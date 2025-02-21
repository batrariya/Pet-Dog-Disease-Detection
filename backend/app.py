from flask import Flask
from flask_cors import CORS
from routes.detect import detect_bp

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend integration

app.register_blueprint(detect_bp, url_prefix="/api")

if __name__ == "__main__":
    app.run(debug=True)
