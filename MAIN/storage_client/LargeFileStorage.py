# -*- coding: utf-8 -*-
from datetime import datetime,timedelta
import random
import string
from MAIN.exceptions import MessageException
from MAIN.utils import Singleton
from django.conf import settings
from .web_storage_client import WebStorageClientDefaultInstance,WebStorageClientStatus
import logging

logger = logging.getLogger(__name__)

HOST = settings.LARGE_STORAGE_SETTINGS.get('SITE_URL')
TOKEN = settings.LARGE_STORAGE_SETTINGS.get('SITE_TOKEN')

@Singleton
class LargeFileStorage:
    def __init__(self):
        self.client = WebStorageClientDefaultInstance
        self.client.config(endpoint=HOST,token=TOKEN)

    def list(self):
        r,s = self.client.list()
        if s != WebStorageClientStatus.SUCCESS:
            logger.error('Can not list key ! LargeFileStorage.list() ')
            raise MessageException('网络或软件出现异常')
        #r 是文件列表
        return r

    def delete(self,key):
        s = self.client.delete(key)
        if s == WebStorageClientStatus.KEY_NOTEXIST:
            logger.error('Delete key \"{}\" which is not exist ! LargeFileStorage.delete() '.format(key))
            return
        if s != WebStorageClientStatus.SUCCESS:
            logger.critical('Unknow error happen in delete key \"{}\" ! LargeFileStorage.delete() '.format(key))
            raise MessageException('该条目不能删除')

    def get_download_url(self,key, realname=None, expire=None):
        if realname == None:
            realname = key
        if expire == None:
            expire = datetime.now() + timedelta(hours=24) #timedelta(minutes=120)
        link = self.client.get_download_url(key,realname,expire)
        return link

    def get_download_command_use_with_wget(self,key, realname=None, expire=None):
        if realname == None:
            realname = key
        if expire == None:
            expire = datetime.now() + timedelta(hours=24) #timedelta(minutes=120)
        command_with_wget = self.client.get_download_command_use_with_wget(key,realname,expire)
        return command_with_wget

    def create_upload_task(self, key, size_limit=-1):
        r,s =self.client.create_upload_task(key,size_limit=size_limit)  #第一次上传授权信息的生成，只有当key有重复时才可能发生"KEY_OCCUPIED"的错误
        if s == WebStorageClientStatus.KEY_OCCUPIED:
            logger.error('Key \"{}\" exist ! LargeFileStorage.create_upload_task() '.format(key))
            raise MessageException('上传文件失败')
        if (s != WebStorageClientStatus.KEY_OCCUPIED) and (s!= WebStorageClientStatus.SUCCESS):
            logger.critical('Unknow error happen in create upload task ! LargeFileStorage.create_upload_task() '.format(key))
            raise MessageException('网络或软件出现异常')
        return r

    def random_key_prefix(self,stringLength=6):
        """Generate a random string of fixed length """
        letters = string.ascii_letters
        return ''.join(random.choice(letters) for i in range(stringLength))