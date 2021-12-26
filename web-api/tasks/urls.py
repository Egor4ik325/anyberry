from django.urls import re_path

from .views import task_detail_view

urlpatterns = [
    re_path(r"^tasks/(?P<task_id>\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b)/$",
            task_detail_view, name="tasks-detail"),
]
