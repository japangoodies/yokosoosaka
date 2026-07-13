"""Test different ways to interact with the app window."""

import subprocess, time, os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from pywinauto import Desktop
from pywinauto.keyboard import send_keys

# Launch
env = os.environ.copy()
env["SERVER"] = r"\\192.168.0.3\VQPBOS"
env["SERVERPC"] = r"\\192.168.0.3"
env["REG"] = "01"
env["winvqpdebug"] = "2"

proc = subprocess.Popen(
    [r"D:\winvqp93\WINVQP93.exe"],
    cwd=r"D:\winvqp93",
    env=env
)
time.sleep(10)

win = Desktop(backend="win32").window(class_name="vqpmain")
print(f"Window: '{win.window_text()}'")
print(f"Visible: {win.is_visible()}")
print(f"Enabled: {win.is_enabled()}")
print(f"Active: {win.is_active()}")

rect = win.rectangle()
print(f"Rectangle: {rect}")

# Try clicking in the center to set focus
print("\nClicking window to set focus...")
try:
    win.click_input()
    time.sleep(1)
    print(f"After click - Active: {win.is_active()}")
except Exception as e:
    print(f"click_input failed: {e}")

# Try sending keys using different methods
print("\nTrying type_keys with set_foreground=True...")
try:
    win.type_keys("{F1}", with_spaces=True)
    print("  type_keys(F1) OK")
    time.sleep(2)
except Exception as e:
    print(f"  type_keys(F1) failed: {e}")

print("\nTrying send_keys (keyboard module)...")
try:
    send_keys("{F1}")
    print("  send_keys(F1) OK")
    time.sleep(2)
except Exception as e:
    print(f"  send_keys(F1) failed: {e}")

# Check status
try:
    status = win.child_window(class_name="msctls_statusbar32")
    print(f"\nStatus: '{status.window_text()}'")
except Exception as e:
    print(f"Status error: {e}")

# Try click at specific coordinate
print(f"\nTrying click at center: ({rect.mid_point().x}, {rect.mid_point().y})")
try:
    win.click_input(coords=(rect.mid_point().x - rect.left, rect.mid_point().y - rect.top))
    time.sleep(1)
    print("  click at center OK")
except Exception as e:
    print(f"  click at center failed: {e}")

# Try sending text
print("\nTrying to send 'cashier1'...")
try:
    win.type_keys("cashier1", with_spaces=True)
    print("  typing OK")
    time.sleep(1)
except Exception as e:
    print(f"  typing failed: {e}")

# Take screenshot
img = win.capture_as_image()
img_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "interaction_test.png")
img.save(img_path)
print(f"\nScreenshot: {img_path}")

proc.terminate()
proc.wait()
print("Done")
