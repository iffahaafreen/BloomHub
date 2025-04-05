import requests
from flask import Blueprint, request, jsonify
import os

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable not set")

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

    try:
        response = requests.post(
            GEMINI_URL,
            json=payload,
            params={"key": GEMINI_API_KEY}
        )
        response.raise_for_status()
    except requests.RequestException as e:
        return jsonify({"error": "Request to Gemini API failed", "details": str(e)}), 500

    return jsonify(response.json())
