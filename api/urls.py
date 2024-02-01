from django.urls import path, include
from .views import AllWrappedView, CreateWrapView, WrappedView, GetFirstVideo, GetMonthsCats, CheckUser, OnRepeat, TopChannels

urlpatterns = [
    path('home',AllWrappedView.as_view()),
    path('create-wrap', CreateWrapView.as_view()),  
    path('get-wrap', WrappedView.as_view()), 
    path('get-first', GetFirstVideo.as_view()), 
    path('get-monthscats', GetMonthsCats.as_view()), 
    path('check-user', CheckUser.as_view()), 
    path('on-repeat', OnRepeat.as_view()),     
    path('top-channel', TopChannels.as_view()),    
]