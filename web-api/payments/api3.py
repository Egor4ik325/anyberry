"""
API for interacting with the QIWI.
"""
import urllib.parse
from pprint import pprint
from uuid import uuid4

import requests

WALLET_BALANCE_URL = "/funding-sources/v2/persons/{person_id}/accounts"


def get_profile(token):
    s = requests.Session()
    s.headers["Accept"] = "application/json"
    s.headers["Authorization"] = f"Bearer {token}"
    profile = s.get(
        f"{API_ORIGIN}/person-profile/v1/profile/current?authInfoEnabled=true&contactInfoEnabled=true&userInfoEnabled=true")
    return profile.json()


def get_wallet_balance(token):
    s = requests.Session()
    s.headers["accept"] = "application/json"
    s.headers["authorization"] = f"Bearer {token}"
    balance = s.get(
        API_ORIGIN + WALLET_BALANCE_URL.format(person_id="79516604259"))
    return balance.json()


def create_p2p_key_pair(token):
    with requests.Session() as s:
        s.headers["accept"] = "application/json"
        s.headers["authorization"] = f"Bearer {token}"
        keys = s.post(f"{API_ORIGIN}/widgets-api/api/p2p/protected/keys/create",
                      json={"keysPairName": "Anyberry"})
        if keys.ok:
            return keys.json()
        else:
            return keys.content


def get_bill_list(token):
    with requests.Session() as s:
        s.headers["accept"] = "application/json"
        s.headers["authorization"] = f"Bearer {token}"
        url = f"{API_ORIGIN}/checkout-api/api/bill/search"
        payload = {
            "statuses": "READY_FOR_PAY",
            "rows": 50,
        }
        bills = s.get(url, params=payload)

    if bills.ok:
        return bills.json()
    else:
        return bills.content

# Invoice a bill


def make_bill_form(public_key, phone, amount):
    base_url = "https://oplata.qiwi.com/create?"
    parametors = {
        "publicKey": public_key,
        # "amount": 100,
        # "phone": phone,
    }
    return base_url + urllib.parse.urlencode(parametors)


def invoice_bill(secret_key):
    billid = uuid4()
    base_url = f"https://api.qiwi.com/partner/bill/v1/bills/{billid}"
    # s = requests.Session()
    headers = {
        "content-type": "application/json",
        "accept": "application/json",
        "authorization": f"Bearer {secret_key}",
    }
    body = {
        "amount": {
            "currency": "RUB",
            "value": "1.00",
        },
        "comment": "Text P2P bill",
    }
    # base_url = "https://httpbin.org/put"
    bill = requests.put(base_url, headers=headers, json=body)
    bill.raise_for_status()

    return bill.json()


def reject_bill(secret_key, billid):
    base_url = f"https://api.qiwi.com/partner/bill/v1/bills/{billid}/reject"
    headers = {
        "content-type": "application/json",
        "accept": "application/json",
        "authorization": f"Bearer {secret_key}",
    }
    reject = requests.post(base_url, headers=headers)

    reject.raise_for_status()
    return reject.json()


def get_bill_status(secret_key, billid):
    base_url = f"https://api.qiwi.com/partner/bill/v1/bills/{billid}"
    headers = {
        "content-type": "application/json",
        "accept": "application/json",
        "authorization": f"Bearer {secret_key}",
    }
    status = requests.get(base_url, headers=headers)

    status.raise_for_status()
    return status.json()


API_ACCESS_TOKEN = ""

QIWI_P2P_PUBLIC_KEY = ""
QIWI_P2P_SECRET_KEY = ""

if __name__ == "__main__":
    # pprint(get_profile(API_ACCESS_TOKEN))
    # pprint(get_wallet_balance(API_ACCESS_TOKEN))
    # pprint(create_p2p_key_pair(API_ACCESS_TOKEN))
    # pprint(get_bill_list(API_ACCESS_TOKEN))
    # print(make_bill_form(QIWI_P2P_PUBLIC_KEY, "+79516604259", 100))
    # pprint(invoice_bill(QIWI_P2P_SECRET_KEY))
    # pprint(reject_bill(QIWI_P2P_SECRET_KEY,
    #        "d9b1ca6f-a450-41fb-8b89-cd7d7ed25863"))
    # pprint(get_bill_status(QIWI_P2P_SECRET_KEY, "7c750c81-18e7-4821-be14-3b2552a679eb"))
