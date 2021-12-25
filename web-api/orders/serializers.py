from qiwi_api.client import Bill
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


def serialize_bill(bill: Bill) -> dict:
    """Serialize bill object to the dict for API representation.
    Reorder fields, cut off data, rename output.
    """
    return {
        "amount": str(bill.amount.amount),
        "currency": str(bill.amount.currency),
        "pay_url": bill.pay_url,
        "status": bill.status.value,
        "create_time": bill.creation_date_time.isoformat(),
        "expire_time": bill.expiration_date_time.isoformat(),
    }
