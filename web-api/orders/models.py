import uuid

from django.db import models
from django.shortcuts import reverse
from django.utils.translation import gettext_lazy as _

from payments.api_client import QIWIAPIClient


class Order(models.Model):
    user = models.ForeignKey("users.CustomUser", verbose_name=_(
        "user"), on_delete=models.CASCADE, related_name="orders")
    berries = models.ManyToManyField(
        "berries.Berry", verbose_name=_("berries"))
    bill_uuid = models.UUIDField(
        _("bill UUID"), default=uuid.uuid4(), editable=False)

    @property
    def amount(self):
        # TODO: calculate total order amount values (django-money)
        return 1.00

    def save(self, **kwargs):
        # Invoice a bill
        client = QIWIAPIClient()
        client.invoice_bill(self.bill_uuid, self.amount, comment=f"Bill for order #{self.pk}")

        super().save(**kwargs)

    class Meta:
        verbose_name = _("order")
        verbose_name_plural = _("orders")

    def __str__(self):
        return f"Order #{self.pk}"

    def get_absolute_url(self):
        return reverse("order_detail", kwargs={"pk": self.pk})
