"""Test clicking on Manager Code field and typing."""

import subprocess, time, os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from pywinauto import Desktop
from pywinauto.keyboard import send_keys
import pytesseract
from PIL import Image

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# Launch
env = os.environ.copy()
env["SERVER"] = r"\\192.168.0.3\VQPBOS"
env["SERVERPC"] = r"\\192.168.0.3"
env["REG"] = "01"
env["winvqpdebug"] = "2"

proc = subprocess.Popen(
    [r"D:\winvqp93\WINVQP93.exe"],
    cwd=r"D:\winvqp93",
    env=env
)
time.sleep(10)

win = Desktop(backend="win32").window(class_name="vqpmain")
win.click_input()
time.sleep(1)

def ocr_screen():
    img = win.capture_as_image()
    text = pytesseract.image_to_string(img, config="--psm 6")
    return text, img

print("Initial screen:")
text0, _ = ocr_screen()
print(text0[:500])
print("---")

# Click on Manager Code field area
# Label "Manager Code:" at ~(480, 330), field likely to the right
field_x = 600
field_y = 340
print(f"\nClicking Manager Code field at ({field_x}, {field_y})...")
win.click_input(coords=(field_x, field_y))
time.sleep(1)

# Send keyboard input
print("Sending keys '1'...")
send_keys("1")
time.sleep(1)

text1, img1 = ocr_screen()
print("After typing 1:")
print(text1[:500])
print("---")

# Send more
print("Sending '234'...")
send_keys("234")
time.sleep(1)

text2, img2 = ocr_screen()
print("After typing 234:")
print(text2[:500])
print("---")

# Screenshots
out_dir = os.path.dirname(os.path.abspath(__file__))
img1.save(os.path.join(out_dir, "login_test_1.png"))
img2.save(os.path.join(out_dir, "login_test_234.png"))

# Check if "Manager Code:" label changed
for label in ["Manager Code:", "Manager Code", "Code:", "Code"]:
    if label in text1 and label not in text0:
        print(f"\nDetected '{label}' change!")

proc.terminate()
proc.wait()
print("Done")
