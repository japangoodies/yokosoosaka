"""Map out which keys/combinations work on the login screen."""

import subprocess, time, os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from pywinauto import Desktop

# Launch the app
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
win.set_focus()
time.sleep(1)

output_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "key_map.txt")
lines = []
lines.append("=" * 60)
lines.append("WINVQP93 Keyboard Mapping")
lines.append("=" * 60)

def get_status():
    try:
        return win.child_window(class_name="msctls_statusbar32").window_text()
    except:
        return "?"

def try_key(label, keystroke, wait=2):
    before = get_status()
    win.type_keys(keystroke, with_spaces=True)
    time.sleep(wait)
    after = get_status()
    changed = "***" if before != after else ""
    line = f"  {label:30s} {before:20s} -> {after:20s} {changed}"
    print(line)
    lines.append(line)
    return before, after

lines.append(f"\nInitial status: '{get_status()}'\n")

# Function keys
try_key("F1", "{F1}")
try_key("F2", "{F2}")
try_key("F10", "{F10}")
try_key("F12", "{F12}")
try_key("Escape", "{ESCAPE}")
try_key("Escape x2", "{ESCAPE}")

# Try login with different inputs
try_key("Type '1'", "1")
try_key("Enter", "{ENTER}", wait=3)
try_key("Status after login", "")

# Screenshot current state
img = win.capture_as_image()
img_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "after_login.png")
img.save(img_path)
lines.append(f"\nScreenshot saved: {img_path}")

# If still on login, try typing 01
try_key("Type '01'", "01")
try_key("Enter", "{ENTER}", wait=3)
try_key("Status after 01 login", "")

# Try other common POS keys
try_key("F11", "{F11}")
try_key("F3 (Void)", "{F3}")
try_key("F4", "{F4}")
try_key("F5", "{F5}")
try_key("F6", "{F6}")
try_key("F7", "{F7}")
try_key("F8", "{F8}")
try_key("F9 (Report)", "{F9}")
try_key("Tab", "{TAB}")
try_key("Enter again", "{ENTER}", wait=3)

try_key("Ctrl+Shift+F1", "^+{F1}")
try_key("Ctrl+F1", "^{F1}")
try_key("Alt+F1", "%{F1}")

lines.append("\n" + "=" * 60)
lines.append("END")

with open(output_path, "w", encoding="utf-8") as f:
    f.write("\n".join(lines))

print(f"\nKey map saved to: {output_path}")
print("Cleaning up...")
proc.terminate()
proc.wait()
