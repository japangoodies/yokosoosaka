Add-Type -Path "D:\winvqp93\Cipher256.dll"
$cipher = New-Object Cipher256.Cipher

$enc_user01 = "2@F=2@F=D"
$enc_user02 = "2@F=2@F=["
$enc_user88 = "2@F=2@F=B"
$enc_common = [char]0x41 + [char]0x5C + [char]0x07 + [char]0x52 + [char]0x2E + [char]0x05 + [char]0x05 + [char]0x4F

Write-Output "=== Trying decryptMessage with numeric keys (1-100) ==="
$found = $false
for ($i = 1; $i -le 100; $i++) {
    try {
        $dec = $cipher.decryptMessage($enc_user01, [string]$i)
        if ($dec -and $dec.Length -gt 0) {
            Write-Output "  KEY='$i' -> DEC='$dec' (len=$($dec.Length))"
            $found = $true
        }
    } catch {}
}
if (-not $found) { Write-Output "  No valid decryption with numeric keys" }

Write-Output "`n=== Trying decryptMessage with string keys ==="
$string_keys = @("VQPBOS", "GOLD", "BROWN", "admin", "password", 
    "1234", "0000", "12345678", "00000000", "0123456789ABCDEF",
    "goldilocks", "brownies", "CIPHER256", "cipher256",
    "FASTFOOD", "WINVQP93", "winvqp93", "phase4",
    "Goldilocks", "Brownies", "BROWNIES", "GOLDILOCKS",
    "VQPBOS93", "VQPBOS01", "VQPBOS88", "01", "02", "88",
    "REP03", "REP01", "REP02", "REP00", "REP")

foreach ($key in $string_keys) {
    try {
        $dec = $cipher.decryptMessage($enc_user01, $key)
        if ($dec -and $dec.Length -gt 0) {
            Write-Output "  KEY='$key' -> DEC='$dec' (len=$($dec.Length))"
            $found = $true
        }
    } catch {}
}

if (-not $found) { Write-Output "  No valid decryption with string keys" }

Write-Output "`n=== Trying decryptMessage with empty key ==="
try {
    $dec = $cipher.decryptMessage($enc_user01, "")
    Write-Output "  KEY='' -> DEC='$dec' (len=$($dec.Length))"
} catch {
    Write-Output "  Error: $_"
}

Write-Output "`n=== Trying encryptMessage with known passwords and checking ==="
try {
    $enc1 = $cipher.encryptMessage("1", "VQPBOS")
    $enc2 = $cipher.encryptMessage("2", "VQPBOS")
    Write-Output "  encrypt('1','VQPBOS') = '$enc1'"
    Write-Output "  encrypt('2','VQPBOS') = '$enc2'"
} catch {
    Write-Output "  Error: $_"
}

Write-Output "`n=== Trying all combinations: key XOR key2 ==="
# Maybe the encryption uses double-key approach
try {
    $encA = $cipher.encryptMessage("1", "VQPBOS")
    $encB = $cipher.encryptMessage("2", "VQPBOS")
    Write-Output "  User 01 enc('1'): $encA"
    Write-Output "  User 02 enc('2'): $encB"
} catch { Write-Output "Error: $_" }

# Let me also check what CipherPassword does with these
Write-Output "`n=== CipherPassword of encrypted DB values ==="
$pwd01 = $cipher.CipherPassword($enc_user01)
$pwd02 = $cipher.CipherPassword($enc_user02)
$pwd88 = $cipher.CipherPassword($enc_user88)
$pwdCommon = $cipher.CipherPassword($enc_common)
Write-Output "  CipherPassword('2@F=2@F=D') = $pwd01"
Write-Output "  CipherPassword('2@F=2@F=[') = $pwd02"
Write-Output "  CipherPassword('2@F=2@F=B') = $pwd88"
Write-Output "  CipherPassword('common') = $pwdCommon"
