from pages.base_page import BasePage


class SalePage(BasePage):

    @property
    def item_code_input(self):
        """Usually the main input field where you scan/type item codes"""
        edits = self.find_child_by_class("Edit")
        return edits[0] if edits else None

    @property
    def qty_input(self):
        edits = self.find_child_by_class("Edit")
        return edits[1] if len(edits) > 1 else None

    @property
    def sale_list(self):
        """ListView showing items in current transaction"""
        lists = self.find_child_by_class("SysListView32")
        return lists[0] if lists else None

    @property
    def total_display(self):
        """Static text showing the transaction total"""
        for child in self.main_window.children():
            try:
                text = child.window_text()
                if any(kw in text for kw in ["TOTAL", "Total", "Amount Due", "PHP", "P"]):
                    return child
            except Exception:
                continue
        return None

    @property
    def payment_button(self):
        btn = self.find_child_by_text("Payment", "Button")
        if btn:
            return btn
        btn = self.find_child_by_text("F10", "Button")
        if btn:
            return btn
        btn = self.find_child_by_text("Tender", "Button")
        if btn:
            return btn
        return None

    @property
    void_button(self):
        btn = self.find_child_by_text("Void", "Button")
        if btn:
            return btn
        btn = self.find_child_by_text("Cancel", "Button")
        return btn

    def add_item(self, item_code, qty=1):
        inp = self.item_code_input
        if not inp:
            raise Exception("Cannot find item code input field")
        if qty and qty > 1:
            self.type_keys(inp, str(qty))
            try:
                inp.type_keys("{MULTIPLY}")
            except Exception:
                pass
        self.type_keys(inp, item_code, with_enter=True)
        self.wait(0.5)

    def verify_item_in_list(self, item_code):
        lst = self.sale_list
        if not lst:
            return False
        try:
            for row in lst.texts():
                if item_code in row:
                    return True
        except Exception:
            pass
        return False

    def get_total_text(self):
        if self.total_display:
            return self.get_text(self.total_display)
        return ""

    def click_payment(self):
        if self.payment_button:
            self.click(self.payment_button)
            self.wait(1)
            return True
        try:
            self.main_window.type_keys("{F10}")
            self.wait(1)
            return True
        except Exception:
            pass
        return False
