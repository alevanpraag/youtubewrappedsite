from django.urls import path, include
from .views import WrappedView, CreateWrapView, GetWrap#, VideoView, CreateVideoView

urlpatterns = [
    path('home',WrappedView.as_view()),
    path('create-wrap', CreateWrapView.as_view()),  
    path('get-wrap', GetWrap.as_view()), 
    #path('create-video', CreateVideoView.as_view()), 
    #path('video', VideoView.as_view()), 
]