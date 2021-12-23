from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from qiwi_api import client
from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response

from .models import Order
from .serializers import OrderSerializer


class OrdersViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = OrderSerializer
    queryset = Order.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    @action(methods=["GET"], detail=True, url_path="bill", url_name="bill")
    @method_decorator(cache_page(60))
    def get_bill(self, request, pk) -> Response:
        order: Order = get_object_or_404(Order, pk=pk)
        bill = client.get_bill(order.bill_uuid)

        # Serialize bill for API
        bill_dict = {
            "amount": str(bill.amount.amount),
            "currency": str(bill.amount.currency),
            "pay_url": bill.pay_url,
            "status": bill.status.value,
            "create_time": bill.creation_date_time.isoformat(),
            "expire_time": bill.expiration_date_time.isoformat(),
        }

        return Response(bill_dict)
