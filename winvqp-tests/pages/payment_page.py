from pages.base_page import BasePage


class PaymentPage(BasePage):

    @property
    def amount_input(self):
        """Amount tendered input field"""
        edits = self.find_child_by_class("Edit")
        return edits[0] if edits else None

    @property
    def cash_button(self):
        btn = self.find_child_by_text("Cash", "Button")
        if btn:
            return btn
        btn = self.find_child_by_text("F1", "Button")
        if btn:
            return btn
        return None

    @property
    def card_button(self):
        btn = self.find_child_by_text("Card", "Button")
        if btn:
            return btn
        btn = self.find_child_by_text("Credit", "Button")
        if btn:
            return btn
        return None

    @property
    def complete_button(self):
        btn = self.find_child_by_text("Complete", "Button")
        if btn:
            return btn
        btn = self.find_child_by_text("Enter", "Button")
        if btn:
            return btn
        btn = self.find_child_by_text("OK", "Button")
        if btn:
            return btn
        btn = self.find_child_by_text("Confirm", "Button")
        return btn

    @property
    def change_display(self):
        """Change due text"""
        for child in self.main_window.children():
            try:
                text = child.window_text()
                if "CHANGE" in text.upper() or "CHANGE DUE" in text.upper():
                    return child
            except Exception:
                continue
        return None

    def select_cash(self):
        if self.cash_button:
            self.click(self.cash_button)
            self.wait(1)
            return True
        self.main_window.type_keys("{F1}")
        self.wait(1)
        return True

    def enter_amount(self, amount):
        inp = self.amount_input
        if inp:
            self.type_keys(inp, amount)
            self.wait(0.3)

    def click_complete(self):
        if self.complete_button:
            self.click(self.complete_button)
            self.wait(1)
            return True
        self.amount_input.type_keys("{ENTER}")
        self.wait(1)
        return True

    def verify_change(self, expected):
        txt = self.get_change_text()
        print(f"  [Change display says: {txt}]")
        return expected in txt

    def get_change_text(self):
        if self.change_display:
            return self.get_text(self.change_display)
        return self.main_window.window_text()
