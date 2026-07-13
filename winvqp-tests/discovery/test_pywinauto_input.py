"""Try pywinauto type_keys() for direct window input."""
import sys, os, time, subprocess
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

os.environ["SERVER"] = r"\\192.168.0.3\VQPBOS"
os.environ["SERVERPC"] = r"\\192.168.0.3"
os.environ["REG"] = "01"
os.environ["winvqpdebug"] = "2"

proc = subprocess.Popen([r"D:\winvqp93\WINVQP93.exe"], cwd=r"D:\winvqp93")
time.sleep(10)

import pyautogui, pytesseract
from pywinauto import Desktop, Application
pyautogui.FAILSAFE = True

from utils.coords import ALL_KEYS, MANAGER_CODE_FIELD, PASSWORD_FIELD, NUMPAD

def ocr_status():
    im = pyautogui.screenshot(region=(50, 1045, 700, 35))
    return pytesseract.image_to_string(im, config="--psm 7 --oem 3").strip()

def ocr_title():
    im = pyautogui.screenshot(region=(100, 180, 300, 25))
    return pytesseract.image_to_string(im, config="--psm 7 --oem 3").strip()

def snap(name):
    pyautogui.screenshot(f"E:\\opencode\\winvqp-tests\\assets\\screenshots\\{name}.png")

# Get the vqpmain window via pywinauto
wins = Desktop(backend="win32").windows(class_name="vqpmain")
if wins:
    win = wins[0]
    print(f"Found vqpmain: handle={win.handle}, text='{win.window_text()}'")
    has_focus = win.has_focus()
    print(f"  Has focus: {has_focus}")
else:
    print("ERROR: No vqpmain window found!")
    proc.terminate()
    exit(1)

# Method 1: Click field, then use pywinauto.type_keys()
print("\n=== Method 1: pywinauto type_keys() ===")
print(f"  Initial status: '{ocr_status()}'")

# First make sure the window has focus
win.set_focus()
time.sleep(1)
print(f"  After set_focus: has_focus={win.has_focus()} status='{ocr_status()}'")

# Click the Manager Code field
pyautogui.click(*MANAGER_CODE_FIELD, duration=0.2)
time.sleep(0.5)

# Try sending keys via pywinauto
print("  Sending '88' via type_keys...")
win.type_keys("88", with_spaces=True)
time.sleep(1)
snap("pywinauto_88")
print(f"  Status: '{ocr_status()}'")

# Send Tab
print("  Sending Tab...")
win.type_keys("{TAB}", with_spaces=True)
time.sleep(0.5)

# Send password
print("  Sending '12341234a' via type_keys...")
win.type_keys("12341234a", with_spaces=True)
time.sleep(1)
snap("pywinauto_pwd")
print(f"  Status: '{ocr_status()}'")

# Send Enter
print("  Sending Enter...")
win.type_keys("{ENTER}", with_spaces=True)
time.sleep(3)
snap("pywinauto_enter")
print(f"  Status: '{ocr_status()}' Title: '{ocr_title()}'")

# Check if login succeeded
center = pyautogui.screenshot(region=(150, 300, 400, 100))
t = pytesseract.image_to_string(center, config="--psm 6 --oem 3").strip()
print(f"  Center: '{t}'")

# Method 2: Try with click_input() on a specific child control
print("\n=== Method 2: pywinauto click + type_keys ===")
# Try to find any edit control
edits = win.descendants(control_type="Edit")
print(f"  Descendant edit controls: {len(edits)}")
for e in edits:
    print(f"    class={e.class_name()} rect={e.rectangle()}")

# Try all descendants
all_ctrls = win.descendants()
print(f"  All descendants: {len(all_ctrls)}")
visible = [c for c in all_ctrls if c.is_visible()]
print(f"  Visible: {len(visible)}")
for c in visible[:10]:
    cls = c.class_name()
    txt = c.window_text()[:30]
    r = c.rectangle()
    print(f"    cls={cls} text='{txt}' rect=({r.left},{r.top},{r.width()}x{r.height()})")

# Method 3: Send WM_CHAR messages
print("\n=== Method 3: WM_CHAR with ctypes ===")
import ctypes
from ctypes import wintypes

WM_CHAR = 0x0102
WM_KEYDOWN = 0x0100
WM_KEYUP = 0x0101

user32 = ctypes.windll.user32
hwnd = win.handle

def send_char(hwnd, char):
    """Send a WM_CHAR message to the window."""
    message = ctypes.c_uint(WM_CHAR)
    wparam = ctypes.wintypes.WPARAM(ord(char))
    lparam = ctypes.wintypes.LPARAM(0)
    user32.SendMessageW(hwnd, message, wparam, lparam)

def send_vk(hwnd, vk_code):
    """Send a virtual key press."""
    user32.SendMessageW(hwnd, WM_KEYDOWN, vk_code, 0)
    time.sleep(0.05)
    user32.SendMessageW(hwnd, WM_KEYUP, vk_code, 0)

pyautogui.click(*MANAGER_CODE_FIELD, duration=0.2)
time.sleep(0.5)
for ch in "88":
    send_char(hwnd, ch)
time.sleep(0.5)
send_vk(hwnd, 0x09)  # VK_TAB
time.sleep(0.5)
for ch in "12341234a":
    send_char(hwnd, ch)
time.sleep(0.5)
send_vk(hwnd, 0x0D)  # VK_RETURN
time.sleep(3)
snap("wmmessages")
print(f"  Status: '{ocr_status()}' Title: '{ocr_title()}'")

proc.terminate()
proc.wait()
print("\nDone!")
