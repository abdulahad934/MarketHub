from django.shortcuts import render

from rest_framework.decorators import api_view, APIView
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import *




#Admin Login
class AdminLoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = AdminLoginSerializer(data = request.data)

        if not serializer.is_valid():
            return Response({
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']


        user = authenticate(username= username, password= password)

        if user is None or not user.is_staff:
            return Response({
                "success": False,
                "message": "invalid Credentials"
            }, status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(user)

        return Response({
            "success": True,
            "message": "Login Successfully!",
            "access": str(refresh.access_token),
            "refresh": str(refresh)

        }, status=status.HTTP_200_OK)

   


    

