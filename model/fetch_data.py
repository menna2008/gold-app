import requests, os
import pandas as pd

def get_data(API_KEY, start_date, end_date):
    url = f'https://api.metalpriceapi.com/v1/timeframe?api_key={API_KEY}&start_date={start_date}&end_date={end_date}&base=USD&currencies=XAU,XAG,XPT,XPD'
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        rates = data['rates']
    
    combined_df = pd.DataFrame.from_dict(rates, orient='index')

try:
    API_KEY = os.getenv['API_KEY']
    start_date = '2019-01-01'
    end_date = '2025-12-31'
    get_data(API_KEY, start_date, end_date)
except:
    print('API key not available')