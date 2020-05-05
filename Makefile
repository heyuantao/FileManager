.PHONY: savedata loaddata uploaddata downloaddata help


help: ##how to use
	@echo "savedata loaddata uploaddata downloaddata help"


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

installnodemodules:
	@echo "install the node modules"
	@cd ./media/guest/ && yarn install
	@cd ./media/manager/ && yarn install