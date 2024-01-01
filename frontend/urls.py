from django.urls import path
from .views import index

urlpatterns = [
    path('', index),
    path('create', index), 
    path('mywrap/<str:code>', index), 
    path('mywrap2/<str:code>', index),         
    path('loading/<str:code>', index),
    path('test', index)
]