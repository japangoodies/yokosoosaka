"""Definitive test: compare pixel-by-pixel BEFORE and AFTER typing."""
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
from PIL import Image
import numpy as np

from utils.coords import ALL_KEYS, MANAGER_CODE_FIELD, PASSWORD_FIELD, NUMPAD

def snap_region(rx, ry, rw, rh):
    return np.array(pyautogui.screenshot(region=(rx, ry, rw, rh)))

def diff_regions(a, b, label):
    diff = np.abs(a.astype(int) - b.astype(int))
    changed = np.sum(diff > 30)
    total = a.shape[0] * a.shape[1]
    pct = 100 * changed / total
    print(f"  [{label}] {changed}/{total} pixels changed ({pct:.1f}%)")
    # Show the most changed pixel positions
    diff_sum = np.sum(diff, axis=2)
    max_diff = np.max(diff_sum)
    if max_diff > 30:
        max_pos = np.unravel_index(np.argmax(diff_sum), diff_sum.shape)
        print(f"    Max diff at ({max_pos[1]+rx},{max_pos[0]+ry}): value={max_diff}")
    return changed, pct

def type_key(key_name):
    if key_name in ALL_KEYS:
        pyautogui.click(*ALL_KEYS[key_name], duration=0.08)
        time.sleep(0.3)

# Ensure field is focused first
print("=== Focusing Manager Code field ===")
pyautogui.click(*MANAGER_CODE_FIELD, duration=0.2)
time.sleep(0.5)

# Test 1: Type a single character and compare
print("\n=== Test 1: Type '8' on numpad ===")
before = snap_region(150, 328, 420, 30)
type_key("8")
after = snap_region(150, 328, 420, 30)
diff_regions(before, after, "numpad_8")

# Test 2: Click a different position (not keyboard) and compare
print("\n=== Test 2: Click empty area (500, 500) ===")
pyautogui.click(*MANAGER_CODE_FIELD, duration=0.2)
time.sleep(0.5)
before = snap_region(150, 328, 420, 30)
pyautogui.click(500, 500, duration=0.2)
time.sleep(0.5)
after = snap_region(150, 328, 420, 30)
diff_regions(before, after, "click_500_500")

# Test 3: Type a QWERTY character
print("\n=== Test 3: Type 'Q' on QWERTY ===")
pyautogui.click(*MANAGER_CODE_FIELD, duration=0.2)
time.sleep(0.5)
before = snap_region(150, 328, 420, 30)
type_key("Q")
after = snap_region(150, 328, 420, 30)
diff_regions(before, after, "qwerty_Q")

# Test 4: Focus Password field, type '9'
print("\n=== Test 4: Password field + numpad ===")
pyautogui.click(*PASSWORD_FIELD, duration=0.2)
time.sleep(0.5)
before = snap_region(150, 384, 420, 30)
type_key("9")
after = snap_region(150, 384, 420, 30)
diff_regions(before, after, "pwd_numpad_9")

# Test 5: Focus field, type multiple keys rapidly
print("\n=== Test 5: Type '1234567890ABCDEF' on focused field ===")
pyautogui.click(*MANAGER_CODE_FIELD, duration=0.2)
time.sleep(0.5)
before = snap_region(150, 328, 420, 30)
for ch in "1234567890ABCDEF":
    k = ch.upper()
    if k in ALL_KEYS:
        pyautogui.click(*ALL_KEYS[k], duration=0.05)
        time.sleep(0.08)
time.sleep(1)
after = snap_region(150, 328, 420, 30)
diff_regions(before, after, "multi_char")
# Save final screenshot
pyautogui.screenshot("E:\\opencode\\winvqp-tests\\assets\\screenshots\\multi_char_final.png")

# Test 6: Check if text appears outside the field (in the login form area)
print("\n=== Test 6: Check form area for changes ===")
before = snap_region(150, 300, 600, 250)
pyautogui.click(*MANAGER_CODE_FIELD, duration=0.2)
time.sleep(0.5)
type_key("8")
type_key("8")
time.sleep(0.5)
after = snap_region(150, 300, 600, 250)
diff_regions(before, after, "form_area")

proc.terminate()
proc.wait()
print("\nDone!")
