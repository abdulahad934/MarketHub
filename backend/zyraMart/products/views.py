from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.generics import ListAPIView, RetrieveAPIView
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


#product api create
class AddProductAPIView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    authentication_classes = [JWTAuthentication]
    @transaction.atomic

    def post(self, request):
        serializer = ProductSerializer(data=request.data, context={'request': request})

        if serializer.is_valid():
            serializer.save()

            return Response({
                "success": True,
                "message": "Product added successfully!",
                "product_id": serializer.instance.id
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            "success":False,
            "message": "faild added product",
            "errors": serializer.errors
        }, status=status.HTTP_401_UNAUTHORIZED)


# Category Get API
class CategoryListView(ListAPIView):
    queryset = Category.objects.all()
    serializer_class = AddCategorySerializer


# Brand Get API
class BrandListView(ListAPIView):
    serializer_class = AddBrandSerializer

    def get_queryset(self):
        return Brand.objects.filter(is_active=True).order_by('-created_date')