from pages.base_page import BasePage, click, write_text, ocr_text, wait_for_text
from utils.coords import MANAGER_CODE_FIELD, PASSWORD_FIELD, STATUS_BAR_REGION


class LoginPage(BasePage):

    def is_at_login_screen(self):
        text = ocr_text(region=STATUS_BAR_REGION)
        return "Ready" in text

    def login(self, user_id, password):
        click(*MANAGER_CODE_FIELD)
        self.wait(0.3)

        write_text(user_id)
        self.wait(0.3)

        click(*PASSWORD_FIELD)
        self.wait(0.3)

        if password:
            write_text(password)
            self.wait(0.3)

        from utils.coords import ALL_KEYS
        click(*ALL_KEYS["=>"])
        self.wait(2)

        return True
