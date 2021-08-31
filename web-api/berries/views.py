from rest_framework import viewsets

from .serializers import BerrySerializer
from .models import Berry

class BerryView(viewsets.ModelViewSet):
    """Berry API view/presentation."""
    serializer_class = BerrySerializer
    queryset = Berry.berries.all()