"""Take a clean screenshot of the field content for visual inspection."""
import sys, os, time, subprocess
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

os.environ["SERVER"] = r"\\192.168.0.3\VQPBOS"
os.environ["SERVERPC"] = r"\\192.168.0.3"
os.environ["REG"] = "01"
os.environ["winvqpdebug"] = "2"

proc = subprocess.Popen([r"D:\winvqp93\WINVQP93.exe"], cwd=r"D:\winvqp93")
time.sleep(10)

import pyautogui
from PIL import Image
pyautogui.FAILSAFE = True

from utils.coords import ALL_KEYS, MANAGER_CODE_FIELD, PASSWORD_FIELD, NUMPAD

def save_crop(rx, ry, rw, rh, name):
    im = pyautogui.screenshot(region=(rx, ry, rw, rh))
    im.save(f"E:\\opencode\\winvqp-tests\\assets\\screenshots\\{name}.png")
    print(f"  Saved: {name}.png ({rw}x{rh})")

# Step 1: Empty field reference
print("=== Empty Manager Code field ===")
save_crop(150, 325, 450, 35, "field_empty")

# Step 2: Click field, type "88", then click elsewhere to show text
print("\n=== Type '88' in Manager Code ===")
pyautogui.click(*MANAGER_CODE_FIELD, duration=0.2)
time.sleep(0.5)

for _ in range(2):
    pyautogui.click(*NUMPAD["8"], duration=0.1)
    time.sleep(0.3)

# Click outside to defocus the field to show text
pyautogui.click(500, 500, duration=0.2)
time.sleep(0.5)
save_crop(150, 325, 450, 35, "field_with_88")

# Step 3: Type password
print("\n=== Type password '12341234a' ===")
pyautogui.click(*PASSWORD_FIELD, duration=0.2)
time.sleep(0.5)
for ch in "12341234a":
    if ch in NUMPAD:
        pyautogui.click(*NUMPAD[ch], duration=0.08)
    elif ch.upper() in ALL_KEYS:
        pyautogui.click(*ALL_KEYS[ch.upper()], duration=0.08)
    time.sleep(0.15)

pyautogui.click(500, 500, duration=0.2)
time.sleep(0.5)
save_crop(150, 375, 450, 35, "field_with_password")

# Step 4: Save full screen
pyautogui.screenshot("E:\\opencode\\winvqp-tests\\assets\\screenshots\\full_login_filled.png")
print("\n  Full screen saved!")

# Step 5: Type a very distinctive sequence "HELLO" 
print("\n=== Type distinctive 'ABCDEF' in code field ===")
pyautogui.click(*MANAGER_CODE_FIELD, duration=0.2)
time.sleep(0.5)

for ch in "ABCDEF":
    if ch.upper() in ALL_KEYS:
        pyautogui.click(*ALL_KEYS[ch.upper()], duration=0.08)
        time.sleep(0.15)

pyautogui.click(500, 500, duration=0.2)
time.sleep(0.5)
save_crop(150, 325, 450, 35, "field_with_ABCDEF")

proc.terminate()
proc.wait()
print("\nDone! Check the screenshots in assets/screenshots/")
