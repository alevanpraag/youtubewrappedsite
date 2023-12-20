from django.urls import path, include
from .views import WrappedView, CreateWrapView, GetWrap

urlpatterns = [
    path('home',WrappedView.as_view()),
    path('create-wrap', CreateWrapView.as_view()),  
    path('get-wrap', GetWrap.as_view()), 
]