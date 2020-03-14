# -*- coding: utf-8 -*-
from datetime import datetime,timedelta
from MAIN.exceptions import MessageException
from MAIN.utils import Singleton
from django.conf import settings
from .web_storage_client import WebStorageClient,WebStorageClientStatus

HOST = settings.LARGE_STORAGE_SETTINGS.get('SITE_URL')
TOKEN = settings.LARGE_STORAGE_SETTINGS.get('SITE_TOKEN')

@Singleton
class LargeFileStorage:
    def __init__(self):
        self.client = WebStorageClient(endpoint=HOST,token=TOKEN)

    def list(self):
        r,s = self.client.list()
        if s != WebStorageClientStatus.SUCCESS:
            raise MessageException('Error in get file list in LargeFileStorage.list() ')
        #r 是文件列表
        return r

    def delete(self,key):
        r, s = self.client.delete(key)
        if s != WebStorageClientStatus.SUCCESS:
            raise MessageException('Error in delete file list in LargeFileStorage.delete() ')

    def get_download_url(self,key, realname=None, expire=datetime.now()+timedelta(minutes=120)):
        if realname == None:
            realname = key
        r,s = self.client.get_download_url(key,realname,expire)
        if s!= WebStorageClientStatus.SUCCESS:
            raise MessageException('Error in delete file list in LargeFileStorage.get_download_url() ')
        return r

    def create_upload_task(self, key, size_limit=-1):
        r,s =self.client.create_upload_task(key,size_limit=size_limit)
        if s == WebStorageClientStatus.KEY_OCCUPIED:
            raise MessageException('Key has exist in WebStorage LargeFileStorage.create_upload_task() ')
        if (s != WebStorageClientStatus.KEY_OCCUPIED) and (s!= WebStorageClientStatus.SUCCESS):
            raise MessageException('Error in delete file list in LargeFileStorage.create_upload_task() ')
        return r