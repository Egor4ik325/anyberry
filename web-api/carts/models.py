from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.translation import ugettext_lazy as _

from users.models import CustomUser


class ShoppingCart(models.Model):
    """User shopping cart with added berries."""
    user = models.OneToOneField("users.CustomUser", verbose_name=_("user"), on_delete=models.CASCADE, related_name='cart')
    berries = models.ManyToManyField("berries.Berry", verbose_name=_("berries"))

    def __str__(self):
        """Present cart."""
        if self.user:
            return f"{self.user.username} shopping cart"


@receiver(post_save, sender=CustomUser)
def create_user_cart(sender, instance, created, **kwargs):
    """Automatically create shopping cart for new user."""
    if created:
        if not hasattr(instance, 'cart'):
            ShoppingCart.objects.create(user=instance)
