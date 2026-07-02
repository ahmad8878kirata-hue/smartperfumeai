from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

fragrances = [
    {"id": "#PF-001", "name": "Midnight Oud", "brand": "L'Artiste Digital", "ingredients": ["Oud", "Saffron", "Leather"], "price": 185.00},
    {"id": "#PF-002", "name": "Solaris Mist", "brand": "Neo-Olfactive", "ingredients": ["Bergamot", "Amber", "Sea Salt"], "price": 140.00},
    {"id": "#PF-003", "name": "Cipher Green", "brand": "Algorithm Scent", "ingredients": ["Vetiver", "Oakmoss", "Green Tea"], "price": 210.00},
    {"id": "#PF-004", "name": "Velvet Logic", "brand": "SmartPerfume AI", "ingredients": ["Rose", "Patchouli", "Vanilla"], "price": 245.00},
]

users = []


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid request"}), 400
    email = data.get("email", "")
    password = data.get("password", "")
    if email and password:
        return jsonify({"token": "mock-jwt-token", "user": {"email": email}})
    return jsonify({"error": "Email and password required"}), 400


@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid request"}), 400
    email = data.get("email", "")
    password = data.get("password", "")
    if email and password:
        users.append({"email": email, "password": password})
        return jsonify({"message": "User created", "user": {"email": email}}), 201
    return jsonify({"error": "Email and password required"}), 400


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
    new_id = f"#PF-{len(fragrances) + 1:03d}"
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


if __name__ == "__main__":
    app.run(debug=True, port=5000)
