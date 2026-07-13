"""Full GO.BAT launch sequence: VDOSPLUS first, then WINVQP93."""
import subprocess, time, os, sys
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from pywinauto import Desktop

env = os.environ.copy()
env['SERVER'] = r'\\192.168.0.3\VQPBOS'
env['SERVERPC'] = r'\\192.168.0.3'
env['REG'] = '01'
env['winvqpdebug'] = '2'

winvqp_dir = r'D:\winvqp93'
vdosplus = r'D:\WINVQP81\vDosPlus.exe'

output_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "app_structure.txt")
lines = []
lines.append("=" * 70)
lines.append("Full GO.BAT Launch Sequence")
lines.append("=" * 70)

# Step 1: Launch VDOSPLUS
lines.append(f"\n1. Launching VDOSPLUS: {vdosplus} /cfg configpos.txt")
vd = subprocess.Popen([vdosplus, '/cfg', 'configpos.txt'], cwd=winvqp_dir, env=env)
time.sleep(4)
lines.append(f"   VDOSPLUS alive: {vd.poll() is None}")

# Step 2: Launch WINVQP93
exe = os.path.join(winvqp_dir, 'WINVQP93.exe')
lines.append(f"\n2. Launching WINVQP93: {exe}")
lines.append(f"   File exists: {os.path.exists(exe)}")
proc = subprocess.Popen([exe], cwd=winvqp_dir, env=env)
time.sleep(10)
alive = proc.poll() is None
lines.append(f"   WINVQP93 alive: {alive}")
if not alive:
    lines.append(f"   Exit code: {proc.returncode}")

# Check for windows
lines.append("\n3. Visible windows with text:")
windows = Desktop(backend="win32").windows()
for w in windows:
    try:
        wt = w.window_text()
        if wt and wt.strip() and w.is_visible():
            cls = w.class_name()
            rect = w.rectangle()
            lines.append(f"   [{cls}] '{wt[:80]}' ({rect.left},{rect.top},{rect.right},{rect.bottom})")
    except:
        pass

# Try to find the app more aggressively
lines.append("\n4. Trying to find by various window titles:")
for title in ['WINVQP93', 'WINVQP', 'VQP', 'BROWNIES', 'Brownies', 'Login', 'Cashier']:
    try:
        win = Desktop(backend="win32").window(title=title)
        if win.exists():
            lines.append(f"   FOUND by '{title}': {win.window_text()} [{win.class_name()}]")
            import io
            from contextlib import redirect_stdout
            f = io.StringIO()
            with redirect_stdout(f):
                win.print_control_identifiers()
            lines.append(f.getvalue())
            break
    except Exception as e:
        lines.append(f"   NOT found by '{title}': {type(e).__name__}")

lines.append("\n5. Any new process called WINVQP*:")
import psutil
for p in psutil.process_iter(['pid', 'name']):
    try:
        if 'winvqp' in p.info['name'].lower():
            lines.append(f"   {p.info['pid']}: {p.info['name']}")
    except:
        pass

with open(output_path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))

print(f'\nSaved to: {output_path}')
if alive:
    input('\nApp is running! Press Enter to close everything...')
else:
    input('\nApp exited. Press Enter to cleanup...')

try: proc.terminate()
except: pass
try: vd.terminate()
except: pass
print('Done')
