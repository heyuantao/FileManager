FROM harbor.syslab.org/library/python3web:1.0

WORKDIR /app/FileManager
COPY ./ /app/FileManager/
RUN bash /app/FileManager/docker/install/install_web.sh

#VOLUME ['/app/EEAS/media/avatar/','/var/log/supervisor/']
VOLUME ['/var/log/supervisor/']

ENTRYPOINT  ["supervisord","-n"]
