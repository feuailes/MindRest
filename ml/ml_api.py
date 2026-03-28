from flask import Flask, request, jsonify
import joblib
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app) # Allows Laravel to talk to this Python server

# 1. Load your saved ML files (Ensure these .pkl files are in the SAME folder)
try:
    model = joblib.load("digital_exhaustion_lr_model.pkl")
    scaler = joblib.load("scaler.pkl")
    print("Model and Scaler loaded successfully!")
except Exception as e:
    print(f"Error loading model files: {e}")

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        
        # 2. Extract features in the EXACT order your model expects:
        # [Screentime, Sleep, Stress, Mood]
        raw_features = [
            float(data.get('screentime', 0)), 
            float(data.get('sleep', 0)), 
            float(data.get('stress', 0)), 
            float(data.get('mood', 0))
        ]
        
        # 3. Reshape and Scale
        features = np.array(raw_features).reshape(1, -1)
        features_scaled = scaler.transform(features)
        
        # 4. Predict (0=Low, 1=Moderate, 2=High)
        prediction = model.predict(features_scaled)[0]
        
        print(f"Input: {raw_features} -> Prediction: {prediction}")
        
        return jsonify({'prediction': int(prediction)})
        
    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    # Runs on port 5000 (which matches your Laravel Controller)
    app.run(port=5000, debug=True)