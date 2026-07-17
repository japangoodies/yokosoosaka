Add-Type -AssemblyName System.IO.Compression.FileSystem
$path = "E:\opencode\brownies\260715_ttimetrnduplicate.prz"
[System.GC]::Collect()
[System.GC]::WaitForPendingFinalizers()
Start-Sleep -Seconds 2
if (Test-Path $path) { Remove-Item $path -Force }
Start-Sleep -Seconds 1
$zip = [System.IO.Compression.ZipFile]::Open($path, 'Create')
$files = @{
  'ansiupd.bat' = 'E:\opencode\brownies\run_hotext.bat'
  'dupdates.sql' = 'E:\opencode\brownies\dupdates.sql'
  'ttimetrn_duplicates.sql' = 'E:\opencode\brownies\ttimetrn_duplicates.sql'
}
$files.Keys | ForEach-Object {
  $entry = $zip.CreateEntry($_)
  $w = New-Object System.IO.StreamWriter($entry.Open())
  Get-Content $files[$_] | ForEach-Object { $w.WriteLine($_) }
  $w.Close()
}
$zip.Dispose()
Write-Host "OK"
