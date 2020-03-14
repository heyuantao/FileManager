from django.contrib import admin
from django.conf.urls import  include, url
from django.conf import settings
from django.conf.urls.static import static
from django.views.decorators.csrf import csrf_exempt

from API.views import LoginAPIView, LogoutAPIView, UserAPIView

urlpatterns = [
    #Login and Registration Data
    #url(r'^v1/captcha/$', CaptchaAPIView.as_view()),
    url(r'^v1/user/', UserAPIView.as_view()),
    #url(r'^v1/registration/', RegisterAPIView.as_view()),
    url(r'^v1/login/', LoginAPIView.as_view()),
    url(r'^v1/logout/', LogoutAPIView.as_view()),
    #end or manager api
]

