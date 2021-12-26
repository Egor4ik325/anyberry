from celery.result import AsyncResult
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import (api_view, authentication_classes,
                                       permission_classes, schema)
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.schemas import AutoSchema

from tasks.serializers import serialize_task


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
@schema(AutoSchema)
def task_detail_view(request: Request, task_id: str) -> Response:
    # Note: if task doesn't exists it will be null and have PENDING status
    task = AsyncResult(task_id)

    return Response(serialize_task(task))
