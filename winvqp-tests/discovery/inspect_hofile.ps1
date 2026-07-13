Add-Type -Path 'C:\Users\shaye\Desktop\VQP.HOFile.dll'
[AppDomain]::CurrentDomain.GetAssemblies() | Where { $_.Location -like '*HOFile*' } | ForEach {
    $_.GetExportedTypes() | ForEach {
        Write-Host "Type: $($_.FullName)"
        $_.GetMethods() | ForEach {
            $params = ($_.GetParameters() | ForEach { $_.Name + ':' + $_.ParameterType.Name }) -join ', '
            Write-Host "  Method: $($_.Name)($params) -> $($_.ReturnType.Name)"
        }
        $_.GetProperties() | ForEach {
            Write-Host "  Property: $($_.Name) : $($_.PropertyType.Name)"
        }
        $_.GetFields() | ForEach {
            Write-Host "  Field: $($_.Name) : $($_.FieldType.Name)"
        }
    }
}
