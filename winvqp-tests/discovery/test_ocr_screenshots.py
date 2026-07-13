"""OCR all recent screenshots to check login status."""
import pytesseract
from PIL import Image

files = [
    "method1_typewrite.png",
    "method2_numpad.png", 
    "method3_qwerty.png",
    "method4_physical.png",
    "method5_title_first.png",
]
for fname in files:
    path = f"E:\\opencode\\winvqp-tests\\assets\\screenshots\\{fname}"
    try:
        img = Image.open(path)
        sb = img.crop((50, 1045, 700, 1080))
        text = pytesseract.image_to_string(sb, config="--psm 7 --oem 3").strip()
        title = img.crop((100, 180, 300, 210))
        title_text = pytesseract.image_to_string(title, config="--psm 7 --oem 3").strip()
        center = img.crop((150, 300, 600, 500))
        center_text = pytesseract.image_to_string(center, config="--psm 6 --oem 3").strip()[:80]
        print(f"{fname}:")
        print(f"  Status: '{text}'")
        print(f"  Title: '{title_text}'")
        print(f"  Center: '{center_text}'")
        print()
    except FileNotFoundError:
        print(f"{fname}: NOT FOUND")
