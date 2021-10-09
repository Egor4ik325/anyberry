from rest_framework import routers

from .views import OrdersViewSet

router = routers.DefaultRouter()
router.register("orders", OrdersViewSet)
urlpatterns = router.urls
