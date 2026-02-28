from django.urls import path
from .views import *


urlpatterns = [
    
    path('add-category/', add_category, name='add-category')
    
]
