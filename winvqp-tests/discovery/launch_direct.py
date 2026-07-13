"""Launch WINVQP93 directly (no VDOSPLUS) with env vars from GO.BAT."""
import subprocess, time, os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from pywinauto import Desktop

env = os.environ.copy()
env["SERVER"] = r"\\192.168.0.3\VQPBOS"
env["SERVERPC"] = r"\\192.168.0.3"
env["REG"] = "01"
env["winvqpdebug"] = "2"

print("Launching WINVQP93.exe directly (no VDOSPLUS)...")
proc = subprocess.Popen(
    [r"D:\winvqp93\WINVQP93.exe"],
    cwd=r"D:\winvqp93",
    env=env
)
time.sleep(10)

alive = proc.poll() is None
print(f"Running: {alive}")
if not alive:
    print(f"Exit code: {proc.returncode}")
    exit(1)

win = Desktop(backend="win32").window(class_name="vqpmain")
print(f"Window: '{win.window_text()}'")
try:
    status = win.child_window(class_name="msctls_statusbar32")
    print(f"Status: '{status.window_text()}'")
except Exception as e:
    print(f"Status error: {e}")

time.sleep(3)
proc.terminate()
proc.wait()
print("Done")
