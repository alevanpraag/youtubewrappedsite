from rest_framework import generics, status
from .serializers import WrappedSerializer, CreateWrapSerializer, VideoSerializer
from .models import Wrapped, Video
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
from google.cloud import secretmanager
import datetime as dt
import requests
import json
import re
import os
import calendar
import io
import environ


env = environ.Env(DEBUG=(bool, False))
project_id = "youtube-rewind-410800"
client = secretmanager.SecretManagerServiceClient()
name = f"projects/{project_id}/secrets/django_settings/versions/latest"
payload = client.access_secret_version(name=name).payload.data.decode("UTF-8")
env.read_env(io.StringIO(payload))
google_api_key = env('GOOGLE_API_KEY', default=None) 

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
    serializer_class = CreateWrapSerializer
    lookup_url_kwarg = 'code'

    def get_data(self, region, *ids):
    #with all video ids, gets info from youtube data api
        url = "https://www.googleapis.com/youtube/v3/videos?part=snippet&id={ids}&key={api_key}&part=contentDetails&part=statistics"
        r = requests.get(url.format(ids=",".join(ids), api_key=google_api_key))
        js = r.json()
        items = js["items"]
        cat_js = requests.get("https://www.googleapis.com/youtube/v3/videoCategories?part=snippet&regionCode={}&key={}".format(region,
            google_api_key)).json()
        categories = {d['id']: d["snippet"]['title'] for d in cat_js["items"]}
        for item in items:
            #try to get max resolution thumbnail if it exists
            try:
                url = item['snippet']['thumbnails']['maxres']['url']
            except KeyError:
                url = item['snippet']['thumbnails']['default']['url']            
            try:
                yield item["id"], item["snippet"]["title"], item["snippet"]["publishedAt"], item["statistics"]["viewCount"], categories[item["snippet"]["categoryId"]], item["snippet"]["channelTitle"], url, item['contentDetails']['duration']
            except KeyError:
                yield None, None, None, None, None, None, None, None

    def is_ad(self,video):
    #checks to see if a video is a an ad
        try:
            if "From Google Ads" in video["details"][0]["name"]:
                return True
            return False
        except:
            return False


    def dur_to_mins(self, dur):
    #converts iso 8601 duration to minutes
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

    def create_videos(self,wrap,video_list, month_dict):
    #creates a Video object for each video in the watch history
        for i in range(0, len(video_list), 50):
            video_sublst = video_list[i:i + 50]
            for video_id, title, iso_date, views, cat, chnl, thumbnail, dur in self.get_data( "IE",  *video_sublst):
                if video_id != None:
                    month = month_dict[video_id]
                    date = dt.datetime.fromisoformat(iso_date[:10])
                    duration = self.dur_to_mins(dur)
                    video = Video(video_id= video_id, wrap = wrap, title = title, channel = chnl, duration = duration,
                                        date = date, views = views, category = cat, thumbnail = thumbnail, month= month)
                    video.save() 

    def get_total_time(self,wrap):
    #get total watch time of user
        total = 0
        for vid in wrap.videos.all():
            total+= int(vid.duration)
        return total       

    def get_video_ids(self, watch_history):
        #gets all the 2023 the video ids
        video_list = []
        month_dict = {}        
        for video in watch_history:
            if not self.is_ad(video):
                if "time" in video:
                    video_year = int((video['time'])[:4])
                    video_month = (video['time'])[5:7]
                    if video_year < 2023:
                        break
                    elif "titleUrl" in video:
                        video_id = str((video['titleUrl'])[32:])
                        video_list.append(video_id)
                        month_dict[video_id] = int(video_month)    
        return video_list, month_dict

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()   
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            name = serializer.data.get('name')
            host = self.request.session.session_key
            queryset = Wrapped.objects.filter(host=host)
            f = request.data.get('file').read()
            my_json = f.decode('utf8').replace("'", '"')
            watch_history = json.loads(my_json)
            video_list, month_dict = self.get_video_ids(watch_history)
            if not video_list:
                return Response({'Bad Request': 'No data...'}, status=status.HTTP_400_BAD_REQUEST)
            #if same user requests a new wrap, delete old info
            if queryset.exists():  
                wrap = queryset[0] 
                Video.objects.filter(wrap=wrap).delete()
                wrap.name = name  
                wrap.save(update_fields=['name'])
                curr_status=status.HTTP_200_OK
            else:
                wrap = Wrapped(host=host, name=name)
                wrap.save()
                curr_status=status.HTTP_201_CREATED    
            self.create_videos(wrap,video_list, month_dict)
            videos = Video.objects.filter(wrap=wrap)
            wrap.channels = videos.order_by().values('channel').distinct().count()
            wrap.count = videos.count()#.order_by().values('video_id').distinct().count()
            wrap.time = self.get_total_time(wrap)              
            wrap.save(update_fields=['count','time','channels'])   
            self.request.session['code'] = wrap.code 
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

class GetMonthsCats(APIView):
    lookup_url_kwarg = 'code'

    def cat_counts(self,videos):
        categories = {}      
        for video in videos:
            categories[video.category] = categories.get(video.category, 0) + 1
        return categories        

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

    def get_most(self,videos):
        months = self.month_counts(videos)
        cats = self.cat_counts(videos)
        top_cats = sorted(cats, key=cats.get, reverse=True)
        top_months = sorted(months, key=months.get, reverse=True)
        top = {}
        if len(top_months)>0:
            top["month"] = calendar.month_name[int(top_months[0])]
            top["countM"] = months[top_months[0]]  
        if len(top_cats)>0:
            top["cat"] = top_cats[0]
            top["countC"] = cats[top_cats[0]]              
        return top           

    def get(self, request, format=None):
        code = request.GET.get(self.lookup_url_kwarg)
        if code != None:
            queryset = Wrapped.objects.filter(code=code)
            if len(queryset) > 0: 
                wrap = queryset[0] 
                videos = Video.objects.filter(wrap=wrap)
                top = self.get_most(videos)
                return JsonResponse(top, status=status.HTTP_200_OK)
            return Response({'Bad Request': 'Wrap Not Found'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Missing Parameters'}, status=status.HTTP_400_BAD_REQUEST) 

class OnRepeat(APIView):
    serializer_class = VideoSerializer
    lookup_url_kwarg = 'code'

    def get_counts(self,wrap):
        counts = {}
        for vid in wrap.videos.all():
            counts[vid.video_id] = counts.get(vid.video_id,0)+1
        return counts

    def get_repeats(self,counts):
        repeats = {}
        for key, value in counts.items():
            if value > 1:
                repeats[key] = value
        return repeats

    def get_most(self,wrap):
        counts = self.get_counts(wrap)
        repeats = self.get_repeats(counts)
        videos = Video.objects.filter(wrap=wrap)
        top = sorted(repeats, key=repeats.get, reverse=True)
        top3 = {}
        if len(top)>0:
            videoA = videos.filter(video_id=top[0])[0]
            top3["nameA"] = videoA.title
            top3["urlA"] = videoA.thumbnail
            top3["countA"] = repeats[top[0]]
        if len(top)>1:
            videoB = videos.filter(video_id=top[1])[0]
            top3["nameB"] = videoB.title
            top3["urlB"] = videoB.thumbnail   
            top3["countB"] = repeats[top[1]]         
        if len(top)>2:
            videoC = videos.filter(video_id=top[2])[0]
            top3["nameC"] = videoC.title
            top3["urlC"] = videoC.thumbnail   
            top3["countC"] = repeats[top[2]]         
        return top3

    def get(self, request, format=None):
        code = request.GET.get(self.lookup_url_kwarg)
        if code != None:
            queryset = Wrapped.objects.filter(code=code)
            if len(queryset) > 0:
                wrap = queryset[0]   
                videos = self.get_most(wrap)            
                return JsonResponse(videos, status=status.HTTP_200_OK)
            return Response({'Bad Request': 'Wrap Not Found'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Wrap Parameter Not Found in Request'}, status=status.HTTP_400_BAD_REQUEST) 

class CheckUser(APIView):
        
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        if 'code' in self.request.session:
            data = {'code': self.request.session.get('code'), 'prevUser' : True}
            return JsonResponse(data, status=status.HTTP_200_OK)     
        else:
            data = {'code': '000000', 'prevUser' : False}
            return JsonResponse(data,  status=status.HTTP_200_OK)            