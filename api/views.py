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
import requests
import json
import csv

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
        
class ProcessWrap(APIView):
    serializer_class = WrappedSerializer
    lookup_url_kwarg = 'code'
    my_key = 'AIzaSyAj_otQff7NB2HsyD1RZFiNBLGgFw1uAzg'

    def get_data(self,key, region, *ids):
        url = "https://www.googleapis.com/youtube/v3/videos?part=snippet&id={ids}&key={api_key}"
        r = requests.get(url.format(ids=",".join(ids), api_key=key))
        js = r.json()
        items = js["items"]
        cat_js = requests.get("https://www.googleapis.com/youtube/v3/videoCategories?part=snippet&regionCode={}&key={}".format(region,
            key)).json()
        categories = {d['id']: d["snippet"]['title'] for d in cat_js["items"]}
        for item in items:
            try:
                yield item["snippet"]["title"], categories[item["snippet"]["categoryId"]], item["snippet"]["channelTitle"]
            except:
                continue
            
    def get_ids(self,f):    
        video_list = []
        watch_history = json.load(f)
        for video in watch_history:
            if "time" in video:
                video_year = (video['time'])[:4]
                if video_year != '2023':
                    break
                else:
                    if "titleUrl" in video:
                        video_id = str((video['titleUrl'])[32:])
                        video_list.append(video_id)
        return video_list
            
    def get_music_only(self,key, json_file):    
        music_list = []
        video_list = self.get_ids(json_file)
        for i in range(0, len(video_list), 50):
            video_sublst = video_list[i:i + 50]
            for title, cat, chnl in self.get_data(key, "IE",  *video_sublst):
                if cat == "Music":
                    item = title + "," + chnl
                    music_list.append(item)
        return music_list  

    def history_count(self,json_file):
        with json_file.file.open('r') as f:
            my_music_list = self.get_music_only(self.my_key,f)
            watch_count = len(my_music_list)
            return watch_count
        return 0

    def get(self, request, format=None):
        code = request.GET.get(self.lookup_url_kwarg)
        if code != None:
            queryset = Wrapped.objects.filter(code=code)
            if len(queryset) > 0:
                wrap = queryset[0]   
                wrap.count = self.history_count(wrap.file)
                wrap.save(update_fields=['count'])
                return Response(WrappedSerializer(wrap).data, status=status.HTTP_200_OK)
            return Response({'Bad Request': 'Wrap Not Found'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Wrap Parameter Not Found in Request'}, status=status.HTTP_400_BAD_REQUEST)

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