"""Analyze the Cipher256.dll to understand the encryption."""
import struct, re, os

dll_path = r"D:\winvqp93\Cipher256.dll"
with open(dll_path, "rb") as f:
    data = f.read()

print(f"File size: {len(data)} bytes")
print(f"First 4 bytes: {data[:4]}")

if data[:2] == b"MZ":
    pe_off = struct.unpack_from("<I", data, 0x3C)[0]
    print(f"PE offset: 0x{pe_off:X}")

    if data[pe_off:pe_off+4] == b"PE\0\0":
        machine = struct.unpack_from("<H", data, pe_off+4)[0]
        num_sections = struct.unpack_from("<H", data, pe_off+6)[0]
        opt_hdr_size = struct.unpack_from("<H", data, pe_off+20)[0]
        print(f"Machine: 0x{machine:X}  Sections: {num_sections}")

        # Check DLL flag
        dll_char = struct.unpack_from("<H", data, pe_off+24+70)[0]
        is_dll = (dll_char & 0x2000) != 0
        print(f"DLL flag: {is_dll}")

        # Export table
        export_rva = struct.unpack_from("<I", data, pe_off+24+96)[0]
        export_size = struct.unpack_from("<I", data, pe_off+24+100)[0]
        print(f"Export table RVA: 0x{export_rva:X} Size: {export_size}")

        if export_rva and export_size:
            sections_start = pe_off + 24 + opt_hdr_size
            for i in range(num_sections):
                s_off = sections_start + i * 40
                s_name = data[s_off:s_off+8].rstrip(b"\0").decode("ascii", errors="replace")
                s_va = struct.unpack_from("<I", data, s_off+12)[0]
                s_raw = struct.unpack_from("<I", data, s_off+20)[0]
                s_rsize = struct.unpack_from("<I", data, s_off+16)[0]
                if s_va <= export_rva < s_va + 1024*1024:
                    file_off = export_rva - s_va + s_raw
                    num_fns = struct.unpack_from("<I", data, file_off+20)[0]
                    num_names = struct.unpack_from("<I", data, file_off+24)[0]
                    addr_names = struct.unpack_from("<I", data, file_off+32)[0]
                    print(f"\nExports: {num_fns} functions, {num_names} named")

                    name_ptr_off = addr_names - s_va + s_raw
                    for j in range(min(num_names, 30)):
                        name_rva = struct.unpack_from("<I", data, name_ptr_off + j*4)[0]
                        name_off = name_rva - s_va + s_raw
                        fn_name = data[name_off:name_off+60].split(b"\0")[0]
                        try:
                            fn_name = fn_name.decode("ascii", errors="replace")
                            print(f"  {fn_name}")
                        except:
                            print(f"  [binary: {fn_name[:20].hex()}]")
                    break
else:
    print("Not a standard PE file")
    # Try to find readable strings
    strings = re.findall(rb"[\x20-\x7E]{4,}", data)
    print(f"\nReadable strings in file ({len(strings)} found):")
    for s in strings[:50]:
        try:
            decoded = s.decode("ascii", errors="replace")
            print(f"  {decoded}")
        except:
            pass
