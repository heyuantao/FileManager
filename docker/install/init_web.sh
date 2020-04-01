cd /app/EEAS/

python3 manage.py makemigrations
python3 manage.py migrate

python3 manage.py createadminuser -u admin@example.com -p example.com -c 12345678 -a soft

