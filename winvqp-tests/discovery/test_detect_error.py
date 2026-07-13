"""Try to detect error messages after login failure, and try alternative approaches."""
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

def ocr_region(rx, ry, rw, rh, label):
    im = pyautogui.screenshot(region=(rx, ry, rw, rh))
    text = pytesseract.image_to_string(im, config='--psm 6 --oem 3').strip()
    print(f"  [{label}] OCR: '{text[:120]}'")
    return text

def snap(name, rx=0, ry=0, rw=1920, rh=1080):
    im = pyautogui.screenshot(region=(rx, ry, rw, rh))
    path = f"E:\\opencode\\winvqp-tests\\assets\\screenshots\\{name}.png"
    os.makedirs(os.path.dirname(path), exist_ok=True)
    im.save(path)
    return im

def click_and_check(x, y, desc):
    pyautogui.click(x, y, duration=0.2)
    time.sleep(0.3)

def type_keys(text):
    for ch in text:
        k = ch.upper()
        if k in ALL_KEYS:
            pyautogui.click(*ALL_KEYS[k], duration=0.08)
            time.sleep(0.1)
        elif ch == ' ':
            pyautogui.click(*ALL_KEYS['spacebar'], duration=0.08)
            time.sleep(0.1)

print("=== Initial state OCR ===")
ocr_region(0, 0, 1920, 120, "title_bar")
ocr_region(150, 280, 600, 180, "login_form")
ocr_region(50, 1020, 500, 60, "status_bar")

print("\n=== Try 1: Submit empty form (click =>) ===")
click_and_check(*ALL_KEYS["=>"], "submit")
time.sleep(2)
snap("error_empty_submit")
ocr_region(300, 280, 600, 400, "center_after_empty_submit")
ocr_region(50, 1020, 500, 60, "status_after_empty_submit")

print("\n=== Try 2: Fill in code field, leave password empty ===")
click_and_check(*MANAGER_CODE_FIELD, "click_code")
type_keys("88")
time.sleep(0.5)
click_and_check(*ALL_KEYS["=>"], "submit_code_only")
time.sleep(2)
snap("error_code_only")
ocr_region(300, 280, 600, 400, "center_after_code_only")
ocr_region(50, 1020, 500, 60, "status")

print("\n=== Try 3: Fill both fields properly ===")
click_and_check(*MANAGER_CODE_FIELD, "click_code")
type_keys("88")
time.sleep(0.3)
click_and_check(*PASSWORD_FIELD, "click_pwd")
type_keys("12341234a")
time.sleep(0.5)
snap("before_full_submit")
ocr_region(150, 280, 600, 180, "form_before_submit")

click_and_check(*ALL_KEYS["=>"], "submit_full")
time.sleep(3)

print("\n=== After full submit ===")
snap("after_full_submit")
ocr_region(0, 0, 1920, 120, "title_bar")
ocr_region(150, 280, 600, 180, "login_form")
ocr_region(50, 1020, 500, 60, "status_bar")

# Also try checking the center area where error might appear
ocr_region(400, 400, 400, 100, "error_center")
ocr_region(300, 500, 600, 200, "error_lower_center")

print("\n=== Try 4: Click 'Enter' with keyboard ===")
click_and_check(*MANAGER_CODE_FIELD, "click_code")
type_keys("88")
time.sleep(0.3)
click_and_check(*PASSWORD_FIELD, "click_pwd") 
type_keys("12341234a")
time.sleep(0.5)
pyautogui.press("enter")
time.sleep(3)
snap("after_enter_key")
ocr_region(150, 280, 600, 180, "form_after_enter")
ocr_region(50, 1020, 500, 60, "status_after_enter")

proc.terminate()
proc.wait()
print("\nDone!")
