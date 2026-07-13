Add-Type -Path "D:\winvqp93\Cipher256.dll"
$asm = [System.Reflection.Assembly]::LoadFrom("D:\winvqp93\Cipher256.dll")
$types = $asm.GetExportedTypes()
Write-Output "=== Exported Types ==="
foreach ($t in $types) {
    Write-Output "`nClass: $($t.FullName)"
    Write-Output "  Constructors:"
    foreach ($c in $t.GetConstructors()) {
        $params = ($c.GetParameters() | ForEach-Object { "$($_.ParameterType.Name) $($_.Name)" }) -join ", "
        Write-Output "    $($c.Name)($params)"
    }
    Write-Output "  Methods:"
    foreach ($m in $t.GetMethods()) {
        if ($m.Name -notmatch '^(get_|set_|add_|remove_|ToString|Equals|GetHashCode|GetType)$') {
            $params = ($m.GetParameters() | ForEach-Object { "$($_.ParameterType.Name) $($_.Name)" }) -join ", "
            Write-Output "    $($m.ReturnType.Name) $($m.Name)($params)"
        }
    }
    Write-Output "  Properties:"
    foreach ($p in $t.GetProperties()) {
        Write-Output "    $($p.PropertyType.Name) $($p.Name)"
    }
    Write-Output "  Fields:"
    foreach ($f in $t.GetFields()) {
        Write-Output "    $($f.FieldType.Name) $($f.Name)"
    }
}
