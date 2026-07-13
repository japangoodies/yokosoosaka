"""Read status bar changes after login attempt."""
import sys, os, time, subprocess
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

os.environ["SERVER"] = r"\\192.168.0.3\VQPBOS"
os.environ["SERVERPC"] = r"\\192.168.0.3"
os.environ["REG"] = "01"
os.environ["winvqpdebug"] = "2"

proc = subprocess.Popen([r"D:\winvqp93\WINVQP93.exe"], cwd=r"D:\winvqp93")
time.sleep(10)

import pyautogui, pytesseract
pyautogui.FAILSAFE = True

from utils.coords import ALL_KEYS, MANAGER_CODE_FIELD, PASSWORD_FIELD, NUMPAD

def ocr_status():
    im = pyautogui.screenshot(region=(50, 1045, 700, 35))
    text = pytesseract.image_to_string(im, config='--psm 7 --oem 3').strip()
    print(f"  Status: '{text}'")

def ocr_title():
    im = pyautogui.screenshot(region=(100, 180, 300, 25))
    text = pytesseract.image_to_string(im, config='--psm 7 --oem 3').strip()
    print(f"  Title: '{text}'")

def ocr_center():
    im = pyautogui.screenshot(region=(150, 300, 300, 150))
    text = pytesseract.image_to_string(im, config='--psm 6 --oem 3').strip()
    print(f"  Login form: '{text}'")

def type_text(text):
    for ch in text:
        k = ch.upper()
        if k in ALL_KEYS:
            pyautogui.click(*ALL_KEYS[k], duration=0.08)
            time.sleep(0.15)

print("=== Initial state ===")
ocr_status()
ocr_title()
ocr_center()

print("\n=== After empty submit ===")
pyautogui.click(*ALL_KEYS["=>"], duration=0.2)
time.sleep(2.5)
ocr_status()
ocr_title()
ocr_center()

print("\n=== After login attempt (88 / 12341234a) ===")
pyautogui.click(*MANAGER_CODE_FIELD, duration=0.2)
time.sleep(0.3)
type_text("88")
time.sleep(0.3)
pyautogui.click(*PASSWORD_FIELD, duration=0.2)
time.sleep(0.3)
type_text("12341234a")
time.sleep(0.5)

print("\n  Before submit:")
ocr_status()

pyautogui.click(*ALL_KEYS["=>"], duration=0.2)
time.sleep(3)

print("\n  After submit:")
ocr_status()
ocr_title()
ocr_center()

print("\n=== Try again with lowercase password ===")
pyautogui.click(*MANAGER_CODE_FIELD, duration=0.2)
time.sleep(0.3)
type_text("88")
time.sleep(0.3)
pyautogui.click(*PASSWORD_FIELD, duration=0.2)
time.sleep(0.3)
type_text("12341234a")
time.sleep(0.5)
pyautogui.click(*ALL_KEYS["=>"], duration=0.2)
time.sleep(3)
ocr_status()

print("\n=== Try with just '88' and no password ===")
pyautogui.click(*MANAGER_CODE_FIELD, duration=0.2)
time.sleep(0.3)
type_text("88")
time.sleep(0.5)
pyautogui.click(*ALL_KEYS["=>"], duration=0.2)
time.sleep(2.5)
ocr_status()

print("\n=== Try with spaces around password ===")
pyautogui.click(*MANAGER_CODE_FIELD, duration=0.2)
time.sleep(0.3)
type_text("88")
time.sleep(0.3)
pyautogui.click(*PASSWORD_FIELD, duration=0.2)
time.sleep(0.3)
type_text("12341234a")
time.sleep(0.5)
# Try pressing Enter key instead of => button
import pyautogui as pg
pg.press("enter")
time.sleep(3)
ocr_status()
ocr_title()
ocr_center()

proc.terminate()
proc.wait()
print("\nDone!")
