import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime

# Function to preprocess data
def preprocess_data(file_path):
    try:
        df = pd.read_excel(file_path)
    except Exception as e:
        print(f"Error reading Excel file: {e}")
        return None
    
    # Check for required columns
    required_columns = ['date', 'name', 'withdrawal_amt', 'deposit_amt', 'closing_balance']
    for col in required_columns:
        if col not in df.columns:
            print(f"Missing required column: {col}")
            return None
    
    # Convert 'date' to datetime
    df['date'] = pd.to_datetime(df['date'], errors='coerce')
    df = df.dropna(subset=['date'])  # Drop rows with invalid dates
    
    # Filter only deposit transactions
    df_deposits = df[df['deposit_amt'] > 0].copy()
    
    return df_deposits

# Function to analyze transactions and identify salary sources
def identify_salary_sources(df_deposits):
    # Extract month and year for frequency analysis
    df_deposits['year_month'] = df_deposits['date'].dt.to_period('M')
    
    # Group by 'name'
    grouped = df_deposits.groupby('name')
    
    salary_candidates = []
    
    for name, group in grouped:
        total_deposits = group['deposit_amt'].sum()
        num_deposits = group['deposit_amt'].count()
        unique_months = group['year_month'].nunique()
        amount_std = group['deposit_amt'].std()
        amount_mean = group['deposit_amt'].mean()
        
        # Calculate frequency: deposits per month
        frequency = num_deposits / unique_months if unique_months else 0
        
        # Calculate consistency: lower std dev indicates higher consistency
        consistency = 1 / (1 + amount_std)  # Higher score for lower std dev
        
        # Regularity: how close the deposit dates are within the month
        # Calculate average day of month
        group['day'] = group['date'].dt.day
        avg_day = group['day'].mean()
        day_variance = group['day'].std()
        regularity = 1 / (1 + day_variance)  # Higher score for lower variance
        
        score = (frequency * 0.5) + (consistency * 0.3) + (regularity * 0.2)
        
        salary_candidates.append({
            'name': name,
            'total_deposits': total_deposits,
            'num_deposits': num_deposits,
            'unique_months': unique_months,
            'frequency_per_month': frequency,
            'amount_mean': amount_mean,
            'amount_std_dev': amount_std,
            'consistency_score': consistency,
            'regularity_score': regularity,
            'overall_score': score
        })
    
    candidates_df = pd.DataFrame(salary_candidates)

    candidates_df = candidates_df.sort_values(by='overall_score', ascending=False)
    
    return candidates_df

def main():
    print("=== Salary Transaction Identifier ===\n")
    
    # Get the Excel file path from the user
    file_path = r'C:\Users\rahul\OneDrive\Desktop\Hackathon\Financial_expenses_synthetic.xlsx'
    
    # Preprocess the data
    df_deposits = preprocess_data(file_path)
    if df_deposits is None or df_deposits.empty:
        print("No deposit transactions found or failed to preprocess data.")
        return
    
    print(f"\nTotal deposit transactions found: {df_deposits.shape[0]}")
    
    # Identify salary sources
    candidates_df = identify_salary_sources(df_deposits)
    
    if candidates_df.empty:
        print("No candidates identified.")
        return
    
    # Display top 5 candidates
    print("\nTop Salary Candidates:")
    print(candidates_df[['name', 'overall_score', 'frequency_per_month', 'consistency_score', 'regularity_score']].head(5))
    
    

if __name__ == "__main__":
    main()
