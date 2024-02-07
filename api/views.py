import datetime as dt
import json
import re
import io
import gc
import psutil
import requests
import calendar
import environ
import os
import ijson
import concurrent.futures
import pytz

from google.cloud import secretmanager
from django.core.files.storage import default_storage
from django.http import JsonResponse
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Video, Wrapped
from .serializers import CreateWrapSerializer, VideoSerializer, WrappedSerializer

try:
    from beautifulsoup4 import BeautifulSoup
except:
    from bs4 import BeautifulSoup

gc.collect()
env = environ.Env(DEBUG=(bool, False))
project_id = "youtube-rewind-410800"
client = secretmanager.SecretManagerServiceClient()
name = f"projects/{project_id}/secrets/django_settings/versions/latest"
payload = client.access_secret_version(name=name).payload.data.decode("UTF-8")
env.read_env(io.StringIO(payload))
google_api_key = env('GOOGLE_API_KEY', default=None) 
rewind_year = 2023
VIDEO_BATCH_SIZE = 50
REQUEST_TIMEOUT = 60

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
        try:
            r = requests.get(url.format(ids=",".join(ids), api_key=google_api_key), timeout=60)
        except requests.exceptions.Timeout:
            print("Timed out")
            for i in len(ids):
                yield None, None, None, None, None, None, None, None
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
                yield item["id"], item["snippet"]["title"], item["snippet"]["publishedAt"], item["statistics"]["viewCount"], categories[item["snippet"]["categoryId"]], item["snippet"]["channelId"], url, item['contentDetails']['duration']
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

    def create_videos(self, wrap, video_list, month_dict, watch_dict):
        def process_batch(batch):
            videos_to_create = []

            for video_id, title, iso_date, views, cat, chnl, thumbnail, dur in batch:
                if video_id is not None:
                    if len(title) > 100:
                        title = title[0:100]
                    videos_to_create.append(Video(
                        video_id=video_id,
                        wrap=wrap,
                        title=title,
                        channel=chnl,
                        duration=self.dur_to_mins(dur),
                        date=dt.datetime.fromisoformat(iso_date),
                        views=views,
                        category=cat,
                        thumbnail=thumbnail,
                        month=month_dict.get(video_id),
                        watched=watch_dict.get(video_id)
                    ))

            Video.objects.bulk_create(videos_to_create)

        # Split video_list into batches
        batch_size = VIDEO_BATCH_SIZE
        batches = [video_list[i:i + batch_size] for i in range(0, len(video_list), batch_size)]

        # Use ThreadPoolExecutor for concurrent execution
        with concurrent.futures.ThreadPoolExecutor() as executor:
            executor.map(process_batch, map(lambda batch: self.get_data("IE", *batch), batches))


    def get_total_time(self,wrap):
    #get total watch time of user
        total = 0
        for vid in wrap.videos.all():
            total+= int(vid.duration)
        return total       

    def read_json(self, wrap):
        #gets all the rewind_year the video ids
        with default_storage.open(wrap.filename) as f:
            my_json = (f.read()).decode('utf8').replace("'", '"')
            try:
                watch_history = ijson.items(my_json, 'item')
            except Exception as e:
                watch_history = None
                print(e)
        video_list = []
        month_dict = {}        
        watch_dict = {}
        for video in watch_history:
            if not self.is_ad(video):
                if "time" in video:
                    date = dt.datetime.fromisoformat(video['time']).replace(tzinfo=pytz.utc)
                    video_year = date.year
                    video_month = date.month
                    if video_year > rewind_year:
                        continue
                    elif video_year < rewind_year:
                        break
                    elif "titleUrl" in video:
                        video_id = str((video['titleUrl'])[32:])
                        if video_id in watch_dict:
                            if watch_dict[video_id] > date:
                                video_list.append(video_id)
                                month_dict[video_id] = video_month 
                                watch_dict[video_id] = date
                            elif watch_dict[video_id] < date:
                                video_list.append(video_id)
                        else:
                            video_list.append(video_id)
                            month_dict[video_id] = video_month 
                            watch_dict[video_id] = date
        return video_list, month_dict, watch_dict

    def html_is_ad(self, tag):
        caption = tag.find('div', attrs={'class':'content-cell mdl-cell mdl-cell--12-col mdl-typography--caption'})
        if caption:
            ad = caption.get_text()
            if "Google Ads" in ad:
                return True
        return False     

    def read_html(self,wrap):
        video_list = []
        month_dict = {} 
        watch_dict = {}
        soup = None
        abbr_to_num = {month: num for num, month in enumerate(calendar.month_abbr) if num}
        with default_storage.open(wrap.filename) as f:
            print(wrap.filename)
            print("BeautifulSoup creating...")
            f_read = f.read().decode('utf8')
        html = f_read.split('<div class="outer-cell mdl-cell mdl-cell--12-col mdl-shadow--2dp">')
        body = html[1:]
        for b in body:
            html_content = b[:-6]
            if soup:
                soup.decompose()
            soup = BeautifulSoup(html_content, 'lxml')
            tag = soup.find('div', attrs={'class':'content-cell mdl-cell mdl-cell--6-col mdl-typography--body-1'})
            if tag:
                try:
                    video_id = tag.contents[1].attrs['href'][-11:]
                    date = tag.contents[-1]
                except:
                    video_id = None
                    date = None
                if not self.html_is_ad(soup):
                    if date:
                        mon_day, year, time = date.split(",")
                        month, day = mon_day.split(' ')
                        hr, minute, sec = time.split(":")
                        hour = int(hr)
                        video_month = int(abbr_to_num[month])
                        second = sec[:2]
                        if (sec[-6:-4] == "PM") and hour > 12:
                            hour = hour + 12
                        if int(year) > rewind_year:
                            continue
                        elif int(year) < rewind_year:
                            break
                        elif video_id:
                            curr = dt.datetime(int(year), video_month, int(day), int(hour), int(minute), int(second)).replace(tzinfo=pytz.utc)
                            video_list.append(video_id)
                            if video_id in watch_dict: 
                                if watch_dict[video_id] > curr:
                                    month_dict[video_id] = video_month  
                                    watch_dict[video_id] = curr
                            else:
                                month_dict[video_id] = video_month  
                                watch_dict[video_id] = curr
        return video_list, month_dict, watch_dict
 
    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()   
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            name = serializer.data.get('name')
            f = request.FILES["file"]
            file_name = default_storage.save(f.name, f)
            host = self.request.session.session_key
            queryset = Wrapped.objects.filter(host=host)
            #if same user requests a new wrap, delete old info
            if queryset.exists():  
                wrap = queryset[0] 
                Video.objects.filter(wrap=wrap).delete()
                wrap.name = name  
                wrap.filename = file_name
                wrap.save(update_fields=['name','filename'])
                curr_status=status.HTTP_200_OK
            else:
                wrap = Wrapped(host=host, name=name, filename=file_name)
                wrap.save()
                curr_status=status.HTTP_201_CREATED    
            #parse file data depending on type
            if f.name[-4:] == "html":
                video_list, month_dict, watch_dict = self.read_html(wrap)
            else:
                video_list, month_dict, watch_dict = self.read_json(wrap)
            if not video_list:
                return Response({'Bad Request': 'No data...'}, status=status.HTTP_400_BAD_REQUEST)
            try:
                self.create_videos(wrap,video_list, month_dict,watch_dict)
            except Exception as e:
                print('error is ')
                print(e)
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
        for vid in wrap.videos.all().order_by('-watched'):
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

class TopChannels(APIView):
    lookup_url_kwarg = 'code'

    def get_data(self, region, channel_id):
    #with all video ids, gets info from youtube data api GET https://www.googleapis.com/youtube/v3/channels?part=snippet&id+CHANNEL_ID&fields=items%2Fsnippet%2Fthumbnails&key={YOUR_API_KEY}
        url = "https://www.googleapis.com/youtube/v3/channels?key={api_key}&id={id}&part=snippet"
        try:
            r = requests.get(url.format(id=channel_id, api_key=google_api_key), timeout=REQUEST_TIMEOUT)
        except requests.exceptions.Timeout:
            print("Timed out")
            return None, None
        js = r.json()
        items = js["items"]
        if len(items)>0:
            item = items[0]
            title = item['snippet']['title']
            #try to get max resolution thumbnail if it exists
            try:
                url = item['snippet']['thumbnails']['maxres']['url']
            except KeyError:
                url = item['snippet']['thumbnails']['default']['url']            
        return title, url

    def chnl_counts(self,videos):
        channels = {}      
        for video in videos:
            channels[video.channel] = channels.get(video.channel, 0) + 1
        return channels        

    def get_most(self,videos):
        channels = self.chnl_counts(videos)
        top_channels = sorted(channels, key=channels.get, reverse=True)
        top = {}
        if len(top_channels)>0:
            top["countA"] = channels[top_channels[0]]   
            top["channelA"], top["thmnlA"] = self.get_data('IE',top_channels[0])
        if len(top_channels)>1:
            top["countB"] = channels[top_channels[1]]   
            top["channelB"], top["thmnlB"] = self.get_data('IE',top_channels[1])      
        if len(top_channels)>2:
            top["countC"] = channels[top_channels[2]]   
            top["channelC"], top["thmnlC"] = self.get_data('IE',top_channels[2])    
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

class LongestVideo(APIView):
    lookup_url_kwarg = 'code'

    def get_longest(self,videos):
        data = {} 
        longest_videos = videos.order_by('-duration')
        oldest_videos = videos.order_by('date')
        if len(oldest_videos) > 0:
            old = oldest_videos[0]
            data['nameO'] = old.title
            d = old.date.strftime("%B %Y")
            data['dateO'] = d
            data['urlO'] = old.thumbnail
        if len(longest_videos) > 0:
            longest = longest_videos[0]
            data['nameL'] = longest.title
            data['durL'] = longest.duration
            data['urlL'] = longest.thumbnail
        return data

    def get(self, request, format=None):
        code = request.GET.get(self.lookup_url_kwarg)
        if code != None:
            queryset = Wrapped.objects.filter(code=code)
            if len(queryset) > 0: 
                wrap = queryset[0] 
                videos = Video.objects.filter(wrap=wrap)
                data = self.get_longest(videos)
                return JsonResponse(data, status=status.HTTP_200_OK)
            return Response({'Bad Request': 'Wrap Not Found'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Missing Parameters'}, status=status.HTTP_400_BAD_REQUEST) 