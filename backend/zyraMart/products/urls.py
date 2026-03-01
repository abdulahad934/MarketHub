from django.urls import path
from .views import *


urlpatterns = [
    
    path('add-category/', AddCategoryAPIView.as_view()),
    
]
