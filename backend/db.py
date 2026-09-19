import json
import sqlite3
from contextlib import closing

DB_PATH = "smartperfume.db"

SEED_FRAGRANCES = [
    {"id": "PF-001", "name": "Oud Wood", "brand": "Tom Ford", "ingredients": ["Cardamom", "Oud", "Sandalwood", "Vetiver", "Amber"], "price": 200.00},
    {"id": "PF-002", "name": "Acqua di Gio", "brand": "Giorgio Armani", "ingredients": ["Bergamot", "Sea Notes", "Jasmine", "Cedar", "White Musk"], "price": 110.00},
    {"id": "PF-003", "name": "Vetiver", "brand": "Guerlain", "ingredients": ["Vetiver", "Bergamot", "Tobacco", "Oakmoss"], "price": 85.00},
    {"id": "PF-004", "name": "Noir de Noir", "brand": "Tom Ford", "ingredients": ["Rose", "Black Truffle", "Patchouli", "Vanilla", "Amber"], "price": 235.00},
    {"id": "PF-005", "name": "Chanel No. 5", "brand": "Chanel", "ingredients": ["Aldehydes", "Jasmine", "Rose", "Sandalwood", "Vanilla"], "price": 140.00},
    {"id": "PF-006", "name": "Spicebomb", "brand": "Viktor & Rolf", "ingredients": ["Cinnamon", "Pink Pepper", "Saffron", "Tobacco", "Amber"], "price": 110.00},
    {"id": "PF-007", "name": "Interlude Man", "brand": "Amouage", "ingredients": ["Bergamot", "Black Pepper", "Incense", "Myrrh", "Oud"], "price": 250.00},
    {"id": "PF-008", "name": "Colonia", "brand": "Acqua di Parma", "ingredients": ["Sicilian Citrus", "Neroli", "Lavender", "Rosemary", "Vetiver"], "price": 140.00},
    {"id": "PF-009", "name": "Le Male", "brand": "Jean Paul Gaultier", "ingredients": ["Lavender", "Mint", "Cardamom", "Vanilla"], "price": 90.00},
]


def _connect():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    with closing(_connect()) as conn:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS fragrances (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                brand TEXT NOT NULL DEFAULT '',
                ingredients TEXT NOT NULL DEFAULT '[]',
                price REAL NOT NULL DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS users (
                email TEXT PRIMARY KEY,
                password TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS cart_items (
                email TEXT NOT NULL,
                id TEXT NOT NULL,
                name TEXT NOT NULL DEFAULT '',
                brand TEXT NOT NULL DEFAULT '',
                price REAL NOT NULL DEFAULT 0,
                qty INTEGER NOT NULL DEFAULT 1,
                PRIMARY KEY (email, id)
            );
            """
        )
        conn.commit()

    if _fragrance_count() == 0:
        seed_fragrances()


def _fragrance_count():
    with closing(_connect()) as conn:
        row = conn.execute("SELECT COUNT(*) AS n FROM fragrances").fetchone()
    return row["n"]


def seed_fragrances():
    with closing(_connect()) as conn:
        conn.executemany(
            "INSERT OR IGNORE INTO fragrances (id, name, brand, ingredients, price) VALUES (?, ?, ?, ?, ?)",
            [
                (f["id"], f["name"], f["brand"], json.dumps(f["ingredients"]), f["price"])
                for f in SEED_FRAGRANCES
            ],
        )
        conn.commit()


def _row_to_fragrance(row):
    return {
        "id": row["id"],
        "name": row["name"],
        "brand": row["brand"],
        "ingredients": json.loads(row["ingredients"]),
        "price": row["price"],
    }


def get_all_fragrances():
    with closing(_connect()) as conn:
        rows = conn.execute("SELECT * FROM fragrances ORDER BY id").fetchall()
    return [_row_to_fragrance(r) for r in rows]


def search_fragrances(query):
    like = f"%{query}%"
    with closing(_connect()) as conn:
        rows = conn.execute(
            "SELECT * FROM fragrances WHERE LOWER(name) LIKE ? OR LOWER(brand) LIKE ? "
            "OR LOWER(ingredients) LIKE ? ORDER BY id",
            (like, like, like),
        ).fetchall()
    return [_row_to_fragrance(r) for r in rows]


def get_fragrance(fragrance_id):
    with closing(_connect()) as conn:
        row = conn.execute("SELECT * FROM fragrances WHERE id = ?", (fragrance_id,)).fetchone()
    return _row_to_fragrance(row) if row else None


def next_fragrance_id():
    with closing(_connect()) as conn:
        rows = conn.execute("SELECT id FROM fragrances").fetchall()
    max_num = 0
    for row in rows:
        suffix = str(row["id"])[3:]
        if suffix.isdigit():
            max_num = max(max_num, int(suffix))
    return f"PF-{max_num + 1:03d}"


def add_fragrance(data):
    fragrance = {
        "id": next_fragrance_id(),
        "name": data["name"],
        "brand": data.get("brand", ""),
        "ingredients": data.get("ingredients", []),
        "price": data.get("price", 0),
    }
    with closing(_connect()) as conn:
        conn.execute(
            "INSERT INTO fragrances (id, name, brand, ingredients, price) VALUES (?, ?, ?, ?, ?)",
            (fragrance["id"], fragrance["name"], fragrance["brand"], json.dumps(fragrance["ingredients"]), fragrance["price"]),
        )
        conn.commit()
    return fragrance


def delete_fragrance(fragrance_id):
    with closing(_connect()) as conn:
        conn.execute("DELETE FROM fragrances WHERE id = ?", (fragrance_id,))
        conn.commit()


def get_user(email):
    with closing(_connect()) as conn:
        row = conn.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
    return dict(row) if row else None


def add_user(email, password):
    with closing(_connect()) as conn:
        conn.execute("INSERT INTO users (email, password) VALUES (?, ?)", (email, password))
        conn.commit()


def _row_to_cart_item(row):
    return {
        "id": row["id"],
        "name": row["name"],
        "brand": row["brand"],
        "price": row["price"],
        "qty": row["qty"],
    }


def get_cart(email):
    with closing(_connect()) as conn:
        rows = conn.execute("SELECT * FROM cart_items WHERE email = ? ORDER BY id", (email,)).fetchall()
    return [_row_to_cart_item(r) for r in rows]


def get_all_carts():
    with closing(_connect()) as conn:
        rows = conn.execute("SELECT * FROM cart_items ORDER BY email, id").fetchall()
    carts = {}
    for row in rows:
        carts.setdefault(row["email"], []).append(_row_to_cart_item(row))
    return [{"email": email, "items": items} for email, items in carts.items()]


def add_to_cart(email, item):
    with closing(_connect()) as conn:
        conn.execute(
            "INSERT INTO cart_items (email, id, name, brand, price, qty) VALUES (?, ?, ?, ?, ?, ?) "
            "ON CONFLICT(email, id) DO UPDATE SET qty = qty + excluded.qty",
            (email, item["id"], item.get("name", ""), item.get("brand", ""), item.get("price", 0), item.get("qty", 1)),
        )
        conn.commit()


def remove_from_cart(email, product_id):
    with closing(_connect()) as conn:
        conn.execute("DELETE FROM cart_items WHERE email = ? AND id = ?", (email, product_id))
        conn.commit()


def clear_cart(email):
    with closing(_connect()) as conn:
        conn.execute("DELETE FROM cart_items WHERE email = ?", (email,))
        conn.commit()


def update_cart_qty(email, product_id, qty):
    if qty <= 0:
        remove_from_cart(email, product_id)
        return
    with closing(_connect()) as conn:
        conn.execute(
            "UPDATE cart_items SET qty = ? WHERE email = ? AND id = ?",
            (qty, email, product_id),
        )
        conn.commit()