"""Test the login flow with coordinate-based clicks."""
import sys, os, time, subprocess
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

os.environ["SERVER"] = r"\\192.168.0.3\VQPBOS"
os.environ["SERVERPC"] = r"\\192.168.0.3"
os.environ["REG"] = "01"
os.environ["winvqpdebug"] = "2"

# Launch app
proc = subprocess.Popen([r"D:\winvqp93\WINVQP93.exe"], cwd=r"D:\winvqp93")
print("Waiting for app to launch...")
time.sleep(10)

import pyautogui
pyautogui.FAILSAFE = True

from utils.coords import MANAGER_CODE_FIELD, PASSWORD_FIELD, NUMPAD, ALL_KEYS
from pages.base_page import ocr_text, get_main_window

win = get_main_window()
win.set_focus()
time.sleep(1)

def screenshot(name):
    path = f"E:\\opencode\\winvqp-tests\\assets\\screenshots\\{name}.png"
    os.makedirs(os.path.dirname(path), exist_ok=True)
    pyautogui.screenshot(path)
    print(f"  Screenshot saved: {path}")
    return path

def ocr_full():
    text = ocr_text()
    print(f"  OCR text: '{text[:100]}...'")
    return text

print("\n=== Step 1: Initial state ===")
screenshot("step1_initial")

print("\n=== Step 2: Click Manager Code field ===")
pyautogui.click(*MANAGER_CODE_FIELD, duration=0.2)
time.sleep(1)
screenshot("step2_after_click_code")

print("\n=== Step 3: Type '88' on number pad ===")
for _ in range(2):
    pyautogui.click(*NUMPAD["8"], duration=0.15)
    time.sleep(0.3)
screenshot("step3_after_typing_88")

print("\n=== Step 4: Click Password field ===")
pyautogui.click(*PASSWORD_FIELD, duration=0.2)
time.sleep(1)
screenshot("step4_after_click_password")

print("\n=== Step 5: Type password '12341234a' ===")
for ch in "12341234a":
    key = ch.upper()
    if key in ALL_KEYS:
        cx, cy = ALL_KEYS[key]
        pyautogui.click(cx, cy, duration=0.15)
        time.sleep(0.2)
    else:
        print(f"  WARNING: No key mapping for '{ch}'")
screenshot("step5_after_typing_password")

print("\n=== Step 6: Click Enter (=>) ===")
pyautogui.click(*ALL_KEYS["=>"], duration=0.2)
time.sleep(3)
screenshot("step6_after_login")

print("\n=== Step 7: Check status ===")
try:
    s = win.child_window(class_name="msctls_statusbar32")
    print(f"  Status bar: '{s.window_text()}'")
except Exception as e:
    print(f"  Status bar error: {e}")

proc.terminate()
proc.wait()
print("\nDone!")
