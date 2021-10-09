from rest_framework import serializers

from .models import Order


class OrderSerializer(serializers.ModelSerializer):
    """Model API for creation and validation in the views."""

    class Meta:
        model = Order
        fields = ['id', 'user', 'berries']
