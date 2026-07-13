"""Read USERS.DBF structure and data, handling binary fields."""
import struct, os

dbf_path = r"D:\winvqp93\USERS.DBF"
with open(dbf_path, "rb") as f:
    data = f.read()

# Header info
ver = data[0]
last_update = (data[1] + 1900, data[2], data[3])  # Y,M,D
num_records = struct.unpack_from("<I", data, 4)[0]
header_len = struct.unpack_from("<H", data, 8)[0]
record_len = struct.unpack_from("<H", data, 10)[0]

print(f"dBase version: {ver}")
print(f"Last update: {last_update}")
print(f"Records: {num_records}")
print(f"Header length: {header_len}")
print(f"Record length: {record_len}")
print()

# Parse field descriptors (each 32 bytes starting at offset 32)
num_fields = (header_len - 32 - 1) // 32  # -1 for terminator
fields = []
for i in range(num_fields):
    off = 32 + i * 32
    name = data[off:off+11].split(b"\0")[0].decode("ascii", errors="replace")
    ftype = chr(data[off+11])
    foffset = struct.unpack_from("<I", data, off+12)[0]
    flen = data[off+16]
    fdec = data[off+17]
    fields.append((name, ftype, flen, fdec))
    print(f"  {name:12s} type={ftype} len={flen} dec={fdec}")

print(f"\nTotal fields: {num_fields}")
print()

# Read records
records_start = header_len
for i in range(min(num_records, 20)):
    offset = records_start + i * record_len
    rec = data[offset:offset+record_len]
    deleted = rec[0] == 0x2A  # '*' = deleted
    
    if deleted:
        print(f"Record {i}: [DELETED]")
        continue
    
    print(f"Record {i}:")
    pos = 1
    for name, ftype, flen, fdec in fields:
        raw = rec[pos:pos+flen]
        if ftype == "C":  # Character
            val = raw.decode("cp1252", errors="replace").strip()
            print(f"  {name:12s} = '{val}'")
        elif ftype == "N":  # Numeric
            val = raw.decode("ascii", errors="replace").strip()
            print(f"  {name:12s} = {val}")
        elif ftype in ("B", "M"):  # Binary/Memo
            print(f"  {name:12s} = bytes({flen}): {raw[:40].hex()}")
        else:
            print(f"  {name:12s} = [{ftype}] {raw[:40].hex()}")
        pos += flen
    print()
