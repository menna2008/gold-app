from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth import login, authenticate, logout
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
import json


# Create your views here.
@csrf_exempt
def login_user(request):
    data = json.loads(request.body)
    username = data['username']
    password = data['password']
    user = authenticate(uername=username, password=password)
    if user is not None:
        return JsonResponse({'status' : 'authenticated'})
    return JsonResponse({'staus' : 'Could not authenticate'})

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
