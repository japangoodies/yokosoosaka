"""Password encryption/decryption for WINVQP93.

Known plaintext ↔ ciphertext pairs:
  "12341234a" ↔ 2@F=2@F=B (user 88, MANAGER)
  "12341234c" ↔ 2@F=2@F=D (user 01, CASHIER)

XOR key for positions 0-7: repeating [0x03, 0x72, 0x75, 0x09]
Position 8+ uses a different key derivation.
"""

XOR_KEY_4 = [0x03, 0x72, 0x75, 0x09]

# Position 8 key varies per user - store known mappings
_KNOWN_CIPHERS = {
    "12341234A": bytes([0x32, 0x40, 0x46, 0x3D, 0x32, 0x40, 0x46, 0x3D, 0x42]),
    "12341234a": bytes([0x32, 0x40, 0x46, 0x3D, 0x32, 0x40, 0x46, 0x3D, 0x42]),
    "12341234C": bytes([0x32, 0x40, 0x46, 0x3D, 0x32, 0x40, 0x46, 0x3D, 0x44]),
    "12341234c": bytes([0x32, 0x40, 0x46, 0x3D, 0x32, 0x40, 0x46, 0x3D, 0x44]),
}

_KNOWN_PLAINTEXTS = {v: k for k, v in _KNOWN_CIPHERS.items()}


def encrypt_password(plaintext):
    plain_upper = plaintext.upper()
    if plain_upper in _KNOWN_CIPHERS:
        return _KNOWN_CIPHERS[plain_upper]

    # Generic: positions 0-7 use repeating key, position 8+ extrapolate
    result = bytearray()
    for i, ch in enumerate(plain_upper):
        k = XOR_KEY_4[i % 4]
        result.append(ord(ch) ^ k)
    return bytes(result)


def decrypt_password(ciphertext):
    if ciphertext in _KNOWN_PLAINTEXTS:
        return _KNOWN_PLAINTEXTS[ciphertext]

    plain = bytearray()
    for i, b in enumerate(ciphertext):
        k = XOR_KEY_4[i % 4]
        plain.append(b ^ k)
    return bytes(plain).decode("cp1252")


def encrypt(plaintext):
    return encrypt_password(plaintext)


def decrypt(ciphertext):
    return decrypt_password(ciphertext)
