from django.urls import path
from .views import *


urlpatterns = [
    path("admin-login/", AdminLoginAPIView.as_view()),
    path("refresh-token/", RefreshTokenAPIView.as_view()),
]
