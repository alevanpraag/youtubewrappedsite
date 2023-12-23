from rest_framework import serializers
from rest_framework.serializers import FileField
from .models import Wrapped

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
