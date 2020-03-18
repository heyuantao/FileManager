# -*- coding: utf-8 -*-
#该文件为WebStorage的客户端接口
from enum import Enum
from datetime import datetime,timedelta
import requests
import json
import urllib
import string
import os
import traceback
import logging

logger = logging.getLogger(__name__)

FILE_LIST_API   = '/api/file/list/'
FILE_DELETE_API = '/api/file/delete/'
FILE_INRO_API   = '/api/file/info/'
FILE_URL_API    = '/api/file/url/'
FILE_TASK_API  = '/api/upload/token/'

import hashlib
from collections import Iterable

#所有的参数都为字符串
class DownloadKeyCrypto:
    def __init__(self):
        pass

    #secret为预共享密钥,为一个单独的密钥
    def sign(self,key,realname,timestamp,secret):
        combined_str = key + realname + timestamp + secret
        combined_byte = combined_str.encode('utf-8')
        combined_hash =hashlib.md5(combined_byte).hexdigest()
        return combined_hash

    # secret为预共享密钥,可能是一个密钥也可以是一个密钥列表
    def valid(self,key,realname,timestamp,secret_or_secret_list,sign):
        if isinstance(secret_or_secret_list, list):
            for one_secret in secret_or_secret_list:
                combined_str = key + realname + timestamp + one_secret
                combined_byte = combined_str.encode('utf-8')
                combined_hash = hashlib.md5(combined_byte).hexdigest()
                if combined_hash ==sign:
                    return True
            return False
        else:
            combined_str = key + realname + timestamp + secret_or_secret_list
            combined_byte = combined_str.encode('utf-8')
            combined_hash = hashlib.md5(combined_byte).hexdigest()
            if combined_hash == sign:
                return True
            else:
                return False

downloadkeycrpyto = DownloadKeyCrypto()

class WebStorageClientStatus(Enum):
    SUCCESS         = 1
    UNAUTHORIZED    = 2
    KEY_OCCUPIED    = 3
    KEY_NOTEXIST    = 4
    NETWORK_ERROR   = 5
    OTHER_ERROR     = 6


class WebStorageClient:
    def __init__(self, endpoint=None, token=""):
        self.token = token
        self.endpoint = endpoint
        self.list_file_api      = FILE_LIST_API
        self.info_file_api      = FILE_INRO_API
        self.delete_file_api    = FILE_DELETE_API
        self.file_task_api      = FILE_TASK_API

    #进行post请求，传入的data为Python对象格式（字典或者列表），返回有两个值，其中json_object是返回值也是对象格式（字典或者列表），url为api接口的地址，不带域名和协议类型,例如'/api/file/list/'
    def _post(self, url, data_dict):
        headers = {'content-type': 'application/json','Authorization':'Token '+self.token}
        res = requests.post(url, json.dumps(data_dict), headers=headers)
        json_object = json.loads(res.content.decode('utf-8'))
        return (json_object,res.status_code)

    #获取当前可下载的文件列表，和执行状态
    def list(self):
        try:
            url = self.endpoint+ self.list_file_api;
            return_object,status_code = self._post(url,{})
            file_list = return_object['files']

            if status_code == 200:
                status = WebStorageClientStatus.SUCCESS
            else:
                file_list = []
                if status_code == 401:
                    status = WebStorageClientStatus.UNAUTHORIZED
                else:
                    status = WebStorageClientStatus.NETWORK_ERROR
            return (file_list, status)

        except Exception as e:
            logger.error(traceback.format_exc())
            return ({}, WebStorageClientStatus.OTHER_ERROR)

    #查看文件是否存在,返回值为元组(文件是否存在,执行状态)
    def exist(self, key):
        try:
            url = self.endpoint + self.info_file_api
            data = {'key': key}
            return_object,status_code = self._post(url, data)

            if status_code == 200:
                status = WebStorageClientStatus.SUCCESS
                exist = return_object['exist']
                if exist == True:
                    return (True, status)
                else:
                    return (False, status)
            else:
                if status_code == 401:
                    status = WebStorageClientStatus.UNAUTHORIZED
                else:
                    status = WebStorageClientStatus.NETWORK_ERROR
                return (False, status)
        except Exception as e:
            logger.error(traceback.format_exc())
            status = WebStorageClientStatus.OTHER_ERROR
            return (False, status)


    #删除某个文件，返回该命令的执行结果
    def delete(self, key):
        try:
            url = self.endpoint + self.delete_file_api
            data = {'key': key}
            return_object,status_code = self._post(url, data)

            if status_code == 200:
                status = WebStorageClientStatus.SUCCESS
            else:
                if status_code == 400:
                    status = WebStorageClientStatus.KEY_NOTEXIST
                elif status_code == 401:
                    status = WebStorageClientStatus.UNAUTHORIZED
                else:
                    status = WebStorageClientStatus.NETWORK_ERROR
            return status
        except Exception as e:
            logger.error(traceback.format_exc())
            return WebStorageClientStatus.OTHER_ERROR

    #返回执行的返回值{'task':'xxx','key':'sdfsdfd','size':xx}（以对象返回)和状态值
    def create_upload_task(self, key, size_limit=-1):
        try:
            url = self.endpoint+ self.file_task_api
            data = {'key': key, 'size': size_limit}
            return_object, status_code = self._post(url, data)

            if status_code == 200:
                status = WebStorageClientStatus.SUCCESS
            else:
                return_object = {}
                if status_code == 401:
                    status = WebStorageClientStatus.UNAUTHORIZED
                elif status_code == 403:
                    status = WebStorageClientStatus.KEY_OCCUPIED
                else:
                    status = WebStorageClientStatus.NETWORK_ERROR
            return (return_object, status)
        except Exception as e:
            logger.error(traceback.format_exc())
            return ({}, WebStorageClientStatus.OTHER_ERROR)


    #生成文件下载链接
    def get_download_url(self, key, realname=None, expire=None):
        if realname == None:
            realname = key
        if expire == None:
            expire = datetime.now() + timedelta(minutes=120)
        #timestamp = str((datetime.now() + timedelta(minutes=120)).timestamp())
        timestamp = str(expire.timestamp())
        secret = self.token
        sign = downloadkeycrpyto.sign(key, realname, timestamp, secret)
        site_url = self.endpoint
        api_url = "/file/content"
        download_url = "{0}{1}?key={2}&realname={3}&timestamp={4}&sign={5}".format(site_url, api_url, key, realname,timestamp, sign)
        return download_url

    #下载文件,将文件下载到指定目录，返回值是元组(link_url,执行状态)
    def download_to_dir(self,key, dir="/tmp/"):
        try:
            if not os.path.exists(dir):
                os.mkdir(dir)
            expire = datetime.now() + timedelta(minutes=30)
            link = self.get_download_url(key, expire=expire)
            target = os.path.join(dir,key)
            safe_media_url = urllib.parse.quote(link, safe=string.printable)
            urllib.request.urlretrieve(safe_media_url, target)
            return (safe_media_url, WebStorageClientStatus.SUCCESS)
        except Exception as e:
            logger.error(traceback.format_exc())
            status = WebStorageClientStatus.OTHER_ERROR
            return ("", WebStorageClientStatus.OTHER_ERROR)



def test_case1():
    client = WebStorageClient(token='UseMyWebStorageService',endpoint='http://webstorage.heyuantao.cn')

    r, s = client.list()
    print('VALUE: {}\nSTATUS: {}'.format(r,s))
    r, s = client.exist('bIOmQ_04_OpenStack HA 理论.zip')
    print('VALUE: {}\nSTATUS: {}'.format(r, s))
    r, s = client.exist('bIOmQ_04_OpenStack HA  理论.zip')
    print('VALUE: {}\nSTATUS: {}'.format(r, s))

    s = client.delete('bIOmQ_04_OpenStack HA 理论.zip')
    print('STATUS: {}'.format(s))

    r, s = client.create_upload_task('bIOmQ_04_OpenStack HA  理论.zip')
    print('VALUE: {}\nSTATUS: {}'.format(r, s))


def test_case2():
    client = WebStorageClient(token='UseMyWebStorageService',endpoint='http://webstorage.heyuantao.cn')
    #生成一个在一定时间内有效的链接
    #expire= datetime.now() + timedelta(minutes=1)
    #link = client.get_download_url('YcSXe_千与千寻.mp4',realname='千与千寻.mp4',expire=expire)
    link = client.get_download_url('YcSXe_千与千寻.mp4', realname='千与千寻.mp4')
    print(link)

def test_case3():
    client = WebStorageClient(token='UseMyWebStorageService',endpoint='http://webstorage.heyuantao.cn')
    r, s = client.list()
    print('VALUE: {}\nSTATUS: {}'.format(r, s))
    r, s =client.download_to_dir('bB2PK_node-v12.16.1-x64.msi', dir='./tmp/')
    print('VALUE: {}\nSTATUS: {}'.format(r, s))

if __name__=="__main__":
    #test_case1()
    #test_case2()
    test_case3()
