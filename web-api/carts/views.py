from django.shortcuts import get_object_or_404
from django.utils.translation import ugettext_lazy as _
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotFound
from rest_framework import status
from rest_framework.response import Response

from .models import ShoppingCart
from .serializers import ShoppingCartSerializer
from berries.models import Berry
from orders.models import Order


class ShoppingCartBerriesViewSet(viewsets.ViewSet):
    """
    API endpoints for exposing user berries in the cart.
    """
    permission_classes = [IsAuthenticated]

    def get_cart_object(self):
        """Return session user shopping cart."""
        if not hasattr(self.request.user, 'cart'):
            raise NotFound(detail=_("User doesn't have a cart."))
        return self.request.user.cart

    def list(self, request, *args, **kwargs):
        """Return serialized cart berry ids."""
        cart = self.get_cart_object()
        serializer = ShoppingCartSerializer(instance=cart)
        berries = serializer.data.get('berries')
        return Response(data=berries)

    def get_lookup_kwarg(self):
        return int(self.kwargs['pk'])

    def add(self, request, *args, **kwargs):
        """Add berry to the cart, no body is required just id in URL."""
        lookup_url_kwarg = self.get_lookup_kwarg()
        berry = get_object_or_404(Berry, pk=lookup_url_kwarg)
        cart = self.get_cart_object()
        cart.berries.add(berry)
        return Response(data={'detail': _("Successfully added berry to the cart.")}, status=status.HTTP_201_CREATED)

    def remove(self, *args, **kwargs):
        """Remove berry from the cart, no request content."""
        lookup_url_kwarg = self.get_lookup_kwarg()
        berry = get_object_or_404(Berry, pk=lookup_url_kwarg)
        cart = self.get_cart_object()
        cart.berries.remove(berry)
        return Response(data={'detail': _("Successfully removed berry from the cart.")}, status=status.HTTP_200_OK)

    def clear(self, *args, **kwargs):
        """Clear cart from the berries (remove all berries)."""
        cart = self.get_cart_object()
        cart.berries.clear()
        return Response(data={'detail': _("Successfully cleared the cart.")}, status=status.HTTP_200_OK)

    def order(self, *args, **kwargs):
        """Create an order from all berries in the cart.
        And than clear the cart."""
        cart = self.get_cart_object()
        order = Order.objects.create(user=self.request.user)
        order.berries.set(cart.berries.all())
        cart.berries.clear()
        return Response(data={'detail': _("Successfully made an order.")}, status=status.HTTP_200_OK)