import os

from celery import Celery

# Same as in manage.py (before runserver is executed)
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "anyberry.settings")

app = Celery("anyberry")
app.config_from_object("django.conf:settings", namespace="CELERY")

# Finds Celery tasks in tasks.py (in reusable apps, from Django apps)
app.autodiscover_tasks()
