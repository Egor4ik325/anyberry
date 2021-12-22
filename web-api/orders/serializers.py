from rest_framework import serializers

from .models import Order


class OrderSerializer(serializers.ModelSerializer):
    """Model API for creation and validation in the views."""

    class Meta:
        model = Order
        fields = ['id', 'user', 'berries']

        extra_fields = {
            "bill": {
                "view_name": "order-detail-bill",
                "lookup_field": "pk"
            },
        }
