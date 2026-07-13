"""Search the EXE for Harbour function names and encryption-related code."""
import struct, re

with open(r'D:\winvqp93\WINVQP93.exe', 'rb') as f:
    data = f.read()

# Find cyphwrap.dll related strings
print("=== cyphwrap.dll related strings ===")
idx = data.find(b'cyphwrap.dll')
while idx != -1:
    ctx = data[max(0,idx-40):idx+60]
    print(f"  @ 0x{idx:X}: {ctx}")
    idx = data.find(b'cyphwrap.dll', idx+1)

# Find all HB_FUN_ references (Harbour exported functions)
print("\n=== Harbour HB_FUN_ references ===")
pattern = b'HB_FUN_[A-Z_0-9]+'
for match in re.finditer(pattern, data):
    fn_name = match.group().decode('ascii')
    pos = match.start()
    print(f"  @ 0x{pos:X}: {fn_name}")

# Find Harbour DLL function references (hb_DLLCall patterns)
print("\n=== Harbour DLL function names ===")
# After HB_FUN_ references, look for function name strings
for match in re.finditer(rb'[a-z][a-zA-Z0-9]+@\d+', data):
    pos = match.start()
    print(f"  @ 0x{pos:X}: {match.group().decode('ascii', errors='replace')}")

# Also look for all Harbour function names (often in .MAP sections)
print("\n=== Possible Harbour functions (PascalCase names) ===")
# Look for strings that look like Harbour function names
for match in re.finditer(rb'[A-Z][A-Z_0-9]{4,}', data):
    s = match.group().decode('ascii', errors='replace')
    if any(kw in s for kw in ['CIPHER', 'DECRYPT', 'ENCRYPT', 'PASSWORD', 'HASH', 'SALT']):
        print(f"  @ 0x{match.start():X}: {s}")

# Now check the Cipher256.dll - is it a Harbour plugin?
print("\n=== Checking Cipher256.dll format ===")
with open(r'D:\winvqp93\Cipher256.dll', 'rb') as f:
    dll_data = f.read()
# Look for Harbour header
if b'Harbour' in dll_data:
    print("  Contains 'Harbour' string - likely a Harbour plugin")
    pos = dll_data.find(b'Harbour')
    print(f"  @ 0x{pos:X}: {dll_data[pos:pos+50]}")
if b'HB_FUN' in dll_data:
    print("  Contains 'HB_FUN' - Harbour function table")
    for m in re.finditer(rb'HB_FUN_[A-Z_0-9]+', dll_data):
        print(f"    {m.group().decode()} @ 0x{m.start():X}")
# Look for readable strings  
strings = re.findall(rb'[\x20-\x7E]{4,}', dll_data)
print(f"  Readable strings in Cipher256.dll:")
for s in strings[:30]:
    try:
        decoded = s.decode('ascii')
        if any(kw in decoded for kw in ['init', 'decrypt', 'encrypt', 'key', 'cipher']):
            print(f"    {decoded}")
    except:
        pass
print(f"\n  First/last 50 readable strings:")
if strings:
    for s in strings[:10]:
        print(f"    {s.decode('ascii', errors='replace')}")
    if len(strings) > 10:
        print(f"    ...")
        for s in strings[-10:]:
            print(f"    {s.decode('ascii', errors='replace')}")
