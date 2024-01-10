from django.urls import path
from .views import index

urlpatterns = [
    path('', index),
    path('create', index), 
    path('mywrap/<str:code>', index), 
    path('mywrap2/<str:code>', index), 
    path('mywrap3/<str:code>', index), 
    path('mywrap4/<str:code>', index),         
    path('help', index),
    path('test', index)
]