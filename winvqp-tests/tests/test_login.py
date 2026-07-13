"""Login tests for WINVQP93 using coordinate-based interaction."""

import pytest
from pages.login_page import LoginPage
from data.test_data import USERS


class TestLogin:

    def test_at_login_screen(self, app, main_window):
        login = LoginPage(app)
        assert login.is_at_login_screen(), "Not at login screen"

    def test_login_cashier(self, app, main_window):
        login = LoginPage(app)
        assert login.is_at_login_screen()
        login.login(USERS["cashier"]["id"], USERS["cashier"]["password"])
        login.wait(2)

    def test_logout_and_login_manager(self, app, main_window):
        login = LoginPage(app)
        if login.is_at_login_screen():
            login.login(USERS["manager"]["id"], USERS["manager"]["password"])
            login.wait(2)
