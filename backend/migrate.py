import json
import os
import shutil
import sys
import warnings
from contextlib import closing

import db


def table_exists(conn, name):
    return conn.execute(
        "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?", (name,)
    ).fetchone() is not None


def column_names(conn, table):
    return {r["name"] for r in conn.execute(f"PRAGMA table_info({table})")}


def detect_version(conn):
    if not table_exists(conn, "fragrances"):
        return 0
    columns = column_names(conn, "fragrances")
    if "price_cents" in columns:
        return 2
    if "price" in columns or "ingredients" in columns:
        return 1
    return 0


def backup(path):
    if not os.path.exists(path):
        return None
    target = f"{path}.pre-migrate"
    shutil.copy2(path, target)
    return target


def migrate_v1_to_v2(conn):
    conn.execute("BEGIN IMMEDIATE")
    try:
        db._exec_script(
            conn,
            """
            CREATE TABLE _stage_fragrances (
                id TEXT PRIMARY KEY, name TEXT NOT NULL, brand TEXT NOT NULL DEFAULT '',
                price_cents INTEGER NOT NULL DEFAULT 0, notes TEXT NOT NULL DEFAULT '',
                rating REAL NOT NULL DEFAULT 0, image TEXT NOT NULL DEFAULT '',
                created_at TEXT NOT NULL DEFAULT (datetime('now')),
                updated_at TEXT NOT NULL DEFAULT (datetime('now'))
            );
            CREATE TABLE _stage_notes (
                fragrance_id TEXT NOT NULL, note TEXT NOT NULL, position INTEGER NOT NULL
            );
            CREATE TABLE _stage_users (
                email TEXT PRIMARY KEY, password TEXT NOT NULL,
                role TEXT NOT NULL DEFAULT 'customer',
                created_at TEXT NOT NULL DEFAULT (datetime('now'))
            );
            CREATE TABLE _stage_cart (
                email TEXT NOT NULL, fragrance_id TEXT NOT NULL,
                qty INTEGER NOT NULL DEFAULT 1,
                added_at TEXT NOT NULL DEFAULT (datetime('now'))
            );
            """,
        )

        rows = conn.execute(
            "SELECT id, name, brand, ingredients, price FROM fragrances"
        ).fetchall()
        for r in rows:
            conn.execute(
                "INSERT INTO _stage_fragrances(id, name, brand, price_cents) VALUES (?, ?, ?, ?)",
                (r["id"], r["name"], r["brand"] or "", db.to_cents(r["price"] or 0)),
            )
            try:
                notes = json.loads(r["ingredients"] or "[]")
            except (TypeError, ValueError):
                notes = []
            if not isinstance(notes, list):
                notes = []
            for position, note in enumerate(notes):
                if note:
                    conn.execute(
                        "INSERT INTO _stage_notes(fragrance_id, note, position) VALUES (?, ?, ?)",
                        (r["id"], str(note), position),
                    )

        for r in conn.execute("SELECT email, password FROM users").fetchall():
            conn.execute(
                "INSERT INTO _stage_users(email, password) VALUES (?, ?)",
                (r["email"], r["password"]),
            )

        orphaned = conn.execute(
            """
            SELECT c.email, c.id, c.qty FROM cart_items c
             LEFT JOIN _stage_fragrances f ON f.id = c.id
            WHERE f.id IS NULL
            """
        ).fetchall()
        for r in conn.execute(
            """
            SELECT c.email, c.id, c.qty FROM cart_items c
              JOIN _stage_fragrances f ON f.id = c.id
            """
        ).fetchall():
            conn.execute(
                "INSERT INTO _stage_cart(email, fragrance_id, qty) VALUES (?, ?, ?)",
                (r["email"], r["id"], max(1, int(r["qty"] or 1))),
            )

        db._exec_script(
            conn,
            "DROP TABLE cart_items; DROP TABLE users; DROP TABLE fragrances;",
        )

        db.create_schema(conn)
        fts_enabled = db.enable_fts(conn)

        conn.execute(
            "INSERT INTO fragrances(id, name, brand, price_cents) "
            "SELECT id, name, brand, price_cents FROM _stage_fragrances"
        )
        conn.execute(
            "INSERT INTO fragrance_notes(fragrance_id, note, position) "
            "SELECT fragrance_id, note, position FROM _stage_notes"
        )
        conn.execute(
            "INSERT INTO users(email, password, role) "
            "SELECT email, password, role FROM _stage_users"
        )
        conn.execute(
            "INSERT INTO cart_items(email, fragrance_id, qty) "
            "SELECT email, fragrance_id, qty FROM _stage_cart"
        )

        by_id = {f["id"]: f for f in db.SEED_FRAGRANCES}
        backfilled = 0
        for row in conn.execute("SELECT id FROM fragrances").fetchall():
            seed = by_id.get(row["id"])
            if not seed:
                continue
            conn.execute(
                "UPDATE fragrances SET notes = ?, rating = ?, image = ? WHERE id = ?",
                (seed.get("notes", ""), seed.get("rating", 0), seed.get("image", ""), seed["id"]),
            )
            backfilled += 1

        db._exec_script(
            conn,
            "DROP TABLE _stage_fragrances; DROP TABLE _stage_notes; "
            "DROP TABLE _stage_users; DROP TABLE _stage_cart;",
        )

        db._sync_counter(conn)
        conn.execute(f"PRAGMA user_version = {db.SCHEMA_VERSION}")
        conn.execute("COMMIT")
    except Exception:
        conn.execute("ROLLBACK")
        raise

    return {
        "fragrances": len(rows),
        "notes": conn.execute("SELECT COUNT(*) FROM fragrance_notes").fetchone()[0],
        "users": conn.execute("SELECT COUNT(*) FROM users").fetchone()[0],
        "cart_items": conn.execute("SELECT COUNT(*) FROM cart_items").fetchone()[0],
        "orphaned_cart_rows_dropped": len(orphaned),
        "metadata_backfilled": backfilled,
        "fts": fts_enabled,
    }


def main():
    print(f"database : {os.path.abspath(db.DB_PATH)}")

    if not os.path.exists(db.DB_PATH):
        print("No database file found. Starting the server will create a fresh v2 database.")
        db.init_db()
        print("Created empty v2 database.")
        return 0

    saved = backup(db.DB_PATH)
    if saved:
        print(f"backup   : {saved}")

    with closing(db._connect()) as conn:
        version = detect_version(conn)
        print(f"detected : v{version}")

        if version >= db.SCHEMA_VERSION:
            print(f"Already at v{db.SCHEMA_VERSION}. Nothing to do.")
            return 0

        if version == 0:
            print("No legacy tables found. Nothing to migrate.")
            return 0

        print("migrating: v1 -> v2")
        summary = migrate_v1_to_v2(conn)

    for key, value in summary.items():
        print(f"  {key}: {value}")

    warnings.resetwarnings()
    result = db.ensure_admin_account()
    if result:
        print(f"admin    : {result} from SMARTPERFUME_ADMIN_EMAIL")
    else:
        print("admin    : not provisioned (set SMARTPERFUME_ADMIN_EMAIL / _PASSWORD)")

    print("done     : schema is now v2")
    return 0


if __name__ == "__main__":
    sys.exit(main())
