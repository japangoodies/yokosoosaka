"""
UI Discovery Script for WINVQP93 POS System
Run this first to learn the app's control structure, then report back the output.
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from pywinauto import Desktop
from pages.base_page import launch_app
import time


def dump_controls(window, indent=0):
    prefix = "  " * indent
    info = []
    try:
        ctrl = window
        rect = ctrl.rectangle() if ctrl.element_info.rectangle else None
        rect_str = f"rect=({rect.left},{rect.top},{rect.right},{rect.bottom})" if rect else ""

        info.append(
            f"{prefix}{ctrl.element_info.class_name or '(no class)'} | "
            f"text='{ctrl.window_text()[:60]}' | "
            f"{rect_str}"
        )

        for child in ctrl.children():
            try:
                info.extend(dump_controls(child, indent + 1))
            except Exception:
                pass
    except Exception as e:
        info.append(f"{prefix}[Error: {e}]")
    return info


def interactive_discovery():
    print("=" * 70)
    print("WINVQP93 UI Discovery Tool")
    print("=" * 70)
    print()
    print("This script will help us learn the app's control structure.")
    print()
    print("Steps:")
    print("1. The app will launch (using GO.BAT-like sequence).")
    print("2. Navigate to each screen you want to capture.")
    print("3. Press Enter in this console when you're on the target screen.")
    print("4. Press q + Enter to quit after capturing all screens.")
    print()

    input("Press Enter to launch the app...")

    try:
        main_proc = launch_app()
    except Exception as e:
        print(f"Failed to launch app: {e}")
        return

    captures = {}

    while True:
        print("\n" + "-" * 70)
        print("Navigate to the screen you want to capture, then:")
        print("  Enter     = capture current screen")
        print("  q + Enter = quit")
        cmd = input("> ").strip().lower()

        if cmd == "q":
            break

        if cmd == "":
            try:
                top_windows = Desktop(backend="win32").windows()
                active = [w for w in top_windows if w.is_visible() and w.window_text().strip()]
                if not active:
                    print("No visible windows found. Make sure the app is running.")
                    continue

                print(f"\nFound {len(active)} visible windows.")

                for i, w in enumerate(active):
                    print(f"\n--- Window {i + 1}: '{w.window_text()}' ({w.class_name}) ---")
                    try:
                        controls = dump_controls(w)
                        for line in controls:
                            print(line)
                    except Exception as e:
                        print(f"  [Error dumping controls: {e}]")

                name = input("\nName this screen (e.g., 'login', 'sale', 'payment'): ").strip()
                if name:
                    captures[name] = active

            except Exception as e:
                print(f"Error: {e}")

        print(f"\nCaptured screens so far: {', '.join(captures.keys()) if captures else 'none'}")

    print("\n" + "=" * 70)
    print("Discovery complete!")
    print("Please copy the full output above and share it with me.")
    print("=" * 70)

    try:
        main_proc.terminate()
    except Exception:
        pass


if __name__ == "__main__":
    interactive_discovery()
