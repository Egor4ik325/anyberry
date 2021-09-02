from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator

from djmoney.models.fields import MoneyField
from djmoney.models.validators import MinMoneyValidator
from djmoney.models.managers import money_manager
from djmoney.money import Money


def get_berry_image_path(instance, filename):
    return f'images/{filename}'


class Berry(models.Model):
    """Model representing berry product that is being sell on the website."""
    title = models.CharField(_("Title"), max_length=50,
                             help_text=_("What will be product title?"))
    description = models.TextField(
        _("Description"), blank=True, help_text=_("Describe product."))
    image = models.ImageField(_("Image"), upload_to=get_berry_image_path,
                              height_field='image_height', width_field='image_width', max_length=None, blank=True)
    image_width = models.IntegerField(verbose_name=_(
        'Image width'), null=True, editable=False)
    image_height = models.IntegerField(verbose_name=_(
        'Image height'), null=True, editable=False)

    quantity = models.PositiveIntegerField(_("Quantity"))
    price = MoneyField(
        _("Price"),
        max_digits=10,
        decimal_places=2,
        validators=[MinMoneyValidator(0)],
        help_text=_("Enter price of 1 unit in RUB"),
    )
    weight = models.FloatField(
        _("Weight"),
        validators=[MinValueValidator(0)],
        help_text=_("Enter weight of 1 unit in kilogramms."),
    )

    berries = money_manager(models.Manager())

    class Meta:
        verbose_name_plural = 'berries'

    def clean(self):
        """Multi-field model consistancy validation."""

    def __str__(self):
        """Berry product string representation."""
        return self.title
