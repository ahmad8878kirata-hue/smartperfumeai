import json
import os
import re
import sqlite3
import warnings
from contextlib import closing
from datetime import datetime, timezone

DB_PATH = os.environ.get("SMARTPERFUME_DB", "smartperfume.db")
SCHEMA_VERSION = 2

ROLES = ("customer", "admin")

_FTS_AVAILABLE = True

SEED_FRAGRANCES = [
    {
        "id": "PF-001", "name": "Oud Wood", "brand": "Tom Ford",
        "ingredients": ["Cardamom", "Oud", "Sandalwood", "Vetiver", "Amber"], "price": 200.00,
        "notes": "Woody, Smoky, Luxurious", "rating": 4.8,
        "image": "/images/fragrances/tom-ford-oud-wood.svg",
    },
    {
        "id": "PF-002", "name": "Acqua di Gio", "brand": "Giorgio Armani",
        "ingredients": ["Bergamot", "Sea Notes", "Jasmine", "Cedar", "White Musk"], "price": 110.00,
        "notes": "Fresh, Aquatic, Warm", "rating": 4.6,
        "image": "/images/fragrances/acqua-di-gio.svg",
    },
    {
        "id": "PF-003", "name": "Vetiver", "brand": "Guerlain",
        "ingredients": ["Vetiver", "Bergamot", "Tobacco", "Oakmoss"], "price": 85.00,
        "notes": "Earthy, Green, Sophisticated", "rating": 4.7,
        "image": "/images/fragrances/guerlain-vetiver.svg",
    },
    {
        "id": "PF-004", "name": "Noir de Noir", "brand": "Tom Ford",
        "ingredients": ["Rose", "Black Truffle", "Patchouli", "Vanilla", "Amber"], "price": 235.00,
        "notes": "Floral, Deep, Sensual", "rating": 4.9,
        "image": "/images/fragrances/tom-ford-noir-de-noir.svg",
    },
    {
        "id": "PF-005", "name": "Chanel No. 5", "brand": "Chanel",
        "ingredients": ["Aldehydes", "Jasmine", "Rose", "Sandalwood", "Vanilla"], "price": 140.00,
        "notes": "Elegant, Complex, Iconic", "rating": 5.0,
        "image": "/images/fragrances/chanel-no-5.svg",
    },
    {
        "id": "PF-006", "name": "Spicebomb", "brand": "Viktor & Rolf",
        "ingredients": ["Cinnamon", "Pink Pepper", "Saffron", "Tobacco", "Amber"], "price": 110.00,
        "notes": "Spicy, Bold, Electric", "rating": 4.5,
        "image": "/images/fragrances/spicebomb.svg",
    },
    {
        "id": "PF-007", "name": "Interlude Man", "brand": "Amouage",
        "ingredients": ["Bergamot", "Black Pepper", "Incense", "Myrrh", "Oud"], "price": 250.00,
        "notes": "Dark, Mysterious, Intense", "rating": 4.9,
        "image": "/images/fragrances/amouage-interlude.svg",
    },
    {
        "id": "PF-008", "name": "Colonia", "brand": "Acqua di Parma",
        "ingredients": ["Sicilian Citrus", "Neroli", "Lavender", "Rosemary", "Vetiver"], "price": 140.00,
        "notes": "Golden, Radiant, Sunny", "rating": 4.7,
        "image": "/images/fragrances/acqua-di-parma-colonia.svg",
    },
    {
        "id": "PF-009", "name": "Le Male", "brand": "Jean Paul Gaultier",
        "ingredients": ["Lavender", "Mint", "Cardamom", "Vanilla"], "price": 90.00,
        "notes": "Aromatic, Crisp, Refined", "rating": 4.4,
        "image": "/images/fragrances/le-male.svg",
    },
]

SCHEMA_SQL = """
CREATE TABLE users (
    email       TEXT    PRIMARY KEY,
    password    TEXT    NOT NULL,
    role        TEXT    NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
) STRICT;

CREATE TABLE fragrances (
    id           TEXT    PRIMARY KEY,
    name         TEXT    NOT NULL,
    brand        TEXT    NOT NULL DEFAULT '',
    price_cents  INTEGER NOT NULL DEFAULT 0 CHECK (price_cents >= 0),
    notes        TEXT    NOT NULL DEFAULT '',
    rating       REAL    NOT NULL DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    image        TEXT    NOT NULL DEFAULT '',
    created_at   TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at   TEXT    NOT NULL DEFAULT (datetime('now'))
) STRICT;

CREATE TABLE fragrance_notes (
    fragrance_id TEXT    NOT NULL REFERENCES fragrances(id) ON DELETE CASCADE,
    note         TEXT    NOT NULL,
    position     INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (fragrance_id, note)
) STRICT;

CREATE TABLE cart_items (
    email        TEXT    NOT NULL REFERENCES users(email) ON DELETE CASCADE,
    fragrance_id TEXT    NOT NULL REFERENCES fragrances(id) ON DELETE CASCADE,
    qty          INTEGER NOT NULL DEFAULT 1 CHECK (qty > 0),
    added_at     TEXT    NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (email, fragrance_id)
) STRICT;

CREATE TABLE counters (
    name  TEXT    PRIMARY KEY,
    value INTEGER NOT NULL
) STRICT;

CREATE INDEX idx_fragrances_brand      ON fragrances(brand);
CREATE INDEX idx_fragrances_created_at ON fragrances(created_at DESC);
CREATE INDEX idx_fragrances_price      ON fragrances(price_cents);
CREATE INDEX idx_notes_note            ON fragrance_notes(note);
CREATE INDEX idx_cart_email            ON cart_items(email);
"""

FTS_SQL = """
CREATE VIRTUAL TABLE fragrances_fts USING fts5(
    name,
    brand,
    notes,
    ingredient,
    fragrance_id UNINDEXED,
    tokenize = 'unicode61 remove_diacritics 2'
);

CREATE TRIGGER fragrances_fts_ai AFTER INSERT ON fragrances BEGIN
    INSERT INTO fragrances_fts(rowid, name, brand, notes, ingredient, fragrance_id)
    VALUES (new.rowid, new.name, new.brand, new.notes, '', new.id);
END;

CREATE TRIGGER fragrances_fts_ad AFTER DELETE ON fragrances BEGIN
    DELETE FROM fragrances_fts WHERE rowid = old.rowid;
END;

CREATE TRIGGER fragrances_fts_au AFTER UPDATE ON fragrances BEGIN
    DELETE FROM fragrances_fts WHERE rowid = old.rowid;
    INSERT INTO fragrances_fts(rowid, name, brand, notes, ingredient, fragrance_id)
    SELECT new.rowid, new.name, new.brand, new.notes,
           COALESCE((SELECT group_concat(n.note, ' ')
                       FROM fragrance_notes n
                      WHERE n.fragrance_id = new.id), ''),
           new.id;
END;

CREATE TRIGGER fragrance_notes_fts_ai AFTER INSERT ON fragrance_notes BEGIN
    UPDATE fragrances_fts
       SET ingredient = COALESCE((
               SELECT group_concat(note, ' ') FROM fragrance_notes
                WHERE fragrance_id = new.fragrance_id
           ), '')
     WHERE rowid = (SELECT rowid FROM fragrances WHERE id = new.fragrance_id);
END;

CREATE TRIGGER fragrance_notes_fts_ad AFTER DELETE ON fragrance_notes BEGIN
    UPDATE fragrances_fts
       SET ingredient = COALESCE((
               SELECT group_concat(note, ' ') FROM fragrance_notes
                WHERE fragrance_id = old.fragrance_id
           ), '')
     WHERE rowid = (SELECT rowid FROM fragrances WHERE id = old.fragrance_id);
END;
"""


def to_cents(value):
    if value is None:
        return 0
    if isinstance(value, str):
        value = float(value.strip() or 0)
    return int(round(float(value) * 100))


def from_cents(cents):
    return round(int(cents) / 100, 2)


def _now():
    return datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")


def _exec_script(conn, script):
    buffer = ""
    for char in script:
        buffer += char
        if char == ";" and sqlite3.complete_statement(buffer):
            conn.execute(buffer)
            buffer = ""
    if buffer.strip():
        conn.execute(buffer)


def _connect():
    conn = sqlite3.connect(DB_PATH, isolation_level=None)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    conn.execute("PRAGMA busy_timeout = 5000")
    return conn


def _fts_supported():
    try:
        with closing(sqlite3.connect(":memory:")) as probe:
            probe.execute("CREATE VIRTUAL TABLE t USING fts5(a)")
        return True
    except sqlite3.OperationalError:
        return False


def schema_version():
    with closing(_connect()) as conn:
        return conn.execute("PRAGMA user_version").fetchone()[0]


def create_schema(conn):
    _exec_script(conn, SCHEMA_SQL)
    conn.execute("INSERT OR IGNORE INTO counters(name, value) VALUES ('fragrance_id', 0)")


def enable_fts(conn):
    global _FTS_AVAILABLE
    _FTS_AVAILABLE = _fts_supported()
    if not _FTS_AVAILABLE:
        return False
    try:
        _exec_script(conn, FTS_SQL)
    except sqlite3.OperationalError:
        _FTS_AVAILABLE = False
        return False
    rebuild_fts(conn)
    return True


def rebuild_fts(conn):
    if not _FTS_AVAILABLE:
        return
    conn.execute("DELETE FROM fragrances_fts")
    conn.execute(
        """
        INSERT INTO fragrances_fts(rowid, name, brand, notes, ingredient, fragrance_id)
        SELECT f.rowid, f.name, f.brand, f.notes,
               COALESCE((SELECT group_concat(n.note, ' ')
                           FROM fragrance_notes n
                          WHERE n.fragrance_id = f.id), ''),
               f.id
          FROM fragrances f
        """
    )


def init_db():
    with closing(_connect()) as conn:
        version = conn.execute("PRAGMA user_version").fetchone()[0]
        if version == 0:
            conn.execute("BEGIN IMMEDIATE")
            create_schema(conn)
            enable_fts(conn)
            conn.execute(f"PRAGMA user_version = {SCHEMA_VERSION}")
            conn.execute("COMMIT")
        elif version < SCHEMA_VERSION:
            warnings.warn(
                f"Database schema is v{version}, expected v{SCHEMA_VERSION}. "
                "Run `python migrate.py` before starting the server.",
                RuntimeWarning,
                stacklevel=2,
            )
            return

    seed_fragrances()
    ensure_admin_account()


def seed_fragrances():
    with closing(_connect()) as conn:
        if conn.execute("SELECT COUNT(*) FROM fragrances").fetchone()[0] > 0:
            return
        conn.execute("BEGIN IMMEDIATE")
        for f in SEED_FRAGRANCES:
            _insert_fragrance(conn, f)
        _sync_counter(conn)
        conn.execute("COMMIT")


def _insert_fragrance(conn, f):
    conn.execute(
        """
        INSERT INTO fragrances(id, name, brand, price_cents, notes, rating, image)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        (
            f["id"], f["name"], f.get("brand", ""),
            to_cents(f.get("price", 0)), f.get("notes", ""),
            f.get("rating", 0), f.get("image", ""),
        ),
    )
    for position, note in enumerate(f.get("ingredients", [])):
        conn.execute(
            "INSERT OR IGNORE INTO fragrance_notes(fragrance_id, note, position) VALUES (?, ?, ?)",
            (f["id"], note, position),
        )


def _sync_counter(conn):
    highest = 0
    for row in conn.execute("SELECT id FROM fragrances"):
        suffix = str(row["id"])[3:]
        if suffix.isdigit():
            highest = max(highest, int(suffix))
    conn.execute("UPDATE counters SET value = ? WHERE name = 'fragrance_id'", (highest,))


def _allocate_fragrance_id(conn):
    row = conn.execute(
        "UPDATE counters SET value = value + 1 WHERE name = 'fragrance_id' RETURNING value"
    ).fetchone()
    if row is None:
        conn.execute("INSERT INTO counters(name, value) VALUES ('fragrance_id', 1)")
        return "PF-001"
    return f"PF-{row[0]:03d}"


def ensure_admin_account():
    email = os.environ.get("SMARTPERFUME_ADMIN_EMAIL", "").strip().lower()
    password = os.environ.get("SMARTPERFUME_ADMIN_PASSWORD", "")
    if not email or not password:
        warnings.warn(
            "No admin account created: set SMARTPERFUME_ADMIN_EMAIL and "
            "SMARTPERFUME_ADMIN_PASSWORD to provision one. "
            "Admin login is disabled until then.",
            RuntimeWarning,
            stacklevel=2,
        )
        return None

    from werkzeug.security import generate_password_hash

    with closing(_connect()) as conn:
        conn.execute("BEGIN IMMEDIATE")
        existing = conn.execute("SELECT role FROM users WHERE email = ?", (email,)).fetchone()
        if existing is None:
            conn.execute(
                "INSERT INTO users(email, password, role) VALUES (?, ?, 'admin')",
                (email, generate_password_hash(password)),
            )
            created = "created"
        else:
            conn.execute(
                "UPDATE users SET password = ?, role = 'admin' WHERE email = ?",
                (generate_password_hash(password), email),
            )
            created = "updated"
        conn.execute("COMMIT")
    return created


def _attach_notes(conn, rows):
    result = [_row_to_fragrance(r) for r in rows]
    if not result:
        return result
    ids = [r["id"] for r in result]
    placeholders = ",".join("?" for _ in ids)
    notes = {}
    for note_row in conn.execute(
        f"""
        SELECT fragrance_id, note FROM fragrance_notes
         WHERE fragrance_id IN ({placeholders})
         ORDER BY fragrance_id, position
        """,
        ids,
    ):
        notes.setdefault(note_row["fragrance_id"], []).append(note_row["note"])
    for item in result:
        item["ingredients"] = notes.get(item["id"], [])
    return result


FRAGRANCE_COLUMNS = "id, name, brand, price_cents, notes, rating, image, created_at, updated_at"


def _row_to_fragrance(row):
    return {
        "id": row["id"],
        "name": row["name"],
        "brand": row["brand"],
        "price": from_cents(row["price_cents"]),
        "price_cents": row["price_cents"],
        "ingredients": [],
        "notes": row["notes"],
        "rating": row["rating"],
        "image": row["image"],
    }


def get_all_fragrances():
    with closing(_connect()) as conn:
        rows = conn.execute(
            f"SELECT {FRAGRANCE_COLUMNS} FROM fragrances ORDER BY id"
        ).fetchall()
        return _attach_notes(conn, rows)


def get_fragrance(fragrance_id):
    with closing(_connect()) as conn:
        row = conn.execute(
            f"SELECT {FRAGRANCE_COLUMNS} FROM fragrances WHERE id = ?", (fragrance_id,)
        ).fetchone()
        if row is None:
            return None
        return _attach_notes(conn, [row])[0]


def _tokenize(query):
    return [t for t in re.findall(r"[\w']+", (query or "").lower()) if t]


def _match_expression(tokens):
    return " ".join(f'"{t}"*' for t in tokens)


def _search_like(tokens, limit):
    clause = " AND ".join(
        "(LOWER(name) LIKE ? ESCAPE '\\' OR LOWER(brand) LIKE ? ESCAPE '\\' "
        "OR LOWER(notes) LIKE ? ESCAPE '\\' "
        "OR EXISTS (SELECT 1 FROM fragrance_notes n "
        "WHERE n.fragrance_id = fragrances.id AND LOWER(n.note) LIKE ? ESCAPE '\\'))"
        for _ in tokens
    )
    params = []
    for token in tokens:
        like = f"%{_escape_like(token)}%"
        params.extend([like] * 4)
    sql = (
        f"SELECT {FRAGRANCE_COLUMNS} FROM fragrances "
        f"WHERE {clause} ORDER BY id LIMIT ?"
    )
    params.append(limit)
    with closing(_connect()) as conn:
        return conn.execute(sql, params).fetchall()


def _escape_like(token):
    return token.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")


def search_fragrances(query, limit=100):
    tokens = _tokenize(query)
    if not tokens:
        return []
    rows = None
    if _FTS_AVAILABLE:
        with closing(_connect()) as conn:
            try:
                rows = conn.execute(
                    """
                    SELECT f.id, f.name, f.brand, f.price_cents, f.notes, f.rating, f.image,
                           f.created_at, f.updated_at
                      FROM fragrances_fts
                      JOIN fragrances f ON f.rowid = fragrances_fts.rowid
                     WHERE fragrances_fts MATCH ?
                     ORDER BY bm25(fragrances_fts, 10.0, 6.0, 2.0, 8.0), f.id
                     LIMIT ?
                    """,
                    (_match_expression(tokens), limit),
                ).fetchall()
            except sqlite3.OperationalError:
                rows = None
    if rows is None:
        rows = _search_like(tokens, limit)
    with closing(_connect()) as conn:
        return _attach_notes(conn, rows)


def add_fragrance(data):
    with closing(_connect()) as conn:
        conn.execute("BEGIN IMMEDIATE")
        try:
            fragrance_id = _allocate_fragrance_id(conn)
            _insert_fragrance(conn, {
                "id": fragrance_id,
                "name": data["name"],
                "brand": data.get("brand", ""),
                "ingredients": data.get("ingredients", []),
                "price": from_cents(data["price_cents"]) if "price_cents" in data
                         else data.get("price", 0),
                "notes": data.get("notes", ""),
                "rating": data.get("rating", 0),
                "image": data.get("image", ""),
            })
            conn.execute("COMMIT")
        except Exception:
            conn.execute("ROLLBACK")
            raise
        return get_fragrance(fragrance_id)


def update_fragrance(fragrance_id, data):
    with closing(_connect()) as conn:
        current = conn.execute(
            f"SELECT {FRAGRANCE_COLUMNS} FROM fragrances WHERE id = ?", (fragrance_id,)
        ).fetchone()
        if current is None:
            return None

        merged = {
            "name": data.get("name", current["name"]),
            "brand": data.get("brand", current["brand"]),
            "price_cents": (
                to_cents(data["price"]) if "price" in data
                else int(data["price_cents"]) if "price_cents" in data
                else current["price_cents"]
            ),
            "notes": data.get("notes", current["notes"]),
            "rating": data.get("rating", current["rating"]),
            "image": data.get("image", current["image"]),
        }
        if "ingredients" in data:
            conn.execute("BEGIN IMMEDIATE")
            try:
                conn.execute(
                    "DELETE FROM fragrance_notes WHERE fragrance_id = ?", (fragrance_id,)
                )
                for position, note in enumerate(data["ingredients"]):
                    conn.execute(
                        "INSERT OR IGNORE INTO fragrance_notes(fragrance_id, note, position) "
                        "VALUES (?, ?, ?)",
                        (fragrance_id, note, position),
                    )
                conn.execute(
                    """
                    UPDATE fragrances
                       SET name = ?, brand = ?, price_cents = ?, notes = ?,
                           rating = ?, image = ?, updated_at = ?
                     WHERE id = ?
                    """,
                    (
                        merged["name"], merged["brand"], merged["price_cents"], merged["notes"],
                        merged["rating"], merged["image"], _now(), fragrance_id,
                    ),
                )
                conn.execute("COMMIT")
            except Exception:
                conn.execute("ROLLBACK")
                raise
        else:
            conn.execute("BEGIN IMMEDIATE")
            conn.execute(
                """
                UPDATE fragrances
                   SET name = ?, brand = ?, price_cents = ?, notes = ?,
                       rating = ?, image = ?, updated_at = ?
                 WHERE id = ?
                """,
                (
                    merged["name"], merged["brand"], merged["price_cents"], merged["notes"],
                    merged["rating"], merged["image"], _now(), fragrance_id,
                ),
            )
            conn.execute("COMMIT")
    return get_fragrance(fragrance_id)


def delete_fragrance(fragrance_id):
    with closing(_connect()) as conn:
        conn.execute("BEGIN IMMEDIATE")
        conn.execute("DELETE FROM fragrances WHERE id = ?", (fragrance_id,))
        removed = conn.execute("SELECT changes()").fetchone()[0]
        conn.execute("COMMIT")
    return removed > 0


def get_user(email):
    with closing(_connect()) as conn:
        row = conn.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
    return dict(row) if row else None


def add_user(email, password, role="customer"):
    with closing(_connect()) as conn:
        conn.execute("BEGIN IMMEDIATE")
        conn.execute(
            "INSERT INTO users(email, password, role) VALUES (?, ?, ?)", (email, password, role)
        )
        conn.execute("COMMIT")


def set_user_role(email, role):
    if role not in ROLES:
        raise ValueError(f"role must be one of {ROLES}")
    with closing(_connect()) as conn:
        conn.execute("BEGIN IMMEDIATE")
        conn.execute("UPDATE users SET role = ? WHERE email = ?", (role, email))
        conn.execute("COMMIT")


def get_cart(email):
    sql = """
        SELECT c.fragrance_id AS id, f.name, f.brand, f.price_cents, c.qty, c.added_at
          FROM cart_items c
          JOIN fragrances f ON f.id = c.fragrance_id
         WHERE c.email = ?
         ORDER BY c.added_at, c.fragrance_id
    """
    with closing(_connect()) as conn:
        rows = conn.execute(sql, (email,)).fetchall()
    return [
        {
            "id": r["id"],
            "name": r["name"],
            "brand": r["brand"],
            "price": from_cents(r["price_cents"]),
            "price_cents": r["price_cents"],
            "qty": r["qty"],
        }
        for r in rows
    ]


def get_all_carts():
    sql = """
        SELECT c.email AS owner_email, c.fragrance_id AS id, f.name, f.brand,
               f.price_cents, c.qty, c.added_at
          FROM cart_items c
          JOIN fragrances f ON f.id = c.fragrance_id
         ORDER BY c.email, c.added_at, c.fragrance_id
    """
    with closing(_connect()) as conn:
        rows = conn.execute(sql).fetchall()

    carts = {}
    for r in rows:
        entry = carts.setdefault(r["owner_email"], {"email": r["owner_email"], "items": []})
        entry["items"].append({
            "id": r["id"],
            "name": r["name"],
            "brand": r["brand"],
            "price": from_cents(r["price_cents"]),
            "price_cents": r["price_cents"],
            "qty": r["qty"],
        })
    return list(carts.values())


def add_to_cart(email, item):
    with closing(_connect()) as conn:
        conn.execute("BEGIN IMMEDIATE")
        conn.execute(
            """
            INSERT INTO cart_items(email, fragrance_id, qty)
            VALUES (?, ?, ?)
            ON CONFLICT(email, fragrance_id) DO UPDATE SET qty = qty + excluded.qty
            """,
            (email, item["id"], max(1, int(item.get("qty", 1)))),
        )
        conn.execute("COMMIT")


def remove_from_cart(email, product_id):
    with closing(_connect()) as conn:
        conn.execute("BEGIN IMMEDIATE")
        conn.execute(
            "DELETE FROM cart_items WHERE email = ? AND fragrance_id = ?", (email, product_id)
        )
        conn.execute("COMMIT")


def clear_cart(email):
    with closing(_connect()) as conn:
        conn.execute("BEGIN IMMEDIATE")
        conn.execute("DELETE FROM cart_items WHERE email = ?", (email,))
        conn.execute("COMMIT")


def update_cart_qty(email, product_id, qty):
    qty = int(qty)
    if qty <= 0:
        remove_from_cart(email, product_id)
        return
    with closing(_connect()) as conn:
        conn.execute("BEGIN IMMEDIATE")
        conn.execute(
            "UPDATE cart_items SET qty = ? WHERE email = ? AND fragrance_id = ?",
            (qty, email, product_id),
        )
        conn.execute("COMMIT")
