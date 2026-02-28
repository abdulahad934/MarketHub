from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    phone_number = models.CharField(max_length=15, unique=True)
    is_vendor = models.BooleanField(default=True)
    profile_image = models.ImageField(upload_to="images/", blank=True, null=True)


    def __str__(self):
        return f"{self.username} - {self.phone_number}"