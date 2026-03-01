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
        slug = value.strip()

        qs = Brand.objects.filter(slug=slug)
        if self.instance:
            qs = qs.exclude(id=self.instance.id)
        if qs.exists():
            raise serializers.ValidationError("Slug already exists")
        return slug
    
    def create(self, validated_data):
        if not validated_data.get('slug'):
            validated_data['slug'] = slugify(validated_data['name'])
        return super().create(validated_data)
    




#Add Brand Serializers
class AddBrandSerializer(serializers.ModelSerializer):

    class Meta:
        model = Brand

        fields = ['id', 'name', 'slug', 'logo', 'is_active', 'created_date']

        read_only_fields = ['id', 'created_date']

    
    def validate_name(self, value):

        if not value.strip():
            raise serializers.ValidationError("Brand name is required.")
        return value
    
    def validate_slug(self, value):
        slug = value.strip()

        qs = Brand.objects.filter(slug=slug)
        if self.instance:
            qs = qs.exclude(id=self.instance.id)
        if qs.exists():
            raise serializers.ValidationError("Slug already exists")
        return slug
    
    def create(self, validated_data):
        if not validated_data.get('slug'):
            validated_data['slug'] = slugify(validated_data['name'])
        return super().create(validated_data)