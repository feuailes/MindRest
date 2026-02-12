from flask import Flask
from flask_cors import CORS
import os

# Import routes
from routes.predict import predict_bp
from routes.dashboard import dashboard_bp

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests from React frontend

# Register blueprints
app.register_blueprint(predict_bp, url_prefix='/predict')
app.register_blueprint(dashboard_bp, url_prefix='/dashboard')

# Create database folder if not exists
if not os.path.exists('database'):
    os.makedirs('database')

if __name__ == "__main__":
    app.run(debug=True)
