from rest_framework import serializers

from .models import CustomUser

class CustomUserSerializer(serializers.ModelSerializer):
    """Convert user model to JSON for API."""
    class Meta:
        model = CustomUser
        fields = ('email', 'username',)