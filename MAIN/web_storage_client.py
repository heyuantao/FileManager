# -*- coding: utf-8 -*-
from enum import Enum
import requests
import json
import traceback
import logging

logger = logging.getLogger(__name__)

FILE_LIST_API   = '/api/file/list/'
FILE_DELETE_API = '/api/file/delete/'
FILE_INRO_API   = '/api/file/info/'
FILE_URL_API    = '/api/file/url/'
FILE_TASK_API  = '/api/upload/token/'

class WebStorageClientStatus(Enum):
    SUCCESS         = 1
    UNAUTHORIZED    = 2
    KEY_OCCUPIED    = 3
    KEY_NOTEXIST    = 4
    NETWORK_ERROR   = 5
    OTHER_ERROR     = 6


class WebStorageClient:
    def __init__(self, token="", endpoint=None):
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
        json_object = json.loads(res.content)
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

    #查看文件是否存在
    def exist(self, key):
        try:
            url = self.endpoint + self.info_file_api
            data = {'key': key}
            return_object,status_code = self._post(url, data)

            if status_code == 200:
                status = WebStorageClientStatus.SUCCESS
                return (True, status)
            else:
                if status_code == 400:
                    status = WebStorageClientStatus.KEY_NOTEXIST
                elif status_code == 401:
                    status = WebStorageClientStatus.UNAUTHORIZED
                else:
                    status = WebStorageClientStatus.NETWORK_ERROR
                return (False, status)
        except Exception as e:
            logger.error(traceback.format_exc())
            status = WebStorageClientStatus.OTHER_ERROR
            return (False, status)


    #删除某个文件，返回状态值
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
    def create_upload_task(self,key,size_limit=-1):
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



def test():
    client = WebStorageClient(token='UseMyWebStorageService',endpoint='http://webstorage.heyuantao.cn')
    #l, s = client.list_key()
    #l,s=client.delete_key('Sys4p_00_OpenStack基础-注意这里面的视频没加密.zip')
    l,s = client.create_upload_task('obc1.txt')
    print(l)
    print(s)

if __name__=="__main__":
    test()