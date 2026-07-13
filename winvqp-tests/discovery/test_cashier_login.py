"""Try logging in as CASHIER (01) instead of MANAGER (88)."""
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

def type_text(text):
    for ch in text:
        if ch in NUMPAD:
            pyautogui.click(*NUMPAD[ch], duration=0.08)
        elif ch.upper() in ALL_KEYS:
            pyautogui.click(*ALL_KEYS[ch.upper()], duration=0.08)
        time.sleep(0.1)

def ocr_section(rx, ry, rw, rh, label):
    im = pyautogui.screenshot(region=(rx, ry, rw, rh))
    text = pytesseract.image_to_string(im, config="--psm 6 --oem 3").strip()
    print(f"  [{label}] '{text[:100]}'")
    return text

def snap(name):
    path = f"E:\\opencode\\winvqp-tests\\assets\\screenshots\\{name}.png"
    os.makedirs(os.path.dirname(path), exist_ok=True)
    pyautogui.screenshot(path)

print("=== Initial ===")
snap("cashier_initial")
ocr_section(100, 180, 300, 25, "title")
ocr_section(50, 1045, 700, 35, "status")

# Try login as CASHIER (01) with password 12341234c
print("\n=== Attempt: Cashier 01 login ===")
pyautogui.click(*MANAGER_CODE_FIELD, duration=0.2)
time.sleep(0.5)
type_text("01")
time.sleep(0.3)
ocr_section(150, 300, 600, 150, "after_cashier_id")

pyautogui.click(*PASSWORD_FIELD, duration=0.2)
time.sleep(0.3)
type_text("12341234c")
time.sleep(0.5)
ocr_section(150, 300, 600, 150, "after_cashier_pwd")

# Submit
pyautogui.click(*ALL_KEYS["=>"], duration=0.2)
time.sleep(3)

print("\n=== After cashier login attempt ===")
ocr_section(100, 180, 300, 25, "title")
ocr_section(50, 1045, 700, 35, "status")
ocr_section(150, 300, 600, 150, "form")
snap("cashier_after_login")

# Try with UPPERCASE password
print("\n=== Attempt: Cashier 01 with UPPERCASE password ===")
pyautogui.click(*MANAGER_CODE_FIELD, duration=0.2)
time.sleep(0.5)
type_text("01")
time.sleep(0.3)
pyautogui.click(*PASSWORD_FIELD, duration=0.2)
time.sleep(0.3)
type_text("12341234C")
time.sleep(0.5)
pyautogui.click(*ALL_KEYS["=>"], duration=0.2)
time.sleep(3)
ocr_section(100, 180, 300, 25, "title")
ocr_section(50, 1045, 700, 35, "status")
snap("cashier_after_uppercase")

# Try with empty password (maybe cashier has no password?)
print("\n=== Attempt: Cashier 01 with empty password ===")
pyautogui.click(*MANAGER_CODE_FIELD, duration=0.2)
time.sleep(0.5)
type_text("01")
time.sleep(0.5)
pyautogui.click(*ALL_KEYS["=>"], duration=0.2)
time.sleep(3)
ocr_section(100, 180, 300, 25, "title")
ocr_section(50, 1045, 700, 35, "status")
snap("cashier_no_pwd")

# Try with physical keyboard entirely
print("\n=== Attempt: Physical keyboard, user 01 ===")
pyautogui.click(*MANAGER_CODE_FIELD, duration=0.2)
time.sleep(0.5)
pyautogui.typewrite("01", interval=0.3)
time.sleep(0.5)
pyautogui.press("tab")
time.sleep(0.5)
pyautogui.typewrite("12341234c", interval=0.3)
time.sleep(0.5)
pyautogui.press("enter")
time.sleep(3)
ocr_section(100, 180, 300, 25, "title")
ocr_section(50, 1045, 700, 35, "status")
snap("cashier_physical_kb")

proc.terminate()
proc.wait()
print("\nDone!")
