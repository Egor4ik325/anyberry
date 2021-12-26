from uuid import UUID

from celery import shared_task
from celery.result import AsyncResult
from django.core.mail import send_mail
from qiwi_api import client
from qiwi_api.exceptions import QIWIAPIError

from orders.serializers import serialize_bill


@shared_task
def reject_bill(bill_id: UUID) -> AsyncResult:
    try:
        result = client.reject_bill(bill_id)
        return serialize_bill(result)  # type: ignore
    except QIWIAPIError as e:
        # TODO: handle the error some how or try retring
        raise e


@shared_task
def send_order_cheque(bill_dict: dict):
    """
    Send order cheque when the order bill was paid.
    """
    pass
