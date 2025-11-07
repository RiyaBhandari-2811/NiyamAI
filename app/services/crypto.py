import base64
import json
from Crypto.Cipher import AES

def _unpad_pkcs7(data: bytes) -> bytes:
    padding_len = data[-1]
    if padding_len < 1 or padding_len > 16:
        raise ValueError("Invalid PKCS7 padding.")
    return data[:-padding_len]

def decrypt_object(encrypted_b64: str, iv_b64: str, key_bytes: bytes):
    """
    encrypted_b64  - base64 string, matches Node's 'data' value
    iv_b64         - base64 string, matches Node's 'iv' value
    key_bytes      - raw bytes, length must be 32 for AES-256
    Returns parsed JSON object
    """
    iv = base64.b64decode(iv_b64)
    encrypted = base64.b64decode(encrypted_b64)
    cipher = AES.new(key_bytes, AES.MODE_CBC, iv=iv)
    decrypted = cipher.decrypt(encrypted)
    unpadded = _unpad_pkcs7(decrypted)
    return json.loads(unpadded.decode("utf-8"))
