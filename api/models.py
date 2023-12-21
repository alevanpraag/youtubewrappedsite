from django.db import models
import string
import random


def generate_unique_code():
    length = 6

    while True:
        code = ''.join(random.choices(string.ascii_uppercase, k=length))
        if Wrapped.objects.filter(code=code).count() == 0:
            break

    return code

class Wrapped(models.Model):
    code = models.CharField(
        max_length=8, default=generate_unique_code, unique=True)    
    host = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=64)
    file = models.FileField(upload_to="watch_history/jsons/")
    created_at = models.DateTimeField(auto_now_add=True) 
    count = models.IntegerField(null=False, default=1)
    
""" class Video(models.Model):
    code = models.CharField(max_length=8)
    title = models.CharField(max_length=100)    
    artist = models.CharField(max_length=100)
    duration = models.IntegerField(null=False)
    genre = models.CharField(max_length=100) 
    count = models.IntegerField(null=False, default=1) """