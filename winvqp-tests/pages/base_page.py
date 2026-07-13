import os
import subprocess
import time
import pyautogui
import pytesseract
from PIL import Image
from pywinauto import Desktop
from io import BytesIO

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

WINVQP_DIR = r"D:\winvqp93"
APP_TITLE = " W I N V Q P  version 9.3 for FASTFOOD"
APP_TITLE_CLASS = "vqpmain"
APP_EXE = os.path.join(WINVQP_DIR, "WINVQP93.exe")
SCREENSHOT_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "assets", "screenshots"
)

pyautogui.FAILSAFE = True


def launch_app():
    env = os.environ.copy()
    env["SERVER"] = r"\\192.168.0.3\VQPBOS"
    env["SERVERPC"] = r"\\192.168.0.3"
    env["REG"] = "01"
    env["winvqpdebug"] = "2"

    if not os.path.exists(APP_EXE):
        raise FileNotFoundError(f"Cannot find {APP_EXE}.")

    main_proc = subprocess.Popen([APP_EXE], cwd=WINVQP_DIR, env=env)
    time.sleep(8)
    return main_proc


def get_main_window(timeout=20):
    wins = Desktop(backend="win32").windows(class_name=APP_TITLE_CLASS)
    if not wins:
        raise RuntimeError(f"No window with class '{APP_TITLE_CLASS}' found")
    return wins[0]


def click(x, y, duration=0.1):
    pyautogui.click(x, y, duration=duration)


def write_text(text):
    """Type text using virtual keyboard clicks."""
    from utils.coords import ALL_KEYS
    for ch in text.upper():
        key = ch.upper()
        if key in ALL_KEYS:
            cx, cy = ALL_KEYS[key]
            click(cx, cy)
            time.sleep(0.15)
        else:
            raise ValueError(f"No key mapping for '{ch}'")


def ocr_text(region=None):
    """Extract text from screen (optionally within a region)."""
    screenshot = pyautogui.screenshot(region=region)
    text = pytesseract.image_to_string(screenshot, config="--psm 6").strip()
    return text


def wait_for_text(text, region=None, timeout=10, interval=0.5):
    """Wait until text appears on screen (via OCR)."""
    for _ in range(int(timeout / interval)):
        found = ocr_text(region=region)
        if text.lower() in found.lower():
            return True
        time.sleep(interval)
    return False


class BasePage:

    def __init__(self, app):
        self.app = app
        self.main_window = get_main_window()

    def wait(self, seconds=1):
        time.sleep(seconds)

    def screenshot(self, name):
        os.makedirs(SCREENSHOT_DIR, exist_ok=True)
        path = os.path.join(SCREENSHOT_DIR, f"{name}.png")
        try:
            self.main_window.capture_as_image().save(path)
        except Exception as e:
            print(f"  [Screenshot failed: {e}]")
        return path
