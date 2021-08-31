from rest_framework import serializers

from .models import Berry


class BerrySerializer(serializers.ModelSerializer):
    """Convert ORM model into JSON, and vice-versa."""

    class Meta:
        model = Berry
        fields = ('id', 'title', 'description',)