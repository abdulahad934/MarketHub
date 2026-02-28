from rest_framework import serializers
from django.utils.text import slugify
from .models import *

#Add Category Serializers
class AddCategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'is_active', 'created_date']
        read_only_fields = ['id', 'created_date']

    def validate_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("category name is required")
        return value
    
    def validate_slug(self, value):
        if Category.objects.filter(slug = value).exists():
            raise serializers.ValidationError("slug already exists.")
        return value
    
    def create(self, validated_data):
        if not validated_data.get('slug'):
            validated_data['slug'] = slugify(validated_data['name'])
        return super().create(validated_data)