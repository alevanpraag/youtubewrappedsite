from django.urls import path, include
from .views import AllWrappedView, CreateWrapView, WrappedView, GetFirstVideo, GetMonths, GetCategories, CheckUser

urlpatterns = [
    path('home',AllWrappedView.as_view()),
    path('create-wrap', CreateWrapView.as_view()),  
    path('get-wrap', WrappedView.as_view()), 
    path('get-first', GetFirstVideo.as_view()), 
    path('get-month', GetMonths.as_view()), 
    path('get-categories', GetCategories.as_view()),  
    path('check-user', CheckUser.as_view()),     
]