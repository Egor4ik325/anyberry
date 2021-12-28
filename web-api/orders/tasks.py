from uuid import UUID

from celery import shared_task
from celery.result import AsyncResult
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.translation import gettext_lazy as _
from qiwi_api import Status, client
from qiwi_api.exceptions import QIWIAPIError

from orders.models import Order
from orders.serializers import serialize_bill

User = get_user_model()


@shared_task
def reject_bill(bill_id: UUID) -> AsyncResult:
    try:
        result = client.reject_bill(bill_id)
        return serialize_bill(result)  # type: ignore
    except QIWIAPIError as e:
        # TODO: handle the error some how or try retring
        raise e


@shared_task
def send_order_cheque(bill_id: UUID):
    """
    Send order cheque when the order bill was paid.

    - check whether order is in fact paid
    - check whether the cheque was sent already
    - if can't perform email sending it is considered exceptional situation
    - if not appropriate to send email is also exceptional situation
    - violates function business logic
    """

    # The situation when bill is already sent will be considered normal (for user)
    # because it is normat that API can send duplicate webhook requests
    # TODO

    bill = client.get_bill(bill_id)
    # The situation when bill is not paid will not be considered normal
    # because the user excepts it to be paid, the program should notify
    # that he is wrong by raising an exception.
    # if bill.status.value != Status.PAID:
    #     raise BillNotPaidError(
    #         f"Can't send an email for unpaid bill: {bill.status.value}")

    # Get associated order and user
    order = Order.objects.select_related("user").get(bill_uuid=bill_id)
    user = order.user

    context = {
        "username": user.username,
        "order": order,
        "amount": bill.amount.amount,
        "currency": bill.amount.currency,
        "berries": order.berries.all(),
        "paid_time": bill.status.changed_date_time,
    }
    message = render_to_string("order_cheque.txt", context)
    message_html = render_to_string("order_cheque.html", context)
    sent_emails_count = send_mail(subject=_("Paid order cheque"),
                                  message=message,
                                  html_message=message_html,
                                  recipient_list=[user.email],
                                  from_email=None)

    # Save information bill sent email in the Redis/cache (temporary database)
    if sent_emails_count == 1:
        pass  # TODO

    return sent_emails_count


class BillNotPaidError(Exception):
    pass
