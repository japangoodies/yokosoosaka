"""Decode encrypted passwords using the derived XOR key."""
import struct

dbf_path = r"D:\winvqp93\USERS.DBF"
with open(dbf_path, "rb") as f:
    data = f.read()

num_records = struct.unpack_from("<I", data, 4)[0]
header_len = struct.unpack_from("<H", data, 8)[0]
record_len = struct.unpack_from("<H", data, 10)[0]

num_fields = (header_len - 33) // 32
fields = []
for i in range(num_fields):
    off = 32 + i * 32
    name = data[off:off+11].split(b"\0")[0].decode("ascii", errors="replace")
    ftype = chr(data[off+11])
    flen = data[off+16]
    fields.append((name, ftype, flen))

pos = 1
field_positions = {}
for name, ftype, flen in fields:
    field_positions[name] = (pos, flen)
    pos += flen

def get_field(rec, field_name):
    if field_name not in field_positions:
        return b""
    p, l = field_positions[field_name]
    return rec[p:p+l]

# XOR key derived from known pair (88: 2@F=2@F=B = 12341234a)
# Repeating 4-byte key for positions 0-7
xor_key_4 = [0x03, 0x72, 0x75, 0x09]
# Position 8 uses different key byte:
# For user 88: plain[8]='a'(0x61), cipher[8]='B'(0x42), key_8 = 0x61^0x42 = 0x23
# For other users, we'll try all possibilities

def xor_decrypt(cipher_bytes, key_4, key_8_guess=None):
    result = []
    for i in range(len(cipher_bytes)):
        if i < 8:
            k = key_4[i % 4]
        else:
            # Position 8+ - use key_8 if provided, else extrapolate
            if key_8_guess is not None:
                k = key_8_guess
            else:
                k = key_4[i % 4]
        result.append(cipher_bytes[i] ^ k)
    return bytes(result)

records_start = header_len
key_hex = [hex(k) for k in xor_key_4]

print(f"XOR key (4-byte repeating): [{', '.join(key_hex)}]")
print(f"First 248 employees with 'common' password:")
print()

# Decode common encrypted password
common_enc = bytes([0x41, 0x5C, 0x07, 0x52, 0x2E, 0x05, 0x05, 0x4F])
common_dec = xor_decrypt(common_enc, xor_key_4)
print(f"  Common (248 users): enc={common_enc.hex()} -> dec={repr(common_dec.decode('cp1252', errors='replace'))}")

# Decode user 01
u01_enc = bytes([0x32, 0x40, 0x46, 0x3D, 0x32, 0x40, 0x46, 0x3D, 0x44])
u01_dec = xor_decrypt(u01_enc, xor_key_4)
print(f"  User 01: enc={u01_enc.hex()} -> dec={repr(u01_dec.decode('cp1252', errors='replace'))}")

# Decode user 02
u02_enc = bytes([0x32, 0x40, 0x46, 0x3D, 0x32, 0x40, 0x46, 0x3D, 0x5B])
u02_dec = xor_decrypt(u02_enc, xor_key_4)
print(f"  User 02: enc={u02_enc.hex()} -> dec={repr(u02_dec.decode('cp1252', errors='replace'))}")

# Decode user 88
u88_enc = bytes([0x32, 0x40, 0x46, 0x3D, 0x32, 0x40, 0x46, 0x3D, 0x42])
u88_dec = xor_decrypt(u88_enc, xor_key_4)
print(f"  User 88 (known): enc={u88_enc.hex()} -> dec={repr(u88_dec.decode('cp1252', errors='replace'))}")

# Try with key_8 = 0x23 for position 8+ (same as user 88)
print(f"\nUsing key_8=0x23 for position 8+:")
u01_dec2 = xor_decrypt(u01_enc, xor_key_4, 0x23)
print(f"  User 01: {repr(u01_dec2.decode('cp1252', errors='replace'))}")
u02_dec2 = xor_decrypt(u02_enc, xor_key_4, 0x23)
print(f"  User 02: {repr(u02_dec2.decode('cp1252', errors='replace'))}")

# Decode user 1001 and 1002 (only 4 bytes each)
print(f"\nShort passwords (4 bytes):")
u1001_enc = bytes([0x32, 0x3E, 0x43, 0x3A])
u1002_enc = bytes([0x32, 0x3E, 0x43, 0x3B])
u1001_dec = xor_decrypt(u1001_enc, xor_key_4)
u1002_dec = xor_decrypt(u1002_enc, xor_key_4)
print(f"  User 1001: enc={u1001_enc.hex()} -> dec={repr(u1001_dec.decode('cp1252', errors='replace'))}")
print(f"  User 1002: enc={u1002_enc.hex()} -> dec={repr(u1002_dec.decode('cp1252', errors='replace'))}")

# Decode ANSIUSER
uansi_enc = bytes([0x54, 0x08, 0x43, 0x3F, 0x32, 0x47, 0x4B, 0x40])
uansi_dec = xor_decrypt(uansi_enc, xor_key_4)
print(f"  ANSIUSER: enc={uansi_enc.hex()} -> dec={repr(uansi_dec.decode('cp1252', errors='replace'))}")

# Decode BUI_IT
bui_enc = bytes([0x3C, 0x5D, 0x01, 0x54, 0x30, 0x46, 0x41, 0x5A])
bui_dec = xor_decrypt(bui_enc, xor_key_4)
print(f"  BUI_IT: enc={bui_enc.hex()} -> dec={repr(bui_dec.decode('cp1252', errors='replace'))}")

# Decode GBI_IT
gbi_enc = bytes([0x26, 0x3B, 0x4E, 0x5A, 0x42, 0x4A, 0x03, 0x03])
gbi_dec = xor_decrypt(gbi_enc, xor_key_4)
print(f"  GBI_IT: enc={gbi_enc.hex()} -> dec={repr(gbi_dec.decode('cp1252', errors='replace'))}")

# Decode all unique passwords and print all users
print(f"\n{'='*80}")
print(f"{'USERID':15s} {'NAME':30s} {'DECRYPTED_PWD':20s} {'PRV':3s}")
print(f"{'='*80}")
for i in range(num_records):
    offset = records_start + i * record_len
    rec = data[offset:offset+record_len]
    if rec[0] == 0x2A:
        continue
    uid = get_field(rec, "USERID").decode("ascii", errors="replace").strip()
    name = get_field(rec, "NAME").decode("cp1252", errors="replace").strip()
    pwd = get_field(rec, "PASSWORD").rstrip(b" ")
    prv = get_field(rec, "PRVLEVEL").decode("ascii", errors="replace").strip()
    
    if len(pwd) == 0:
        pwd_dec = "(empty)"
    else:
        pwd_dec_raw = xor_decrypt(pwd, xor_key_4)
        try:
            pwd_dec = repr(pwd_dec_raw.decode("cp1252", errors="replace"))
        except:
            pwd_dec = pwd_dec_raw.hex()
    print(f"{uid:15s} {name:30s} {pwd_dec:20s} {prv:3s}")
