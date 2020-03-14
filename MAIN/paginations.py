# -*- coding: utf-8 -*-
from rest_framework.pagination import LimitOffsetPagination,PageNumberPagination
from rest_framework.response import Response

class CustomItemPagination(PageNumberPagination):
    page_query_param = 'current'
    page_size_query_param = 'pageSize'
    page_size = 8
    max_page_size = 100

    def get_paginated_response(self, data):
        paginator = self.page.paginator
        page_number = self.request.query_params.get(self.page_query_param, 1)
        page_size = self.get_page_size(self.request)
        pagination ={
            'current': int(page_number),
            'pageSize': page_size,
            'total': self.page.paginator.count,
        }
        return Response({
            'pagination':pagination,
            'items': data
        })

    def get_page_size(self, request):
        if self.page_size_query_param:
            page_size = min(int(request.query_params.get(self.page_size_query_param, self.page_size)), self.max_page_size)
            if page_size > 0:
                return page_size
            elif page_size == 0:
                return None
            else:
                pass
        return self.page_size
