"""Find and dump the POS app window specifically."""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from pywinauto import Desktop
import time

output_path = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "app_structure.txt"
)

all_lines = []
all_lines.append("=" * 70)
all_lines.append("WINVQP93 - Targeted Window Search")
all_lines.append(f"Generated: {time.strftime('%Y-%m-%d %H:%M:%S')}")
all_lines.append("=" * 70)

# Check if app process is running
import subprocess
result = subprocess.run(["tasklist", "/FI", "IMAGENAME eq WINVQP93.exe", "/NH"],
                       capture_output=True, text=True, timeout=10)
all_lines.append(f"Process check: {result.stdout.strip() or 'not found'}")

# Dump ALL windows with their info
windows = Desktop(backend="win32").windows()
all_lines.append(f"\nTotal top-level windows: {len(windows)}")

keywords = ['WINVQP', 'VQP', 'BROWNIES', 'POS', 'Brownies', 'vqp', 'login',
            'cashier', 'register', 'sale', 'pos']

found_any = False
for w in windows:
    try:
        wt = w.window_text()
        cls = w.class_name()
        vis = w.is_visible()
        enabled = w.is_enabled()
        rect = w.rectangle()
        rid = w.element_info.control_id

        # Show ALL windows with non-empty text (to find the POS app)
        if wt and wt.strip():
            match_tag = ""
            if any(k.lower() in wt.lower() for k in keywords):
                match_tag = " <<<"
                found_any = True
            all_lines.append(
                f"  [{cls}] id={rid} vis={vis} en={enabled} "
                f"({rect.left},{rect.top},{rect.right},{rect.bottom}) "
                f"'{wt[:80]}'{match_tag}"
            )
    except Exception as e:
        pass

# Also show windows with specific class names
all_lines.append(f"\n--- Windows with Button/Edit/ListBox classes ---")
for w in windows:
    try:
        cls = w.class_name()
        if cls in ['Button', 'Edit', 'ListBox', 'SysListView32', '#32770']:
            wt = w.window_text() or ''
            vis = w.is_visible()
            rect = w.rectangle()
            all_lines.append(f"  [{cls}] vis={vis} '{wt[:60]}' ({rect.left},{rect.top},{rect.right},{rect.bottom})")
    except:
        pass

if not found_any:
    all_lines.append(f"\n[NOTE] No POS-related windows found. The app may not have launched.")

all_lines.append("\n" + "=" * 70)
all_lines.append("END")

with open(output_path, "w", encoding="utf-8") as f:
    f.write("\n".join(all_lines))

print(f"Saved to: {output_path}")
print(f"Found any POS windows: {found_any}")
