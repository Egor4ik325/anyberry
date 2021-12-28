"""
QIWI API Python client library.
"""
from __future__ import annotations

from enum import Enum
from json.decoder import JSONDecodeError
from typing import Literal, TypedDict
from uuid import UUID

import requests
from dateutil.parser import isoparse
from django.conf import settings
from moneyed import Money
from requests.models import HTTPError

from .exceptions import QIWIAPIError

# API module constants
API_ORIGIN = "https://edge.qiwi.com"
P2P_API_ORIGIN = "https://api.qiwi.com"


class QIWIAPIClient:
    """Singleton class for QIWI API."""

    # API configuration class fields
    api_token = settings.QIWI_API_TOKEN
    public_key = settings.QIWI_P2P_PUBLIC_KEY
    secret_key = settings.QIWI_P2P_SECRET_KEY

    endpoints = {
        "get_bill": f"{P2P_API_ORIGIN}/partner/bill/v1/bills/{{bill_id}}",
        "reject_bill": f"{P2P_API_ORIGIN}/partner/bill/v1/bills/{{bill_id}}/reject",
    }

    def __init__(self):
        base_headers = {
            "content-type": "application/json",
            "accept": "application/json",
            "authorization": f"Bearer {self.secret_key}",
        }
        self.session = requests.Session()
        self.session.headers = base_headers  # type: ignore

    def invoice_bill(self, bill_id: str, amount_value, amount_currency="RUB", comment="Berry bill"):
        # TODO: add more parametors (customer id, phone, email + customFields)
        base_url = f"{P2P_API_ORIGIN}/partner/bill/v1/bills/{bill_id}"
        body = {
            "amount": {
                "currency": amount_currency,
                "value": amount_value,
            },
            "comment": comment,
        }

        try:
            response = self.session.put(base_url, json=body)
            response.raise_for_status()
            bill_dict = response.json()
            return bill_dict
        except Exception as e:
            raise QIWIAPIError from e

    def get_bill(self, bill_id: UUID) -> Bill:
        response = self.session.get(
            self.endpoints["get_bill"].format(bill_id=str(bill_id)))

        # Check for exceptions on 4xx, 5xx, 6xx status codes
        try:
            response.raise_for_status()
        except HTTPError as e:
            # TODO: parse body to get as much information about the error as possible
            raise QIWIAPIError from e

        # Check for parsing exceptions
        try:
            bill_dict = response.json()
            return Bill(**bill_dict)
        except JSONDecodeError as e:
            raise QIWIAPIError from e

    def reject_bill(self, bill_id: UUID) -> Bill:
        """Rejects the bill and returns the resulted bill with REJECTED status."""
        response = self.session.post(
            self.endpoints["reject_bill"].format(bill_id=bill_id))

        # Check for client or server errors (provide library client with error feedback)
        try:
            response.raise_for_status()
        except HTTPError as e:
            # TODO: initialize exception based on error response.data
            raise QIWIAPIError() from e

        try:
            bill_dict = response.json()
        except JSONDecodeError as e:
            raise QIWIAPIError("Response was not in JSON file format.") from e

        return Bill(**bill_dict)


class Bill:
    """Bill model

    - coverts bill dictionary (JavaScript object) to Python object.

    1. Unpacks dictionary to kwargs (simplify init object fields accessing)
    """

    class AmountDictType(TypedDict):
        currency: str
        value: str

    class StatusDictType(TypedDict):
        value: StatusValue
        changedDateTime: str

    class Amount(Money):
        """QIWI API amount model"""

        def __init__(self, value: str, currency: str):
            super().__init__(value, currency)

    class Status:
        """QIWI API bill status model."""

        def __init__(self, value: StatusValue, changedDateTime: str):
            self.value = value
            self.changed_date_time = isoparse(changedDateTime)

    def __init__(self, siteId: str, billId: str, amount: Bill.AmountDictType, status: Bill.StatusDictType, comment: str, creationDateTime: str, expirationDateTime: str, payUrl: str, *args, **kwargs):
        self.site_id = siteId
        self.bill_id = UUID(billId)
        self.amount = Bill.Amount(**amount)
        self.status = Bill.Status(**status)
        self.comment = comment
        # datetime.fromiso doesn't support ISO
        self.creation_date_time = isoparse(creationDateTime)
        self.expiration_date_time = isoparse(expirationDateTime)
        self.pay_url = payUrl


class Status(Enum):
    WAITING = "WAITING"
    PAID = "PAID"
    REJECTED = "REJECTED"
    EXPIRED = "EXPIRED"


StatusValue = Literal["WAITING", "PAID", "REJECTED", "EXPIRED"]
