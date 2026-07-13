"""Test data for WINVQP93 regression tests."""

USERS = {
    "cashier": {
        "id": "01",
        "password": "12341234c",
        "name": "CASHIER",
    },
    "manager": {
        "id": "88",
        "password": "12341234a",
        "name": "MANAGER",
    },
    "invalid": {
        "id": "9999",
        "password": "wrong",
    },
}

ITEMS = {
    "sample_item_1": {
        "code": "1001",
        "desc": "Sample Product 1",
        "price": "25.00",
    },
    "sample_item_2": {
        "code": "1002",
        "desc": "Sample Product 2",
        "price": "50.00",
    },
    "sample_item_3": {
        "code": "1003",
        "desc": "Sample Product 3",
        "price": "75.00",
    },
}

DISCOUNTS = {
    "senior": {"code": "S", "pct": 20},
    "pwd": {"code": "P", "pct": 20},
}

PAYMENT_TYPES = ["CASH", "CARD", "GCASH"]

SHORT_WAIT = 1
MEDIUM_WAIT = 3
LONG_WAIT = 5
