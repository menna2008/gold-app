import xgboost as xgb
from sklearn.model_selection import TimeSeriesSplit
import pandas as pd
from datetime import date, timedelta
import requests
import os

def create_lag_features(df, lags=[1, 2, 3, 5, 7, 14, 30]):
    for lag in lags:
        df[f'lag_{lag}'] = df['price'].shift(lag)
    df['rolling_7_mean'] = df['price'].rolling(window=7).mean()
    df['rolling_30_mean'] = df['price'].rolling(window=30).mean()
    return df.dropna()

def xgboost_model(df, metal_name='gold', random_state=42):
    X = df.drop(['date', 'price'], axis=1)
    y = df['price']
    
    tscv = TimeSeriesSplit(n_splits=5, test_size=30)

    for fold, (train_idx, test_idx) in enumerate(tscv.split(X)):
        X_train, X_test = X.iloc[train_idx], X.iloc[test_idx]
        y_train, y_test = y.iloc[train_idx], y.iloc[test_idx]
    
    model = xgb.XGBRegressor(
        objective='reg:squarederror',
        n_estimators=1000,
        learning_rate=0.01,
        max_depth=6,
        subsample=0.8,
        colsample_bytree=0.8,
        early_stopping_rounds=50,
        random_state=random_state
    )
        
    model.fit(
        X_train, y_train,
        eval_set=[(X_train, y_train), (X_test, y_test)],
        verbose=100
    )

    return model

def predict_future(model, df, metal, purity, currency):
    last_30_days = df[['price']].iloc[-30:].copy()
    predictions = []
    today = date.today()

    for i in range(30):
        x = today + timedelta(days=i)
        features = {}
        for lag in [1, 2, 3, 5, 7, 14, 30]:
            features[f'lag_{lag}'] = last_30_days['price'].iloc[-lag]
        features['rolling_7_mean'] = last_30_days['price'].tail(7).mean()
        features['rolling_30_mean'] = last_30_days['price'].mean()

        price = float(model.predict(pd.DataFrame([features]))[0])

        predictions.append({'date' : x.strftime('%Y-%m-%d'), 'price' : float(price)})
        last_30_days.loc[len(last_30_days)] = price
        last_30_days = last_30_days.iloc[1 : ].reset_index(drop=True)

    API_KEY = os.getenv('EXCHANGE_RATE_API_KEY')
    rate = 1
    if currency != 'USD':
        url = f'https://v6.exchangerate-api.com/v6/${API_KEY}/pair/USD/{currency}'
        res = requests.get(url)
        data = res.json()
        rate = data['conversion_rate']
    
    purity_ratio = 1
    purity = float(purity)
    if metal == 'gold' and purity != 24:
        purity_ratio = purity/24
    elif metal == 'silver' and purity != 99.9:
        purity_ratio = purity/99.9
    elif metal == 'platinum' and purity != 1000:
        purity_ratio = purity/1000
    elif metal == 'palladium' and purity != 999:
        purity_ratio = purity/999

    for i in range(len(predictions)):
        predictions[i]['price'] = round(predictions[i]['price'] * purity_ratio * rate, 2)
    
    return predictions
