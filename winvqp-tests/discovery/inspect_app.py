"""
Simple app inspector. Launch this with the app already running, or let it launch the app.
Dumps all visible windows and their control hierarchies to a text file.
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from pywinauto import Desktop
from pages.base_page import launch_app
import time
import traceback


def dump_ctrl(ctrl, depth=0, lines=None):
    if lines is None:
        lines = []
    prefix = "  " * depth
    try:
        cls = ctrl.element_info.class_name or "(no class)"
        text = (ctrl.window_text() or "")[:80]
        rect = ctrl.rectangle()
        cid = ctrl.element_info.control_id
        auto_id = ctrl.element_info.automation_id
        rect_s = f"({rect.left},{rect.top},{rect.right},{rect.bottom})"
        cid_s = f" id={cid}" if cid else ""
        aid_s = f" auto_id={auto_id}" if auto_id else ""
        lines.append(f"{prefix}[{cls}] text='{text}' {rect_s}{cid_s}{aid_s}")
    except Exception:
        try:
            lines.append(f"{prefix}[Error reading control]")
        except Exception:
            pass
    try:
        for child in ctrl.children():
            try:
                dump_ctrl(child, depth + 1, lines)
            except Exception:
                lines.append(f"{prefix}  [Error reading child]")
    except Exception:
        lines.append(f"{prefix}  [Error enumerating children]")
    return lines


def main():
    output_path = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        "discovery", "app_structure.txt"
    )

    all_lines = []
    all_lines.append("=" * 70)
    all_lines.append("WINVQP93 UI Structure Dump")
    all_lines.append(f"Generated: {time.strftime('%Y-%m-%d %H:%M:%S')}")
    all_lines.append("=" * 70)
    all_lines.append("")

    main_proc = None

    # First, try to connect to an already-running instance
    try:
        win = Desktop(backend="win32").window(title="WINVQP93")
        if win.exists():
            all_lines.append("Connected to running WINVQP93 instance.")
    except Exception:
        all_lines.append("No running instance found. Launching (uses GO.BAT sequence)...")
        try:
            main_proc = launch_app()
            all_lines.append("App launched successfully.")
        except Exception as e:
            all_lines.append(f"FAILED to launch: {e}")
            all_lines.append("")
            all_lines.append("Make sure the path exists and the app can run.")
            with open(output_path, "w", encoding="utf-8") as f:
                f.write("\n".join(all_lines))
            print(f"Output saved to: {output_path}")
            return

    all_lines.append("")

    # Dump all top-level windows
    try:
        windows = Desktop(backend="win32").windows()
        all_lines.append(f"Total top-level windows: {len(windows)}")
        all_lines.append("")

        for i, w in enumerate(windows):
            try:
                if not w.is_visible():
                    continue
                wt = w.window_text()
                if not wt:
                    continue
                all_lines.append(f"--- Window {i+1}: '{wt}' ({w.class_name}) ---")
                lines = dump_ctrl(w)
                all_lines.extend(lines)
                all_lines.append("")
            except Exception as e:
                all_lines.append(f"  [Error: {e}]")
    except Exception as e:
        all_lines.append(f"Desktop enumeration error: {e}")
        all_lines.append(traceback.format_exc())

    all_lines.append("=" * 70)
    all_lines.append("END OF STRUCTURE DUMP")
    all_lines.append("=" * 70)

    with open(output_path, "w", encoding="utf-8") as f:
        f.write("\n".join(all_lines))

    print(f"Structure dump saved to: {output_path}")
    print(f"File size: {os.path.getsize(output_path)} bytes")

    if main_proc:
        input("\nPress Enter to close the app...")
        try:
            main_proc.terminate()
        except Exception:
            pass


if __name__ == "__main__":
    main()
