from django.db import models
from django.shortcuts import reverse
from django.utils.translation import gettext_lazy as _


class Order(models.Model):
    user = models.ForeignKey("users.CustomUser", verbose_name=_(
        "user"), on_delete=models.CASCADE, related_name="orders")
    berries = models.ManyToManyField(
        "berries.Berry", verbose_name=_("berries"))

    class Meta:
        verbose_name = _("order")
        verbose_name_plural = _("orders")

    def __str__(self):
        return f"Order #{self.pk}"

    def get_absolute_url(self):
        return reverse("order_detail", kwargs={"pk": self.pk})
