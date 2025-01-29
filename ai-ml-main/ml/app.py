from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.ensemble import RandomForestClassifier
import numpy as np
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(
    filename='ml_service.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

app = Flask(__name__)
CORS(app)

def calculate_risk_score(features):
    """
    Calculate risk score based on various features
    """
    base_score = 0
    
    # BMI Analysis (weight in kg, height in cm)
    height_m = features['height'] / 100
    bmi = features['weight'] / (height_m * height_m)
    if bmi > 25:
        base_score += 20
    elif bmi > 30:
        base_score += 30

    # Cycle Analysis
    if features['cycle'] > 35 or features['cycle'] < 21:
        base_score += 15

    # Age Analysis
    if 15 <= features['age'] <= 45:
        base_score += 10

    # Symptoms Analysis
    symptoms = ['hairGrowth', 'skinDarkening', 'hairLoss', 'pimples']
    symptom_count = sum(1 for symptom in symptoms if features.get(symptom, False))
    base_score += symptom_count * 10

    # Normalize score to 0-100 range
    final_score = min(max(base_score, 0), 100)
    
    return final_score

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        logging.info(f"Received prediction request: {data}")

        # Validate required fields
        required_fields = ['age', 'weight', 'height', 'cycle']
        if not all(field in data for field in required_fields):
            return jsonify({
                'error': 'Missing required fields',
                'required_fields': required_fields
            }), 400

        # Calculate risk score
        risk_score = calculate_risk_score(data)

        response = {
            'risk': risk_score,
            'probability': risk_score / 100,
            'timestamp': datetime.now().isoformat(),
            'risk_level': 'High' if risk_score > 70 else 'Medium' if risk_score > 40 else 'Low'
        }

        logging.info(f"Prediction response: {response}")
        return jsonify(response)

    except Exception as e:
        logging.error(f"Error processing request: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
