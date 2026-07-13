"""Verify clicks work at various positions by detecting state changes."""
import sys, os, time, subprocess
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

os.environ["SERVER"] = r"\\192.168.0.3\VQPBOS"
os.environ["SERVERPC"] = r"\\192.168.0.3"
os.environ["REG"] = "01"
os.environ["winvqpdebug"] = "2"

proc = subprocess.Popen([r"D:\winvqp93\WINVQP93.exe"], cwd=r"D:\winvqp93")
time.sleep(8)

import pyautogui
pyautogui.FAILSAFE = True

from utils.coords import ALL_KEYS, MANAGER_CODE_FIELD, PASSWORD_FIELD

def pixel_snapshot(name, regions=None):
    """Take a screenshot and sample colors at key positions."""
    if regions is None:
        regions = {
            "status_bar": (100, 1050, 200, 20),
            "manager_label": (160, 310, 80, 15),
            "code_field": (400, 337, 300, 20),
            "login_title": (160, 189, 120, 15),
            "submit_btn_area": (1650, 850, 100, 30),
        }
    for label, (rx, ry, rw, rh) in regions.items():
        im = pyautogui.screenshot(region=(rx, ry, rw, rh))
        avg = sum(im.getdata()) / len(im.getdata())
        print(f"  [{name}] {label}: avg_pixel={avg:.0f}")
    return name

def click_and_snapshot(label, x, y, duration=0.2):
    print(f"\n--- Click {label} at ({x}, {y}) ---")
    pyautogui.click(x, y, duration=duration)
    time.sleep(0.5)
    snapshot = f"after_{label.lower().replace(' ', '_')}"
    pixel_snapshot(snapshot)

print("=== INITIAL STATE ===")
pixel_snapshot("initial")

print("\n=== Test 1: Click Submit (=>) with empty fields - expect error ===")
pyautogui.click(*ALL_KEYS["=>"], duration=0.2)
time.sleep(2)
pixel_snapshot("after_submit_empty")

print("\n=== Test 2: Try clicking at various code field x-positions ===")
for x_offset, label in [(300, "x300"), (400, "x400"), (500, "x500"), (620, "x620_current")]:
    pyautogui.click(x_offset, 337, duration=0.15)
    time.sleep(0.3)
    # Type "8" on numpad
    pyautogui.click(*ALL_KEYS["8"], duration=0.15)
    time.sleep(0.5)
    pixel_snapshot(f"click_{label}_type_8")

print("\n=== Test 3: Try clicking Password field at various x-positions ===")
for x_offset, label in [(300, "x300"), (400, "x400"), (500, "x500"), (620, "x620_current")]:
    pyautogui.click(x_offset, 393, duration=0.15)
    time.sleep(0.3)
    pyautogui.click(*ALL_KEYS["8"], duration=0.15)
    time.sleep(0.5)
    pixel_snapshot(f"pwd_{label}_type_8")

proc.terminate()
proc.wait()
print("\nDone!")
