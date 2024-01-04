from django.urls import path, include
from .views import AllWrappedView, CreateWrapView, WrappedView, ProcessWrap, GetFirstVideo

urlpatterns = [
    path('home',AllWrappedView.as_view()),
    path('create-wrap', CreateWrapView.as_view()),  
    path('get-wrap', WrappedView.as_view()), 
    path('process-wrap', ProcessWrap.as_view()), 
    path('get-first', GetFirstVideo.as_view()), 
]