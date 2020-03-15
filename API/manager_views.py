# -*- coding: utf-8 -*-
from django.db.models import Q
from django.shortcuts import render
from django.utils.datastructures import MultiValueDictKeyError
from rest_framework import generics
from rest_framework import status
from rest_framework.filters import SearchFilter
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.core.urlresolvers import reverse
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from rest_framework.exceptions import ValidationError
from django.http import HttpResponse,JsonResponse
from django.views.generic.base import View
from django.contrib.auth.models import User
from django.contrib.auth import update_session_auth_hash
from datetime import datetime
from django.utils.decorators import method_decorator
import traceback
import json
import moment
import pandas
import random
import logging
from API.manager_seralizers import ManagerFileSerializer
from MAIN.exceptions import MessageException
from MAIN.models import FileModel
from MAIN.paginations import CustomItemPagination

logger = logging.getLogger(__name__)

class ManagerFileListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = ManagerFileSerializer
    permission_classes = (IsAdminUser,)
    pagination_class = CustomItemPagination
    filter_backends = (SearchFilter,)
    search_fields = ("filename", )

    def get_queryset(self):
        try:
            return FileModel.objects.all()
        except MessageException as e:
            logger.error(traceback.format_exc())
            raise e  # rethrow exception
        except Exception as e:
            logger.error(traceback.format_exc())
            raise MessageException('出现未知错误 !')

    def get(self, request, *args, **kwargs):
        try:
            return self.list(request, *args, **kwargs)
        except MessageException as e:
            return Response({'error_message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(traceback.print_exc())
            return Response({}, status=status.HTTP_400_BAD_REQUEST)

    def create(self, request):
        try:
            serializerClass = self.get_serializer_class()
            serializer = serializerClass(data=request.data, context={'request': request, 'view': self})
            if not serializer.is_valid(raise_exception=True):
                raise MessageException('保存出错!')
            instance = serializer.save()
            return Response(serializerClass(instance).data, status=status.HTTP_201_CREATED)
        except ValidationError as e:  # 验证异常类
            logger.error(traceback.print_exc())
            first_validate_error_message = list(e.detail.values())[0][0]
            return Response({'error_message': first_validate_error_message}, status=status.HTTP_400_BAD_REQUEST)
        except MessageException as e:
            return Response({'error_message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(traceback.print_exc())
            return Response({}, status=status.HTTP_400_BAD_REQUEST)


class ManagerFileRetriveUpdateDestoryAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ManagerFileSerializer
    permission_classes = (IsAdminUser,)

    def get_queryset(self):
        try:
            return FileModel.objects.all()
        except Exception as e:
            logger.error(traceback.format_exc())
            raise MessageException('出现未知错误 !')

    def retrieve(self, request, id ):
        try:
            instance = self.get_queryset().get(id = id)
            seralizer_class = self.get_serializer_class()
            seralizer = seralizer_class(instance)
            return Response(seralizer.data, status=status.HTTP_200_OK)
        except FileModel.DoesNotExist as e:
            return Response({'error_message': 'instance not found'}, status=status.HTTP_400_BAD_REQUEST)
        except MessageException as e:
            return Response({'error_message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(traceback.print_exc())
            return Response({'error_message': 'error in software'}, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, id):
        try:
            category_instance = self.get_queryset().get(id=id)
            seralizer_class = self.get_serializer_class()

            seralizer = seralizer_class(instance=category_instance, data=request.data)
            if not seralizer.is_valid(raise_exception=True):
                raise MessageException('data save error')
            instance = seralizer.save()
            return Response(seralizer_class(instance).data, status=status.HTTP_200_OK)
        except FileModel.DoesNotExist:
            return Response({'error_message': 'instance not find'}, status=status.HTTP_400_BAD_REQUEST)
        except ValidationError as e:
            logger.error(traceback.print_exc())
            first_validate_error_message = list(e.detail.values())[0][0]
            return Response({'error_message': first_validate_error_message}, status=status.HTTP_400_BAD_REQUEST)
        except MessageException as e:
            return Response({'error_message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(traceback.print_exc())
            return Response({'error_message': 'error in software'}, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request,id):
        try:
            category_instance = self.get_queryset().get(id=id)
            category_instance.delete()
            return Response({}, status=status.HTTP_200_OK)
        except FileModel.DoesNotExist:
            return Response({'error_message': 'instance not find'}, status=status.HTTP_400_BAD_REQUEST)
        except MessageException as e:
            return Response({'error_message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(traceback.print_exc())
            return Response({'error_message': 'error in software'}, status=status.HTTP_400_BAD_REQUEST)

