#if you want to use a database to explictly store the users 

from flask_pymongo import PyMongo
from config import MONGO_URI

mongo = PyMongo()

def initialize_user_db(app):
    """Initialize MongoDB connection for user authentication."""
    app.config["MONGO_URI"] = MONGO_URI
    mongo.init_app(app)

def save_user(user_data):
    """Save user info to MongoDB only if they are new."""
    if not mongo.db:  # Ensure database is initialized
        return {"error": "MongoDB is not initialized"}

    users = mongo.db.users

    # Check if user already exists
    existing_user = users.find_one({"email": user_data["email"]})

    if existing_user:
        return {"message": "User already exists"}

    # Insert new user
    user_id = users.insert_one(user_data).inserted_id
    return {"message": "User saved successfully", "user_id": str(user_id)}
