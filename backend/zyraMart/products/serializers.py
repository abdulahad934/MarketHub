from rest_framework import serializers
from django.utils.text import slugify
from django.db import transaction
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

        qs = Category.objects.filter(slug=slug)
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
    

# ProductVariants Serializer
class ProductVariantsSerializer(serializers.ModelSerializer):
    class Meta:

        model = ProductVariant
        exclude = ['product']

        extra_kwargs = {
            "discount_price": {"required": False, 'allow_null': True},
            "stock": {'required': False}
        }

    def validate_price(self, value):
        if value <=0:
            raise serializers.ValidationError("price must be greater than 0. ")
        return value
    


# ProductImage serailizer
class ProductImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProductImage
        fields = ['image']



# Product serializer
class ProductSerializer(serializers.ModelSerializer):
    variants = ProductVariantsSerializer(many=True, required=False)
    images = ProductImageSerializer(many=True, required =False)

    class Meta:
        model = Product
        fields = '__all__'
        

    def validate_slug(self, value):
        slug = value.strip()

        qs = Product.objects.filter(slug=slug)
        if self.instance:
            qs = qs.exclude(id=self.instance.id)
        if qs.exists():
            raise serializers.ValidationError("Slug already exists")
        return slug
    

    
    @transaction.atomic
    def create(self, validated_data):
        variants_data = validated_data.pop('variants', [])
        images_data = validated_data.pop('images', [])

        product = Product.objects.create(**validated_data)

        for variant_data in variants_data:

            if not variant_data.get('sku'):
                variant_data['sku'] = f"{product.slug}-{variant_data.get('unit')}"
            
            ProductVariant.objects.create(
                product = product,
                **variant_data
            )
        
        for image_data in images_data:
            ProductImage.objects.create(
                product = product,
                **image_data
            )
        
        return product

