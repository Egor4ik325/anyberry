from rest_framework import routers

from .views import BerryViewSet

router = routers.DefaultRouter()
router.register(r'berries', BerryViewSet)

urlpatterns = router.urls
