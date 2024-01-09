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
import re
import os


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
            
    def dur_to_mins(self, dur):
        time_raw = re.split("PT(\d*)(H?)(\d*)(M?)(\d*)(S?)",dur)
        time = list(filter(None, time_raw))
        if len(time)==6:
            hours = int(time[0])
            mins = (hours*60) + int(time[2])
        elif len(time)==4:
            mins = int(time[0])
        else:
            mins = 0
        return mins

    def get_hd_pic(self,thumbnail):
        if thumbnail[-12:] == "/default.jpg":
            new_url = thumbnail[:-11] + "maxresdefault.jpg"
            return new_url
        else:
            return thumbnail

    def create_videos(self,key,wrap,video_list, month_dict):
        for i in range(0, len(video_list), 50):
            video_sublst = video_list[i:i + 50]
            for video_id, title, cat, chnl, thmnl, dur in self.get_data(key, "IE",  *video_sublst):
                month = month_dict[video_id]
                duration = self.dur_to_mins(dur)
                thumbnail = self.get_hd_pic(thmnl)
                video = Video(video_id= video_id, wrap = wrap, title = title, channel = chnl, duration = duration,
                                    category = cat, thumbnail = thumbnail, month= month)
                video.save() 

    def get_total_time(self,wrap):
        total = 0
        for vid in wrap.videos.all():
            total+= int(vid.duration)
        return total       
        
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
                watch_history = json.load(f)
                video_list = []
                month_dict = {}
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
                                    month_dict[video_id] = int(video_month)                 
                #if same user requests a new wrap, delete old info
                if queryset.exists():  
                    wrap = queryset[0] 
                    Video.objects.filter(wrap=wrap).delete()
                    wrap.name = name   
                    wrap.file = file
                    self.request.session['code'] = wrap.code
                    wrap.save(update_fields=['name', 'file'])
                    curr_status=status.HTTP_200_OK
                else:
                    wrap = Wrapped(host=host, name=name,file=file)
                    wrap.save()
                    self.request.session['code'] = wrap.code
                    curr_status=status.HTTP_201_CREATED    
                self.create_videos(self.my_key,wrap,video_list, month_dict)
                videos = Video.objects.filter(wrap=wrap)
                wrap.channels = videos.order_by().values('channel').distinct().count()
                wrap.count = videos.count()#videos.order_by().values('video_id').distinct().count()
                wrap.time = self.get_total_time(wrap)               
                wrap.save(update_fields=['count','time','channels'])    
                return Response(WrappedSerializer(wrap).data, status=curr_status)      
        else:
            return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)
                

class GetFirstVideo(APIView):
    serializer_class = VideoSerializer
    lookup_url_kwarg = 'code'

    def get_first(self,wrap):
        first_four_dict = {}
        a, b, c, d = None, None, None, None 
        for vid in wrap.videos.all():
            if vid.category == 'Music':
                d = c
                c = b
                b = a
                a = vid
        if a != None:
            first_four_dict["choiceA"] = a.title
            first_four_dict["choiceAUrl"] = a.thumbnail
        if b!= None:
            first_four_dict["choiceB"] = b.title
            first_four_dict["choiceBUrl"] = b.thumbnail
        if c!= None:
            first_four_dict["choiceC"] = c.title
            first_four_dict["choiceCUrl"] = c.thumbnail
        if d!= None:
            first_four_dict["choiceD"] = d.title
            first_four_dict["choiceDUrl"] = d.thumbnail       
        return first_four_dict                  

    def get(self, request, format=None):
        code = request.GET.get(self.lookup_url_kwarg)
        if code != None:
            queryset = Wrapped.objects.filter(code=code)
            if len(queryset) > 0:
                wrap = queryset[0]   
                first_four = self.get_first(wrap)
                return JsonResponse(first_four, status=status.HTTP_200_OK)
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
        for i in range(1,13):
            month_videos = videos.filter(month=i)
            if len(month_videos) > 0:
                count = month_videos.count()
                months[str(i)] = count  
            else:
                months[str(i)] = 0  
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

class OnRepeat(APIView):
    serializer_class = VideoSerializer
    lookup_url_kwarg = 'code'

    def get_hd_pic(self,video):
        if video.thumbnail[-12:] == "/default.jpg":
            new_url = video.thumbnail[:-11] + "maxresdefault.jpg"
            video.thumbnail = new_url
            video.save(update_fields=['thumbnail'])

    def get_most(self,wrap):
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
                video = self.get_most(wrap)
                self.get_hd_pic(video)              
                return Response(VideoSerializer(video).data, status=status.HTTP_200_OK)
            return Response({'Bad Request': 'Wrap Not Found'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Wrap Parameter Not Found in Request'}, status=status.HTTP_400_BAD_REQUEST) 

class CheckUser(APIView):
        
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        data = {'code': self.request.session.get('code')}
        return JsonResponse(data, status=status.HTTP_200_OK)              