from uuid import UUID

from celery import shared_task
from celery.result import AsyncResult
from django.contrib.auth import get_user_model
from django.core.cache import cache
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

    # Key prefix for cache
    cache_key = f"send_cheque_{bill_id}"

    # The situation when bill is already sent will be considered normal (for user)
    # because it is normat that API can send duplicate webhook requests
    if cache.get(cache_key) is not None:
        return 0

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
        "username": user,
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

    # Save information sent cheque in the Redis/cache (temporary database)
    if sent_emails_count == 1:
        cheque = {
            "username": user.username,
            "order": order.id,
            "amount": bill.amount.amount,
            "currency": bill.amount.currency,
            "berries": list(order.berries.values("id")),  # serialize berries
            "paid_time": bill.status.changed_date_time,
        }
        day_seconds = 60 * 60 * 24
        # Save cheque for furter retrieving
        cache.set(cache_key, cheque, timeout=day_seconds)

    return sent_emails_count


class BillNotPaidError(Exception):
    pass
