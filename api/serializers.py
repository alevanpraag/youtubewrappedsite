from rest_framework import serializers
from rest_framework.serializers import FileField
from .models import Wrapped #, Video

class WrappedSerializer(serializers.ModelSerializer):
    file = FileField()
    class Meta:
        model = Wrapped
        fields = ('code','host','name','file','created_at','count')

class CreateWrapSerializer(serializers.ModelSerializer):
    file = FileField()
    class Meta:
        model = Wrapped
        fields = ('name','file')
""" 
class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ('id','title', 'artist', 'duration', 'genre', 'count')

class CreateVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ('id','title', 'artist', 'duration', 'genre')       """
