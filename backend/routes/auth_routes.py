from flask import Blueprint, request, jsonify
from models.user_model import save_user

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/firebase-login", methods=["POST"])
def firebase_login():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    profilePic = data.get("profilePic")

    if not name or not email or not profilePic:
        return jsonify({"error": "Missing user details"}), 400

    user_data = {
        "name": name,
        "email": email,
        "profilePic": profilePic
    }

    response = save_user(user_data)
    return jsonify(response)
