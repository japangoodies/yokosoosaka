"""
Capture the POS app's window structure while it's running.
Launch the app manually first, then run this script.
"""

import sys, os, time
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from pywinauto import Desktop

output_path = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "app_structure.txt"
)

print("=" * 70)
print("WINVQP93 - Capture Running App")
print("=" * 70)
print()
print("1. Launch WINVQP93 manually (via GO.BAT or however you normally do it)")
print("2. Navigate to the Login screen")
print("3. Press Enter here to capture the window structure")
print()

input("Press Enter when the app is running and on the Login screen...")

lines = []
lines.append("=" * 70)
lines.append("WINVQP93 - Running App Capture")
lines.append(f"Generated: {time.strftime('%Y-%m-%d %H:%M:%S')}")
lines.append("=" * 70)

# First, try to find the app window
windows = Desktop(backend="win32").windows()

# Look for the POS app by checking common window title keywords
pos_keywords = ['WINVQP', 'VQP', 'BROWNIES', 'Brownies', 'POS', 'Login',
                'Cashier', 'Register', 'Point of Sale', 'vqp', 'sale']

found_windows = []
for w in windows:
    try:
        wt = w.window_text()
        cls = w.class_name()
        if wt and wt.strip():
            for kw in pos_keywords:
                if kw.lower() in wt.lower():
                    found_windows.append((w, kw))
                    break
    except:
        pass

if found_windows:
    lines.append(f"\nFound {len(found_windows)} potential POS windows:")
    for w, kw in found_windows:
        try:
            rect = w.rectangle()
            lines.append(f"  [{w.class_name()}] '{w.window_text()[:80]}' "
                        f"({rect.left},{rect.top},{rect.right},{rect.bottom}) "
                        f"[matched: '{kw}']")
        except:
            pass

# Also show all visible windows with their classes for finding the right one
lines.append("\n--- All visible windows ---")
for w in windows:
    try:
        wt = w.window_text()
        cls = w.class_name()
        vis = w.is_visible()
        if vis and wt and wt.strip():
            rect = w.rectangle()
            if rect.width < 1920 and rect.height < 1080:  # skip fullscreen windows
                lines.append(f"  [{cls}] '{wt[:80]}' ({rect.left},{rect.top},{rect.right},{rect.bottom})")
    except:
        pass

# If no POS windows found, let user manually identify
if not found_windows:
    lines.append("\n[No POS windows automatically identified]")
    lines.append("\nLet's try to find any non-system window that appeared recently.")
    lines.append("Enter the EXACT text of the window title you see (or 'skip'): ")
    title = input("Window title text: ").strip()
    if title and title.lower() != 'skip':
        try:
            win = Desktop(backend="win32").window(title=title)
            lines.append(f"\n--- Structure of '{title}' ---")
            import io
            from contextlib import redirect_stdout
            f = io.StringIO()
            with redirect_stdout(f):
                win.print_control_identifiers()
            lines.append(f.getvalue())
        except Exception as e:
            lines.append(f"Could not find: {e}")

with open(output_path, "w", encoding="utf-8") as f:
    f.write("\n".join(lines))

print(f"\nSaved to: {output_path}")
print("\nYou can now close the app. Share the file contents with me.")
input("Press Enter to exit...")
