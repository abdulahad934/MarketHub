from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import status
from .serializers import *




class AddCategoryAPIView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    def post(self, request):
        serializer = AddCategorySerializer(data = request.data)

        if serializer.is_valid():
            serializer.save()

            return Response({
                "success": True,
                "message": "Category Added Succefully!",
                "data": serializer.data
            }, status=200)
        
        return Response({
            "success":False,
            "message": "Faild Added Category",
            "errors": serializer.errors
        }, status=400)



# @api_view(['POST'])
# @authentication_classes([JWTAuthentication])
# @permission_classes([IsAuthenticated])
# def add_category(request):
#     serializer = AddCategorySerializer(data= request.data)

#     if serializer.is_valid():
#         serializer.save()

#         return Response({
#             "success": True,
#             "message": "Add Category Successfully!",
#             "data": serializer.data
#         }, status=200)
    
#     return Response({
#         "success": False,
#         "message": "Faild add Category",
#         "errors": serializer.errors
#     }, status=400)

