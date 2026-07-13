"""Explore the running app: screenshot + keyboard interaction test."""

import subprocess, time, os, sys
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from pywinauto import Desktop

winvqp_dir = r"D:\winvqp93"
vdosplus = r"D:\WINVQP81\vDosPlus.exe"
exe = os.path.join(winvqp_dir, "WINVQP93.exe")

# Check if app is already running
app_was_running = False
try:
    win = Desktop(backend="win32").window(class_name="vqpmain")
    if win.exists():
        app_was_running = True
        print(f"App already running: '{win.window_text()}'")
except Exception:
    pass

if not app_was_running:
    print("Launching app (VDOSPLUS + WINVQP93)...")
    env = os.environ.copy()
    env["SERVER"] = r"\\192.168.0.3\VQPBOS"
    env["SERVERPC"] = r"\\192.168.0.3"
    env["REG"] = "01"
    env["winvqpdebug"] = "2"

    if os.path.exists(vdosplus):
        subprocess.Popen([vdosplus, "/cfg", "configpos.txt"], cwd=winvqp_dir, env=env)
        time.sleep(4)

    proc = subprocess.Popen([exe], cwd=winvqp_dir, env=env)
    time.sleep(10)
    win = Desktop(backend="win32").window(class_name="vqpmain")

output_dir = os.path.dirname(os.path.abspath(__file__))

# Screenshot 1 - before interaction
img = win.capture_as_image()
img.save(os.path.join(output_dir, "screenshot_login.png"))
print(f"\nScreenshot 1 saved: {img.size}")

# Read status bar
try:
    status = win.child_window(class_name="msctls_statusbar32")
    print(f"Status bar text: '{status.window_text()}'")
except Exception as e:
    print(f"Status bar error: {e}")

# Try keyboard interaction - typical POS login
print("\nSending keyboard input...")
win.click_input()
time.sleep(0.5)

# Type cashier code 1 and press Enter
print("Typing '1' + Enter...")
win.type_keys("1", with_spaces=True)
time.sleep(1)
win.type_keys("{ENTER}")
time.sleep(3)

# Screenshot 2 - after login attempt
img2 = win.capture_as_image()
img2.save(os.path.join(output_dir, "screenshot_after_login.png"))
print(f"Screenshot 2 saved: {img2.size}")

# Check status bar again
try:
    status = win.child_window(class_name="msctls_statusbar32")
    print(f"Status bar after: '{status.window_text()}'")
except Exception as e:
    print(f"Status bar error after: {e}")

# Dump any new controls that appeared
print("\nAll controls now:")
try:
    for ctrl in win.children():
        try:
            cls = ctrl.class_name()
            txt = ctrl.window_text()[:60] if ctrl.window_text() else ""
            rect = ctrl.rectangle()
            print(f"  [{cls}] '{txt}' ({rect.left},{rect.top},{rect.right},{rect.bottom})")
        except:
            pass
except Exception as e:
    print(f"Error: {e}")

# Recursive dump
print("\nFull control tree:")
import io
from contextlib import redirect_stdout
f = io.StringIO()
with redirect_stdout(f):
    win.print_control_identifiers()
output = f.getvalue()
out_path = os.path.join(output_dir, "app_structure.txt")
with open(out_path, "w", encoding="utf-8") as f:
    f.write(output)
print(output)

print(f"\nScreenshots: {os.path.join(output_dir, 'screenshot_login.png')}")
print(f"Controls: {out_path}")
print("\nPress Ctrl+C to close the app.")
try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    print("\nCleaning up...")
    if not app_was_running:
        try: proc.terminate()
        except: pass
    print("Done")
