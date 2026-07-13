"""Analyze cyphwrap.dll to understand the Harbour-to-.NET bridge."""
import struct, re

with open(r'D:\winvqp93\cyphwrap.dll', 'rb') as f:
    data = f.read()

print(f"File size: {len(data)} bytes")
print(f"First 4 bytes: {data[:4]}")

if data[:2] == b'MZ':
    pe_off = struct.unpack_from("<I", data, 0x3C)[0]
    print(f"PE offset: 0x{pe_off:X}")

    if data[pe_off:pe_off+4] == b"PE\0\0":
        machine = struct.unpack_from("<H", data, pe_off+4)[0]
        num_sections = struct.unpack_from("<H", data, pe_off+6)[0]
        opt_hdr_size = struct.unpack_from("<H", data, pe_off+20)[0]
        print(f"Machine: 0x{machine:X} Sections: {num_sections}")

        # Check DLL flag
        dll_char = struct.unpack_from("<H", data, pe_off+24+70)[0]
        is_dll = (dll_char & 0x2000) != 0
        print(f"DLL flag: {is_dll}")

        # Find all strings
        print("\n=== All readable strings ===")
        strings = re.findall(rb'[\x20-\x7E]{4,}', data)
        for s in sorted(set(strings)):
            try:
                decoded = s.decode('ascii')
                if any(kw in decoded for kw in ['cipher', 'Cipher', 'encrypt', 'decrypt', 
                                                  'Password', 'password', 'OLE', 'ole',
                                                  'CreateObject', 'hb_', 'HB_FUN']):
                    print(f"  {decoded}")
            except:
                pass

        # Search for Harbour function table
        print("\n=== HB_FUN references ===")
        for match in re.finditer(rb'HB_FUN_[A-Z_0-9]+', data):
            fn_name = match.group().decode('ascii')
            print(f"  @ 0x{match.start():X}: {fn_name}")

        # Look for .NET/COM related function names
        print("\n=== COM/OLE strings ===")
        for match in re.finditer(rb'[A-Za-z_][A-Za-z0-9_]{3,}', data):
            s = match.group().decode('ascii', errors='replace')
            if s in ['CreateObject', 'GetObject', 'Dispatch', 'Invoke', 'OLE', 
                     'UUID', 'CLSID', 'Interface', 'Cipher', 'encryptMessage',
                     'decryptMessage', 'CipherPassword']:
                print(f"  @ 0x{hex(match.start())}: {s}")

        # Look for CLSID/GUID
        print("\n=== GUID/CLSID patterns ===")
        guid_pattern = rb'[0-9A-Fa-f]{8}[-][0-9A-Fa-f]{4}[-][0-9A-Fa-f]{4}[-][0-9A-Fa-f]{4}[-][0-9A-Fa-f]{12}'
        for match in re.finditer(guid_pattern, data):
            print(f"  @ 0x{hex(match.start())}: {match.group().decode()}")
else:
    print("Not a standard PE file")
    strings = re.findall(rb'[\x20-\x7E]{4,}', data)
    print(f"Readable strings ({len(strings)}):")
    for s in strings[:50]:
        print(f"  {s.decode('ascii', errors='replace')}")
