"""OCR analysis of login screenshot for coordinate mapping."""
import pytesseract
from PIL import Image

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

img = Image.open(r"E:\opencode\winvqp-tests\discovery\login_test_1.png")
w, h = img.size
print(f"Image size: {w}x{h}")
print()

data = pytesseract.image_to_data(img, output_type=pytesseract.Output.DICT)

print("=== All detected text (conf > 30) ===")
for i in range(len(data["text"])):
    text = data["text"][i].strip()
    conf = data["conf"][i]
    if text and conf != -1 and conf > 30:
        left = data["left"][i]
        top = data["top"][i]
        width = data["width"][i]
        height = data["height"][i]
        cx = left + width // 2
        cy = top + height // 2
        print(f"  {text:25s} conf={conf:3d} L={left:4d} T={top:4d} W={width:4d} H={height:3d} cx={cx:4d} cy={cy:4d}")

print()
print("=== Virtual keyboard area analysis ===")
# Focus on y > 500 (keyboard area)
for i in range(len(data["text"])):
    text = data["text"][i].strip()
    conf = data["conf"][i]
    if text and conf != -1 and conf > 20 and data["top"][i] > 450:
        left = data["left"][i]
        top = data["top"][i]
        width = data["width"][i]
        height = data["height"][i]
        cx = left + width // 2
        cy = top + height // 2
        print(f"  {text:10s} conf={conf:3d} L={left:4d} T={top:4d} W={width:4d} H={height:3d} cx={cx:4d} cy={cy:4d}")

print()
print("=== Login fields area (y 200-450) ===")
for i in range(len(data["text"])):
    text = data["text"][i].strip()
    conf = data["conf"][i]
    if text and conf != -1 and conf > 20 and 200 <= data["top"][i] <= 450:
        left = data["left"][i]
        top = data["top"][i]
        width = data["width"][i]
        height = data["height"][i]
        cx = left + width // 2
        cy = top + height // 2
        print(f"  {text:25s} conf={conf:3d} L={left:4d} T={top:4d} W={width:4d} H={height:3d} cx={cx:4d} cy={cy:4d}")
