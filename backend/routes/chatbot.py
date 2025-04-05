import requests
from flask import Blueprint, request, jsonify
from flask_cors import CORS
import os

chatbot_bp = Blueprint('chatbot', __name__)
CORS(chatbot_bp, origins=["https://bloom-hub-five.vercel.app"])

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable not set")

chatbot_bp = Blueprint('chatbot', __name__)

GEMINI_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent"

@chatbot_bp.route('/chat', methods=['POST', 'OPTIONS'])
def chat():
    if request.method == 'OPTIONS':
        return '', 204

    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 415

    data = request.get_json()
    user_message = data.get("message", "")

    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    payload = {
        "contents": [
            {
                "parts": [{"text": user_message}]
            }
        ],
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 256,
            "topP": 0.8
        }
    }

    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }

    try:
        response = requests.post(
            GEMINI_URL,
            json=payload,
            params={"key": GEMINI_API_KEY},
            headers=headers,
            timeout=30  # optional, set a timeout
        )
        response.raise_for_status()
    except requests.RequestException as e:
        return jsonify({"error": "Request to Gemini API failed", "details": str(e)}), 500

    return jsonify(response.json())
