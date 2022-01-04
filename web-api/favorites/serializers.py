from berries.models import Berry
from rest_framework import serializers, validators


class FavoriteDeserializer(serializers.Serializer):
    """Validate and clean user data."""

    berry = serializers.PrimaryKeyRelatedField(queryset=Berry.berries.all())

    def create(self, validated_data) -> Berry:
        """Create favorite berry from passed berry (just output validated berry id)."""
        return validated_data["berry"]
