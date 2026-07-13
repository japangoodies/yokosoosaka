"""Analyze the password encryption patterns in USERS.DBF."""
from collections import Counter

# Encrypted passwords from known users
users = {
    '01':   {'enc': bytes([0x32, 0x40, 0x46, 0x3D, 0x32, 0x40, 0x46, 0x3D, 0x44]), 'prv': 3},
    '02':   {'enc': bytes([0x32, 0x40, 0x46, 0x3D, 0x32, 0x40, 0x46, 0x3D, 0x5B]), 'prv': 0},
    '88':   {'enc': bytes([0x32, 0x40, 0x46, 0x3D, 0x32, 0x40, 0x46, 0x3D, 0x42]), 'prv': 4},
    '1001': {'enc': bytes([0x32, 0x3E, 0x43, 0x3A]), 'prv': 0},
    '1002': {'enc': bytes([0x32, 0x3E, 0x43, 0x3B]), 'prv': 0},
    'ANSIUSER': {'enc': bytes([0x54, 0x08, 0x43, 0x3F, 0x32, 0x47, 0x4B, 0x40]), 'prv': 9},
    'BUI_IT':   {'enc': bytes([0x3C, 0x5D, 0x01, 0x54, 0x30, 0x46, 0x41, 0x5A]), 'prv': 4},
    'GBI_IT':   {'enc': bytes([0x26, 0x3B, 0x4E, 0x5A, 0x42, 0x4A, 0x03, 0x03]), 'prv': 4},
}
common_pwd = bytes([0x41, 0x5C, 0x07, 0x52, 0x2E, 0x05, 0x05, 0x4F])

print("=== Encryption Analysis ===\n")

# Method 1: Try various fixed XOR keys
key_candidates = [
    b'CIPH', b'cipH', b'256', b'@!#$', b'VQPB', b'POS\0',
    bytes([0xFF, 0xFF, 0xFF, 0xFF]),
    bytes([0x50, 0x4F, 0x53, 0x21]),  # 'POS!'
    bytes([0x56, 0x51, 0x50, 0x42]),  # 'VQPB'
    bytes([0x47, 0x42, 0x49, 0x53]),  # 'GBIS'
    bytes([0x42, 0x4F, 0x53, 0x31]),  # 'BOS1'
    bytes([0x12, 0x34, 0x56, 0x78]),
    bytes([0x00, 0x00, 0x00, 0x00]),
]
# Also try single-byte XOR keys (simple Caesar)
key_candidates.extend([bytes([i]) for i in range(256)])

def decrypt(cipher, key):
    return bytes(c ^ key[i % len(key)] for i, c in enumerate(cipher))

# Test keys against the common password
print("Testing keys against common password A\\aR.\\x05\\x05O:")
print("  (248 employees share this encrypted password)\n")

pwd_bytes = common_pwd
for key in key_candidates:
    p = decrypt(pwd_bytes, key)
    try:
        p_str = p.decode('ascii')
        if p_str.isprintable() and all(32 <= ord(c) < 127 for c in p_str):
            key_repr = (key.decode('ascii', errors='replace') 
                       if all(32 <= b < 127 for b in key) 
                       else key.hex())
            print(f"  Key '{key_repr}': {repr(p_str)}")
    except:
        pass

print("\n=== Testing against user 01/02/88 ===")
print("These users have pattern: 32 40 46 3D 32 40 46 3D XX")
print("First 4 bytes repeat at positions 4-7 (repeating key of length 4)")
print("Only last byte differs between users\n")

# Try: what if the last byte incorporates PRVLEVEL or user ID?
for uid in ['01', '02', '88']:
    u = users[uid]
    enc = u['enc']
    prv = u['prv']
    # Last byte only differs
    # What if plain[8] XOR key[0] = enc[8]
    # And plain[8] is derived from uid or prv?
    print(f"  User {uid}: last_byte=0x{enc[8]:02x}, prv={prv}, uid_last_char='{uid[-1]}'")

# Try encryption as XOR with repeating 4-byte key
# Since cipher[0]=cipher[4] and cipher[1]=cipher[5] etc.,
# the plaintext must have p[0]=p[4], p[1]=p[5], etc.
# OR the key repeats every 4 bytes
# OR both!

# If key repeats every 4 bytes:
# cipher[0..3] = plain[0..3] XOR key[0..3]
# cipher[4..7] = plain[4..7] XOR key[0..3]
# Since cipher[0]=cipher[4], we have plain[0]=plain[4]
# Since cipher[1]=cipher[5], we have plain[1]=plain[5]
# etc.
# So the password must have: p[0]=p[4], p[1]=p[5], p[2]=p[6], p[3]=p[7]

# A password where first 4 chars repeat: e.g., "12341234X", "ABCDeABCX"
# Or shorter passwords get padded with first chars?

print("\n=== Looking for common passwords with repeating 4-char pattern ===")
print("If pwd = 'XXXXYYYY' with XXXX != YYYY, then:")
print("  cipher[0]=... cipher[4]=... would differ (they're same, so XXXX=YYYY)")
print("So password must have first 4 chars matching next 4 chars!\n")

# Common default passwords with this pattern:
# "12341234" (most likely for 248 employees!)
# "00000000" 
# "passwordpassword" would be too long

print("If password is '12341234' (8 chars, repeating '1234'):")
pwd_guess = b'12341234'
key_guess = bytes(pwd_bytes[i] ^ pwd_guess[i] for i in range(8))
print(f"  Key w/ 4-char repetition: {key_guess.hex()}")
print(f"  Key as text: {repr(key_guess[:4])}")
print(f"  Decrypt user 01 with same key: user_01_pwd = ", end="")

# Now decrypt user 01 with this key
u01 = users['01']['enc']
p01 = decrypt(u01, key_guess[:4])
print(repr(p01))

# Decrypt user 1001
u1001 = users['1001']['enc']
p1001 = decrypt(u1001, key_guess[:4])
print(f"  Decrypt user 1001: {repr(p1001)}")

# Decrypt ANSIUSER 
u_ansi = users['ANSIUSER']['enc']
p_ansi = decrypt(u_ansi, key_guess[:4])
print(f"  Decrypt ANSIUSER: {repr(p_ansi)}")

# Decrypt BUI_IT
u_bui = users['BUI_IT']['enc']
p_bui = decrypt(u_bui, key_guess[:4])
print(f"  Decrypt BUI_IT: {repr(p_bui)}")

print("\n=== Try: maybe password is users' employee ID ===")
# The first employee with common password: 205001638
# If password = first 8 chars of user ID...
# But then everyone would have different passwords, not all same
print("All 248 employees with same encrypted password must have same plaintext password")
print("Most likely: '1234' or '12345678' or their employee ID")

# Let me try the inverse: assume nothing about the key, 
# but use the fact that p[0]=p[4], p[1]=p[5], p[2]=p[6], p[3]=p[7]
# for user 01 (since cipher blocks repeat)

# If common password is '12345678' (8 chars), key = common XOR '12345678'
test_pwds = ['12341234', '12345678', '00000000', '11111111', 'password', 
             'qwertyui', 'asdfghjk', 'zxcvbnm,', '87654321',
             '        ', '........', '00001111']
for guess in test_pwds:
    gbytes = guess.encode()
    k = bytes(pwd_bytes[i] ^ gbytes[i] for i in range(len(gbytes)))
    k4 = k[:4]
    # Now test this key on all users
    p01 = decrypt(users['01']['enc'], k4)
    p1001 = decrypt(users['1001']['enc'], k4)
    try:
        p01_str = p01.decode('cp1252')
        p1001_str = p1001.decode('cp1252')
        if all(32 <= ord(c) < 127 for c in p01_str) and all(32 <= ord(c) < 127 for c in p1001_str):
            print(f"  If common1={guess}: 01={repr(p01_str)}, 1001={repr(p1001_str)}, key={k4.hex()}")
    except:
        pass
