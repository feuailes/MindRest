from flask import Flask, request, jsonify
import joblib
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load model
try:
    model = joblib.load("digital_exhaustion_lr_model.pkl")
    scaler = joblib.load("scaler.pkl")
    print("Model and Scaler loaded successfully!")
except Exception as e:
    print(f"Error loading model files: {e}")


# ✅ ADD THIS FUNCTION
def normalize_screen_time(hours):
    if hours <= 2: return 2
    elif hours <= 4: return 4
    elif hours <= 6: return 6
    elif hours <= 8: return 8
    else: return 10


@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json

        # Extract values
        screentime = float(data.get('screentime', 0))
        sleep = float(data.get('sleep', 0))
        stress = float(data.get('stress', 0))
        mood = float(data.get('mood', 0))

        # ✅ ONLY CHANGE: normalize screen time
        screentime = normalize_screen_time(screentime)

        # Keep order SAME
        raw_features = [screentime, sleep, stress, mood]

        # Scale
        features = np.array(raw_features).reshape(1, -1)
        features_scaled = scaler.transform(features)

        # Predict
        prediction = model.predict(features_scaled)[0]

        print(f"Input(after scaling): {raw_features} -> Prediction: {prediction}")

        return jsonify({'prediction': int(prediction)})

    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({'error': str(e)}), 400


if __name__ == '__main__':
    app.run(port=5000, debug=True)