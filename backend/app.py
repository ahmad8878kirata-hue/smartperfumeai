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
]

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
    data = request.get_json()
    return jsonify({
        "message": "Quiz submitted",
        "recommendation": {
            "name": "L'Essence Céleste",
            "price": 145.00,
            "ingredients": ["Bergamot", "Oud", "Midnight Jasmine"],
            "description": "A sophisticated blend designed for the visionary.",
        },
    })


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


if __name__ == "__main__":
    app.run(debug=True, port=5000)
