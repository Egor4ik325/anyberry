from rest_framework import generics

from .models import CustomUser
from .serializers import CustomUserSerializer


class CustomUserListView(generics.ListAPIView):
    """List all users from API."""
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
