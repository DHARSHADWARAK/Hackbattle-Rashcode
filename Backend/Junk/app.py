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

    # Check if the required columns are present
    required_columns = ['income', 'deductions']
    if not all(col in df.columns for col in required_columns):
        return jsonify({"error": "File does not contain the required columns"}), 400

    # Extract total income and deductions from the file
    total_income = df['income'].sum()
    total_deductions = df['deductions'].sum()

    # Simulated tax calculation logic (replace with actual calculation logic)
    old_regime_tax = calculate_old_regime_tax(total_income, total_deductions)
    new_regime_tax = calculate_new_regime_tax(total_income)
    
    # Tax savings and regime recommendation
    tax_savings = old_regime_tax - new_regime_tax
    recommended_regime = "New Regime" if new_regime_tax < old_regime_tax else "Old Regime"
    
    result = {
        "financial_year": "2023-2024",
        "total_income": total_income,
        "total_deductions": total_deductions,
        "old_regime_tax": old_regime_tax,
        "new_regime_tax": new_regime_tax,
        "tax_savings": tax_savings,
        "recommended_regime": recommended_regime
    }
    
    return jsonify(result)

# Dummy tax calculation functions (replace with actual logic)
def calculate_old_regime_tax(total_income, total_deductions):
    taxable_income = total_income - total_deductions
    # Simulate tax calculation (use actual tax slabs)
    tax = taxable_income * 0.1  # Example: 10% tax rate
    return max(tax, 0)

def calculate_new_regime_tax(total_income):
    # Simulate tax calculation for new regime (use actual tax slabs)
    tax = total_income * 0.08  # Example: 8% tax rate
    return max(tax, 0)

if __name__ == "__main__":
    app.run(debug=True)
