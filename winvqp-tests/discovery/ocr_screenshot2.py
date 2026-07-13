"""OCR analysis of second screenshot for number pad coordinates."""
import pytesseract
from PIL import Image

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

for fname in ["login_test_234.png", "interaction_test.png"]:
    img = Image.open(f"E:\\opencode\\winvqp-tests\\discovery\\{fname}")
    w, h = img.size
    print(f"\n=== {fname} ({w}x{h}) ===")

    data = pytesseract.image_to_data(img, output_type=pytesseract.Output.DICT)
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
            print(f"  {text:15s} L={left:4d} T={top:4d} W={width:4d} H={height:3d} cx={cx:4d} cy={cy:4d}")
