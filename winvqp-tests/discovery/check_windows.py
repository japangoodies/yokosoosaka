"""List all visible top-level windows."""
import pywinauto
from pywinauto import Desktop
d = Desktop(backend="win32")
for w in d.windows(top_level_only=True):
    rect = w.rectangle()
    if rect.width() > 0 and rect.height() > 0:
        text = w.window_text().strip()
        cls = w.class_name()
        if text or cls not in ("Shell_TrayWnd", "DV2ControlHost", "WorkerW"):
            print(f"class={cls} text=\"{text[:80]}\" rect=({rect.left},{rect.top},{rect.width()}x{rect.height()}) enabled={w.is_enabled()}")
