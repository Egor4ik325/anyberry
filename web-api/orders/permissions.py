from rest_framework.permissions import BasePermission

from .models import Order


class OrderPermission(BasePermission):
    """
    Authorization for order.
    """

    def has_permission(self, request, view) -> bool:
        """Request-level authorization."""
        return True

    def has_object_permission(self, request, view, obj: Order) -> bool:
        """Check request user has permission for accessing the bill"""
        return obj.user == request.user
