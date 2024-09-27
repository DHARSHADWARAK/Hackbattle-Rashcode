from flask import Flask, jsonify, request, send_from_directory
import pandas as pd
import os

app = Flask(__name__, static_folder="../frontend/build")

# Serve React frontend
@app.route('/')
def serve_react():
    return send_from_directory(app.static_folder, 'index.html')

# API Endpoint for tax calculation
@app.route('/calculate-tax', methods=['POST'])
def calculate_tax_api():
    file = request.files['file']
    
    # Process the file (Excel or CSV)
    if file.filename.endswith('.csv'):
        df = pd.read_csv(file)
    elif file.filename.endswith('.xlsx'):
        df = pd.read_excel(file)
    else:
        return jsonify({"error": "Unsupported file format"}), 400

    # Simulated tax calculation logic
    result = {
        "financial_year": "2023-2024",
        "total_income": 500000,
        "total_deductions": 150000,
        "old_regime_tax": 30000,
        "new_regime_tax": 25000,
        "tax_savings": 5000,
        "recommended_regime": "New Regime"
    }
    
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)
