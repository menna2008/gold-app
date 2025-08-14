from django.shortcuts import render
from django.http import JsonResponse
from django.core.serializers import serialize
from django.contrib.auth import login, authenticate, logout
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from .models import Prediction
import json
import yfinance as yf
from .XGBoost import create_lag_features, xgboost_model, predict_future
from datetime import date

# Create your views here.
@csrf_exempt
def login_user(request):
    data = json.loads(request.body)
    username = data['username']
    password = data['password']
    user = authenticate(username=username, password=password)
    if user is not None:
        return JsonResponse({'status' : 'authenticated'})
    return JsonResponse({'status' : 'Could not authenticate'})

@csrf_exempt
def logout_user(request):
    logout(request)
    return JsonResponse({'status' : 'logged out'})

@csrf_exempt
def register(request):
    data = json.loads(request.body)
    username = data['username']
    password = data['password']
    first_name = data['first_name']
    last_name = data['last_name']
    email = data['email']

    try:
        User.objects.get(username=username)
        return JsonResponse({'status' : 'Username already exists'})
    except:
        user = User.objects.create_user(
            username = username,
            password = password,
            first_name = first_name,
            last_name = last_name,
            email = email
        )
        login(request, user)
        return JsonResponse({'status' : 'registered'})

def prediction(request):
    metal = request.GET['metal']
    purity = request.GET['purity']
    currency = request.GET['currency']

    if metal == 'gold':
        data = yf.download('GC=F', start='2013-01-01')
    elif metal == 'silver':
        data = yf.download('SI=F', start='2013-01-01')
    elif metal == 'platinum':
        data = yf.download('PL=F', start='2013-01-01')
    else:
        data = yf.download('PA=F', start='2013-01-01')

    data.columns = data.columns.get_level_values(0)
    data = data['Close']
    data = data.reset_index(drop=False)
    data.columns = ['date', 'price']
    data = create_lag_features(data)
    data = data.reset_index(drop=True)
    
    model = xgboost_model(data, metal)
    predictions = predict_future(model, data, metal, purity, currency)
    return JsonResponse({'predictions' : predictions})

@csrf_exempt
def save_prediction(request):
    try:
        data = json.loads(request.body)
        user = User.objects.get(username=data['username'])
        metal = data['metal']
        purity = data['purity']
        currency = data['currency']
        predictions = data['predictions']

        try:
            prediction = Prediction.objects.get(
                user=user,
                metal=metal,
                purity=purity,
                currency=currency,
                start_date=date.today()
            )
            return JsonResponse({'status' : 'Prediction already exists'})
        except Prediction.DoesNotExist:
            prediction = Prediction.objects.create(
                user=user,
                metal=metal,
                purity=purity,
                currency=currency,
                start_date=date.today(),
                predictions=predictions
            )
            return JsonResponse({'status' : 'success'})
    except Exception as e:
        return JsonResponse({'status' : 'error', 'message' : str(e)})


