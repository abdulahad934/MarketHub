from rest_framework import serializers
from .models import *



# Admin Login Serializers 
class AdminLoginSerializer(serializers.Serializer):
    password = serializers.CharField(write_only=True, required=True)
    username = serializers.CharField(required=True)


