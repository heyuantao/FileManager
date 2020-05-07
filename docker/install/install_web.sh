#echo "Install Apt Package !"
#apt-get install -y nginx supervisor
#apt-get install -y python3 python3-pip python3-dev libmysqlclient-dev #python-mysqldb
#apt-get install -y libssl-dev


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
