from rest_framework import serializers
from rest_framework.serializers import FileField
from .models import Wrapped, Video, Analysis

class AnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ('first_video', 'first_music', 'most_watched')

class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ('title', 'channel', 'duration', 'category', 'thumbnail')

class WrappedSerializer(serializers.ModelSerializer):
    videos = VideoSerializer(many=True, read_only=True)
    class Meta:
        model = Wrapped
        fields = ('code','host','name','file','created_at','count', 'videos', 'music_count')

class CreateWrapSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wrapped
        fields = ('name','file')