from rest_framework.routers import Route, DynamicRoute, SimpleRouter

# from .views import ShoppingCartViewSet
from .views import ShoppingCartBerriesViewSet


class CartBerriesRouter(SimpleRouter):
    """
    A router for berries in user cart.
    """
    # API routes
    routes = [
        # List operation route
        Route(
            url=r'^{prefix}{trailing_slash}$',
            mapping={
                'get': 'list',
                'delete': 'clear',
                'post': 'order',
            },
            name='{basename}-list',
            detail=False,
            initkwargs={'suffix': 'List'}
        ),
        # Detail route.
        Route(
            url=r'^{prefix}/{lookup}{trailing_slash}$',
            mapping={
                'post': 'add',
                'delete': 'remove',
            },
            name='{basename}-detail',
            detail=True,
            initkwargs={'suffix': 'Instance'}
        ),
    ]


router = CartBerriesRouter()

# Route for request.user shopping cart
router.register(
    prefix=r'cart', viewset=ShoppingCartBerriesViewSet, basename='cart-berry')

urlpatterns = router.urls
