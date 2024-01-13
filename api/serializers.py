from rest_framework import serializers
from rest_framework.serializers import FileField
from .models import Wrapped, Video

class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ('video_id', 'title', 'channel', 'duration', 'category', 'thumbnail', 'month', 'date', 'views')

class WrappedSerializer(serializers.ModelSerializer):
    videos = VideoSerializer(many=True, read_only=True)
    class Meta:
        model = Wrapped
        fields = ('code','host','name','created_at','count', 'time', 'channels','videos')

class CreateWrapSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wrapped
        fields = ('name',)