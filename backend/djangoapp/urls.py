from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from . import views

app_name = 'djangoapp'
urlpatterns = [
    path(route='login', view=views.login_user, name='login'),
    path(route='logout', view=views.logout_user, name='logout'),
    path(route='register', view=views.register, name='register'),
    path(route='prediction', view=views.prediction, name='prediction'),
    path(route='save_prediction', view=views.save_prediction, name='save_prediction'),
    path(route='past_predictions', view=views.past_predictions, name='past_predictions'),
]
