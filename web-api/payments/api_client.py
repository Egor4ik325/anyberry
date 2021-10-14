"""
QIWI P2P API and QIWI wallet API client.
"""
import requests
from django.conf import settings

API_ORIGIN = "https://edge.qiwi.com"
P2P_API_ORIGIN = "https://api.qiwi.com"


class QIWIAPIClient:
    """Singleton class for QIWI API."""
    api_token = settings.QIWI_API_TOKEN
    public_key = settings.QIWI_P2P_PUBLIC_KEY
    secret_key = settings.QIWI_P2P_SECRET_KEY

    def __init__(self):
        pass

    def invoice_bill(self, billid, amount_value, amount_currency="RUB", comment="Bill"):
        base_url = f"{P2P_API_ORIGIN}/partner/bill/v1/bills/{billid}"
        headers = {
            "content-type": "application/json",
            "accept": "application/json",
            "authorization": f"Bearer {self.secret_key}",
        }
        body = {
            "amount": {
                "currency": amount_currency,
                "value": amount_value,
            },
            "comment": comment,
        }
        bill = requests.put(base_url, headers=headers, json=body)

        if bill.status_code != 200:
            print(bill.content)
            bill.raise_for_status()
        return bill.json()
