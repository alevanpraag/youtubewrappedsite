from rest_framework import serializers
from rest_framework.serializers import FileField
from .models import Wrapped, Video

class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ('title', 'channel', 'duration', 'category', 'thumbnail')
        
class WrappedSerializer(serializers.ModelSerializer):
    file = FileField()
    videos = VideoSerializer(many=True, read_only=True)
    class Meta:
        model = Wrapped
        fields = ('code','host','name','file','created_at','count', 'videos')

class CreateWrapSerializer(serializers.ModelSerializer):
    file = FileField()
    class Meta:
        model = Wrapped
        fields = ('name','file')