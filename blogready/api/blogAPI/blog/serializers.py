from rest_framework import serializers
from .models import Category, Post, Subscription, User

from django.contrib.auth.hashers import make_password


class PostSerializer(serializers.ModelSerializer):
    category = serializers.SlugRelatedField(slug_field='name', queryset=Category.objects.all())
    user = serializers.SlugRelatedField(slug_field='username', queryset=User.objects.all())
    img = serializers.ImageField(allow_null=True)

    class Meta:
        model = Post
        fields = '__all__'


class CategorySerializer(serializers.ModelSerializer):
    post_count = serializers.SerializerMethodField()
    user_post_count = serializers.SerializerMethodField()
    # sub_post_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = '__all__'

    def get_post_count(self, category):
        return Post.objects.filter(category=category).count()

    def get_user_post_count(self, category):
        if self.context:
            user = self.context['request'].user
            posts = Post.objects.filter(category=category, user=user)
            return posts.count()
        else:
            return None

    # def get_sub_post_count(self, category):
    #     if self.context:
    #         users = self.context['creator_ids']
    #         posts = Post.objects.filter(category=category, user__in=self.context['creator_ids'])
    #         return posts.count()
    #     else:
    #         return None

class UserSerializer(serializers.ModelSerializer):
    new_password = serializers.CharField(write_only=True, required=False)

    def validate_password(self, value):
        return make_password(value)

    class Meta:
        model = User
        fields = '__all__'
        extra_kwargs = {'password': {'write_only': True}}
