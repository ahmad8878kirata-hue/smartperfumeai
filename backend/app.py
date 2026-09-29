from datetime import datetime, timedelta, timezone
from functools import wraps
import os

from flask import Flask, jsonify, request
from flask_cors import CORS
import jwt
from werkzeug.security import check_password_hash, generate_password_hash

import db

app = Flask(__name__)
app.config["SECRET_KEY"] = os.environ.get(
    "SMARTPERFUME_SECRET_KEY", "smartperfume-secret-key-change-in-production"
)
CORS(app)

db.init_db()

TOKEN_TTL = timedelta(days=1)

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

FALLBACK_RECOMMENDATION = {
    "name": "L'Essence Céleste",
    "price": 145.00,
    "ingredients": ["Bergamot", "Oud", "Midnight Jasmine"],
    "description": "A sophisticated blend designed for the visionary.",
}


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


def _encode(payload):
    payload = dict(payload)
    payload["exp"] = datetime.now(timezone.utc) + TOKEN_TTL
    return jwt.encode(payload, app.config["SECRET_KEY"], algorithm="HS256")


def token_for(email, role="customer"):
    return _encode({"email": email, "role": role})


def _decode():
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        return None
    try:
        return jwt.decode(auth[7:], app.config["SECRET_KEY"], algorithms=["HS256"])
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return None


def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        payload = _decode()
        if not payload or not payload.get("email"):
            return jsonify({"error": "Unauthorized"}), 401
        return f(payload["email"], *args, **kwargs)
    return decorated


def require_admin(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        payload = _decode()
        if not payload:
            return jsonify({"error": "Unauthorized"}), 401
        if payload.get("role") != "admin":
            return jsonify({"error": "Forbidden"}), 403
        return f(*args, **kwargs)
    return decorated


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "schema_version": db.schema_version(),
    })


@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json(silent=True) or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400
    if db.get_user(email):
        return jsonify({"error": "An account with this email already exists"}), 409
    db.add_user(email, generate_password_hash(password))
    return jsonify({"token": token_for(email), "user": {"email": email, "role": "customer"}}), 201


@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400
    user = db.get_user(email)
    if not user or not check_password_hash(user["password"], password):
        return jsonify({"error": "Invalid email or password"}), 401
    return jsonify({
        "token": token_for(user["email"], user.get("role", "customer")),
        "user": {"email": user["email"], "role": user.get("role", "customer")},
    })


@app.route("/api/fragrances", methods=["GET"])
def get_fragrances():
    search = request.args.get("search", "").strip()
    if search:
        return jsonify(db.search_fragrances(search))
    return jsonify(db.get_all_fragrances())


@app.route("/api/fragrances", methods=["POST"])
@require_admin
def add_fragrance():
    data = request.get_json(silent=True) or {}
    if not data.get("name"):
        return jsonify({"error": "Name is required"}), 400
    return jsonify(db.add_fragrance(data)), 201


@app.route("/api/fragrances/<fragrance_id>", methods=["PATCH"])
@require_admin
def edit_fragrance(fragrance_id):
    data = request.get_json(silent=True) or {}
    if not data:
        return jsonify({"error": "No fields to update"}), 400
    updated = db.update_fragrance(fragrance_id, data)
    if updated is None:
        return jsonify({"error": "Fragrance not found"}), 404
    return jsonify(updated)


@app.route("/api/fragrances/<fragrance_id>", methods=["DELETE"])
@require_admin
def delete_fragrance(fragrance_id):
    if not db.delete_fragrance(fragrance_id):
        return jsonify({"error": "Fragrance not found"}), 404
    return jsonify({"message": "Deleted"})


@app.route("/api/quiz/submit", methods=["POST"])
def submit_quiz():
    data = request.get_json(silent=True) or {}
    rec_id = recommend_fragrance_id(data.get("answers", {}))
    rec = db.get_fragrance(rec_id) if rec_id else None
    if rec is None:
        rec = FALLBACK_RECOMMENDATION
    return jsonify({"message": "Quiz submitted", "recommendation": rec})


@app.route("/api/cart", methods=["GET"])
@require_auth
def get_cart(email):
    return jsonify(db.get_cart(email))


@app.route("/api/cart", methods=["POST"])
@require_auth
def add_to_cart(email):
    data = request.get_json(silent=True) or {}
    if not data.get("id"):
        return jsonify({"error": "Product id is required"}), 400
    if db.get_fragrance(data["id"]) is None:
        return jsonify({"error": "Fragrance not found"}), 404
    db.add_to_cart(email, data)
    return jsonify({"message": "Added to cart", "cart": db.get_cart(email)}), 201


@app.route("/api/cart", methods=["DELETE"])
@require_auth
def clear_cart(email):
    db.clear_cart(email)
    return jsonify({"message": "Cart cleared"})


@app.route("/api/cart/<product_id>", methods=["DELETE"])
@require_auth
def remove_from_cart(email, product_id):
    db.remove_from_cart(email, product_id)
    return jsonify({"message": "Removed from cart", "cart": db.get_cart(email)})


@app.route("/api/cart/<product_id>", methods=["PATCH"])
@require_auth
def update_cart_item(email, product_id):
    data = request.get_json(silent=True) or {}
    if not any(i["id"] == product_id for i in db.get_cart(email)):
        return jsonify({"error": "Item not found"}), 404
    db.update_cart_qty(email, product_id, data.get("qty", 1))
    return jsonify({"message": "Updated", "cart": db.get_cart(email)})


@app.route("/api/admin/login", methods=["POST"])
def admin_login():
    data = request.get_json(silent=True) or {}
    email = data.get("email") or data.get("username") or ""
    email = email.strip().lower()
    password = data.get("password", "")
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400
    user = db.get_user(email)
    if not user or user.get("role") != "admin":
        return jsonify({"error": "Invalid username or password"}), 401
    if not check_password_hash(user["password"], password):
        return jsonify({"error": "Invalid username or password"}), 401
    return jsonify({
        "token": token_for(user["email"], "admin"),
        "user": {"email": user["email"], "role": "admin"},
    })


@app.route("/api/admin/carts", methods=["GET"])
@require_admin
def admin_carts():
    return jsonify(db.get_all_carts())


if __name__ == "__main__":
    app.run(debug=True, port=5000)
