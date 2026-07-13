"""Analyze the login screenshot to find element positions using OCR."""
import pytesseract
from PIL import Image

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

img = Image.open(r"E:\opencode\winvqp-tests\discovery\login_test.png")
w, h = img.size
print(f"Image size: {w}x{h}")
print()

# Get detailed bounding box data
data = pytesseract.image_to_data(img, output_type=pytesseract.Output.DICT)
print(f"Found {len(data['text'])} text elements")
print()
print(f"{'Text':25s} {'Conf':5s} {'Left':5s} {'Top':5s} {'W':5s} {'H':5s} {'CenterX':8s} {'CenterY':8s}")
print("-" * 70)

for i in range(len(data["text"])):
    text = data["text"][i].strip()
    conf = data["conf"][i]
    if text and conf != -1 and conf > 20:
        left = data["left"][i]
        top = data["top"][i]
        width = data["width"][i]
        height = data["height"][i]
        cx = left + width // 2
        cy = top + height // 2
        print(f"{text:25s} {conf:5d} {left:5d} {top:5d} {width:5d} {height:5d} {cx:8d} {cy:8d}")

print()
print("=" * 70)
print("KEY ELEMENT POSITIONS (relative to 1920x1080):")
print("=" * 70)

# Specifically find labels and fields
print("\nSearching for specific elements...")
for i in range(len(data["text"])):
    text = data["text"][i].strip().lower()
    conf = data["conf"][i]
    if conf != -1 and conf > 20:
        if "manager" in text and "code" in text:
            left = data["left"][i]
            top = data["top"][i]
            print(f"  'Manager Code' label: ({left},{top}) size=({data['width'][i]}x{data['height'][i]})")
            print(f"  Likely field center: ~({left + data['width'][i] + 50}, {top + data['height'][i]//2})")
        if "password" in text:
            left = data["left"][i]
            top = data["top"][i]
            print(f"  'Password' label: ({left},{top}) size=({data['width'][i]}x{data['height'][i]})")

# Find the button labels
for i in range(len(data["text"])):
    text = data["text"][i].strip()
    conf = data["conf"][i]
    if conf != -1 and conf > 20 and len(text) <= 3:
        left = data["left"][i]
        top = data["top"][i]
        if top > 200:  # Only virtual keyboard buttons
            pass  # We'll handle these separately

# Print bottom part analysis
print("\nStatus bar area (bottom 50px):")
for i in range(len(data["text"])):
    if data["top"][i] > 1030:
        text = data["text"][i].strip()
        if text:
            print(f"  '{text}' at ({data['left'][i]},{data['top'][i]})")

print("\nTop bar area (header, top 100px):")
for i in range(len(data["text"])):
    if data["top"][i] < 100:
        text = data["text"][i].strip()
        if text:
            print(f"  '{text}' at ({data['left'][i]},{data['top'][i]})")
