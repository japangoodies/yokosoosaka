"""Test keyboard mechanism by comparing different interaction methods."""
import sys, os, time, subprocess
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

os.environ["SERVER"] = r"\\192.168.0.3\VQPBOS"
os.environ["SERVERPC"] = r"\\192.168.0.3"
os.environ["REG"] = "01"
os.environ["winvqpdebug"] = "2"

proc = subprocess.Popen([r"D:\winvqp93\WINVQP93.exe"], cwd=r"D:\winvqp93")
time.sleep(10)

import pyautogui
pyautogui.FAILSAFE = True

from utils.coords import ALL_KEYS, MANAGER_CODE_FIELD, PASSWORD_FIELD, NUMPAD

def snap(name):
    path = f"E:\\opencode\\winvqp-tests\\assets\\screenshots\\{name}.png"
    os.makedirs(os.path.dirname(path), exist_ok=True)
    pyautogui.screenshot(path)

def type_via_numpad(text):
    """Type text using numpad keys only."""
    for ch in text:
        if ch in NUMPAD:
            pyautogui.click(*NUMPAD[ch], duration=0.08)
            time.sleep(0.15)
        elif ch in ALL_KEYS:
            pyautogui.click(*ALL_KEYS[ch], duration=0.08)
            time.sleep(0.15)

def type_via_qwerty(text):
    """Type text using QWERTY row keys."""
    for ch in text:
        k = ch.upper()
        if k in ALL_KEYS:
            pyautogui.click(*ALL_KEYS[k], duration=0.08)
            time.sleep(0.15)

# Method 1: Physical keyboard via typewrite
print("=== Method 1: Physical keyboard typewrite ===")
pyautogui.click(*MANAGER_CODE_FIELD, duration=0.2)
time.sleep(0.5)
pyautogui.typewrite("99", interval=0.3)
time.sleep(1)
snap("method1_typewrite")
pyautogui.click(*ALL_KEYS["=>"], duration=0.2)
time.sleep(2)

# Method 2: NumPad clicks only (for numeric fields)
print("\n=== Method 2: NumPad clicks ===")
pyautogui.click(*MANAGER_CODE_FIELD, duration=0.2)
time.sleep(0.5)
type_via_numpad("88")
time.sleep(1)
snap("method2_numpad")
pyautogui.click(*PASSWORD_FIELD, duration=0.2)
time.sleep(0.5)
type_via_numpad("12341234")
time.sleep(0.5)
# Type 'a' from QWERTY since it's not on numpad
type_via_qwerty("a")
time.sleep(0.5)
pyautogui.click(*ALL_KEYS["=>"], duration=0.2)
time.sleep(2)

# Method 3: Only QWERTY
print("\n=== Method 3: QWERTY only ===")
pyautogui.click(*MANAGER_CODE_FIELD, duration=0.2)
time.sleep(0.5)
type_via_qwerty("88")
time.sleep(1)
snap("method3_qwerty")
pyautogui.click(*PASSWORD_FIELD, duration=0.2)
time.sleep(0.5)
type_via_qwerty("12341234A")
time.sleep(0.5)
pyautogui.click(*ALL_KEYS["=>"], duration=0.2)
time.sleep(2)

# Method 4: Physical keyboard entirely
print("\n=== Method 4: Full physical keyboard ===")
pyautogui.click(*MANAGER_CODE_FIELD, duration=0.2)
time.sleep(0.5)
pyautogui.typewrite("88", interval=0.3)
time.sleep(0.5)
pyautogui.press("tab")
time.sleep(0.5)
pyautogui.typewrite("12341234a", interval=0.3)
time.sleep(0.5)
pyautogui.press("enter")
time.sleep(3)
snap("method4_physical")

# Method 5: Click on the title to activate, then use keyboard
print("\n=== Method 5: Click title first ===")
pyautogui.click(200, 194, duration=0.2)  # Click on "Manager Login" title
time.sleep(1)
pyautogui.click(*MANAGER_CODE_FIELD, duration=0.2)
time.sleep(1)
pyautogui.typewrite("88", interval=0.3)
time.sleep(0.5)
pyautogui.press("tab")
time.sleep(0.5)
pyautogui.typewrite("12341234a", interval=0.3)
time.sleep(0.5)
pyautogui.press("enter")
time.sleep(3)
snap("method5_title_first")

proc.terminate()
proc.wait()
print("\nDone!")
