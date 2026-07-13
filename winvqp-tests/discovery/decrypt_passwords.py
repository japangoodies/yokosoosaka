"""
Try to decrypt passwords by testing various algorithms.
Since Cipher256.dll is a Harbour plugin (not standard DLL), let's try:
1. Search for the encryption in the EXE binary
2. Try to identify the algorithm from the pattern
"""

import struct, re

# Known encrypted passwords (stripped of trailing spaces)
known = {
    '01':        bytes([0x32, 0x40, 0x46, 0x3D, 0x32, 0x40, 0x46, 0x3D, 0x44]),
    '02':        bytes([0x32, 0x40, 0x46, 0x3D, 0x32, 0x40, 0x46, 0x3D, 0x5B]),
    '88':        bytes([0x32, 0x40, 0x46, 0x3D, 0x32, 0x40, 0x46, 0x3D, 0x42]),
    '1001':      bytes([0x32, 0x3E, 0x43, 0x3A]),
    '1002':      bytes([0x32, 0x3E, 0x43, 0x3B]),
    'common248': bytes([0x41, 0x5C, 0x07, 0x52, 0x2E, 0x05, 0x05, 0x4F]),
    'empty':     b'',
}

# Key insight: For users 01, 02, 88 - the encrypted password has a REPEATING 
# 4-byte pattern: 32 40 46 3D | 32 40 46 3D | XX
# This means: cipher[i] = cipher[i+4] for i=0..3 and i=4..7

# For a stream cipher with repeating key of length 4:
# cipher[i] = plain[i] XOR key[i mod 4]
# Since cipher[0] = cipher[4]: plain[0] XOR key[0] = plain[4] XOR key[0]
# Therefore: plain[0] = plain[4] (same for i=1..3 vs i=5..7)

# So the plaintext password must have: p[0]=p[4], p[1]=p[5], p[2]=p[6], p[3]=p[7]
# For user 01: password is 9 chars, where first 8 = [A,B,C,D,A,B,C,D] and 9th = X

# What common password has this structure? 
# Or what if the password is SHORTER and gets padded?
# If password is 4 chars "ABCD", then padded to 8 as "ABCDABCD"
# That would explain the repetition!

# Common 4-char PINs for POS systems:
# "1234", "0000", "1111", "2580", "2000", "2345"

# Let me try: if password = "1234" and it's repeated to fill 8 chars (no 9th):
# But user 01 has 9 bytes encrypted, user 1001 has 4 bytes
# So password for 1001 might be 4 chars, and for 01 it's 9 chars

# If common password for 248 users is "1234" repeated to "12341234":
# Then encrypt("12341234") = 41 5C 07 52 2E 05 05 4F
# And key = "12341234" XOR "41 5C 07 52 2E 05 05 4F"

common_enc = bytes([0x41, 0x5C, 0x07, 0x52, 0x2E, 0x05, 0x05, 0x4F])

# Let me brute force 4-digit PINs and see if any gives a consistent key
def test_pin(pin_str):
    """Test if a 4-char PIN repeated twice is the common password."""
    pin = pin_str.encode()
    if len(pin) != 4:
        return None
    padded = pin * 2  # "ABCDABCD"
    key = bytes(common_enc[i] ^ padded[i] for i in range(8))
    
    # Now apply this key to user 01, 1001
    u01_dec = bytes(known['01'][i] ^ key[i % 4] if i < 8 else known['01'][i] ^ key[0] for i in range(len(known['01'])))
    u1001_dec = bytes(known['1001'][i] ^ key[i % 4] for i in range(len(known['1001'])))
    
    try:
        u01_str = u01_dec.decode('cp1252')
        u1001_str = u1001_dec.decode('cp1252')
        valid01 = all(32 <= ord(c) < 127 for c in u01_str)
        valid1001 = all(32 <= ord(c) < 127 for c in u1001_str)
        if valid01 and valid1001:
            return (u01_str, u1001_str, key)
    except:
        pass
    return None

# Generate all common PIN combinations
import itertools
common_pins = []
# All 4-digit PINs
for combo in itertools.product('0123456789', repeat=4):
    common_pins.append(''.join(combo))

# Also try all POS common passwords
pos_passwords = ['1234', '0000', '1111', '2222', '3333', '4444', '5555', '6666', '7777', '8888', '9999',
                 '1000', '2000', '3000', '2580', '12345678', '00000000',
                 'PASS', 'pass', 'CODE', 'code',
                 # Common Filipino/POS
                 'GOLD', 'gold', 'BROW', 'brow',
                 # Try single char repeated
                 '1111', '2222', '3333', '4444', '5555',
                 # Numbers
                 '1357', '2468', '0123', '4321', '5678']

print("Testing specific passwords first...")
for pwd in pos_passwords:
    if len(pwd) == 4:
        r = test_pin(pwd)
        if r:
            u01, u1001, key = r
            print(f"  PIN '{pwd}': 01='{u01}', 1001='{u1001}', key={key.hex()}")

print("\nNow testing user 01's password structure more carefully...")

# User 01's encrypted: 32 40 46 3D 32 40 46 3D 44
# First 4 bytes (32 40 46 3D) repeat exactly
# If password = "ABCDABCDE" (9 chars, first 8 = ABCD repeated)

# Let me assume user 01's password is the user ID '01', and the encrypted value 
# is the encryption of '01' processed with some salt/key derived from the system
# 
# Actually, what if the algorithm is:
# 1. Pad the password to 8 bytes by repeating it
# 2. XOR with a 4-byte key
# 3. Append a checksum byte derived from user info

# What if the 9th byte in user 01/02/88 is actually just a function of the 
# user ID or PRVLEVEL?

# Let me check: if the password for 01 is "1234" and it's just repeated + XOR'd
# Then decrypt user 01's first 8 bytes with key derived from common password

# Alternative: maybe the encryption key is derived from the user ID
# cipher = XOR(plaintext, SHA256(user_id)) truncated to plaintext length

# This would be more secure and explain why different users with same 
# password have different encrypted values

# Let me try another approach: look at the EXE for Harbour code strings
print("\nSearching WINVQP93.exe for encryption-related strings...")
with open(r'D:\winvqp93\WINVQP93.exe', 'rb') as f:
    exe_data = f.read()

# Search for strings related to password, cipher, encrypt
keywords = [b'cipher', b'Cipher', b'CIPHER', b'encrypt', b'Encrypt', 
            b'password', b'Password', b'PASSWORD', b'cyph', b'Cyph',
            b'256', b'Cipher256', b'cyphwrap', b'ENCRYPT', b'DECRYPT',
            b'Decrypt', b'decrypt']

for kw in keywords:
    positions = []
    start = 0
    while True:
        pos = exe_data.find(kw, start)
        if pos == -1:
            break
        positions.append(pos)
        start = pos + 1
    if positions:
        print(f"  '{kw.decode()}': found at {[hex(p) for p in positions[:5]]}")
        # Show context around first find
        for p in positions[:2]:
            ctx = exe_data[max(0,p-20):p+len(kw)+30]
            print(f"    Context: {ctx}")
