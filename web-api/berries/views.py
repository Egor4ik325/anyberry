from rest_framework.viewsets import ReadOnlyModelViewSet

from .serializers import BerrySerializer
from .models import Berry

class BerryViewSet(ReadOnlyModelViewSet):
    """Berry API view/presentation (READONLY)."""
    serializer_class = BerrySerializer
    queryset = Berry.berries.all()