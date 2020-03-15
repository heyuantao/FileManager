# -*- coding: utf-8 -*-
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.core.urlresolvers import reverse
from django.http import HttpResponse
from django.views.generic.base import View
from django.contrib.auth.models import User
from django.db import transaction
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.contrib.auth import update_session_auth_hash
from datetime import datetime
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics
from rest_framework.permissions import IsAdminUser, IsAuthenticatedOrReadOnly, IsAuthenticated, AllowAny

from API.seralizers import UserSerializer
from MAIN.paginations import CustomItemPagination
from MAIN.exceptions import MessageException
from django.conf import settings
import traceback
import moment
import pandas
import random
import logging

logger = logging.getLogger(__name__)

class LoginAPIView(APIView):

    def get(self, request, format=None):
        if request.user.is_authenticated():
            return Response({"message": request.user.username }, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Not login !"}, status=status.HTTP_200_OK)

    def post(self, request, format=None):
        user_email_string = request.data.get("email")
        user_password_string = request.data.get("password")

        user = authenticate(username=user_email_string, password=user_password_string)
        if user is not None:
            login(request, user)
            if user.is_superuser:
                return Response({"dashboard_url": reverse("manager")}, status=status.HTTP_200_OK)
        else:
            return Response({"error_message": "用户名或密码错误 !"}, status=status.HTTP_400_BAD_REQUEST)

class LogoutAPIView(APIView):
    def get(self, request, format=None):
        return Response({"error_message": u"该接口未启用"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    def post(self, request, format=None):
        try:
            logout(request)
            response =  Response({"redirect_url": reverse("guest")}, status=status.HTTP_302_FOUND)
            response['Cache-Control'] = 'no-cache'
            return response
        except Exception as e:
            logger.error(traceback.print_exc())
            return Response({"error_message": u"error in software"}, status=status.HTTP_400_BAD_REQUEST)
        #return Response({"errormessage": u"该接口未启用"}, status=400)


class UserAPIView(APIView):  #This class handle user information retrive and update some part of user information,such as address ,email etc

    def get(self, request, format=None):
        user_instance = request.user
        if user_instance.is_authenticated():
            serializer = UserSerializer(user_instance)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            response = Response({"redirect_url": reverse("guest")}, status=status.HTTP_302_FOUND)
            response['Cache-Control'] = 'no-cache'
            return response


    def put(self, request, format=None):
        return Response({"error_message": u"method not allow"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
        '''
        user_instance = request.user
        if user_instance.is_authenticated():
            serializer = UserSerializer(user_instance, data=request.data)
            if serializer.is_valid():
                user_instance = serializer.save()
                return Response(UserSerializer(user_instance).data, status=status.HTTP_200_OK)
        else:
            response = Response({"redirect_url": reverse("guest")}, status=status.HTTP_302_FOUND)
            response['Cache-Control'] = 'no-cache'
            return response
        '''
