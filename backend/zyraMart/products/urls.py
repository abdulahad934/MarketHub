from django.urls import path
from .views import *


urlpatterns = [
    
    path('add-category/', AddCategoryAPIView.as_view()),
    path('add-brand/', AddBrandAPIView.as_view()),
    path('add-product/', AddProductAPIView.as_view()),
    path('categories/', CategoryListView.as_view()),
    path('brands/', BrandListView.as_view()),
    
]
