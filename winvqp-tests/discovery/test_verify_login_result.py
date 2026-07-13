"""Check if login succeeded by testing whether login screen elements still respond."""
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

def sample(rx, ry, rw, rh, label):
    from collections import Counter
    im = pyautogui.screenshot(region=(rx, ry, rw, rh))
    data = list(im.getdata())
    counts = Counter(data).most_common(5)
    print(f"  [{label}] {counts}")
    return counts

# Phase 1: Check initial state  
print("=== Phase 1: Initial state ===")
sample(300, 325, 400, 30, "code_field")
sample(300, 380, 400, 30, "pwd_field")
sample(1480, 226, 60, 35, "numpad_8")
sample(1680, 845, 50, 30, "enter_btn")
sample(960, 960, 200, 30, "sale_info")  # bottom area

# Phase 2: Login
print("\n=== Phase 2: Login ===")
# Click code field
pyautogui.click(*MANAGER_CODE_FIELD, duration=0.2)
time.sleep(0.3)
# Type 88
pyautogui.click(*NUMPAD["8"], duration=0.15); time.sleep(0.2)
pyautogui.click(*NUMPAD["8"], duration=0.15); time.sleep(0.2)
# Click password field
pyautogui.click(*PASSWORD_FIELD, duration=0.2); time.sleep(0.3)
# Type password
for ch in "12341234a":
    k = ch.upper()
    if k in ALL_KEYS:
        pyautogui.click(*ALL_KEYS[k], duration=0.1); time.sleep(0.12)
# Submit
pyautogui.click(*ALL_KEYS["=>"], duration=0.2)
time.sleep(3)

# Phase 3: Check state after login
print("\n=== Phase 3: After login ===")
sample(300, 325, 400, 30, "code_field")
sample(300, 380, 400, 30, "pwd_field")
sample(1480, 226, 60, 35, "numpad_8")
sample(1680, 845, 50, 30, "enter_btn")
sample(960, 960, 200, 30, "sale_info")

# Phase 4: Try clicking code field again (would highlight if login screen still there)
print("\n=== Phase 4: Click code field position ===")
pyautogui.click(*MANAGER_CODE_FIELD, duration=0.2)
time.sleep(0.5)
sample(300, 325, 400, 30, "code_field_after_click")

# Phase 5: Check if QWERTY keyboard is still there (login screen) or gone
print("\n=== Phase 5: Sample QWERTY area ===")
sample(300, 600, 400, 30, "qwerty_row1")
sample(300, 680, 400, 30, "qwerty_row2")

# Phase 6: Full screenshot
path = "E:\\opencode\\winvqp-tests\\assets\\screenshots\\login_result.png"
pyautogui.screenshot(path)
print(f"\n  Final: {path}")

proc.terminate()
proc.wait()
print("Done!")
