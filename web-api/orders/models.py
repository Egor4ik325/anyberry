import uuid

from django.db import models
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from qiwi_api import client


class Order(models.Model):
    user = models.ForeignKey("users.CustomUser", verbose_name=_(
        "user"), on_delete=models.CASCADE, related_name="orders")
    berries = models.ManyToManyField(
        "berries.Berry", verbose_name=_("berries"))
    bill_uuid = models.UUIDField(
        _("bill UUID"), editable=False)

    @property
    def amount(self) -> float:
        """Calculate total order amount values (django-money)."""
        return 1.00

    def save(self, **kwargs):
        """Invoice a bill when new order is created (synchronously)."""
        bill_id = uuid.uuid4()
        client.invoice_bill(str(bill_id), self.amount,
                            comment=f"Bill for order #{self.pk}")
        self.bill_uuid = bill_id

        super().save(**kwargs)

    class Meta:
        verbose_name = _("order")
        verbose_name_plural = _("orders")

    def __str__(self):
        return f"Order #{self.pk}"

    def get_absolute_url(self):
        return reverse("order_detail", kwargs={"pk": self.pk})

# TODO: add on delete signal handler
