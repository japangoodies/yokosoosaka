"""Analyze pixel colors at login field positions to detect state changes."""
import sys, os, time, subprocess
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

os.environ["SERVER"] = r"\\192.168.0.3\VQPBOS"
os.environ["SERVERPC"] = r"\\192.168.0.3"
os.environ["REG"] = "01"
os.environ["winvqpdebug"] = "2"

proc = subprocess.Popen([r"D:\winvqp93\WINVQP93.exe"], cwd=r"D:\winvqp93")
print("Waiting for app to launch...")
time.sleep(10)

import pyautogui
pyautogui.FAILSAFE = True

from utils.coords import ALL_KEYS, MANAGER_CODE_FIELD, PASSWORD_FIELD

def sample_field(region, label):
    """Sample the most common pixel color in a region."""
    im = pyautogui.screenshot(region=region)
    colors = list(im.getdata())
    from collections import Counter
    most_common = Counter(colors).most_common(3)
    print(f"  [{label}] region=({region}) top_colors={most_common}")

def full_screen_region(rx, ry, rw, rh):
    im = pyautogui.screenshot(region=(rx, ry, rw, rh))
    colors = list(im.getdata())
    from collections import Counter
    return Counter(colors).most_common(5)

# Initial state
print("\n=== Initial pixel analysis ===")
sample_field((150, 300, 80, 30), "manager_label_area")
sample_field((300, 325, 400, 30), "code_field_wide")
sample_field((300, 380, 400, 30), "password_field_wide")
sample_field((150, 375, 80, 30), "password_label_area")

# Also check the area around the login title
print("\n=== Login title area ===")
print(f"  Title colors: {full_screen_region(150, 180, 200, 30)}")

# Check status bar area
print(f"  Status bar colors: {full_screen_region(50, 1040, 500, 30)}")

# Now click the => button and check for changes
print("\n=== Click => (submit with empty fields) ===")
pyautogui.click(*ALL_KEYS["=>"], duration=0.2)
time.sleep(2)

# Check if any error dialog appeared
print("\n=== After submit - checking for changes ===")
print(f"  Center screen colors: {full_screen_region(600, 450, 400, 200)}")
print(f"  Code field after: {full_screen_region(300, 325, 400, 30)}")

# Click Manager Code field at different positions
for x in [300, 400, 450, 500, 620]:
    print(f"\n=== Click manager code at x={x} ===")
    pyautogui.click(x, 337, duration=0.15)
    time.sleep(0.3)
    print(f"  Field colors: {full_screen_region(300, 325, 400, 30)}")
    # Type a number
    pyautogui.click(*ALL_KEYS["8"], duration=0.15)
    time.sleep(0.3)
    print(f"  After typing 8: {full_screen_region(300, 325, 400, 30)}")
    # Click the same position again to undo
    pyautogui.click(x, 337, duration=0.15)
    time.sleep(0.3)

# Re-check status bar
print(f"\n  Final status bar: {full_screen_region(50, 1040, 500, 30)}")

proc.terminate()
proc.wait()
print("\nDone!")
