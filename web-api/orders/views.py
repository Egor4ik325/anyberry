import hashlib
import hmac

from celery.result import AsyncResult
from django.conf import settings
from django.utils.decorators import method_decorator
from django.utils.translation import gettext_lazy as _
from django.views.decorators.cache import cache_page
from qiwi_api import Bill, client
from qiwi_api.exceptions import QIWIAPIError
from rest_framework import permissions, status, viewsets
from rest_framework.authentication import (SessionAuthentication,
                                           TokenAuthentication)
from rest_framework.decorators import (action, api_view,
                                       authentication_classes,
                                       permission_classes)
from rest_framework.exceptions import APIException, NotFound
from rest_framework.generics import get_object_or_404
from rest_framework.request import Request
from rest_framework.response import Response

from .models import Order
from .permissions import OrderPermission
from .serializers import OrderSerializer, serialize_bill
from .tasks import reject_bill, send_order_cheque


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
            try:
                bill = client.get_bill(order.bill_uuid)
            except QIWIAPIError:
                raise NotFound("Bill for this order doesn't exists!")

            # TODO: check whether the bill is rejected => bill not found (404)
            # (or the order just will be deleted before we save the id)

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


@api_view(["POST"])
@authentication_classes([])
@permission_classes([permissions.AllowAny])
def qiwi_callback_view(request: Request) -> Response:
    """
    Webhook that is called by QIWI on particular event.

    Can be called multiple times after 200 OK.
    """
    from pdb import set_trace
    set_trace()
    # NOTE: I think i should be noted in the documentation that hash is in the hex not just UTF-8
    # HMAC hex hash, encoded in UTF-8
    api_signature: str = request.headers.get("X-Api-Signature-SHA256")

    # Convert the request data to the bill
    bill_dict = request.data.get("bill")
    bill = Bill(**bill_dict)

    message = f"{bill.amount.currency}|{bill.amount.amount}|{bill.bill_id}|{bill.site_id}|{bill.status.value}"
    secret_key: str = settings.QIWI_P2P_SECRET_KEY
    signature = make_hmac_hash(message, secret_key)

    # Validate that request was sent by QIWI
    if not hmac.compare_digest(api_signature, signature):
        raise SignatureNotMatchError

    send_order_cheque.delay(bill.bill_id)

    # Always send 200 response
    return Response()


def make_hmac_hash(message: str, key: str) -> str:
    """Make a hash/digest/signature, HMAC + SHA256."""
    digester = hmac.new(key=key.encode("UTF-8"),
                        msg=message.encode("UTF-8"), digestmod=hashlib.sha256)
    signature = digester.hexdigest()  # hex (base16) or base64
    return signature


class SignatureNotMatchError(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = _('Invalid API signature.')
    default_code = 'invalid'
