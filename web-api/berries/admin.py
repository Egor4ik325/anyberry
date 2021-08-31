from django.contrib import admin

from .models import Berry

class BerryAdmin(admin.ModelAdmin):
    """Admin interface for Berry model."""
    list = ('title', 'description',)

admin.site.register(Berry, BerryAdmin)