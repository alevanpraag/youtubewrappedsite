from django.shortcuts import render, redirect
from rest_framework import generics, status
from .serializers import WrappedSerializer, CreateWrapSerializer
from .models import Wrapped
from rest_framework.views import APIView
from rest_framework.response import Response
from datetime import datetime
from rest_framework.parsers import FormParser, MultiPartParser
from django.core.files.storage import FileSystemStorage
from django.core.files.base import File

class WrappedView(generics.ListAPIView):
    queryset = Wrapped.objects.all()
    serializer_class = WrappedSerializer

class CreateWrapView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    serializer_class = CreateWrapSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            name = serializer.data.get('name')
            host = self.request.session.session_key
            queryset = Wrapped.objects.filter(host=host)
            with open(request.data.get('file').temporary_file_path(),'r') as f:
                file = File(f, name=request.data.get('file').name)
                if queryset.exists():  
                    wrap = queryset[0] 
                    wrap.name = name   
                    wrap.file = file
                    wrap.save(update_fields=['name', 'file'])
                    return Response(WrappedSerializer(wrap).data, status=status.HTTP_200_OK)
                else:
                    wrap = Wrapped(host=host, name=name,
                                file=file)
                    wrap.save()
                    return Response(WrappedSerializer(wrap).data, status=status.HTTP_201_CREATED)                
        else:
            return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)
        
class GetWrap(APIView):
    serializer_class = WrappedSerializer
    lookup_url_kwarg = 'code'

    def get(self, request, format=None):
        code = request.GET.get(self.lookup_url_kwarg)
        if code != None:
            queryset = Wrapped.objects.filter(code=code)
            if len(queryset) > 0:
                wrap = queryset[0] 
                return Response(WrappedSerializer(wrap).data, status=status.HTTP_200_OK)
            return Response({'Bad Request': 'Wrap Not Found'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Wrap Parameter Not Found in Request'}, status=status.HTTP_400_BAD_REQUEST)

