"""Try to dismiss/close the login screen."""
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

def ocr_status():
    im = pyautogui.screenshot(region=(50, 1045, 700, 35))
    return pytesseract.image_to_string(im, config="--psm 7 --oem 3").strip()

def ocr_title():
    im = pyautogui.screenshot(region=(100, 180, 300, 25))
    return pytesseract.image_to_string(im, config="--psm 7 --oem 3").strip()

def ocr_center():
    im = pyautogui.screenshot(region=(150, 300, 600, 200))
    return pytesseract.image_to_string(im, config="--psm 6 --oem 3").strip()[:100]

def snap(name):
    pyautogui.screenshot(f"E:\\opencode\\winvqp-tests\\assets\\screenshots\\{name}.png")

from utils.coords import ALL_KEYS, MANAGER_CODE_FIELD, PASSWORD_FIELD, NUMPAD

print("=== Initial state ===")
print(f"  Status: '{ocr_status()}'")
print(f"  Title: '{ocr_title()}'")

# Try ESC first
print("\n=== Try ESC key ===")
pyautogui.press("esc")
time.sleep(2)
print(f"  Status: '{ocr_status()}'")
print(f"  Title: '{ocr_title()}'")
snap("after_esc1")

# Try clicking "X" / close button area (top right corner of app)
print("\n=== Try clicking top-right area (close/X) ===")
pyautogui.click(1900, 15, duration=0.2)
time.sleep(2)
print(f"  Status: '{ocr_status()}'")
snap("after_topright")

# Try clicking on the title "Manager Login"
print("\n=== Try clicking title area ===")
pyautogui.click(200, 194, duration=0.2)
time.sleep(2)
print(f"  Status: '{ocr_status()}'")
print(f"  Title: '{ocr_title()}'")
snap("after_title_click")

# Try double-click on code field
print("\n=== Try double-click code field ===")
pyautogui.doubleClick(*MANAGER_CODE_FIELD, duration=0.2)
time.sleep(1)

# Now try to type using typewrite with longer delays
pyautogui.typewrite("88", interval=0.5)
time.sleep(1)
pyautogui.press("tab")
time.sleep(1)
pyautogui.typewrite("12341234a", interval=0.5)
time.sleep(1)
pyautogui.press("enter")
time.sleep(3)
print(f"  Status: '{ocr_status()}'")
print(f"  Title: '{ocr_title()}'")
print(f"  Center: '{ocr_center()}'")
snap("after_long_delay_login")

# Try typing into the inpwin overlay window directly
from pywinauto import Desktop
inpwins = Desktop(backend="win32").windows(class_name="inpwin")
if inpwins:
    print(f"\n=== Try inpwin.text() / type_keys() ===")
    inp = inpwins[0]
    print(f"  inpwin: handle={inp.handle} text='{inp.window_text()}'")
    # Click code field first
    pyautogui.click(*MANAGER_CODE_FIELD, duration=0.2)
    time.sleep(0.5)
    # Try typing into inpwin
    inp.type_keys("88", with_spaces=True)
    time.sleep(1)
    print(f"  Status: '{ocr_status()}'")

# Final attempt: just try again after all previous attempts cleared fields
print("\n=== Final attempt: clean login ===")
pyautogui.click(*MANAGER_CODE_FIELD, duration=0.2)
time.sleep(0.5)
for ch in "88":
    pyautogui.click(*NUMPAD[ch], duration=0.1)
    time.sleep(0.3)
time.sleep(0.5)
pyautogui.click(*PASSWORD_FIELD, duration=0.2)
time.sleep(0.5)
for ch in "12341234":
    pyautogui.click(*NUMPAD[ch], duration=0.1)
    time.sleep(0.3)
# 'a' is not on numpad, use QWERTY
pyautogui.click(*ALL_KEYS["A"], duration=0.1)
time.sleep(0.3)
pyautogui.click(*ALL_KEYS["=>"], duration=0.2)
time.sleep(3)
print(f"  Status: '{ocr_status()}'")
print(f"  Title: '{ocr_title()}'")
print(f"  Center: '{ocr_center()}'")
snap("final_attempt")

proc.terminate()
proc.wait()
print("\nDone!")
