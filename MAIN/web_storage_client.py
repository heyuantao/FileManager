# -*- coding: utf-8 -*-
from enum import Enum
import requests
import json
import traceback
import logging

logger = logging.getLogger(__name__)

FILE_LIST_API   = '/api/file/list/'
FILE_DELETE_API = '/api/file/list/'
FILE_URL_API    = '/api/file/url/'
FILE_TASK_API  = '/api/upload/token/'

class WebStorageClientStatus(Enum):
    SUCCESS         = 1
    UNAUTHORIZED    = 2
    KEY_OCCUPIED    = 3
    NETWORK_ERROR   = 4
    OTHER_ERROR     = 5


class WebStorageClient:

    def __init__(self, token="", endpoint=None):
        self.token = token
        self.endpoint = endpoint
        self.list_file_api = FILE_LIST_API
        self.file_task_api = FILE_TASK_API


    def _post(self, url, data_dict):
        headers = {'content-type': 'application/json','Authorization':'Token '+self.token}
        r = requests.post(url, json.dumps(data_dict), headers=headers)
        return r

    #根据HTTP的返回值，解析相应的应用状态
    def _parse_response_status(self, status_code):
        if status_code == 200:
            return WebStorageClientStatus.SUCCESS
        elif status_code == 401:
            return WebStorageClientStatus.KEY_OCCUPIED
        elif status_code == 403:
            return WebStorageClientStatus.KEY_OCCUPIED
        else:
            return WebStorageClientStatus.NETWORK_ERROR

    #get file list
    def list_file(self):
        try:
            #data_json = json.dump({'key':key,'size':size_limit})
            url = self.endpoint+ self.list_file_api;
            r = self._post(url,{})
            json_object=json.loads(r.content,encoding='utf-8')
            file_list= json_object['files']
            return file_list
        except Exception as e:
            raise e

    #get upload token, (object,status) if status=False mean the error happen
    def get_upload_task_info(self,key,size_limit=-1):
        try:
            url = self.endpoint+ self.file_task_api
            data = {'key': key, 'size': size_limit}
            r = self._post(url,data)
            json_object = json.loads(r.content, encoding='utf-8')
            status_string = self._parse_response_status(r.status_code)
            return (json_object,status_string)
        except Exception as e:
            logger.error(traceback.print_exc())
            return ({}, WebStorageClientStatus.OTHER_ERROR)

def test():
    client = WebStorageClient(token='UseMyWebStorageServic',endpoint='http://webstorage.heyuantao.cn')
    #client.list_file()
    obj,status=client.get_upload_task_info('1212212.pdf')
    print(obj,status)

if __name__=="__main__":
    test()