import pandas as pd
from datetime import datetime

def preprocess_data(file):
    # Load and preprocess the salary data
    df = pd.read_excel(file)
    df['date'] = pd.to_datetime(df['date'], errors='coerce')
    df = df.dropna(subset=['date'])
    df['deposit_amt'] = df['deposit_amt'].fillna(0).astype(float)
    return df[df['deposit_amt'] > 0]

def identify_salary_sources(df):
    # Identify potential salary sources based on deposit frequency and amounts
    df['year_month'] = df['date'].dt.to_period('M')
    grouped = df.groupby('name')

    salary_candidates = []

    for name, group in grouped:
        num_deposits = group['deposit_amt'].count()
        unique_months = group['year_month'].nunique()
        frequency = num_deposits / unique_months if unique_months else 0

        salary_candidates.append({
            'name': name,
            'total_deposits': group['deposit_amt'].sum(),
            'frequency_per_month': frequency
        })

    candidates_df = pd.DataFrame(salary_candidates)
    candidates_df = candidates_df.sort_values(by='frequency_per_month', ascending=False)

    return candidates_df
