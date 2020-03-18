1. The base software 
ubuntu 16.04 and python3.5

2. Run the app
gunicorn -w 6 -b 0.0.0.0:8000 --log-level=DEBUG --timeout 30 FileManager.wsgi:application
