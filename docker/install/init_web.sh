cd /app/FileManager/

python3 manage.py makemigrations
python3 manage.py migrate

python3 manage.py createadminuser -u admin@example.com -p example.com -c 123456789 -a soft

