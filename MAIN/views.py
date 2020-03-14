# Create your views here.
from __future__ import unicode_literals
from django.views.generic.base import View
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.shortcuts import render_to_response
from django.core.urlresolvers import reverse
#from django.template.context import RequestContext
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.response import Response
from django.template import RequestContext
from django.http.response import Http404, HttpResponseRedirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect,HttpResponse
from django.core.urlresolvers import reverse
import traceback
import logging

logger = logging.getLogger(__name__)

# Create your views here.

class TestLoginView(View):
    template = 'testLoginAndLogout.html'
    def get(self,request):
        pageContext = request.GET.dict()
        return render(request, self.template, pageContext)
    def post(self,request):
        username = request.POST.get("username")
        password = request.POST.get("password")
        user = authenticate(username=username, password=password)
        pageContext = request.GET.dict()
        if user is not None and user.is_active:
            login(request, user)
            return render(request, self.template, pageContext)
        else:
            return render(request, self.template, pageContext)

class TestLogoutView(View):
    template = 'testLoginAndLogout.html'
    def get(self,request):
        logout(request)
        pageContext = request.GET.dict()
        return HttpResponseRedirect(reverse("testlogin"))

class IndexView(View):
    #template = 'index.html'
    template = "guest/build/index.html"
    def get(self, request):
        pageContext = request.GET.dict()
        return render(request, self.template, pageContext)
