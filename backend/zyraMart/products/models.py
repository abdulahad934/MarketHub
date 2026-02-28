from django.db import models



# Product Category Add 

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.CharField(max_length=120, unique=True, blank=True, null=True)
    is_active = models.CharField(default=True)
    created_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


# Product Brand Add

class Brand(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.CharField(max_length=120, blank=True, null=True)
    logo = models.ImageField(upload_to="brand_logo/", blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    


# Product models Add

class Product(models.Model):
    name = models.CharField(max_length=250)
    slug = models.CharField(max_length=300, blank=True, null=True)
    description = models.CharField()
    brand = models.ForeignKey(Brand, on_delete=models.SET_NULL, blank=True, null=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.brand} - {self.category}"


# Product Images Add

class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="product_image/", blank=True, null=True)

    def __str__(self):
        return f"{self.product.name} Image"
    

# Product Variant add

class ProductVariant(models.Model):
    product  = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="variants")
    sku = models.CharField(max_length=100, unique=True, blank=True, null=True)
    unit = models.CharField(max_length=100, blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    stock = models.PositiveBigIntegerField(default=0, blank=True, null=True)

    def __str__(self):
        return f"{self.product.name} - {self.product.brand}"

