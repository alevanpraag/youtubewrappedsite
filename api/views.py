from django.shortcuts import render, redirect
from rest_framework import generics, status
from .serializers import WrappedSerializer, CreateWrapSerializer, VideoSerializer
from .models import Wrapped, Video
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
                    wrap.count = 0
                    Video.objects.filter(wrap=wrap).delete()
                    wrap.save(update_fields=['name', 'file', 'count'])
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
    vid_serializer = VideoSerializer
    lookup_url_kwarg = 'code'
    my_key = 'AIzaSyAj_otQff7NB2HsyD1RZFiNBLGgFw1uAzg'

    def get_data(self,key, region, *ids):
        url = "https://www.googleapis.com/youtube/v3/videos?part=snippet&id={ids}&key={api_key}&part=contentDetails"
        r = requests.get(url.format(ids=",".join(ids), api_key=key))
        js = r.json()
        items = js["items"]
        cat_js = requests.get("https://www.googleapis.com/youtube/v3/videoCategories?part=snippet&regionCode={}&key={}".format(region,
            key)).json()
        categories = {d['id']: d["snippet"]['title'] for d in cat_js["items"]}
        for item in items:
            try:
                yield item["snippet"]["title"], categories[item["snippet"]["categoryId"]], item["snippet"]["channelTitle"], item['snippet']['thumbnails']['default']['url'], item['contentDetails']['duration']
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
            
    def get_music_only(self,key, json_file,wrap):    
        music_list = []
        watch_list = []
        video_list = self.get_ids(json_file)
        for i in range(0, len(video_list), 50):
            video_sublst = video_list[i:i + 50]
            for title, cat, chnl, thmnl, dur in self.get_data(key, "IE",  *video_sublst):
                video = Video(wrap = wrap, title = title, channel = chnl, duration = dur,
                                    category = cat, thumbnail = thmnl)
                video.save()
                watch_list.append(video)
                if cat == 'Music':
                    music_list.append(video)
        return watch_list, music_list  

    def history_count(self,json_file,wrap):
        with json_file.file.open('r') as f:
            my_watch_list, my_music_list = self.get_music_only(self.my_key,f,wrap)
            watch_count = len(my_watch_list)
            music_count = len(my_music_list)
            return watch_count, music_count
        return 0, 0

    def get(self, request, format=None):
        code = request.GET.get(self.lookup_url_kwarg)
        if code != None:
            queryset = Wrapped.objects.filter(code=code)
            if len(queryset) > 0:
                wrap = queryset[0]   
                if wrap.count == 0:
                    wrap.count, wrap.music_count= self.history_count(wrap.file,wrap)
                    wrap.save(update_fields=['count','music_count'])
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

class GetFirstVideo(APIView):
    serializer_class = VideoSerializer
    lookup_url_kwarg = 'code'

    def first_music_video(self,wrap):
        last_ind = wrap.count
        first_vid = wrap.videos.all()[last_ind-1]
        for vid in wrap.videos.all():
            if vid.category == 'Music':
                first_vid = vid
        return first_vid

    def get_hd_pic(self,video):
        if video.thumbnail[-12:] == "/default.jpg":
            new_url = video.thumbnail[:-11] + "maxresdefault.jpg"
            video.thumbnail = new_url
            video.save(update_fields=['thumbnail'])

    def get(self, request, format=None):
        code = request.GET.get(self.lookup_url_kwarg)
        if code != None:
            queryset = Wrapped.objects.filter(code=code)
            if len(queryset) > 0:
                wrap = queryset[0]   
                video = self.first_music_video(wrap)
                self.get_hd_pic(video)
                return Response(VideoSerializer(video).data, status=status.HTTP_200_OK)
            return Response({'Bad Request': 'Wrap Not Found'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Wrap Parameter Not Found in Request'}, status=status.HTTP_400_BAD_REQUEST)        