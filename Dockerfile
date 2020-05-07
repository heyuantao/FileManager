#FROM harbor.syslab.org/library/ubuntu:18.04
FROM ubuntu:18.04 AS base

###This part is use to set time zone ########
ENV TZ=Asia/Shanghai
RUN sed -i s/archive.ubuntu.com/mirrors.tuna.tsinghua.edu.cn/g /etc/apt/sources.list
RUN sed -i s/security.ubuntu.com/mirrors.tuna.tsinghua.edu.cn/g /etc/apt/sources.list
RUN echo $TZ > /etc/timezone && apt-get update && apt-get install -y tzdata && \
    rm /etc/localtime && \
    ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && \
    dpkg-reconfigure -f noninteractive tzdata && \
    apt-get clean
ENV LANG C.UTF-8
ENV LC_CTYPE en_US.UTF-8
### set timezone end ########

RUN apt-get update && apt-get install -y locales &&  locale-gen zh_CN.UTF-8
RUN sed -i s@/archive.ubuntu.com/@/mirrors.aliyun.com/@g /etc/apt/sources.list  && echo "Asia/Shanghai" > /etc/timezone && dpkg-reconfigure -f noninteractive tzdata

ENV LANG zh_CN.UTF-8
ENV LANGUAGE zh_CN.UTF-8
ENV LC_ALL zh_CN.UTF-8


FROM base AS finally
RUN apt-get update && apt-get install -y nginx supervisor python3 python3-pip python3-dev libmysqlclient-dev libssl-dev  && apt-get clean

WORKDIR /app/FileManager
COPY ./ /app/FileManager/
RUN bash /app/FileManager/docker/install/install_web.sh

#VOLUME ['/app/EEAS/media/avatar/','/var/log/supervisor/']
VOLUME ['/var/log/supervisor/']

ENTRYPOINT  ["supervisord","-n"]
