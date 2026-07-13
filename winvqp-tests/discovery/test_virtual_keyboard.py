"""Test the virtual keyboard by clicking on buttons."""

import subprocess, time, os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from pywinauto import Desktop
import pytesseract
from PIL import Image

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

env = os.environ.copy()
env["SERVER"] = r"\\192.168.0.3\VQPBOS"
env["SERVERPC"] = r"\\192.168.0.3"
env["REG"] = "01"
env["winvqpdebug"] = "2"

proc = subprocess.Popen(
    [r"D:\winvqp93\WINVQP93.exe"],
    cwd=r"d:\winvqp93",
    env=env
)
time.sleep(10)

win = Desktop(backend="win32").window(class_name="vqpmain")

def ocr():
    return pytesseract.image_to_string(
        win.capture_as_image(), config="--psm 6"
    )

def click(x, y):
    win.click_input(coords=(x, y))
    time.sleep(0.5)

print("=== Virtual Keyboard Test ===\n")

print("1. Initial screen:")
print(ocr()[:300])
print("---")

# Click on Manager Code field (label at ~480,340, field likely to the right)
print("2. Clicking Manager Code field area...")
click(620, 340)
time.sleep(1)
print(ocr()[:300])
print("---")

# Click on number key - try the number pad area on the right
# Using centerX≈1518
print("3. Clicking '8' key at (1518, 230)...")
click(1518, 230)
time.sleep(1)
print(ocr()[:300])
print("---")

print("4. Clicking '5' key at (1518, 327)...")
click(1518, 327)
time.sleep(1)
print(ocr()[:300])
print("---")

# Now try clicking letters on the QWERTY keyboard
print("5. Clicking '1' (number pad, bottom row)...")
# Try where 1,2,3 would be
click(1518, 420)
time.sleep(1)
print(ocr()[:300])
print("---")

print("6. Clicking 'Enter/Confirm' (=>) at (1700, 853)...")
click(1700, 853)
time.sleep(2)
print(ocr()[:500])
print("---")

# Check if we got past login
print("7. Verifying result:")
text = ocr()
if "Manager" in text and "Login" in text:
    print("Still at login screen.")
elif "SALE" in text or "sale" in text:
    print("MOVED TO SALE SCREEN!")
elif "Ready" in text:
    print("Status shows Ready.")
else:
    print("Unknown state:")
    print(text[:500])
print("---")

# Screenshot
out_dir = os.path.dirname(os.path.abspath(__file__))
win.capture_as_image().save(os.path.join(out_dir, "after_login_attempt.png"))

proc.terminate()
proc.wait()
print("Done")
