# Import celery app when Django automatically when Django starts*
# * when the file is imported it is automatically executed in Python
# * so this will trigger Celery application creation
from .celery import app as celery_app

# Used for convenient referencing (importing)
__all__ = ("celery_app",)
