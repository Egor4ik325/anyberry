import json

from celery.result import AsyncResult


def serialize_task(task: AsyncResult) -> dict:
    return {
        "id": task.id,
        "status": task.status,
        "date_done": task.date_done,
        "result": task.result if is_json_serializable(task.result) else str(task.result),
    }


def is_json_serializable(result) -> bool:
    try:
        json.dumps(result)
        return True
    except (TypeError, OverflowError):
        return False
