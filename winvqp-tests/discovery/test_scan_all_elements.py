"""Comprehensive screen scan to find ALL interactive elements."""
import sys, os, time, subprocess
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

os.environ["SERVER"] = r"\\192.168.0.3\VQPBOS"
os.environ["SERVERPC"] = r"\\192.168.0.3"
os.environ["REG"] = "01"
os.environ["winvqpdebug"] = "2"

proc = subprocess.Popen([r"D:\winvqp93\WINVQP93.exe"], cwd=r"D:\winvqp93")
time.sleep(10)

import pyautogui, pytesseract
pyautogui.FAILSAFE = True

from collections import Counter

def snap(name):
    pyautogui.screenshot(f"E:\\opencode\\winvqp-tests\\assets\\screenshots\\{name}.png")

# Full screen OCR in zones
print("=== Full screen zone OCR ===")
zones = [
    ("top_left", 0, 0, 960, 200),
    ("top_right", 960, 0, 960, 200),
    ("mid_left", 0, 200, 960, 400),
    ("mid_right", 960, 200, 960, 400),
    ("login_form", 150, 280, 600, 200),
    ("bottom_left", 0, 800, 960, 280),
    ("bottom_right", 960, 800, 960, 280),
    ("numpad_area", 1400, 200, 520, 400),
    ("qwerty_area", 100, 580, 1820, 350),
    ("title_bar", 0, 0, 300, 30),
]

for label, rx, ry, rw, rh in zones:
    im = pyautogui.screenshot(region=(rx, ry, rw, rh))
    text = pytesseract.image_to_string(im, config="--psm 6 --oem 3").strip()
    if text:
        print(f"  [{label} ({rx},{ry},{rw}x{rh})]:")
        for line in text.split("\n"):
            if line.strip():
                print(f"    '{line[:100]}'")

# Scan for non-white areas to find buttons
print("\n=== Pixel analysis: Key areas ===")
def sample(rx, ry, rw, rh, label):
    im = pyautogui.screenshot(region=(rx, ry, rw, rh))
    data = list(im.getdata())
    top = Counter(data).most_common(5)
    print(f"  [{label}] {top[:3]}")

# Check for buttons below the password field
print("\n--- Area below password field ---")
sample(150, 420, 600, 100, "below_pwd")
sample(150, 500, 600, 100, "below_pwd2")

# Check title bar for tabs/buttons
print("\n--- Title bar details ---")
sample(150, 180, 120, 25, "title_whole")
# Check "Manager" and "Login" as separate elements
sample(160, 186, 50, 15, "manager_tab")
sample(214, 186, 30, 15, "login_tab")

# Check around "Manager" title for additional text
print("\n--- Title scan at y=189, x=150 to x=400 ---")
im = pyautogui.screenshot(region=(150, 189, 250, 12))
text = pytesseract.image_to_string(im, config="--psm 7 --oem 3").strip()
print(f"  OCR: '{text}'")

# Check the right side of the screen (right of the login form)
print("\n--- Right of login form ---")
sample(800, 300, 500, 500, "right_of_form")

# Check below keyboard
print("\n--- Below keyboard area ---")
sample(100, 900, 1720, 100, "below_kb")

snap("full_scan")
print("\nDone!")
proc.terminate()
proc.wait()
