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
        ret['is_superuser'] = instance.is_superuser
        if instance.last_login:
            ret['last_login'] = instance.last_login.date()
        else:
            ret['last_login'] = "未登录"

        ret['login_url'] = reverse("guest")

        if instance.is_authenticated():
            if instance.is_superuser:
                ret['dashboard_url'] = reverse("manager")
        return ret


class FileSerializer(serializers.Serializer):
    filename = serializers.CharField(max_length=300)
    filesize = serializers.IntegerField(default=0)
    key = serializers.CharField(max_length=300)
    uploaddate = serializers.DateTimeField(read_only=True)
    browserable = serializers.BooleanField(default=True)

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['id'] = instance.id
        key = ret['key']
        ret['url'] = LargeFileStorageInstance.get_download_url(key)
        return ret

    def create(self, validated_data):
        instance = FileModel(**validated_data)
        instance.save()
        return instance

    def validate(self, data):
        return data

