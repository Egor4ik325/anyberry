"""
QIWI P2P API integration library.
"""
from .client import Bill, QIWIAPIClient

client = QIWIAPIClient()

__all__ = [client, Bill]
