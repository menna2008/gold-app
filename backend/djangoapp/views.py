from django.shortcuts import render
from django.http import JsonResponse
from django.core.serializers import serialize
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from .models import Prediction
import json
import yfinance as yf
from .XGBoost import create_lag_features, xgboost_model, predict_future
from datetime import date
from .serializers import PredictionSerializer

# Create your views here.
@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    try:
        username = request.data.get('username')
        password = request.data.get('password')
        if not username or not password:
            return Response({'status' : 'error', 'message' : 'Missing credentials'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            token, created = Token.objects.get_or_create(user=user)
            return Response({'status' : 'authenticated', 'token' : token.key})
        return Response({'status' : 'error', 'message' : 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    except Exception as e:
        return Response({'status' : 'error', 'message' : str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_user(request):
    try:
        Token.objects.filter(user=request.user).delete()
        logout(request)
        return Response({'status' : 'logged out'})
    except Exception as e:
        return Response({'status' : 'error', 'message' : str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    data = request.data
    username = data.get('username')
    password = data.get('password')
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    email = data.get('email')

    if not username or not password or not first_name or not last_name or not email:
        return Response({'status' : 'error', 'message' : 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=email).exists():
        return Response({'status' : 'error', 'message' : 'Email already exists'}, status=status.HTTP_409_CONFLICT)

    if User.objects.filter(username=username).exists():
        return Response({'status' : 'error', 'message' : 'Username already exists'}, status=status.HTTP_409_CONFLICT)

    try:
        user = User.objects.create_user(
            username = username,
            password = password,
            first_name = first_name,
            last_name = last_name,
            email = email
        )
        login(request, user)
        token, created = Token.objects.get_or_create(user=user)
        return Response({'status' : 'registered', 'token' : token.key}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'status' : 'error', 'message' : str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
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
    return Response({'status' : 'success', 'predictions' : predictions})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_prediction(request):
    try:
        user = request.user
        metal = request.data.get('metal')
        purity = request.data.get('purity')
        currency = request.data.get('currency')
        predictions = request.data.get('predictions')

        if not user or not metal or not purity or not currency or not predictions:
            return Response({'status' : 'error', 'message' : 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)

        if Prediction.objects.filter(user=user,
                                      metal=metal,
                                      purity=purity,
                                      currency=currency,
                                      start_date=date.today()
                                      ).exists():
            return Response({'status' : 'error', 'message' : 'Prediction already exists'}, status=status.HTTP_409_CONFLICT)
        
        prediction = Prediction.objects.create(
            user=user,
            metal=metal,
            purity=purity,
            currency=currency,
            start_date=date.today(),
            predictions=predictions
        )
        return Response({'status' : 'success'})
    except Exception as e:
        return Response({'status' : 'error', 'message' : str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET', 'DELETE'])
@permission_classes([IsAuthenticated])
def past_predictions(request):
    if request.method == 'GET':
        try:
            predictions = Prediction.objects.filter(user=request.user)
            serializer = PredictionSerializer(predictions, many=True)
            print(serializer.data)
            return Response({'status' : 'success', 'predictions' : serializer.data})
        except Exception as e:
            return Response({'status' : 'error', 'message' : str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    elif request.method == 'DELETE':
        try:
            prediction = Prediction.objects.get(id=request.data.get('id'), user=request.user)
            prediction.delete()
            print('success')
            return Response({'status' : 'success'}, status=status.HTTP_204_NO_CONTENT)
        except Prediction.DoesNotExist:
            print('Prediction not found')
            return Response({'status' : 'error', 'message' : 'Prediction not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print('Error deleting prediction:', str(e))
            return Response({'status' : 'error', 'message' : str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
