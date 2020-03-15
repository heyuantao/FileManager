from django.contrib import admin
from django.conf.urls import  include, url
from django.conf import settings
from django.conf.urls.static import static
from django.views.decorators.csrf import csrf_exempt

from API.guest_views import GuestFileListAPIView, GuestFileRetriveAPIView
from API.manager_views import ManagerFileListCreateAPIView, ManagerFileRetriveUpdateDestoryAPIView, \
    ManagerFileUploadTaskAPIView
from API.views import LoginAPIView, LogoutAPIView, UserAPIView

urlpatterns = [
    #basic api
    url(r'^v1/user/', UserAPIView.as_view()),
    url(r'^v1/login/', LoginAPIView.as_view()),
    url(r'^v1/logout/', LogoutAPIView.as_view()),

    #guest api
    url(r'^v1/guest/file/(?P<id>\d+)/$', GuestFileRetriveAPIView.as_view()),
    url(r'^v1/guest/file/', GuestFileListAPIView.as_view()),

    #manager api
    url(r'^v1/manager/file/task/$', ManagerFileUploadTaskAPIView.as_view()),
    url(r'^v1/manager/file/(?P<id>\d+)/$', ManagerFileRetriveUpdateDestoryAPIView.as_view()),
    url(r'^v1/manager/file/', ManagerFileListCreateAPIView.as_view()),
]

