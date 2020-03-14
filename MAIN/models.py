# -*- coding: utf-8 -*-
from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save,pre_save,post_delete,pre_delete
from django.dispatch import receiver
from datetime import datetime
from FileManager import settings
from MAIN.exceptions import MessageException
from django.core.exceptions import ValidationError
from django.utils import timezone
import uuid
import traceback
import logging


logger = logging.getLogger(__name__)


# Create your models here.
class FileModel(models.Model):
    filename = models.CharField(max_length=300)
    filesize = models.IntegerField(default=0)
    key = models.CharField(max_length=300)
    uploaddate = models.DateTimeField(auto_now=True)
    browserable = models.BooleanField(default=True)        #设置文件是否对普通用户可浏览

