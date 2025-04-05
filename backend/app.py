from flask import Flask
from flask_cors import CORS
from flask_caching import Cache
from routes.chatbot import chatbot_bp
from routes.auth_routes import auth_bp
import logging

app = Flask(__name__)

# ✅ CORS config for your frontend
CORS(app, resources={r"/api/*": {"origins": "https://bloom-hub-five.vercel.app"}}, supports_credentials=True)

# ✅ Caching setup (if you still need it elsewhere)
cache = Cache(app, config={'CACHE_TYPE': 'simple'})

# ✅ Logging
logging.basicConfig(level=logging.INFO)

# ✅ Blueprints
app.register_blueprint(chatbot_bp, url_prefix='/api')
app.register_blueprint(auth_bp, url_prefix='/api/auth')

@app.route('/')
def home():
    return "Server is running!"

if __name__ == '__main__':
    app.run(debug=True, port=5000)
