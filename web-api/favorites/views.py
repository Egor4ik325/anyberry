from berries.models import Berry
from berries.serializers import BerrySerializer
from django.core.cache import cache
from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet

from favorites import serializers
from favorites.serializers import FavoriteDeserializer


class FavoriteViewSet(ViewSet):
    """
    API view for CARRL berries from the favorite list.

    List of favorite berries is stored in the Redis datastore and
    references some (FK) user.
    """

    cache_format = "favorite_{user}"
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def list(self, *args, **kwargs):
        """List berries in the favorite list.

        List consist only of unique berries.
        """
        # Get favorite berries from the Redis (cache)
        berries = cache.get(self.get_cache_key(), default=set())
        data = list(berries)
        return Response(data)

    def clear(self, *args, **kwargs):
        """Clear berries in the favorite list."""
        cache.delete(self.get_cache_key())
        return Response(status=status.HTTP_204_NO_CONTENT)

    def add(self, *args, **kwargs):
        """Add berry to the favorite list.

        //This has no effect if the element is already present.
        """
        serializer = FavoriteDeserializer(data=self.request.data)
        serializer.is_valid(raise_exception=True)
        berry = serializer.save()

        berries: set = cache.get(self.get_cache_key(), default=set())
        berries.add(berry.id)
        cache.set(self.get_cache_key(), berries, timeout=None)

        return Response(status=status.HTTP_201_CREATED)

    def remove(self, *args, **kwargs):
        """Remove berry from the favorite list."""
        berry_id = self.kwargs["berry_id"]
        berry = Berry.berries.get(id=berry_id)

        berries: set = cache.get(self.get_cache_key(), default=set())
        try:
            berries.remove(berry.id)
        except KeyError:
            pass
        cache.set(self.get_cache_key(), berries, timeout=None)

        return Response(status=status.HTTP_204_NO_CONTENT)

    def get_cache_key(self):
        return self.cache_format.format(user=self.request.user.id)


favorite_list_view = FavoriteViewSet.as_view(
    {"get": "list", "post": "add", "delete": "clear"})
favorite_detail_view = FavoriteViewSet.as_view(
    {"delete": "remove"})
