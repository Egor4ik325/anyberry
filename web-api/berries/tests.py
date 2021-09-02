from django.test import TestCase, TransactionTestCase
from django.db.utils import IntegrityError
from django.core.exceptions import ValidationError

from djmoney.money import Money

from .models import Berry


class BerryModelTests(TransactionTestCase):
    """Assert model validation and consistancy."""

    def test_validators(self):
        berry = Berry.berries.create(
            title="Very Nice Strawberry", quantity=2, price=Money(10), weight=1)

        # Assert not possible to put negative number into PositiveIntegerField
        with self.assertRaises(IntegrityError):
            berry = Berry.berries.create(
                title="Very Nice Strawberry", quantity=-1, price=Money(10), weight=2)

        # Assert model weigth field validators is working
        with self.assertRaises(ValidationError):
            berry = Berry.berries.create(
                title="Very Nice Strawberry", quantity=25, price=Money(7), weight=-5)
            # Validate instance
            berry.full_clean()