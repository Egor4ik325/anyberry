from rest_framework import permissions, viewsets

from .models import Order
from .serializers import OrderSerializer


class OrdersViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = OrderSerializer
    queryset = Order.objects.all()
    permission_classes = [permissions.IsAuthenticated]
