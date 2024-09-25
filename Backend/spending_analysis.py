import pandas as pd
from sklearn.cluster import KMeans
import matplotlib.pyplot as plt
import io
import base64

def preprocess_data(file):
    # Load and preprocess the Excel file
    df = pd.read_excel(file)
    df['Date'] = pd.to_datetime(df['Date'], errors='coerce')
    df['Withdrawal Amt.'] = df['Withdrawal Amt.'].fillna(0).astype(float)
    df['Deposit Amt.'] = df['Deposit Amt.'].fillna(0).astype(float)
    df['Net Amount'] = df['Deposit Amt.'] - df['Withdrawal Amt.']
    return df

def cluster_spending(df):
    # Clustering based on monthly spending
    df['Month'] = df['Date'].dt.to_period('M')
    monthly_spending = df.groupby('Month')['Net Amount'].sum().reset_index()

    kmeans = KMeans(n_clusters=3, random_state=42)
    monthly_spending['Cluster'] = kmeans.fit_predict(monthly_spending[['Net Amount']])

    # Generate the plot for spending clusters
    plt.scatter(monthly_spending.index, monthly_spending['Net Amount'], c=monthly_spending['Cluster'])
    plt.title('Monthly Spending Clusters')

    # Save the plot as a base64 image
    img = io.BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)
    img_base64 = base64.b64encode(img.read()).decode('utf-8')
    plt.close()

    return img_base64, monthly_spending
