"""Analyze all users and their encrypted passwords to find patterns."""
import struct, os

dbf_path = r"D:\winvqp93\USERS.DBF"
with open(dbf_path, "rb") as f:
    data = f.read()

# Parse header
num_records = struct.unpack_from("<I", data, 4)[0]
header_len = struct.unpack_from("<H", data, 8)[0]
record_len = struct.unpack_from("<H", data, 10)[0]

# Parse fields
num_fields = (header_len - 33) // 32
fields = []
for i in range(num_fields):
    off = 32 + i * 32
    name = data[off:off+11].split(b"\0")[0].decode("ascii", errors="replace")
    ftype = chr(data[off+11])
    flen = data[off+16]
    fields.append((name, ftype, flen))

# Field positions
pos = 1
field_positions = []
for name, ftype, flen in fields:
    field_positions.append((name, pos, flen))
    pos += flen

def get_userid(rec):
    for name, p, l in field_positions:
        if name == "USERID":
            return rec[p:p+l].decode("ascii", errors="replace").strip()
    return ""

def get_password(rec):
    for name, p, l in field_positions:
        if name == "PASSWORD":
            return rec[p:p+l]
    return b""

def get_field(rec, field_name):
    for name, p, l in field_positions:
        if name == field_name:
            return rec[p:p+l]
    return b""

records_start = header_len

print("=== Users sorted by encrypted password pattern ===\n")
print(f"{'USERID':12s} {'NAME':30s} {'PASSWORD_HEX':30s} {'PASSWORD_STR':20s} {'PRV':3s}")
print("-" * 100)

password_groups = {}
for i in range(num_records):
    offset = records_start + i * record_len
    rec = data[offset:offset+record_len]
    if rec[0] == 0x2A:  # deleted
        continue

    uid = get_userid(rec)
    pwd = get_password(rec)
    pwd_hex = pwd.hex()
    pwd_str = pwd.decode("cp1252", errors="replace").strip()
    name = get_field(rec, "NAME").decode("cp1252", errors="replace").strip()
    prv = get_field(rec, "PRVLEVEL").decode("ascii", errors="replace").strip()

    # Remove trailing spaces from encrypted password for comparison
    pwd_stripped = pwd.rstrip(b" ")

    key = pwd_stripped.hex()
    if key not in password_groups:
        password_groups[key] = []
    password_groups[key].append((uid, name, pwd_str, prv))

for key, users in sorted(password_groups.items(), key=lambda x: -len(x[1])):
    print(f"\nPassword pattern: {key} ({len(users)} users)")
    if len(users[0][2]) < 20:
        print(f"  As text: '{users[0][2]}'")
    for uid, name, pwd, prv in users[:5]:
        print(f"  {uid:12s} {name:30s} {prv:3s}")
    if len(users) > 5:
        print(f"  ... and {len(users)-5} more")
