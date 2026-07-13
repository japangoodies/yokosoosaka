"""Verify the typing mechanism works as expected."""
import sys, os, time, subprocess
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

os.environ["SERVER"] = r"\\192.168.0.3\VQPBOS"
os.environ["SERVERPC"] = r"\\192.168.0.3"
os.environ["REG"] = "01"
os.environ["winvqpdebug"] = "2"

proc = subprocess.Popen([r"D:\winvqp93\WINVQP93.exe"], cwd=r"D:\winvqp93")
print("Launched, waiting 10s...")
time.sleep(10)

import pyautogui
pyautogui.FAILSAFE = True

from utils.coords import ALL_KEYS, MANAGER_CODE_FIELD, PASSWORD_FIELD, NUMPAD

def get_top_color(rx, ry, rw, rh):
    from collections import Counter
    im = pyautogui.screenshot(region=(rx, ry, rw, rh))
    data = list(im.getdata())
    return Counter(data).most_common(3)

print("=== Test: Does numpad typing require focused field? ===")

# 1. Initial state - field should be white/unfocused
print("\n1. Initial state:")
c = get_top_color(300, 325, 400, 30)
print(f"   field: {c[:2]}")

# 2. Click "8" WITHOUT focusing field
print("\n2. Click '8' on numpad (field NOT focused):")
pyautogui.click(*NUMPAD["8"], duration=0.15)
time.sleep(0.5)
c = get_top_color(300, 325, 400, 30)
print(f"   field: {c[:2]}")

# 3. Now click the field to focus it
print("\n3. Click field to focus:")
pyautogui.click(*MANAGER_CODE_FIELD, duration=0.2)
time.sleep(0.5)
c = get_top_color(300, 325, 400, 30)
print(f"   field: {c[:2]}")

# 4. Click "8" WITH field focused
print("\n4. Click '8' on numpad (field IS focused):")
pyautogui.click(*NUMPAD["8"], duration=0.15)
time.sleep(0.5)
c = get_top_color(300, 325, 400, 30)
print(f"   field: {c[:2]}")

# 5. Click "8" again  
print("\n5. Click '8' again:")
pyautogui.click(*NUMPAD["8"], duration=0.15)
time.sleep(0.5)
c = get_top_color(300, 325, 400, 30)
print(f"   field: {c[:2]}")

# 6. Check password field - is numpad separate?
print("\n6. Click password field to focus:")
pyautogui.click(*PASSWORD_FIELD, duration=0.2)
time.sleep(0.5)
c = get_top_color(300, 380, 400, 30)
print(f"   pwd field: {c[:2]}")

# 7. Type "8" in password field
print("\n7. Click '8' on numpad (pwd focused):")
pyautogui.click(*NUMPAD["8"], duration=0.15)
time.sleep(0.5)
c = get_top_color(300, 380, 400, 30)
print(f"   pwd field: {c[:2]}")

# 8. Type "1" from QWERTY row
print("\n8. Click '1' on QWERTY (pwd still focused):")
pyautogui.click(*ALL_KEYS["1"], duration=0.15)
time.sleep(0.5)
c = get_top_color(300, 380, 400, 30)
print(f"   pwd field: {c[:2]}")

# Screenshot
path = "E:\\opencode\\winvqp-tests\\assets\\screenshots\\verify_typing.png"
pyautogui.screenshot(path)
print(f"\nScreenshot: {path}")

proc.terminate()
proc.wait()
print("Done!")
