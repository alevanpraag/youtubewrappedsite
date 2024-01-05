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
from django.http import JsonResponse


class AllWrappedView(generics.ListAPIView):
    queryset = Wrapped.objects.all()
    serializer_class = WrappedSerializer

class WrappedView(APIView):
    serializer_class = WrappedSerializer
    lookup_url_kwarg = 'code'

    def get(self, request, format=None):
        #lookup wrap by unique code
        code = request.GET.get(self.lookup_url_kwarg)
        if code != None:
            queryset = Wrapped.objects.filter(code=code)
            if len(queryset) > 0:
                wrap = queryset[0]   
                return Response(WrappedSerializer(wrap).data, status=status.HTTP_200_OK)
            return Response({'Bad Request': 'Wrap Not Found'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Wrap Parameter Not Found in Request'}, status=status.HTTP_400_BAD_REQUEST)

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
                #if same user requests a new wrap, delete old info
                if queryset.exists():  
                    wrap = queryset[0] 
                    wrap.name = name   
                    wrap.file = file
                    wrap.count = 0
                    wrap.music_count = 0
                    self.request.session['code'] = wrap.code
                    Video.objects.filter(wrap=wrap).delete()
                    wrap.save(update_fields=['name', 'file', 'count', 'music_count'])
                    return Response(WrappedSerializer(wrap).data, status=status.HTTP_200_OK)
                else:
                    wrap = Wrapped(host=host, name=name,file=file)
                    wrap.save()
                    self.request.session['code'] = wrap.code
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
                yield item["id"], item["snippet"]["title"], categories[item["snippet"]["categoryId"]], item["snippet"]["channelTitle"], item['snippet']['thumbnails']['default']['url'], item['contentDetails']['duration']
            except:
                continue

    def is_ad(self,video):
        try:
            if "From Google Ads" in video["details"][0]["name"]:
                return True
            return False
        except:
            return False
            
    def get_ids(self,f):    
        video_list = []
        month_dict = {}
        watch_history = json.load(f)
        for video in watch_history:
            if not self.is_ad(video):
                if "time" in video:
                    video_year = (video['time'])[:4]
                    video_month = (video['time'])[5:7]
                    if video_year != '2023':
                        break
                    else:
                        if "titleUrl" in video:
                            video_id = str((video['titleUrl'])[32:])
                            video_list.append(video_id)
                            month_dict[video_id] = video_month
        return video_list, month_dict
            
    def create_videos(self,key, json_file,wrap):    
        video_list, month_dict = self.get_ids(json_file)
        for i in range(0, len(video_list), 50):
            video_sublst = video_list[i:i + 50]
            for video_id, title, cat, chnl, thmnl, dur in self.get_data(key, "IE",  *video_sublst):
                month = month_dict[video_id]
                video = Video(video_id= video_id, wrap = wrap, title = title, channel = chnl, duration = dur,
                                    category = cat, thumbnail = thmnl, month= month)
                video.save() 

    def history_count(self,json_file,wrap):
        with json_file.file.open('r') as f:
            self.create_videos(self.my_key,f,wrap)
            videos = Video.objects.filter(wrap=wrap)
            watch_count = videos.count()
            return watch_count
        return 0

    def post(self, request, format=None):
        code = request.data.get(self.lookup_url_kwarg)
        if code != None:
            queryset = Wrapped.objects.filter(code=code)
            if len(queryset) > 0:
                wrap = queryset[0]   
                if wrap.count == 0:
                    wrap.count = self.history_count(wrap.file,wrap)
                    wrap.save(update_fields=['count'])
                return Response(WrappedSerializer(wrap).data, status=status.HTTP_200_OK)
            return Response({'Bad Request': 'Wrap Not Found'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Wrap Parameter Not Found in Request'}, status=status.HTTP_400_BAD_REQUEST)

class GetFirstVideo(APIView):
    serializer_class = VideoSerializer
    lookup_url_kwarg = 'code'

    def get_hd_pic(self,video):
        if video.thumbnail[-12:] == "/default.jpg":
            new_url = video.thumbnail[:-11] + "maxresdefault.jpg"
            video.thumbnail = new_url
            video.save(update_fields=['thumbnail'])

    def get_first(self,wrap):
        first = None
        for vid in wrap.videos.all():
            if vid.category == 'Music':
                first = vid
        return first

    def get(self, request, format=None):
        code = request.GET.get(self.lookup_url_kwarg)
        if code != None:
            queryset = Wrapped.objects.filter(code=code)
            if len(queryset) > 0:
                wrap = queryset[0]   
                video = self.get_first(wrap)
                self.get_hd_pic(video)              
                return Response(VideoSerializer(video).data, status=status.HTTP_200_OK)
            return Response({'Bad Request': 'Wrap Not Found'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Wrap Parameter Not Found in Request'}, status=status.HTTP_400_BAD_REQUEST) 

class GetMonths(APIView):
    lookup_url_kwarg = 'code'

    def stringify_month(self, month):
        str_month = str(month)
        if month < 10:
            str_month = "0" + str_month
        return str_month

    def month_counts(self,videos):
        months = {}
        for i in range(12):
            month = self.stringify_month(i+1)
            month_videos = videos.filter(month=month)
            if len(month_videos) > 0:
                count = month_videos.count()
                months[month] = count  
            else:
                months[month] = 0  
        return months      

    def get(self, request, format=None):
        code = request.GET.get(self.lookup_url_kwarg)
        if code != None:
            queryset = Wrapped.objects.filter(code=code)
            if len(queryset) > 0: 
                wrap = queryset[0] 
                videos = Video.objects.filter(wrap=wrap)
                months = self.month_counts(videos)
                return JsonResponse(months, status=status.HTTP_200_OK)
            return Response({'Bad Request': 'Wrap Not Found'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Missing Parameters'}, status=status.HTTP_400_BAD_REQUEST) 

class GetCategories(APIView):
    lookup_url_kwarg = 'code'

    def cat_counts(self,videos):
        categories = {}      
        for video in videos:
            categories[video.category] = categories.get(video.category, 0) + 1
        return categories


    def get(self, request, format=None):
        code = request.GET.get(self.lookup_url_kwarg)
        if code != None:
            queryset = Wrapped.objects.filter(code=code)
            if len(queryset) > 0: 
                wrap = queryset[0] 
                videos = Video.objects.filter(wrap=wrap)
                categories = self.cat_counts(videos)
                return JsonResponse(categories, status=status.HTTP_200_OK)
            return Response({'Bad Request': 'Wrap Not Found'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Missing Parameters'}, status=status.HTTP_400_BAD_REQUEST)  

class CheckUser(APIView):
        
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        data = {'code': self.request.session.get('code')}
        return JsonResponse(data, status=status.HTTP_200_OK)              