from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_caching import Cache
from routes.chatbot import chatbot_bp
from routes.auth_routes import auth_bp
import requests
import logging

app = Flask(__name__)

# CORS configuration (Restrict origins for security)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

# Configure caching to reduce API calls
cache = Cache(app, config={'CACHE_TYPE': 'simple'})

# Logging setup
logging.basicConfig(level=logging.INFO)

# Register Blueprints
app.register_blueprint(chatbot_bp, url_prefix='/api')
app.register_blueprint(auth_bp, url_prefix='/api/auth')

@app.route('/')
def home():
    return "Server is running!"

@cache.memoize(300)  # Cache for 5 minutes
@cache.memoize(300)
@app.route('/get-coordinates', methods=['GET'])
def get_coordinates():
    zip_code = request.args.get('zip')
    if not zip_code:
        return jsonify({"error": "Missing ZIP code"}), 400

    try:
        url = f"https://nominatim.openstreetmap.org/search?postalcode={zip_code}&countrycodes=IN&format=json&limit=1"
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()

        logging.info(f"API Response: {data}")  # Print response

        if not data:
            return jsonify({"error": "Invalid ZIP code"}), 404

        return jsonify({
            "success": True,
            "data": {
                "lat": data[0]["lat"],
                "lon": data[0]["lon"]
            }
        })
    except requests.exceptions.RequestException as e:
        logging.error(f"Error fetching coordinates: {e}")
        return jsonify({"error": "Failed to fetch coordinates. Try again later."}), 500

@cache.memoize(300)  # Cache for 5 minutes
@app.route('/reverse-geocode', methods=['GET'])
def reverse_geocode():
    lat = request.args.get('lat')
    lon = request.args.get('lon')

    if not lat or not lon:
        return jsonify({"error": "Missing lat/lon parameters"}), 400

    try:
        url = f"https://nominatim.openstreetmap.org/reverse?lat={lat}&lon={lon}&format=json"
        response = requests.get(url)
        response.raise_for_status()
        return jsonify({"success": True, "data": response.json()})
    except requests.exceptions.RequestException as e:
        logging.error(f"Error fetching reverse geocode: {e}")
        return jsonify({"error": "Failed to fetch location. Try again later."}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
