"""
Launch the POS app and capture ALL controls on the login/sale screen.
This VDOSPLUS first (as GO.BAT does), then WINVQP93.exe.
"""

import subprocess, time, os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from pywinauto import Desktop

env = os.environ.copy()
env['SERVER'] = r'\\192.168.0.3\VQPBOS'
env['SERVERPC'] = r'\\192.168.0.3'
env['REG'] = '01'
env['winvqpdebug'] = '2'

winvqp_dir = r'D:\winvqp93'
vdosplus = r'D:\WINVQP81\vDosPlus.exe'

output_path = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "app_structure.txt"
)

print("=" * 70)
print("WINVQP93 - Full Control Structure Capture")
print("=" * 70)

# Launch VDOSPLUS
print("\n1. Launching VDOSPLUS...")
vd = subprocess.Popen([vdosplus, '/cfg', 'configpos.txt'], cwd=winvqp_dir, env=env)
time.sleep(4)
print(f"   VDOSPLUS OK (PID: {vd.pid})")

# Launch WINVQP93
print("\n2. Launching WINVQP93...")
proc = subprocess.Popen([r'D:\winvqp93\WINVQP93.exe'], cwd=winvqp_dir, env=env)
time.sleep(10)
alive = proc.poll() is None
print(f"   WINVQP93 running: {alive}")
if not alive:
    print(f"   Exit code: {proc.returncode}")
    vd.terminate()
    exit(1)

# Find the main window
try:
    win = Desktop(backend="win32").window(class_name="vqpmain")
    print(f"\n3. Found main window: '{win.window_text()}'")
    print(f"   Class: {win.class_name()}")
    print(f"   Rectangle: {win.rectangle()}")

    # Dump full control structure
    print("\n4. Capturing control identifiers...\n")
    win.print_control_identifiers()

    # Also dump to file
    import io
    from contextlib import redirect_stdout
    f = io.StringIO()
    with redirect_stdout(f):
        win.print_control_identifiers()
    text = f.getvalue()

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write("=== WINVQP93 Control Structure ===\n")
        f.write(f"Window: '{win.window_text()}'\n")
        f.write(f"Class: {win.class_name()}\n\n")
        f.write(text)

    print(f"\n5. Saved to: {output_path}")

except Exception as e:
    print(f"\nERROR finding window: {e}")

print("\nPress Ctrl+C to close the app and exit.")
try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    print("\nCleaning up...")
    proc.terminate()
    vd.terminate()
    print("Done")
