from django.db import models
from django.utils.translation import gettext_lazy as _

class Berry(models.Model):
    """Model representing berry product that is being sell on the website."""
    title = models.CharField(_("Title"), max_length=50, help_text=_("What will be product title?"))
    description = models.TextField(_("Description"), help_text=_("Describe product."))
    
    berries = models.Manager()

    class Meta:
        verbose_name_plural = 'berries'

    def __str__(self):
        """Berry product string representation."""
        return self.title
