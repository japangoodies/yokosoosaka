Add-Type -Path "D:\winvqp93\Cipher256.dll"
$cipher = New-Object Cipher256.Cipher

# Try decrypting known encrypted passwords with different keys
$encrypted = @{
    "01" = "2@F=2@F=D"
    "02" = "2@F=2@F=["
    "88" = "2@F=2@F=B"
    "1001" = "2>C:"
    "common" = "A\aR." + [char]0x05 + [char]0x05 + "O"
    "ANSIUSER" = "T" + [char]0x08 + "C?2GK@"
}

$keys = @("VQPBOS", "VQPBOS93", "goldilocks", "brownies", "Cipher256", 
          "12345678", "12341234", "0123456789ABCDEF0123456789ABCDEF",
          "", "password", "admin", "POS", "FASTFOOD", "winvqp93",
          "VQPBOS00", "VQPBOS01", "VQPBOS88")

Write-Output "=== Testing decryptMessage ==="
foreach ($key in $keys) {
    Write-Output "`n--- Key: '$key' ---"
    foreach ($uid in $encrypted.Keys) {
        $enc = $encrypted[$uid]
        try {
            $dec = $cipher.decryptMessage($enc, $key)
            Write-Output "  $uid : '$enc' -> '$dec'"
        } catch {
            Write-Output "  $uid : ERROR: $_"
        }
    }
}

Write-Output "`n=== Testing CipherPassword ==="
foreach ($uid in $encrypted.Keys) {
    $enc = $encrypted[$uid]
    try {
        $result = $cipher.CipherPassword($enc)
        Write-Output "  $uid : CipherPassword('$enc') = '$result'"
    } catch {
        Write-Output "  $uid : ERROR: $_"
    }
}

Write-Output "`n=== Testing encryptMessage with common passwords ==="
$test_passwords = @("1", "2", "88", "1234", "12341234", "", "1001", "1002")
$enc_key = "VQPBOS"
foreach ($pwd in $test_passwords) {
    try {
        $enc = $cipher.encryptMessage($pwd, $enc_key)
        Write-Output "  encrypt('$pwd', '$enc_key') = '$enc'"
    } catch {
        Write-Output "  encrypt('$pwd', '$enc_key') = ERROR: $_"
    }
}
