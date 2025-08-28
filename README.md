# Precious Metals Price Prediction App
This application is designed to predict the price of gold, silver, platinum, and palladium over a 30 day periiod.

## How to install and run on your local computer
First run this command:
```
git pull https://github.com/menna2008/gold-app.git
```

# Frontend
To deploy the frontend, run the following commands:
```
cd frontend
npm install
npm run build
npm run dev
```

# Backend
In a new terminal, run these commands to deploy the backend:
```
cd ../backend
pip install virtualenv
virtualenv djangoenv
source djangoenv/bin/activate
python3 -m pip install -U -r requirements.txt
python3 manage.py makemigrations
python3 manage.py migrate
```
