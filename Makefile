.PHONY: savedata loaddata uploaddata downloaddata installenv installnodeenv buildnodemodules cleannodemodules help

PATH  := $(PWD)/../venv/bin:$(PWD)/../nodeenv/bin:$(PATH)
SHELL := env PATH=$(PATH) /bin/bash

help: ##how to use
	@echo "savedata loaddata uploaddata downloaddata installenv installnodeenv buildnodemodules cleannodemodules help"


savedata: ##save data base and uploads file
	@echo "Save data to /tmp/filemanager_db.sql in debug container !"
	@mysqldump -h 127.0.0.1 -u root  filemanager>/tmp/filemanager_db.sql


loaddata:  ##load data to database
	@echo "Load data from /tmp/filemanager_db.sql in debug container !"
	@mysql -h 127.0.0.1 -u root  filemanager < /tmp/filemanager_db.sql


uploaddata: ## upload to s3 storage
	@echo "Upload files to s3 ! Please set the ~/.s3cfg file first and install s3cmd !"
	@s3cmd put /tmp/filemanager_db.sql	s3://uploads/


downloaddata: ## download file from s3
	@echo "Download files to s3 ! Please set the ~/.s3cfg file first and install s3cmd !"
	@s3cmd get s3://uploads/filemanager_db.sql	/tmp/


installenv:
	@echo "Install Python3.6 env !"
	@virtualenv -p /usr/bin/python3.6 ../venv
	@pip install -r requirements.txt -i https://pypi.douban.com/simple
	@pip install nodeenv -i https://pypi.douban.com/simple


installnodeenv:
	@echo "Install NodeEnv and nodemodules!"
	@nodeenv ../nodeenv --node=10.15.3 --prebuilt --mirror=npm.taobao.org
	@npm install -g yarn --registry https://registry.npm.taobao.org
	@cd ./media/guest/    && yarn install --registry  https://registry.npm.taobao.org
	@cd ./media/manager/  && yarn install --registry  https://registry.npm.taobao.org


buildnodemodules:
	@echo "build the node modules"
	@cd ./media/guest/ && yarn run build
	@cd ./media/manager/ && yarn run build


cleannodemodules:
	@echo "clean the node modules"
	@rm -Rf ./media/guest/node_modules
	@rm -Rf ./media/manager/node_modules