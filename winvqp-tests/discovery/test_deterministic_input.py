"""Determine if keyboard clicks actually enter text or just cause visual artifact."""
import sys, os, time, subprocess
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

os.environ["SERVER"] = r"\\192.168.0.3\VQPBOS"
os.environ["SERVERPC"] = r"\\192.168.0.3"
os.environ["REG"] = "01"
os.environ["winvqpdebug"] = "2"

proc = subprocess.Popen([r"D:\winvqp93\WINVQP93.exe"], cwd=r"D:\winvqp93")
time.sleep(10)

import pyautogui
from collections import Counter
pyautogui.FAILSAFE = True

from utils.coords import ALL_KEYS, MANAGER_CODE_FIELD, PASSWORD_FIELD, NUMPAD

def count_black(rx, ry, rw, rh, label):
    im = pyautogui.screenshot(region=(rx, ry, rw, rh))
    data = list(im.getdata())
    total = len(data)
    black = sum(1 for p in data if p[0] < 50 and p[1] < 50 and p[2] < 50)
    dark_gray = sum(1 for p in data if p[0] < 150)
    print(f"  [{label}] total={total} black={black} dark={dark_gray}")
    return black, dark_gray

def snap(name):
    path = f"E:\\opencode\\winvqp-tests\\assets\\screenshots\\{name}.png"
    os.makedirs(os.path.dirname(path), exist_ok=True)
    pyautogui.screenshot(path)

# Part 1: Check various positions on screen to see what effect numpad click has
print("=== Part 1: Compare clicking numpad vs clicking empty area ===")

# Initial state
count_black(300, 325, 400, 30, "initial_code_field")

# Click empty area first - check effect
print("\n1a: Click empty area (500, 500):")
pyautogui.click(500, 500, duration=0.2)
time.sleep(0.5)
count_black(300, 325, 400, 30, "after_empty_click")

# Focus field
print("\n1b: Click Manager Code field:")
pyautogui.click(*MANAGER_CODE_FIELD, duration=0.2)
time.sleep(0.5)
c_before = count_black(300, 325, 400, 30, "field_focused")

# Click numpad
print("\n1c: Click numpad '8':")
pyautogui.click(*NUMPAD["8"], duration=0.15)
time.sleep(0.3)
c_after = count_black(300, 325, 400, 30, "after_numpad_8")

# Click another key
print("\n1d: Click Backspace:")
if "Backspace" in ALL_KEYS:
    pyautogui.click(*ALL_KEYS["Backspace"], duration=0.15)
    time.sleep(0.3)
    count_black(300, 325, 400, 30, "after_backspace")

# Part 2: Type multiple different characters
print("\n=== Part 2: Type '123' and check counts ===")
pyautogui.click(*MANAGER_CODE_FIELD, duration=0.2)
time.sleep(0.3)

pyautogui.click(*NUMPAD["1"], duration=0.15)
time.sleep(0.3)
count_black(300, 325, 400, 30, "after_1")

pyautogui.click(*NUMPAD["2"], duration=0.15)
time.sleep(0.3)
count_black(300, 325, 400, 30, "after_12")

pyautogui.click(*NUMPAD["3"], duration=0.15)
time.sleep(0.3)
count_black(300, 325, 400, 30, "after_123")

# Part 3: Check if cursor blink causes variance
print("\n=== Part 3: Check cursor blink ===")
snap("blink_check")
pyautogui.click(*MANAGER_CODE_FIELD, duration=0.2)
time.sleep(0.3)
for i in range(5):
    time.sleep(0.5)
    c = count_black(300, 325, 400, 30, f"blink_{i}")

# Part 4: Type many characters  
print("\n=== Part 4: Type '888888' ===")
pyautogui.click(*MANAGER_CODE_FIELD, duration=0.2)
time.sleep(0.3)
for i in range(6):
    pyautogui.click(*NUMPAD["8"], duration=0.08)
    time.sleep(0.1)
time.sleep(0.5)
count_black(300, 325, 400, 30, "after_888888")

snap("deterministic_final")

proc.terminate()
proc.wait()
print("\nDone!")
