"""
QIWI API Python client library.
"""
from __future__ import annotations

import requests
from django.conf import settings

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

    def __init__(self):
        base_headers = {
            "content-type": "application/json",
            "accept": "application/json",
            "authorization": f"Bearer {self.secret_key}",
        }
        self.session = requests.Session()
        self.session.headers = base_headers  # type: ignore

    def invoice_bill(self, bill_id: str, amount_value, amount_currency="RUB", comment="Berry bill"):
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

    def reject_bill(self, bill_id):
        pass

    def get_bill(self):
        pass
