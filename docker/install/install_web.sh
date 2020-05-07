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


echo "Install virtualenv and requirements !"
cd /app/FileManager && make installenv

echo "Install node yarn and node modules !"
cd /app/FileManager && make installnodeenv

echo "Build node modules !"
cd /app/FileManager && make buildnodemodules

echo "Clear useless node modules !"
cd /app/FileManager && make cleannodemodules

echo "Copy Nginx and Supervisor Config Fle !"
cp /app/FileManager/docker/nginx/default /etc/nginx/sites-enabled/default
cp /app/FileManager/docker/supervisor/filemanager.conf /etc/supervisor/conf.d/filemanager.conf

echo "Install Finished !" 
