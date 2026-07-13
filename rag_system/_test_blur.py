import sys, os, time, ctypes
sys.path.insert(0, 'E:\\opencode\\gdrive_manager')

import customtkinter as ctk
from PIL import Image, ImageFilter, ImageGrab

app = ctk.CTk()
app.geometry('800x600')

for i in range(12):
    ctk.CTkLabel(app, text=f'File {i}.txt').pack(fill='x', padx=20, pady=3)

class TestDialog(ctk.CTkToplevel):
    def __init__(self, p):
        super().__init__(p)
        self.title('Test')
        self.resizable(False, False)
        self.frame = ctk.CTkFrame(self, fg_color='transparent')
        self.frame.pack(expand=True, fill='both', padx=28, pady=24)
        ctk.CTkLabel(self.frame, text='Blur Dialog', font=ctk.CTkFont(size=18, weight='bold')).pack(anchor='w')
        ctk.CTkLabel(self.frame, text='Should see blurred file list behind this text').pack(anchor='w', pady=(8, 16))
        ctk.CTkButton(self.frame, text='Close', width=90, height=32, command=self.destroy).pack(anchor='e')

def show():
    d = TestDialog(app)
    d.update()

    # Take blur screenshot
    root = d.master.winfo_toplevel()
    hwnd = root.winfo_id()
    rect = ctypes.wintypes.RECT()
    ctypes.windll.user32.GetWindowRect(hwnd, ctypes.byref(rect))
    screenshot = ImageGrab.grab(bbox=(rect.left, rect.top, rect.right, rect.bottom))
    blurred = screenshot.filter(ImageFilter.GaussianBlur(radius=16))

    w, h = d.winfo_width(), d.winfo_height()
    bg_img = blurred.resize((w, h), Image.LANCZOS)
    ctk_img = ctk.CTkImage(light_image=bg_img, dark_image=bg_img, size=(w, h))

    bg_label = ctk.CTkLabel(d, image=ctk_img, text='')
    bg_label.place(x=0, y=0, relwidth=1, relheight=1)
    for child in d.winfo_children():
        if child is not bg_label:
            child.lift()

    print(f'Children: {len(d.winfo_children())}')
    print(f'Frame winfo_children: {len(d.frame.winfo_children())}')
    
    app.after(3000, lambda: (d.destroy(), app.destroy()))

app.after(500, show)
app.mainloop()
print('Done')
