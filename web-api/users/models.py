from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.dispatch import receiver
from allauth.account.signals import email_confirmed 

@receiver(email_confirmed)
def email_confirmed_(request, email_address, **kwargs):
    """Set user.email_verified attribute to True when email has been confirmed."""
    user = email_address.user
    user.email_verified = True
    user.save()

class CustomUser(AbstractUser):
    """
    Custom user model for user authentication.
    Email is required and must be unique.
    """
    email = models.EmailField(
        _('email address'),
        unique=True,
        help_text=_('User email for account verification.'),
        error_messages={
            'unique': _("You have already created an account. Please sign-in."),
        },
    )

    def __str__(self):
        """Present users by username."""
        return self.username