from django.db import models
from django.contrib.auth.models import User


class Category(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name


class Post(models.Model):
    title = models.CharField(max_length=255)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='cat_posts')
    content = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_posts')
    date = models.DateField(auto_now_add=True)
    img = models.ImageField(upload_to='post-images/', blank=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-date']


class Subscription(models.Model):
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    subscriber = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subscriptions')
