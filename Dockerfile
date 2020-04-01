FROM harbor.syslab.org/library/ubuntu:18.04

RUN apt-get update && apt-get install -y locales &&  locale-gen zh_CN.UTF-8
RUN sed -i s@/archive.ubuntu.com/@/mirrors.aliyun.com/@g /etc/apt/sources.list  && echo "Asia/Shanghai" > /etc/timezone && dpkg-reconfigure -f noninteractive tzdata

ENV LANG zh_CN.UTF-8
ENV LANGUAGE zh_CN.UTF-8
ENV LC_ALL zh_CN.UTF-8

WORKDIR /app/FileManager

COPY ./ /app/FileManager/

RUN bash /app/FileManager/docker/install/install_web.sh

#VOLUME ['/app/EEAS/media/avatar/','/var/log/supervisor/']
VOLUME ['/var/log/supervisor/']

ENTRYPOINT  ["supervisord","-n"]