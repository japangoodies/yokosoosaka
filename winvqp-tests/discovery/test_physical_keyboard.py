"""Test if physical keyboard input works (TypeWrite approach)."""
import sys, os, time, subprocess
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

os.environ["SERVER"] = r"\\192.168.0.3\VQPBOS"
os.environ["SERVERPC"] = r"\\192.168.0.3"
os.environ["REG"] = "01"
os.environ["winvqpdebug"] = "2"

# Kill existing
subprocess.run(["taskkill", "/f", "/im", "WINVQP93.exe"], capture_output=True)
time.sleep(2)

proc = subprocess.Popen([r"D:\winvqp93\WINVQP93.exe"], cwd=r"D:\winvqp93")
time.sleep(8)

import pyautogui
pyautogui.FAILSAFE = True
import pytesseract
from PIL import Image

def ocr_state(label):
    im = pyautogui.screenshot(region=(0, 0, 800, 200))
    text = pytesseract.image_to_string(im, config='--psm 6 --oem 3').strip()
    print(f"[{label}] OCR: {text[:120]}")
    return text

# Try physical keyboard approach
print("\n=== Test: Click on login area then type with keyboard ===")
# Click on the login area to ensure it has focus
pyautogui.click(400, 200, duration=0.2)
time.sleep(0.5)

# Try to focus Manager Code field by clicking on it
pyautogui.click(400, 337, duration=0.2)
time.sleep(0.5)

# Try pyautogui.typewrite (physical keyboard simulation)
print("  Typing '88' via physical keyboard...")
pyautogui.typewrite("88", interval=0.1)
time.sleep(1)

ocr_state("after_typewrite_88")

print("  Pressing Tab...")
pyautogui.press("tab")
time.sleep(0.5)

ocr_state("after_tab")

print("  Typing password...")
pyautogui.typewrite("12341234a", interval=0.1)
time.sleep(1)

ocr_state("after_typewrite_pwd")

print("  Pressing Enter...")
pyautogui.press("enter")
time.sleep(3)

ocr_state("after_enter")

# Also try clicking "=>" with mouse
print("\n=== Test: Click => button ===")
from utils.coords import ALL_KEYS
pyautogui.click(*ALL_KEYS["=>"], duration=0.2)
time.sleep(3)

ocr_state("after_click_enter")

# Full screenshot
path = "E:\\opencode\\winvqp-tests\\assets\\screenshots\\physical_keyboard_final.png"
pyautogui.screenshot(path)
print(f"  Final screenshot: {path}")

# Check for error dialog
print("\n=== Check for popup ===")
full_im = pyautogui.screenshot(region=(500, 400, 500, 200))
popup_text = pytesseract.image_to_string(full_im, config='--psm 6 --oem 3').strip()
print(f"  Center area OCR: {popup_text}")

proc.terminate()
proc.wait()
print("\nDone!")
