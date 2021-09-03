from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import ugettext_lazy as _

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
        """Present users by email adress."""
        return self.email