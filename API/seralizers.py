# -*- coding: utf-8 -*-
from rest_framework import serializers
from rest_framework.exceptions import ErrorDetail, ValidationError
from datetime import datetime
from django.db import transaction
from django.core.urlresolvers import reverse
from django.contrib.auth.models import User
import traceback
import logging

from MAIN.models import FileModel
from MAIN.storage_client import LargeFileStorageInstance

logger = logging.getLogger(__name__)

class UserSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['id'] = instance.id
        ret['is_superuser'] = instance.is_staff
        if instance.last_login:
            ret['last_login'] = instance.last_login.date()
        else:
            ret['last_login'] = "未登录"

        ret['login_url'] = reverse("guest")

        if instance.is_authenticated():
            if instance.is_superuser:
                ret['dashboard_url'] = reverse("manager")
        return ret

    #the default user ceate by this method is examinee ,the superuser is create by management command
    '''
    def create(self, validated_data):
        with transaction.atomic():
            user_profile_phone_string = validated_data.get("phone")
            user_password_string = validated_data.get("password")
            user_profile_address_string = validated_data.get("address")
            #user_profile_category_string = CategoryModel.getExamineeCategoryString()
            user_profile_category_string = CategoryModel.getExamineeCategoryString()

            user_instance = User(**validated_data)
            user_instance.save()
            user_profile_instance = UserProfileModel(phone=user_profile_phone_string,address=user_profile_address_string,category=user_profile_category_string,\
                                                     user=user_instance)
            user_profile_instance.save()

            if user_password_string!="":
                user_instance.set_password(user_password_string)
                user_instance.save()
            return user_instance
    '''

    # the examinee and superuser can use this medhod, include change phone，address or password
    def update(self, instance, validated_data):
        with transaction.atomic():
            user_instance = instance
            user_password_string = validated_data.get("password")
            if user_password_string!="":
                user_instance.set_password(user_password_string)
                user_instance.save()
            return user_instance

    def validate(self, data):
        user_password_string = self.initial_data.get("password", "")
        data['password'] = user_password_string
        return data

