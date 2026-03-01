from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAdminUser

from rest_framework import status
from .serializers import *




class AddCategoryAPIView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    authentication_classes = [JWTAuthentication]
    
    def post(self, request):
        serializer = AddCategorySerializer(data = request.data)

        if serializer.is_valid():
            serializer.save()

            return Response({
                "success": True,
                "message": "Category Added Succefully!",
                "data": serializer.data
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            "success":False,
            "message": "Faild Added Category",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)



# Add Brand Api
class AddBrandAPIView(APIView):

    permission_classes = [IsAuthenticated, IsAdminUser]
    authentication_classes = [JWTAuthentication]

    def post(self, request):
        
        serializer = AddBrandSerializer(data = request.data)

        if serializer.is_valid():
            serializer.save()

            return Response({
                "success": True,
                "message": "Brand Added Successfully!",
                "data": serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response({
            "success": False,
            "message": "Faild Added Brand",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

