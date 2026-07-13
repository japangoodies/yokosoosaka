"""Test XOR decryption on multiple users to verify key."""
from dbfread import DBF

XOR_KEY = [0x03, 0x72, 0x75, 0x09]

def xor_decrypt(encrypted):
    result = []
    for i, ch in enumerate(encrypted):
        k = XOR_KEY[i % len(XOR_KEY)]
        plain = chr(ord(ch) ^ k)
        result.append(plain)
    return "".join(result)

table = DBF(r"D:\winvqp93\USERS.DBF", encoding='cp1252', char_decode_errors='ignore')

print("Testing XOR decryption on multiple users:\n")

count = 0
for rec in table:
    uid = str(rec.get("USERID", "")).strip()
    pwd = str(rec.get("PASSWORD", "")).strip()
    name = str(rec.get("NAME", "")).strip()
    
    if pwd and len(pwd) >= 8:
        decrypted = xor_decrypt(pwd)
        # Check if result looks like a plausible password (alphanumeric)
        is_alpha = all(c.isalnum() or c in '@#$%&*!' for c in decrypted)
        print(f"  {uid:12s} {name:35s} enc={pwd} -> dec={decrypted} {'[VALID]' if is_alpha else '[BINARY]'}")
        count += 1
        if count >= 5:
            break

# Also check user 0 (GBI SAS)
print("\n--- User 0 (GBI SAS) ---")
table = DBF(r"D:\winvqp93\USERS.DBF", encoding='cp1252', char_decode_errors='ignore')
for rec in table:
    uid = str(rec.get("USERID", "")).strip()
    if uid == "0":
        pwd = str(rec.get("PASSWORD", "")).strip()
        name = str(rec.get("NAME", "")).strip()
        print(f"  {uid} {name}")
        print(f"  Encrypted password: {repr(pwd)}")
        print(f"  Encrypted bytes: {[ord(c) for c in pwd]}")
        dec = xor_decrypt(pwd)
        print(f"  XOR decrypted: {repr(dec)} ({[ord(c) for c in dec]})")
        
        # Try reversing - maybe it's plain XOR from plaintext
        print(f"  Check if decrypt XOR = encrypt: ", end="")
        check = xor_decrypt(dec)
        print(f"'{check}' == '{pwd}' ? {check == pwd}")
        
        # Also check other users with non-ASCII-like encryption
        break

# Check some users with different looking passwords
print("\n--- Users with varied passwords ---")
table = DBF(r"D:\winvqp93\USERS.DBF", encoding='cp1252', char_decode_errors='ignore')
seen_pws = set()
for rec in table:
    pwd = str(rec.get("PASSWORD", "")).strip()
    uid = str(rec.get("USERID", "")).strip()
    name = str(rec.get("NAME", "")).strip()
    if pwd and pwd not in seen_pws and len(pwd) >= 8:
        seen_pws.add(pwd)
        dec = xor_decrypt(pwd)
        is_readable = all(32 <= ord(c) <= 126 for c in dec)
        print(f"  {uid:12s} {name:30s} enc={pwd} -> dec={dec} readable={is_readable}")
