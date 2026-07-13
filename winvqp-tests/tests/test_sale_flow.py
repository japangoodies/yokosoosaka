"""Proof-of-concept: Login -> Add items -> Cash payment -> Verify change."""

import pytest
from pages.login_page import LoginPage
from data.test_data import USERS, ITEMS


class TestSaleFlow:

    def test_login_cashier(self, app, main_window):
        login = LoginPage(app)
        assert login.is_at_login_screen(), "Not at login screen"
        login.login(USERS["cashier"]["id"], USERS["cashier"]["password"])
        login.wait(2)
