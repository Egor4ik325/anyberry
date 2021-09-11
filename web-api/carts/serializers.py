from rest_framework import serializers

from .models import ShoppingCart


class ShoppingCartSerializer(serializers.ModelSerializer):
    """Shopping cart model serializer."""

    class Meta:
        model = ShoppingCart
        fields = ['id', 'user', 'berries']
