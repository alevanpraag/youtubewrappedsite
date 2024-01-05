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
    code = models.CharField(max_length=8, default=generate_unique_code, unique=True)    
    host = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=64)
    file = models.FileField(upload_to="watch_history/jsons/")
    created_at = models.DateTimeField(auto_now_add=True) 
    count = models.IntegerField(null=False, default=0)   

class Video(models.Model):
    wrap = models.ForeignKey('Wrapped', related_name='videos', on_delete=models.CASCADE)  
    video_id = models.CharField(max_length=100)    
    title = models.CharField(max_length=100)    
    channel = models.CharField(max_length=100)  
    duration = models.CharField(max_length=64)
    category = models.CharField(max_length=100)  
    thumbnail = models.CharField(max_length=100)  
    month = models.CharField(max_length=2, default="01")  