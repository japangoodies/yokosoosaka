"""Find how to log in by trying different key sequences."""

import subprocess, time, os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from pywinauto import Desktop
from pywinauto.keyboard import send_keys

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
out_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "login_test.txt")

def get_status():
    try:
        return win.child_window(class_name="msctls_statusbar32").window_text()
    except:
        return "?"

results = []

def try_seq(label, seq, wait=2):
    before = get_status()
    print(f"  {label}: sending keys...", end=" ", flush=True)
    try:
        send_keys(seq)
        time.sleep(wait)
        after = get_status()
        changed = " <<<" if before != after else ""
        print(f"'{before}' -> '{after}'{changed}")
        results.append(f"{label:30s} {before:20s} -> {after:20s}{changed}")
    except Exception as e:
        print(f"ERROR: {e}")
        results.append(f"{label:30s} ERROR: {e}")

print(f"\nInitial status: '{get_status()}'\n")

# Try clicking first to activate
win.click_input()
time.sleep(1)
print(f"Clicked center, status: '{get_status()}'")

# Try different login approaches
try_seq("F1", "{F1}")
try_seq("F2", "{F2}")
try_seq("F3", "{F3}")
try_seq("F4", "{F4}")
try_seq("F5", "{F5}")
try_seq("F6", "{F6}")
try_seq("F7", "{F7}")
try_seq("F8", "{F8}")
try_seq("F9", "{F9}")
try_seq("F10", "{F10}")
try_seq("F11", "{F11}")
try_seq("F12", "{F12}")

# Common POS login: type number then Enter
try_seq("Type '1'", "1")
try_seq("Enter", "{ENTER}", 3)
try_seq("Escape", "{ESCAPE}")

# Try typing cashier code with different separators
try_seq("CTRL+1", "^{1}")
try_seq("ALT+1", "%{1}")

# Screenshot
img = win.capture_as_image()
img_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "login_test.png")
img.save(img_path)

results.append(f"\nScreenshot saved: {img_path}")

with open(out_path, "w", encoding="utf-8") as f:
    f.write("\n".join(results))
print(f"\nResults saved to: {out_path}")

proc.terminate()
proc.wait()
print("Done")
