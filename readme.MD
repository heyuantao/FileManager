##1.Run the app in docker

###1.1 First build the docker image

build image
```
git clone https://github.com/heyuantao/FileManager.git
cd FileManager
docker built -t filemanager:3.0 .
```
###1.2 Start the mysql docker
```
sudo mkdir -p /app
sudo chown -R ${USER}:${USER} /app/
cd /app/
git clone https://github.com/heyuantao/FileManager.git
cd FileManager

sudo mkdir -p /app/data/db
docker run -d --name=mysql --restart=always --network=host -e MYSQL_ALLOW_EMPTY_PASSWORD=yes -e MYSQL_DATABASE=filemanager -v /app/data/db:/var/lib/mysql -v $PWD/docker/mysqld/mysqld.cnf:/etc/mysql/mysql.conf.d/mysqld.cnf mysql:5.6
```
###1.3 Start the app docker
```
sudo mkdir -p /app/data/logs
docker run -d --name=filemanager --restart=always --network=host -e STORAGE_ENDPOINT=http://webstorage.heyuantao.cn -e STORAGE_TOKEN=UseMyWebStorageService -v /app/data/logs/:/var/log/supervisor/ filemanager:3.0
```
###1.4 Exec into web container and do init
```
docker exec -it <web_container_id> /bin/bash   
bash docker/install/init_web.sh
```
The init_web.sh will create database table and create supseruser

##2. If you need not run the app not in docker
###2.1. The base software 
ubuntu 16.04 and python3.5, please use utf8 in mysql

###2.2. Run the app
gunicorn -w 6 -b 0.0.0.0:8000 --log-level=DEBUG --timeout 30 -k gevent FileManager.wsgi:application
