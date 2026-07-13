"""Scan pixel colors across the screen to understand the actual layout."""
import sys, os, time, subprocess
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

os.environ["SERVER"] = r"\\192.168.0.3\VQPBOS"
os.environ["SERVERPC"] = r"\\192.168.0.3"
os.environ["REG"] = "01"
os.environ["winvqpdebug"] = "2"

proc = subprocess.Popen([r"D:\winvqp93\WINVQP93.exe"], cwd=r"D:\winvqp93")
time.sleep(10)

import pyautogui
pyautogui.FAILSAFE = True

def scan_line(y, label, x_start=100, x_end=700):
    """Scan a horizontal line at given y and report color transitions."""
    im = pyautogui.screenshot(region=(x_start, y, x_end-x_start, 1))
    pixels = list(im.getdata())
    
    print(f"  [{label}] y={y} scan from x={x_start} to x={x_end}:")
    
    # Find color transitions
    trans = []
    for i in range(1, len(pixels)):
        prev = pixels[i-1]
        curr = pixels[i]
        diff = sum(abs(prev[c] - curr[c]) for c in range(3))
        if diff > 30:  # significant transition
            trans.append((x_start + i, prev, curr))
    
    # Group nearby transitions
    if trans:
        groups = []
        current = [trans[0]]
        for t in trans[1:]:
            if t[0] - current[-1][0] < 5:  # within 5 pixels
                current.append(t)
            else:
                groups.append(current)
                current = [t]
        groups.append(current)
        
        for g in groups:
            x = g[0][0]
            mid = len(g) // 2
            prev = g[mid][1]
            curr = g[mid][2]
            print(f"    x={x}: ({prev[0]:3d},{prev[1]:3d},{prev[2]:3d}) -> ({curr[0]:3d},{curr[1]:3d},{curr[2]:3d})")
    else:
        # No transitions - report dominant color
        from collections import Counter
        c = Counter(pixels).most_common(2)
        print(f"    No transitions. Dominant: {c}")

def sample_pixels(label, points):
    """Sample individual pixels."""
    for x, y in points:
        c = pyautogui.pixel(x, y)
        print(f"  [{label}] ({x},{y}) = ({c[0]:3d},{c[1]:3d},{c[2]:3d})")

print("=== Horizontal scan at login field height ===")
scan_line(337, "code_field_y337")
scan_line(393, "pwd_field_y393")
scan_line(310, "manager_label_y310")
scan_line(375, "password_label_y375")

print("\n=== Horizontal scan at numpad height ===")
scan_line(230, "numpad_row1_y230", x_start=1400, x_end=1700)
scan_line(327, "numpad_row2_y327", x_start=1400, x_end=1700)

print("\n=== Horizontal scan at QWERTY heights ===")
scan_line(610, "qwerty_row1_y610", x_start=200, x_end=1800)
scan_line(690, "qwerty_row2_y690", x_start=200, x_end=1800)

print("\n=== Sample specific pixels ===")
sample_pixels("code_field", [
    (163, 315), (200, 337), (250, 337), (300, 337), 
    (400, 337), (500, 337), (620, 337), (700, 337)
])
sample_pixels("pwd_field", [
    (163, 380), (200, 393), (250, 393), (300, 393), 
    (400, 393), (500, 393), (620, 393), (700, 393)
])

print("\n=== Sample numpad area ===")
sample_pixels("numpad", [
    (1460, 230), (1520, 230), (1580, 230), 
    (1460, 327), (1520, 327), (1580, 327),
    (1460, 424), (1520, 424), (1580, 424),
    (1460, 521), (1520, 521), (1580, 521),
])

print("\n=== Sample QWERTY keys ===")
sample_pixels("qwerty_top", [
    (400, 610), (500, 610), (600, 610), (700, 610), (800, 610)
])

# Check what's around the "Manager" title
print("\n=== Manager title area ===")
scan_line(194, "title_y194", x_start=150, x_end=300)

proc.terminate()
proc.wait()
print("\nDone!")
