from django.db import models
from django.contrib.auth.models import User
from django.utils.timezone import now

# Create your models here.

class Prediction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    metal = models.CharField(max_length=100)
    purity = models.CharField(max_length=100)
    currency = models.CharField(max_length=10)
    start_date = models.DateField(default=now)
    predictions = models.JSONField()

    def __str__(self):
        return f"{self.user.username} - {self.metal} ({self.currency})"
