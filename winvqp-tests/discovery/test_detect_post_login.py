"""Detect subtle differences after login attempt."""
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
from collections import Counter

from utils.coords import ALL_KEYS, MANAGER_CODE_FIELD, PASSWORD_FIELD, NUMPAD

def scan_bucket(buckets, name):
    """Capture pixel histogram of key screen regions."""
    results = {}
    for label, rx, ry, rw, rh in buckets:
        im = pyautogui.screenshot(region=(rx, ry, rw, rh))
        data = list(im.getdata())
        top = Counter(data).most_common(5)
        results[label] = top
        # Show comparison if we have baseline
        print(f"  [{name}] {label}: {top[:3]}")
    return results

def snap(name):
    path = f"E:\\opencode\\winvqp-tests\\assets\\screenshots\\{name}.png"
    os.makedirs(os.path.dirname(path), exist_ok=True)
    pyautogui.screenshot(path)

def type_text(text):
    for ch in text:
        k = ch.upper()
        if k in ALL_KEYS:
            pyautogui.click(*ALL_KEYS[k], duration=0.08)
            time.sleep(0.15)
        elif ch == ' ':
            pyautogui.click(*ALL_KEYS['spacebar'], duration=0.08)
            time.sleep(0.15)

# Define screen regions to monitor
REGIONS = [
    ("manager_label", 160, 305, 75, 15),
    ("password_label", 160, 370, 55, 15),
    ("code_field", 250, 328, 200, 28),
    ("pwd_field", 250, 384, 200, 28),
    ("title_manager", 160, 185, 60, 15),
    ("title_login", 210, 185, 35, 15),
    ("title_counter", 270, 185, 60, 15),
    ("status_bar", 50, 1045, 500, 30),
    ("corner_top_left", 5, 5, 50, 30),
    ("corner_top_right", 1870, 5, 50, 30),
    ("logo_area", 800, 300, 200, 200),
    ("numpad_8", 1480, 220, 80, 45),
    ("qwerty_row1", 300, 600, 500, 30),
    ("enter_btn", 1650, 840, 80, 35),
]

print("=== BASELINE ===")
baseline = scan_bucket(REGIONS, "baseline")
snap("baseline")

print("\n=== LOGIN ATTEMPT ===")
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

print("\n=== AFTER LOGIN ===")
after = scan_bucket(REGIONS, "after")
snap("after_login")

# Check for differences
print("\n=== DIFFERENCES ===")
for item in REGIONS:
    label = item[0]
    bvals = baseline.get(label)
    avals = after.get(label)
    if bvals != avals:
        print(f"  CHANGED: {label}")
        print(f"    Before: {bvals[:2] if bvals else 'N/A'}")
        print(f"    After:  {avals[:2] if avals else 'N/A'}")

proc.terminate()
proc.wait()
print("\nDone!")
