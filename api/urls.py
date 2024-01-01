from django.urls import path, include
from .views import WrappedView, CreateWrapView, GetWrap, ProcessWrap, GetFirstVideo

urlpatterns = [
    path('home',WrappedView.as_view()),
    path('create-wrap', CreateWrapView.as_view()),  
    path('get-wrap', GetWrap.as_view()), 
    path('process-wrap', ProcessWrap.as_view()), 
    path('get-first', GetFirstVideo.as_view()), 
]