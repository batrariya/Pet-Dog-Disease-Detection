from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)  # Initialize Flask app
    CORS(app)  # Enable CORS for frontend-backend communication
    
    app.config["UPLOAD_FOLDER"] = "static/uploads"  # Set upload directory

    # Ensure the upload folder exists
    import os
    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

    # Register routes (import only after initializing app to avoid circular imports)
    from .routes import setup_routes
    setup_routes(app)

    return app
