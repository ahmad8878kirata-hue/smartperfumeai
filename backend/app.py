from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime

app = Flask(__name__)
app.config["SECRET_KEY"] = "smartperfume-secret-key-change-in-production"
CORS(app)

fragrances = [
    {"id": "PF-001", "name": "Midnight Oud", "brand": "L'Artiste Digital", "ingredients": ["Oud", "Saffron", "Leather"], "price": 185.00},
    {"id": "PF-002", "name": "Solaris Mist", "brand": "Neo-Olfactive", "ingredients": ["Bergamot", "Amber", "Sea Salt"], "price": 140.00},
    {"id": "PF-003", "name": "Cipher Green", "brand": "Algorithm Scent", "ingredients": ["Vetiver", "Oakmoss", "Green Tea"], "price": 210.00},
    {"id": "PF-004", "name": "Velvet Logic", "brand": "SmartPerfume AI", "ingredients": ["Rose", "Patchouli", "Vanilla"], "price": 245.00},
    {"id": "PF-005", "name": "L'Essence C\u00e9leste", "brand": "SmartPerfume AI", "ingredients": ["Bergamot", "Oud", "Midnight Jasmine"], "price": 145.00},
    {"id": "PF-006", "name": "Scarlet Hypothesis", "brand": "Maison Coda", "ingredients": ["Cinnamon", "Pink Pepper", "Amberwood"], "price": 175.00},
    {"id": "PF-007", "name": "Noir Axiom", "brand": "Formule Noire", "ingredients": ["Black Pepper", "Incense", "Dark Vetiver"], "price": 230.00},
    {"id": "PF-008", "name": "Aurum Bloom", "brand": "SmartPerfume AI", "ingredients": ["Neroli", "Honey", "White Cedar"], "price": 195.00},
    {"id": "PF-009", "name": "Cobalt Muse", "brand": "Neo-Olfactive", "ingredients": ["Lavender", "Cardamom", "Cypress"], "price": 160.00},
]

PRIMARY_GRID = {
    "Fresh": {"Energetic": "PF-002", "Romantic": "PF-008", "Mysterious": "PF-003", "Serene": "PF-009"},
    "Woody": {"Energetic": "PF-003", "Romantic": "PF-001", "Mysterious": "PF-007", "Serene": "PF-009"},
    "Oriental": {"Energetic": "PF-006", "Romantic": "PF-005", "Mysterious": "PF-007", "Serene": "PF-001"},
    "Sweet": {"Energetic": "PF-008", "Romantic": "PF-004", "Mysterious": "PF-005", "Serene": "PF-004"},
}

FAMILY_GROUPS = {
    "Fresh": ["PF-002", "PF-003", "PF-008", "PF-009"],
    "Woody": ["PF-001", "PF-003", "PF-007", "PF-009"],
    "Oriental": ["PF-001", "PF-005", "PF-006", "PF-007"],
    "Sweet": ["PF-004", "PF-005", "PF-008"],
}

BOLDNESS = {
    "PF-001": 2, "PF-002": 1, "PF-003": 1, "PF-004": 1, "PF-005": 1,
    "PF-006": 2, "PF-007": 2, "PF-008": 0, "PF-009": 0,
}

SETTING_BOLDNESS = {"Office": 0, "Daily Wear": 1, "Travel": 1, "Evening Out": 2}
SILLAGE_BOLDNESS = {"Subtle": 0, "Moderate": 1, "Strong": 1, "Intense": 2}


def recommend_fragrance_id(answers):
    if not answers:
        return None
    q1 = str(answers.get("0", ""))
    q2 = str(answers.get("1", ""))
    primary_id = PRIMARY_GRID.get(q1, {}).get(q2)
    if primary_id is None:
        return None
    setting = SETTING_BOLDNESS.get(str(answers.get("2", "")), 1)
    sillage = SILLAGE_BOLDNESS.get(str(answers.get("3", "")), 1)
    target = round((setting + sillage) / 2)
    if target == 1:
        return primary_id
    group = FAMILY_GROUPS.get(q1, [])
    best_id, best_dist = primary_id, abs(target - BOLDNESS.get(primary_id, 1))
    for fid in group:
        dist = abs(target - BOLDNESS.get(fid, 1))
        if dist < best_dist:
            best_id, best_dist = fid, dist
    return best_id

users = []


def token_for(email):
    return jwt.encode(
        {"email": email, "exp": datetime.datetime.utcnow() + datetime.timedelta(days=1)},
        app.config["SECRET_KEY"],
        algorithm="HS256",
    )


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid request"}), 400
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400
    if any(u["email"] == email for u in users):
        return jsonify({"error": "An account with this email already exists"}), 409
    hashed = generate_password_hash(password)
    users.append({"email": email, "password": hashed})
    return jsonify({"token": token_for(email), "user": {"email": email}}), 201


@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid request"}), 400
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400
    user = next((u for u in users if u["email"] == email), None)
    if not user or not check_password_hash(user["password"], password):
        return jsonify({"error": "Invalid email or password"}), 401
    return jsonify({"token": token_for(email), "user": {"email": email}})


@app.route("/api/fragrances", methods=["GET"])
def get_fragrances():
    search = request.args.get("search", "").lower()
    if search:
        filtered = [
            f for f in fragrances
            if search in f["name"].lower()
            or search in f["brand"].lower()
            or any(search in i.lower() for i in f["ingredients"])
        ]
        return jsonify(filtered)
    return jsonify(fragrances)


@app.route("/api/fragrances", methods=["POST"])
def add_fragrance():
    data = request.get_json()
    if not data or not data.get("name"):
        return jsonify({"error": "Name is required"}), 400
    new_id = f"PF-{len(fragrances) + 1:03d}"
    fragrance = {
        "id": new_id,
        "name": data["name"],
        "brand": data.get("brand", ""),
        "ingredients": data.get("ingredients", []),
        "price": data.get("price", 0),
    }
    fragrances.append(fragrance)
    return jsonify(fragrance), 201


@app.route("/api/fragrances/<fragrance_id>", methods=["DELETE"])
def delete_fragrance(fragrance_id):
    global fragrances
    fragrances = [f for f in fragrances if f["id"] != fragrance_id]
    return jsonify({"message": "Deleted"}), 200


@app.route("/api/quiz/submit", methods=["POST"])
def submit_quiz():
    data = request.get_json() or {}
    answers = data.get("answers", {})
    rec_id = recommend_fragrance_id(answers)
    rec = next((f for f in fragrances if f["id"] == rec_id), None)
    if rec is None:
        rec = {"name": "L'Essence C\u00e9leste", "price": 145.00, "ingredients": ["Bergamot", "Oud", "Midnight Jasmine"], "description": "A sophisticated blend designed for the visionary."}
    return jsonify({"message": "Quiz submitted", "recommendation": rec})


user_carts = {}


def get_email_from_token():
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        return None
    try:
        payload = jwt.decode(auth[7:], app.config["SECRET_KEY"], algorithms=["HS256"])
        return payload.get("email")
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return None


def require_auth(f):
    from functools import wraps
    @wraps(f)
    def decorated(*args, **kwargs):
        email = get_email_from_token()
        if not email:
            return jsonify({"error": "Unauthorized"}), 401
        return f(email, *args, **kwargs)
    return decorated


@app.route("/api/cart", methods=["GET"])
@require_auth
def get_cart(email):
    cart = user_carts.get(email, [])
    return jsonify(cart)


@app.route("/api/cart", methods=["POST"])
@require_auth
def add_to_cart(email):
    data = request.get_json()
    if not data or not data.get("id"):
        return jsonify({"error": "Product id is required"}), 400
    if email not in user_carts:
        user_carts[email] = []
    existing = next((i for i in user_carts[email] if i["id"] == data["id"]), None)
    if existing:
        existing["qty"] = existing.get("qty", 1) + data.get("qty", 1)
    else:
        user_carts[email].append({
            "id": data["id"],
            "name": data.get("name", ""),
            "brand": data.get("brand", ""),
            "price": data.get("price", 0),
            "qty": data.get("qty", 1),
        })
    return jsonify({"message": "Added to cart", "cart": user_carts[email]}), 201


@app.route("/api/cart/<product_id>", methods=["DELETE"])
@require_auth
def remove_from_cart(email, product_id):
    if email in user_carts:
        user_carts[email] = [i for i in user_carts[email] if i["id"] != product_id]
    return jsonify({"message": "Removed from cart", "cart": user_carts.get(email, [])})


@app.route("/api/cart", methods=["DELETE"])
@require_auth
def clear_cart(email):
    user_carts[email] = []
    return jsonify({"message": "Cart cleared"})


@app.route("/api/cart/<product_id>", methods=["PATCH"])
@require_auth
def update_cart_item(email, product_id):
    data = request.get_json()
    if email not in user_carts:
        return jsonify({"error": "Cart not found"}), 404
    item = next((i for i in user_carts[email] if i["id"] == product_id), None)
    if not item:
        return jsonify({"error": "Item not found"}), 404
    qty = data.get("qty", 1)
    if qty <= 0:
        user_carts[email] = [i for i in user_carts[email] if i["id"] != product_id]
    else:
        item["qty"] = qty
    return jsonify({"message": "Updated", "cart": user_carts[email]})


ADMIN_USERNAME = "admin"
ADMIN_PASSWORD_MIN = 1
ADMIN_PASSWORD_MAX = 8


def admin_token():
    return jwt.encode(
        {"email": ADMIN_USERNAME, "role": "admin", "exp": datetime.datetime.utcnow() + datetime.timedelta(days=1)},
        app.config["SECRET_KEY"],
        algorithm="HS256",
    )


def require_admin(f):
    from functools import wraps
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.headers.get("Authorization", "")
        if not auth.startswith("Bearer "):
            return jsonify({"error": "Unauthorized"}), 401
        try:
            payload = jwt.decode(auth[7:], app.config["SECRET_KEY"], algorithms=["HS256"])
        except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
            return jsonify({"error": "Unauthorized"}), 401
        if payload.get("role") != "admin":
            return jsonify({"error": "Forbidden"}), 403
        return f(*args, **kwargs)
    return decorated


@app.route("/api/admin/login", methods=["POST"])
def admin_login():
    data = request.get_json() or {}
    username = data.get("username", "")
    password = data.get("password", "")
    if username == ADMIN_USERNAME and ADMIN_PASSWORD_MIN <= len(password) <= ADMIN_PASSWORD_MAX:
        return jsonify({"token": admin_token(), "user": {"username": ADMIN_USERNAME}})
    return jsonify({"error": "Invalid username or password"}), 401


@app.route("/api/admin/carts", methods=["GET"])
@require_admin
def admin_carts():
    carts = [{"email": email, "items": items} for email, items in user_carts.items()]
    return jsonify(carts)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
