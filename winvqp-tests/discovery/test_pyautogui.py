"""Test using pyautogui for real mouse clicks on virtual keyboard."""

import subprocess, time, os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from pywinauto import Desktop
import pyautogui
import pytesseract
from PIL import Image

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
pyautogui.PAUSE = 0.5
pyautogui.FAILSAFE = True

env = os.environ.copy()
env["SERVER"] = r"\\192.168.0.3\VQPBOS"
env["SERVERPC"] = r"\\192.168.0.3"
env["REG"] = "01"
env["winvqpdebug"] = "2"

proc = subprocess.Popen(
    [r"D:\winvqp93\WINVQP93.exe"],
    cwd=r"D:\winvqp93",
    env=env
)
time.sleep(10)

win = Desktop(backend="win32").window(class_name="vqpmain")

def ocr():
    return pytesseract.image_to_string(
        win.capture_as_image(), config="--psm 6"
    )

print("=== pyautogui Click Test ===\n")
print("1. Initial:")
print(ocr()[:200])

# Try clicking on Manager Code field area with pyautogui
# The window is fullscreen at (0,0,1920,1080)
# Manager Code label is at ~(449,331) to (558,345)
# Field is likely to the right or below

print("\n2. Clicking Manager Code field with pyautogui...")
pyautogui.click(620, 350)
time.sleep(1)
print(ocr()[:200])

# Try clicking the number 1 key on the virtual keyboard
# The number pad on the right side
# Let me try various positions
print("\n3. Clicking number pad area...")
for label, x, y in [
    ("key-1", 1518, 420),
    ("key-2", 1580, 420),
    ("key-3", 1640, 420),
    ("key-4", 1518, 320),
    ("key-5", 1580, 320),
    ("key-6", 1640, 320),
    ("key-7", 1518, 220),
    ("key-8", 1580, 220),
    ("key-9", 1640, 220),
]:
    pyautogui.click(x, y)
    time.sleep(0.3)

time.sleep(1)
txt = ocr()
print(f"After number pad: {txt[:200]}")

# Try QWERTY keyboard
print("\n4. Clicking Q key at (221, 610)...")
pyautogui.click(221, 610)
time.sleep(1)
print(ocr()[:200])

# Try "=>" button
print("\n5. Clicking => at (1700, 853)...")
pyautogui.click(1700, 853)
time.sleep(2)
print(ocr()[:500])

proc.terminate()
proc.wait()
print("\nDone")
