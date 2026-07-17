Add-Type -AssemblyName System.IO.Compression.FileSystem
$path = "E:\opencode\brownies\260715_ttimetrnduplicate_v2.prz"
$zip = [System.IO.Compression.ZipFile]::OpenRead($path)
foreach ($entry in $zip.Entries) {
  "--- $($entry.FullName) ($($entry.Length) bytes) ---"
  $r = New-Object System.IO.StreamReader($entry.Open())
  $r.ReadToEnd()
  $r.Close()
}
$zip.Dispose()
