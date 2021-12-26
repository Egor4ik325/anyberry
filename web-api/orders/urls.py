from django.urls import path
from rest_framework import routers

from .views import OrdersViewSet, qiwi_callback_view

router = routers.DefaultRouter()
router.register("orders", OrdersViewSet)
urlpatterns = router.urls

urlpatterns += [
    path("qiwi/callback/", qiwi_callback_view, name="qiwi_callback"),
]
