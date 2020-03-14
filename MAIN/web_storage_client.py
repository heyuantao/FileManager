# -*- coding: utf-8 -*-
import requests
import json

FILE_LIST_API   = '/api/file/list/'
FILE_URL_API    = '/api/file/url/'

class WebStorageClient:

    def __init__(self, token="", endpoint=None):
        self.token = token
        self.endpoint = endpoint
        self.list_file_api = FILE_LIST_API


    def _post(self, url, data_dict):
        headers = {'content-type': 'application/json','Authorization':'Token '+self.token}
        r = requests.post(url, json.dumps(data_dict), headers=headers)
        return r

    #upload crendical and status (crendical,status)
    def list_file(self):
        try:
            #data_json = json.dump({'key':key,'size':size_limit})
            url = self.endpoint+ self.list_file_api;
            r = self._post(url,{})
            print(r.text)
            print('信息')
            j=json.loads(r.content,encoding='utf-8')
            print(j)
            print(type(j))
            files= j['files']
            for file in files:
                print(file)

        except Exception as e:
            raise e

def test():
    client = WebStorageClient(token='UseMyWebStorageService',endpoint='http://webstorage.heyuantao.cn')
    client.list_file()

if __name__=="__main__":
    test()