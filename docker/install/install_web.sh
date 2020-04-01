echo "Remove the node_modules !"
rm -Rf /app/FileManager/media/manager/node_modules
rm -Rf /app/FileManager/media/guest/node_modules


#echo "Set Apt Source List !"
#sed -i s@/archive.ubuntu.com/@/mirrors.aliyun.com/@g /etc/apt/sources.list
#echo "Asia/Shanghai" > /etc/timezone
#dpkg-reconfigure -f noninteractive tzdata

#echo "Change Lang !"
#apt-get update
#apt-get install -y locales
#locale-gen zh_CN
#locale-gen zh_CN.utf8
#export LANG=zh_CN.UTF-8
#export LC_ALL=zh_CN.UTF-8
#export LANGUAGE=zh_CN.UTF-8


echo "Install Apt Package !"
apt-get install -y nginx supervisor
apt-get install -y python3 python3-pip python3-dev libmysqlclient-dev #python-mysqldb
apt-get install -y libssl-dev

echo "Install Python Package !"
pip3 install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple/

echo "Copy Nginx and Supervisor Config Fle !"
cp /app/FileManager/docker/nginx/default /etc/nginx/sites-enabled/default
cp /app/FileManager/docker/supervisor/eeas.conf /etc/supervisor/conf.d/eeas.conf

echo "Install Finished !" 
