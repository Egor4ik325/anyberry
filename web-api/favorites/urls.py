from django.urls import path

from .views import favorite_detail_view, favorite_list_view

# As in reusable app favorite prefix can be customized
urlpatterns = [
    path("", favorite_list_view, name="favorite-list"),
    path("<int:berry_id>/", favorite_detail_view, name="favorite-detail"),
]
