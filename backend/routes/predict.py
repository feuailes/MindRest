from flask import Blueprint, request, jsonify
import pickle
import os

predict_bp = Blueprint('predict', __name__)

# Load ML model (if exists)
model_path = os.path.join('models', 'fatigue_model.pkl')
if os.path.exists(model_path):
    with open(model_path, 'rb') as f:
        model = pickle.load(f)
else:
    model = None  # fallback

@predict_bp.route('', methods=['POST'])
def predict():
    data = request.get_json()

    # Basic validation
    required_fields = ['gender', 'screen', 'sleep', 'stress', 'mood', 'longDay']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing fields'}), 400

    # Dummy prediction if model not trained
    if model is None:
        # simple logic: if stress > 7 or mood < 4 → High, else Medium/Low
        stress = int(data.get('stress', 5))
        mood = int(data.get('mood', 5))
        if stress > 7 or mood < 4:
            risk = "High"
        elif stress > 4 or mood < 7:
            risk = "Medium"
        else:
            risk = "Low"
    else:
        # Replace this with your ML prediction code
        features = [list(data.values())]  # adapt as per your trained model
        risk = model.predict(features)[0]

    return jsonify({'risk': risk})
