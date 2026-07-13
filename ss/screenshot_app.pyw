import mss
import mss.tools
from pynput import keyboard
from pathlib import Path
from datetime import datetime
import threading
import queue
import sys
import os

SAVE_DIR = Path.home() / "Desktop" / "screenshots"
SAVE_DIR.mkdir(exist_ok=True)

event_queue = queue.Queue()


def take_screenshot():
    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S-%f")[:-3]
    filename = f"screenshot_{timestamp}.png"
    filepath = SAVE_DIR / filename

    with mss.mss() as sct:
        monitor = sct.monitors[0]
        sct_img = sct.grab(monitor)
        mss.tools.to_png(sct_img.rgb, sct_img.size, output=str(filepath))

    print(f"Saved: {filepath}")


def on_press(key):
    try:
        if key == keyboard.Key.delete:
            event_queue.put("capture")
    except AttributeError:
        pass


def worker():
    while True:
        event_queue.get()
        take_screenshot()


def main():
    threading.Thread(target=worker, daemon=True).start()

    with keyboard.Listener(on_press=on_press) as listener:
        listener.join()


if __name__ == "__main__":
    main()
