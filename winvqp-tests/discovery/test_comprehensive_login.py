"""Comprehensive login test with window state detection."""
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
from pywinauto import Desktop

from utils.coords import ALL_KEYS, MANAGER_CODE_FIELD, PASSWORD_FIELD, NUMPAD

def enum_windows():
    """List all windows to detect modals."""
    d = Desktop(backend="win32")
    for w in d.windows(top_level_only=True):
        rect = w.rectangle()
        if rect.width() > 0 and rect.height() > 0:
            text = w.window_text().strip()
            cls = w.class_name()
            skip = ("Shell_TrayWnd", "DV2ControlHost", "WorkerW", "MsoSvr", "SysListView32", "#32770")
            skip_cls = ("Progman", "SysListView32", "Button", "ToolbarWindow32", "CiceroUIWndFrame")
            if cls not in skip_cls and "NotifyIconOverflowWindow" not in cls and "RealTimeStylus" not in cls:
                safe = text[:60].encode('ascii', errors='replace').decode('ascii')
                print(f"  cls={cls} text=\"{safe}\" rect=({rect.left},{rect.top},{rect.width()}x{rect.height()}) enabled={w.is_enabled()}")

def snap(name):
    path = f"E:\\opencode\\winvqp-tests\\assets\\screenshots\\{name}.png"
    os.makedirs(os.path.dirname(path), exist_ok=True)
    pyautogui.screenshot(path)
    print(f"  Screenshot: {path}")

def focus_field(x, y):
    pyautogui.click(x, y, duration=0.2)
    time.sleep(0.3)

def type_keys(text):
    for ch in text:
        k = ch.upper()
        if k in ALL_KEYS:
            pyautogui.click(*ALL_KEYS[k], duration=0.08)
            time.sleep(0.1)
        elif k == ' ':
            pyautogui.click(*ALL_KEYS['spacebar'], duration=0.08)
            time.sleep(0.1)
        else:
            print(f"  Key '{ch}' not mapped!")

def check_field(rx, ry, rw=400, rh=30):
    from collections import Counter
    im = pyautogui.screenshot(region=(rx, ry, rw, rh))
    data = list(im.getdata())
    counts = Counter(data).most_common(3)
    print(f"    region=({rx},{ry}) top={counts}")

print("\n=== ALL WINDOWS (initial) ===")
enum_windows()
snap("comprehensive_initial")

print("\n=== STEP 1: Fill Manager Code ===")
focus_field(*MANAGER_CODE_FIELD)
check_field(300, 325, 400, 30)

type_keys("88")
time.sleep(0.5)
check_field(300, 325, 400, 30)

print("\n=== STEP 2: Fill Password ===")
focus_field(*PASSWORD_FIELD)
check_field(300, 380, 400, 30)

type_keys("12341234a")
time.sleep(0.5)
check_field(300, 380, 400, 30)

print("\n=== STEP 3: Submit ===")
pyautogui.click(*ALL_KEYS["=>"], duration=0.2)
time.sleep(4)

print("\n=== STATE AFTER LOGIN ===")
snap("comprehensive_after_login")
enum_windows()

# Check if login screen fields still exist
check_field(300, 325, 400, 30)
check_field(300, 380, 400, 30)

# Check keyboard areas
check_field(1480, 226, 60, 35)
check_field(1680, 845, 50, 30)

# Check center area for dialog
check_field(500, 400, 500, 200)

print("\n=== STEP 4: Check for popup dialog, try Enter to close ===")
pyautogui.press("enter")
time.sleep(2)
snap("comprehensive_after_enter")
enum_windows()

# Check if login screen still here
check_field(300, 325, 400, 30)
check_field(300, 380, 400, 30)

proc.terminate()
proc.wait()
print("\nDone!")
