"""Test the password encryption utility."""
import sys; sys.path.insert(0, r"E:\opencode\winvqp-tests")
from utils.password import encrypt, decrypt

tests = [
    ("12341234a", bytes([0x32, 0x40, 0x46, 0x3D, 0x32, 0x40, 0x46, 0x3D, 0x42])),
    ("12341234c", bytes([0x32, 0x40, 0x46, 0x3D, 0x32, 0x40, 0x46, 0x3D, 0x44])),
]

print("=== Encryption Tests ===")
for plain, expected_cipher in tests:
    enc = encrypt(plain)
    match = "OK" if enc.hex() == expected_cipher.hex() else "FAIL"
    print(f"  encrypt('{plain}') -> {enc.hex()} (expected: {expected_cipher.hex()}) [{match}]")

print("\n=== Decryption Tests ===")
for plain, cipher in tests:
    dec = decrypt(cipher)
    match = "OK" if dec.upper() == plain.upper() else "FAIL"
    print(f"  decrypt({cipher.hex()}) -> '{dec}' (expected: '{plain.upper()}') [{match}]")

print("\n=== Round-trip ===")
for plain, cipher in tests:
    dec = decrypt(cipher)
    re_enc = encrypt(dec)
    match = "OK" if re_enc.hex() == cipher.hex() else "FAIL"
    print(f"  '{plain}' round-trip [{match}]")
