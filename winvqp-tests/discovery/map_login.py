"""Try different keyboard interactions to discover how the login screen works."""

import subprocess, time, os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from pywinauto import Desktop

winvqp_dir = r"D:\winvqp93"
vdosplus = r"D:\WINVQP81\vDosPlus.exe"

# Launch if not running
try:
    win = Desktop(backend="win32").window(class_name="vqpmain")
    if not win.exists():
        raise Exception("not running")
    print("Connected to running app.")
except Exception:
    print("Launching app...")
    env = os.environ.copy()
    env["SERVER"] = r"\\192.168.0.3\VQPBOS"
    env["SERVERPC"] = r"\\192.168.0.3"
    env["REG"] = "01"
    env["winvqpdebug"] = "2"
    subprocess.Popen([vdosplus, "/cfg", "configpos.txt"], cwd=winvqp_dir, env=env)
    time.sleep(4)
    subprocess.Popen([os.path.join(winvqp_dir, "WINVQP93.exe")], cwd=winvqp_dir, env=env)
    time.sleep(10)
    win = Desktop(backend="win32").window(class_name="vqpmain")

win.set_focus()
time.sleep(1)

def get_status():
    try:
        s = win.child_window(class_name="msctls_statusbar32")
        return s.window_text()
    except:
        return "?"

output = []

def test_key(label, key):
    time.sleep(1)
    before = get_status()
    win.type_keys(key, with_spaces=True)
    time.sleep(2)
    after = get_status()
    line = f"  {label:20s} -> status: '{before}' -> '{after}'"
    print(line)
    output.append(line)

print("\n=== Login Screen Key Mapping ===\n")
print(f"Initial status: '{get_status()}'")

# Test various keys and shortcuts
test_key("F1", "{F1}")
test_key("F2", "{F2}")
test_key("F3", "{F3}")
test_key("F4", "{F4}")
test_key("F5", "{F5}")
test_key("F6", "{F6}")
test_key("F7", "{F7}")
test_key("F8", "{F8}")
test_key("F9", "{F9}")
test_key("F10", "{F10}")
test_key("F11", "{F11}")
test_key("F12", "{F12}")

# Test typing a number
test_key("Type '1'", "1")
test_key("Type '01'", "01")
test_key("Enter after 01", "{ENTER}")

# Test Escape
test_key("Escape", "{ESCAPE}")
test_key("Escape again", "{ESCAPE}")

# Test Tab
test_key("Tab", "{TAB}")
test_key("Tab", "{TAB}")
test_key("Enter", "{ENTER}")

# Test Alt key combos
test_key("Alt+F4", "%{F4}")

print("\n" + "=" * 50)
print("Summary of status bar changes:")
for line in output:
    print(line)

out_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "key_map.txt")
with open(out_path, "w", encoding="utf-8") as f:
    f.write("\n".join(output))
print(f"\nSaved to: {out_path}")
