"""Verify what characters actually appear in the field."""
import sys, os, time, subprocess
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

os.environ["SERVER"] = r"\\192.168.0.3\VQPBOS"
os.environ["SERVERPC"] = r"\\192.168.0.3"
os.environ["REG"] = "01"
os.environ["winvqpdebug"] = "2"

proc = subprocess.Popen([r"D:\winvqp93\WINVQP93.exe"], cwd=r"D:\winvqp93")
time.sleep(10)

import pyautogui, pytesseract
from PIL import Image
pyautogui.FAILSAFE = True

from utils.coords import ALL_KEYS, MANAGER_CODE_FIELD, PASSWORD_FIELD, NUMPAD

def ocr_small(rx, ry, rw, rh, label):
    im = pyautogui.screenshot(region=(rx, ry, rw, rh))
    text = pytesseract.image_to_string(im, config='--psm 7 --oem 3 -c tessedit_char_whitelist=0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz').strip()
    print(f"  [{label}] OCR: '{text}'")
    return text

def snap(name):
    path = f"E:\\opencode\\winvqp-tests\\assets\\screenshots\\{name}.png"
    os.makedirs(os.path.dirname(path), exist_ok=True)
    pyautogui.screenshot(path)
    print(f"  Screenshot: {path}")

# Step 1: Empty field
print("=== Step 1: Empty Manager Code field ===")
ocr_small(220, 325, 120, 30, "code_field_empty")

# Step 2: Click field and type "8"
print("\n=== Step 2: Click field and type '8' ===")
pyautogui.click(*MANAGER_CODE_FIELD, duration=0.2)
time.sleep(0.3)
pyautogui.click(*NUMPAD["8"], duration=0.15)
time.sleep(0.5)
ocr_small(220, 325, 120, 30, "field_after_1_char")
snap("verify_char_1")

# Step 3: Type another "8"
print("\n=== Step 3: Type another '8' ===")
pyautogui.click(*NUMPAD["8"], duration=0.15)
time.sleep(0.5)
ocr_small(220, 325, 120, 30, "field_after_2_chars")

# Step 4: Try clicking a different position
print("\n=== Step 4: Clear and try again ===")
pyautogui.click(*MANAGER_CODE_FIELD, duration=0.2)
time.sleep(0.3)
# Delete any existing text
pyautogui.click(*ALL_KEYS["9"], duration=0.15)  # force some action
time.sleep(0.3)
pyautogui.click(*MANAGER_CODE_FIELD, duration=0.2)
time.sleep(0.3)

# Try clicking "88" manually at different numpad coordinates
for label, coord in [("x1460", (1460, 230)), ("x1520", (1520, 230)), ("x1580", (1580, 230))]:
    print(f"\n  Trying numpad '8' at {coord}:")
    pyautogui.click(coord[0], coord[1], duration=0.15)
    time.sleep(0.3)
    ocr_small(220, 325, 120, 30, f"field_{label}")

# Step 5: Also try QWERTY keys
print("\n=== Step 5: Try QWERTY '8' ===")
if "8" in ALL_KEYS:
    pyautogui.click(*ALL_KEYS["8"], duration=0.15)
    time.sleep(0.3)
    ocr_small(220, 325, 120, 30, "field_qwerty_8")

snap("verify_char_final")

proc.terminate()
proc.wait()
print("\nDone!")
