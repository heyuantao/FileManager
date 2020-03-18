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


class GuestFileSerializer(serializers.Serializer):
    filename = serializers.CharField(max_length=300)
    filesize = serializers.IntegerField(default=0)
    key = serializers.CharField(max_length=300)
    uploaddate = serializers.DateTimeField(read_only=True)
    browserable = serializers.BooleanField(default=True)

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['id'] = instance.id

        filesize = int(ret['filesize'])

        if 0<= filesize <1024:
            filesizedisplay = str(int(filesize))+"B"
        elif 1024<=filesize<1024*1024:
            filesizedisplay = str(int(filesize / (1024))) + "KB"
        elif 1024*1024 <= filesize < 1024 * 1024 *1024:
            filesizedisplay = str(int(filesize / (1024 * 1024))) + "MB"
        else:
            filesizedisplay = str(int(filesize / (1024 * 1024 *1024))) + "GB"
        ret['filesizedisplay']= filesizedisplay
        
        key = ret['key']
        filename = ret['filename']
        ret['url'] = LargeFileStorageInstance.get_download_url(key)
        ret['wget_download_command'] = LargeFileStorageInstance.get_download_command_use_with_wget(key,filename)
        return ret

    def create(self, validated_data):
        instance = FileModel(**validated_data)
        instance.save()
        return instance

    def update(self, instance, validated_data):
        instance.filename = validated_data.get('filename', instance.filename)
        instance.filesize = validated_data.get('filesize', instance.filesize)
        old_key = instance.key
        new_key = validated_data.get('key')
        if old_key != new_key:
            LargeFileStorageInstance.delete(old_key)
            instance.key = new_key
        instance.uploaddate = datetime.now()
        instance.browserable = validated_data.get('browserable', instance.browserable)
        instance.save()
        return instance


    def validate(self, data):
        return data

