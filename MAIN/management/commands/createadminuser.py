from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth.models import User
from django.db import transaction
import traceback

class Command(BaseCommand):
    help = "\
        Create superuser with the following command ! \n\
        createadminuser -u admin@example.com -p example.com -a soft -c 123456789  \n\
            "

    def add_arguments(self, parser):
        parser.add_argument("-u","--username", type=str, help="username")
        parser.add_argument("-p", "--password", type=str, help="password")
        parser.add_argument("-a", "--address", type=str, help="address")
        parser.add_argument("-c", "--phone", type=str, help="phone")

    def handle(self, *args, **options):
        username =  options.get("username")
        password = options.get("password")
        address = options.get("address")
        phone = options.get("phone")

        if (username==None) or (password==None) or (address==None) or (phone==None) :
            self.stdout.write(self.style.ERROR("One of argument is empty !"))
            return

        if username.find("@")==-1:
            self.stdout.write(self.style.ERROR("Username:{} is not in email format !".format(username)))
            return

        try:
            querySet = User.objects.filter(username = username)
            if querySet:
                self.stdout.write(self.style.SUCCESS("User with {} Exist!".format(username)))
                return

            with transaction.atomic():
                userInstance = User.objects.create(username=username,email=username)
                userInstance.set_password(password)
                userInstance.is_superuser=True
                userInstance.is_staff=True
                userInstance.save()

            self.stdout.write(self.style.SUCCESS("Successfully create admin user named {} !".format(username)))
        except Exception as e:
            self.stdout.write(traceback.print_exc())
            self.stdout.write(self.style.ERROR("Error Happen !".format(username)))