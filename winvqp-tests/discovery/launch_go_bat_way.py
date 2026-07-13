"""Launch WINVQP93 following GO.BAT exactly, then capture the window."""

import subprocess, time, os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from pywinauto import Desktop

output_path = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "app_structure.txt"
)

# Set environment variables exactly like GO.BAT
env = os.environ.copy()
env["SERVER"] = r"\\192.168.0.3\VQPBOS"
env["SERVERPC"] = r"\\192.168.0.3"
env["REG"] = "01"
env["winvqpdebug"] = "2"

winvqp_dir = r"D:\winvqp93"

lines = []
lines.append("=" * 70)
lines.append("WINVQP93 - Launch via GO.BAT sequence")
lines.append("=" * 70)

# Step 1: Try VDOSPLUS.EXE from D:\WINVQP81
vdosplus_path = r"D:\WINVQP81\vDosPlus.exe"
config_path = os.path.join(winvqp_dir, "configpos.txt")
if os.path.exists(vdosplus_path):
    cfg_arg = config_path if os.path.exists(config_path) else None
    cmd = [vdosplus_path, "/cfg", cfg_arg] if cfg_arg else [vdosplus_path]
    lines.append(f"\nLaunching VDOSPLUS: {' '.join(cmd)}")
    lines.append(f"  VDOSPLUS exists: {os.path.exists(vdosplus_path)}")
    lines.append(f"  Config exists: {os.path.exists(config_path)}")
    vd_proc = subprocess.Popen(cmd, cwd=winvqp_dir, env=env)
    lines.append(f"  VDOSPLUS PID: {vd_proc.pid}")
    time.sleep(2)
else:
    lines.append(f"\nVDOSPLUS not found at {vdosplus_path}, skipping...")
    vd_proc = None

# Step 2: Launch WINVQP93.exe
exe_path = os.path.join(winvqp_dir, "WINVQP93.exe")
lines.append(f"\nLaunching: {exe_path}")
lines.append(f"  Exists: {os.path.exists(exe_path)}")
lines.append(f"  CWD: {winvqp_dir}")

proc = subprocess.Popen([exe_path], cwd=winvqp_dir, env=env)
lines.append(f"  PID: {proc.pid}")

time.sleep(10)  # Give it time to initialize

# Check process status
alive = proc.poll() is None
lines.append(f"\n  Process still running: {alive}")
if not alive:
    lines.append(f"  Exit code: {proc.returncode}")

if vd_proc:
    vd_alive = vd_proc.poll() is None
    lines.append(f"  VDOSPLUS still running: {vd_alive}")

# Check for any new windows
lines.append("\n--- All VISIBLE windows with text ---")
windows = Desktop(backend="win32").windows()
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

# Search specifically
lines.append("\n--- Specific search for POS window ---")
try:
    win = Desktop(backend="win32").window(title_re=".*WINVQP.*|.*VQP.*|.*vqp.*|.*POS.*|.*Login.*|.*Brownies.*|.*BROWNIES.*")
    lines.append(f"  FOUND: '{win.window_text()}' class={win.class_name()}")
except Exception as e:
    lines.append(f"  Not found: {e}")

# Try to find any dialog
lines.append("\n--- All visible #32770 dialogs ---")
for w in windows:
    try:
        if w.class_name() == "#32770" and w.is_visible():
            wt = w.window_text()[:100] if w.window_text() else "(empty)"
            lines.append(f"  '{wt}'")
    except:
        pass

with open(output_path, "w", encoding="utf-8") as f:
    f.write("\n".join(lines))

print(f"\nSaved to: {output_path}")
print("\nCheck the file. Press Enter to close everything...")
input()
try:
    proc.terminate()
except:
    pass
if vd_proc:
    try:
        vd_proc.terminate()
    except:
        pass
