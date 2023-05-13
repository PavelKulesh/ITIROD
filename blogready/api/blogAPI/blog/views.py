from django.contrib.auth.models import UserManager
from django.db.models import Count, Q
from django.forms import model_to_dict
from django.shortcuts import render, get_object_or_404
from rest_framework import generics, status
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Category, Post, Subscription, User
from .serializers import PostSerializer, CategorySerializer, UserSerializer


class PostCategoryAPIView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, pk=None):
        category_ids = request.GET.get('categories')
        user_id = request.GET.get('user')
        sub = request.GET.get('sub')
        if category_ids and user_id and sub:
            category_ids = category_ids.split(',')

            subscriptions = Subscription.objects.filter(subscriber_id=user_id)
            creator_ids = subscriptions.values_list('creator_id', flat=True).distinct()

            posts = Post.objects.filter(category_id__in=category_ids, user_id__in=creator_ids)
            posts_serializer = PostSerializer(posts, many=True)

            users = User.objects.all()
            user_serializer = UserSerializer(users, many=True)

            data = {
                'posts': posts_serializer.data,
                'users': user_serializer.data,
            }

        elif user_id and sub:
            subscriptions = Subscription.objects.filter(subscriber_id=user_id)
            creator_ids = subscriptions.values_list('creator_id', flat=True).distinct()

            posts = Post.objects.filter(user_id__in=creator_ids)
            posts_serializer = PostSerializer(posts, many=True)

            categories = Category.objects.annotate(num_posts=Count('cat_posts__id', distinct=True)).filter(
                cat_posts__in=posts).order_by('-num_posts', 'name')
            categories_serializer = CategorySerializer(categories, context={'request': request, 'posts': posts,
                                                                            'creator_ids': creator_ids}, many=True)

            users = User.objects.all()
            user_serializer = UserSerializer(users, many=True)

            data = {
                'posts': posts_serializer.data,
                'categories': categories_serializer.data,
                'users': user_serializer.data,
            }

        elif category_ids and user_id:
            category_ids = category_ids.split(',')

            posts = Post.objects.filter(category_id__in=category_ids, user_id=user_id)
            posts_serializer = PostSerializer(posts, many=True)

            user = User.objects.get(pk=user_id)
            user_serializer = UserSerializer(user, many=False)

            data = {
                'posts': posts_serializer.data,
                'users': user_serializer.data,
            }
        elif category_ids:
            category_ids = category_ids.split(',')

            posts = Post.objects.filter(category_id__in=category_ids)
            posts_serializer = PostSerializer(posts, many=True)

            users = User.objects.all()
            user_serializer = UserSerializer(users, many=True)

            data = {
                'posts': posts_serializer.data,
                'users': user_serializer.data,
            }
        elif user_id:
            user = User.objects.get(pk=user_id)
            posts = user.user_posts.all()
            posts_serializer = PostSerializer(posts, many=True)

            categories = Category.objects.annotate(num_posts=Count('cat_posts__id', distinct=True)).filter(
                cat_posts__in=posts).order_by('-num_posts', 'name')
            categories_serializer = CategorySerializer(categories, context={'request': request}, many=True)

            users = User.objects.filter(pk=user_id).distinct()
            user_serializer = UserSerializer(users, many=True)

            data = {
                'posts': posts_serializer.data,
                'categories': categories_serializer.data,
                'users': user_serializer.data,
            }
        else:
            if pk is not None:
                post = get_object_or_404(Post, pk=pk)
                post_serializer = PostSerializer(post)

                users = User.objects.all()
                user_serializer = UserSerializer(users, many=True)

                data = {
                    'posts': post_serializer.data,
                    'users': user_serializer.data,
                }
            else:
                posts = Post.objects.all()
                posts_serializer = PostSerializer(posts, many=True)

                categories = Category.objects.annotate(num_posts=Count('cat_posts')).filter(
                    cat_posts__isnull=False).order_by('-num_posts', 'name')
                categories_serializer = CategorySerializer(categories, many=True)

                users = User.objects.all()
                user_serializer = UserSerializer(users, many=True)

                data = {
                    'posts': posts_serializer.data,
                    'categories': categories_serializer.data,
                    'users': user_serializer.data,
                }
        return Response(data)

    def post(self, request):
        request.data['category'] = request.data['category'].lower().capitalize()
        print(request.data)
        if not Category.objects.filter(name=request.data['category']).exists() and request.data['category']:
            Category.objects.create(name=request.data['category'])
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            print(serializer.validated_data)
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors)

    def delete(self, request, pk):
        post = Post.objects.get(pk=pk)
        post.delete()
        return Response(status=status.HTTP_200_OK)

    def put(self, request, pk):
        data = request.data.copy()
        if data['img'] == 'undefined':
            data['img'] = get_object_or_404(Post, pk=pk).img
        data['category'] = data['category'].lower().capitalize()
        print(data)
        if not Category.objects.filter(name=data['category']).exists():
            Category.objects.create(name=data['category'])
        post = get_object_or_404(Post, pk=pk)
        serializer = PostSerializer(post, data=data, partial=True)
        try:
            serializer.is_valid(raise_exception=True)
        except ValidationError as e:
            return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


class AddUserAPIView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors)

    def put(self, request):
        user = request.user
        print(user)
        serializer = UserSerializer(user, data=request.data)
        serializer.is_valid(raise_exception=True)
        old_password = request.data.get('password')
        new_password = request.data.get('new_password')
        if not user.check_password(old_password):
            return Response({'error': 'Старый пароль не совпадает'}, status=status.HTTP_400_BAD_REQUEST)
        user.set_password(new_password)
        user.save()
        return Response({'success': 'Пароль успешно изменен'}, status=status.HTTP_200_OK)


class AddSubAPIView(APIView):
    def post(self, request):
        user = User.objects.get(pk=request.data['subscriber'])
        subscriptions = user.subscriptions.filter(Q(creator_id=request.data['creator']))
        print(request.data)
        if 'op' not in request.data:
            if subscriptions:
                return Response({'Subscribed': 'True'})
            else:
                return Response({'Subscribed': 'False'})
        else:
            if request.data['op'] == 'sub' and request.data['creator'] != request.data['subscriber']:
                if not Subscription.objects.filter(creator_id=request.data['creator'],
                                                   subscriber_id=request.data['subscriber']).exists():
                    subscript = Subscription.objects.create(creator_id=request.data['creator'],
                                                            subscriber_id=request.data['subscriber'])
                    return Response({'Added': 'True'}, status=status.HTTP_200_OK)
                else:
                    return Response({'Error': 'Already'})
            elif request.data['op'] == 'unsub' and request.data['creator'] != request.data['subscriber']:
                subscript = Subscription.objects.filter(creator_id=request.data['creator'],
                                                        subscriber_id=request.data['subscriber'])
                if subscript:
                    subscript.delete()
                    return Response({'Deleted': 'True'}, status=status.HTTP_200_OK)
                else:
                    return Response({'Error': ' No subscription'})
            return Response({"Error": 'Something went wrong'}, status=status.HTTP_404_NOT_FOUND)
