from celery.result import AsyncResult
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework import permissions, viewsets
from rest_framework.authentication import (SessionAuthentication,
                                           TokenAuthentication)
from rest_framework.decorators import action
from rest_framework.exceptions import NotFound
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response

from .models import Order
from .permissions import OrderPermission
from .serializers import OrderSerializer, serialize_bill
from .tasks import reject_bill

from qiwi_api import client

class OrdersViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = OrderSerializer
    queryset = Order.objects.all()
    permission_classes = [permissions.IsAuthenticated, OrderPermission]
    authentication_classes = [TokenAuthentication, SessionAuthentication]

    @action(methods=["GET"], detail=True, url_path="bill", url_name="bill")
    @method_decorator(cache_page(60))
    def get_bill(self, request, pk) -> Response:
        order: Order = get_object_or_404(Order, pk=pk)

        if order.bill_uuid is not None:
            bill = client.get_bill(order.bill_uuid)

            # TODO: check whether the bill is rejected => bill not found (404)

            # Serialize bill for API
            bill_dict = serialize_bill(bill)

            return Response(bill_dict)

        raise NotFound("Order doesn't have a associated bill.")

    @action(methods=["POST"], detail=True, url_path="reject", url_name="reject")
    def reject_order(self, request, pk) -> Response:
        """Delete order and reject associated bill."""
        order = self.get_object()
        order.delete()

        if order.bill_uuid is not None:
            # Reject the order bill asynchronously
            result: AsyncResult = reject_bill.delay(order.bill_uuid)

            return Response({
                "reject_bill_task_id": result.id,
            })

        return Response({
            "reject_bill_task_id": None,
        })
