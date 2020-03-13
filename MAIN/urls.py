from django.contrib import admin
from django.conf.urls import  include, url
from django.conf import settings
from django.conf.urls.static import static
import os

from MAIN.views import TestLogoutView, TestLoginView, IndexView

GUEST_MEDIA_ROOT = os.path.join(settings.MEDIA_ROOT, 'guest/build/')
GUEST_MEDIA_URL = "guest/media/"
MANAGER_MEDIA_ROOT = os.path.join(settings.MEDIA_ROOT, 'manager/build/')
MANAGER_MEDIA_URL = "manager/media/"


urlpatterns = [
    url(r'^$', IndexView.as_view(), name='index'),
    url(r'testlogin$', TestLoginView.as_view(), name='testlogin'),
    url(r'testlogout$', TestLogoutView.as_view(), name='testlogout'),
] + static(MANAGER_MEDIA_URL, document_root=MANAGER_MEDIA_ROOT) \
  + static(GUEST_MEDIA_URL, document_root=GUEST_MEDIA_ROOT)

