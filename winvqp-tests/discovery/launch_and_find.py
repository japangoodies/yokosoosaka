"""Launch WINVQP93 and capture its window structure."""
import subprocess, time, os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from pywinauto import Desktop

output_path = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "app_structure.txt"
)

exe = r"D:\winvqp93\WINVQP93.exe"
if not os.path.exists(exe):
    print(f"ERROR: {exe} not found")
    exit(1)

proc = subprocess.Popen([exe], cwd=r"D:\winvqp93")
print(f"Launched PID: {proc.pid}")
time.sleep(8)

alive = proc.poll() is None
print(f"Process still running: {alive}")
if not alive:
    print(f"Process exited with code: {proc.returncode}")

lines = []
lines.append("=" * 70)
lines.append("WINVQP93 - Launch & Capture")
lines.append(f"PID: {proc.pid}  Still running: {alive}")
lines.append("=" * 70)

windows = Desktop(backend="win32").windows()
lines.append(f"\nTotal windows: {len(windows)}")

lines.append("\n--- All VISIBLE windows with text ---")
for w in windows:
    try:
        wt = w.window_text()
        cls = w.class_name()
        vis = w.is_visible()
        if vis and wt and wt.strip():
            rect = w.rectangle()
            lines.append(f"  [{cls}] ({rect.left},{rect.top},{rect.right},{rect.bottom}) '{wt[:100]}'")
    except:
        pass

lines.append("\n--- Searching for WINVQP93 window ---")
try:
    win = Desktop(backend="win32").window(title_re=".*WINVQP.*|.*VQP.*|.*vqp.*|.*Brownies.*|.*POS.*")
    lines.append(f"  FOUND: '{win.window_text()}' class={win.class_name()}")
    import io
    from contextlib import redirect_stdout
    f = io.StringIO()
    with redirect_stdout(f):
        win.print_control_identifiers()
    lines.append(f.getvalue())
except Exception as e:
    lines.append(f"  Not found by title_re: {e}")

lines.append("\n--- Searching for #32770 (dialog) windows ---")
for w in windows:
    try:
        if w.class_name() == "#32770" and w.is_visible():
            wt = w.window_text()[:100] if w.window_text() else "(empty)"
            rect = w.rectangle()
            lines.append(f"  '{wt}' ({rect.left},{rect.top},{rect.right},{rect.bottom})")
    except:
        pass

lines.append("\n--- Looking for any process named WINVQP* ---")
import psutil
for proc_info in psutil.process_iter(['pid', 'name', 'status']):
    try:
        if 'winvqp' in proc_info.info['name'].lower():
            lines.append(f"  PID:{proc_info.info['pid']} {proc_info.info['name']} ({proc_info.info['status']})")
    except:
        pass

with open(output_path, "w", encoding="utf-8") as f:
    f.write("\n".join(lines))

print(f"\nSaved to: {output_path}")
input("\nPress Enter to close app...")
proc.terminate()
proc.wait()
print("App closed.")
