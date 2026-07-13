"""Full login test with pixel verification."""
import sys, os, time, subprocess
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

os.environ["SERVER"] = r"\\192.168.0.3\VQPBOS"
os.environ["SERVERPC"] = r"\\192.168.0.3"
os.environ["REG"] = "01"
os.environ["winvqpdebug"] = "2"

proc = subprocess.Popen([r"D:\winvqp93\WINVQP93.exe"], cwd=r"D:\winvqp93")
print("Launched app, waiting...")
time.sleep(10)

import pyautogui
pyautogui.FAILSAFE = True

from utils.coords import ALL_KEYS, MANAGER_CODE_FIELD, PASSWORD_FIELD, NUMPAD

def snap(name):
    path = f"E:\\opencode\\winvqp-tests\\assets\\screenshots\\{name}.png"
    os.makedirs(os.path.dirname(path), exist_ok=True)
    pyautogui.screenshot(path)
    print(f"  Screenshot: {path}")

def sample_region(rx, ry, rw, rh, label):
    from collections import Counter
    im = pyautogui.screenshot(region=(rx, ry, rw, rh))
    colors = list(im.getdata())
    top = Counter(colors).most_common(3)
    print(f"  [{label}] top: {top[:2]}")

print("=== Step 1: Initial ===")
snap("login_01_initial")
sample_region(300, 325, 400, 30, "code_field")
sample_region(300, 380, 400, 30, "pwd_field")

print("\n=== Step 2: Click Manager Code field ===")
pyautogui.click(*MANAGER_CODE_FIELD, duration=0.2)
time.sleep(0.5)
snap("login_02_clicked_code")
sample_region(300, 325, 400, 30, "code_field")

print("\n=== Step 3: Type '88' via numpad ===")
# Click "8" twice
pyautogui.click(*NUMPAD["8"], duration=0.15)
time.sleep(0.3)
pyautogui.click(*NUMPAD["8"], duration=0.15)
time.sleep(0.5)
snap("login_03_typed_88")
sample_region(300, 325, 400, 30, "code_field")

print("\n=== Step 4: Click Password field ===")
pyautogui.click(*PASSWORD_FIELD, duration=0.2)
time.sleep(0.5)
snap("login_04_clicked_pwd")
sample_region(300, 380, 400, 30, "pwd_field")

print("\n=== Step 5: Type password '12341234a' ===")
for ch in "12341234a":
    key = ch.upper()
    if key in ALL_KEYS:
        pyautogui.click(*ALL_KEYS[key], duration=0.1)
        time.sleep(0.15)
    else:
        print(f"  WARNING: Key '{ch}' not mapped")
snap("login_05_typed_pwd")
sample_region(300, 380, 400, 30, "pwd_field")

print("\n=== Step 6: Click Submit (=>) ===")
pyautogui.click(*ALL_KEYS["=>"], duration=0.2)
time.sleep(3)
snap("login_06_after_submit")

# Sample center of screen (where main POS would appear)
print("\n=== After login state ===")
sample_region(50, 1040, 500, 30, "status_bar")
sample_region(100, 100, 500, 50, "title_area")
sample_region(800, 100, 400, 600, "center")

# Check if still on login screen or main POS
sample_region(300, 325, 400, 30, "code_field_still_exists")
sample_region(300, 380, 400, 30, "pwd_field_still_exists")

# Wait more and take another screenshot
time.sleep(2)
snap("login_07_final")

proc.terminate()
proc.wait()
print("\nDone!")
