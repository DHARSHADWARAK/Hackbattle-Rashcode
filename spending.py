import pandas as pd
from sklearn.cluster import KMeans
import matplotlib.pyplot as plt

# Load the data
df = pd.read_excel('data.xlsx')  # Load the data from the file (Excel, CSV, etc.)

# Data cleaning and preprocessing
df['Date'] = pd.to_datetime(df['Date'], format='%d-%m-%Y')  # Adjust date format if needed
df['Withdrawal Amt.'] = df['Withdrawal Amt.'].fillna(0).astype(float)  # Convert withdrawal amount to float
df['Deposit Amt.'] = df['Deposit Amt.'].fillna(0).astype(float)  # Convert deposit amount to float
df['Closing Balance'] = df['Closing Balance'].astype(float)  # Convert closing balance to float

# Feature engineering
df['Month'] = df['Date'].dt.month
df['Year'] = df['Date'].dt.year
df['Day'] = df['Date'].dt.day

# Calculating net amount per transaction
df['Net Amount'] = df['Deposit Amt.'] - df['Withdrawal Amt.']  # Positive for deposits, negative for withdrawals

# Check the time frame of the data
unique_months = df['Month'].nunique()
unique_years = df['Year'].nunique()

# Plot configuration based on time frame
if unique_months == 1 and unique_years == 1:
    # Data is for a single month, so we use daily aggregation
    daily_spending = df.groupby(['Year', 'Month', 'Day'])['Net Amount'].sum().reset_index()

    # Clustering model to segment spending patterns (using daily data)
    kmeans = KMeans(n_clusters=3, random_state=42)
    daily_spending['Spending_Cluster'] = kmeans.fit_predict(daily_spending[['Net Amount']])

    # Visualization for daily spending
    plt.scatter(daily_spending['Day'], daily_spending['Net Amount'], c=daily_spending['Spending_Cluster'])
    plt.title('Daily Spending Clusters')
    plt.xlabel('Day of the Month')
    plt.ylabel('Net Amount (Deposits - Withdrawals)')
else:
    # Data is for multiple months, use monthly aggregation
    monthly_spending = df.groupby(['Year', 'Month'])['Net Amount'].sum().reset_index()

    # Clustering model to segment spending patterns (using monthly data)
    kmeans = KMeans(n_clusters=3, random_state=42)
    monthly_spending['Spending_Cluster'] = kmeans.fit_predict(monthly_spending[['Net Amount']])

    # Visualization for monthly spending
    plt.scatter(monthly_spending['Month'], monthly_spending['Net Amount'], c=monthly_spending['Spending_Cluster'])
    plt.title('Monthly Spending Clusters')
    plt.xlabel('Month')
    plt.ylabel('Net Amount (Deposits - Withdrawals)')

# Show the plot
plt.grid(True)
plt.show()
