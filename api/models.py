from django.db import models
import string
import random
import datetime as dt

def generate_unique_code():
    length = 6

    while True:
        code = ''.join(random.choices(string.ascii_uppercase, k=length))
        if Wrapped.objects.filter(code=code).count() == 0:
            if code != '000000':
                break

    return code

class Wrapped(models.Model):
    code = models.CharField(max_length=8, default=generate_unique_code, unique=True)    
    host = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=64)
    filename = models.CharField(max_length=100,default=None, null=True)    
    created_at = models.DateTimeField(auto_now_add=True) 
    count = models.IntegerField(null=False, default=0)   
    time = models.IntegerField(default=0)   
    channels = models.IntegerField(default=0)   

class Video(models.Model):
    wrap = models.ForeignKey('Wrapped', related_name='videos', on_delete=models.CASCADE)  
    video_id = models.CharField(max_length=100)    
    title = models.CharField(max_length=100)    
    channel = models.CharField(max_length=100)  
    duration = models.BigIntegerField(default=0)
    category = models.CharField(max_length=100)  
    thumbnail = models.CharField(max_length=100)  
    month = models.IntegerField(default=0) 
    date = models.DateTimeField()
    watched = models.DateTimeField(null=True, default=None)
    views = models.BigIntegerField(default=0) 

