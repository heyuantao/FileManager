FROM harbor.syslab.org/library/python3web:1.0

#RUN apt-get update && apt-get install -y nginx supervisor python3 python3-pip virtualenv python3-dev libmysqlclient-dev libssl-dev  && apt-get clean
WORKDIR /app/FileManager
COPY .. /app/FileManager/
RUN bash /app/FileManager/docker/install/install_web.sh

#VOLUME ['/app/EEAS/media/avatar/','/var/log/supervisor/']
VOLUME ['/var/log/supervisor/']

ENTRYPOINT  ["supervisord","-n"]
