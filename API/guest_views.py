# -*- coding: utf-8 -*-
from django.db.models import Q
from rest_framework import generics
from rest_framework import status
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from API.guest_seralizers import GuestFileSerializer
from MAIN.exceptions import MessageException
from MAIN.models import FileModel
from MAIN.paginations import CustomItemPagination
import traceback
import json
import moment
import random
import logging
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter

logger = logging.getLogger(__name__)

class GuestFileListAPIView(generics.ListAPIView):
    serializer_class = GuestFileSerializer
    permission_classes = (AllowAny,)
    pagination_class = CustomItemPagination
    filter_backends = (SearchFilter,)
    search_fields = ("filename", )

    def get_queryset(self):
        try:
            return FileModel.objects.all().filter(browserable=True).order_by("-uploaddate")
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



class GuestFileRetriveAPIView(generics.RetrieveAPIView):
    serializer_class = GuestFileSerializer
    permission_classes = (AllowAny,)

    def get_queryset(self):
        try:
            return FileModel.objects.all()
        except MessageException as e:
            logger.error(traceback.format_exc())
            raise e  # rethrow exception
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
            return Response({'error_message': '该实例不存在 !'}, status=status.HTTP_400_BAD_REQUEST)
        except MessageException as e:
            return Response({'error_message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(traceback.print_exc())
            return Response({'error_message': '软件错误'}, status=status.HTTP_400_BAD_REQUEST)

