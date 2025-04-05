import requests
from flask import Blueprint, request, jsonify
from config import GEMINI_API_KEY

chatbot_bp = Blueprint('chatbot', __name__)

GEMINI_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent"

@chatbot_bp.route('/chat', methods=['POST'])
def chat():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 415

    data = request.get_json()
    user_message = data.get("message", "")

    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    # Correct JSON payload format for Gemini API
    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": user_message
                    }
                ]
            }
        ]
    }

    response = requests.post(
        GEMINI_URL,
        json=payload,
        params={"key": GEMINI_API_KEY}
    )

    return jsonify(response.json())

