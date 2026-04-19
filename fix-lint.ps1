Get-ChildItem -Path f:\tajwater-square\app, f:\tajwater-square\components -Filter *.tsx -Recurse | ForEach-Object {
    $c = Get-Content $_.FullName -Raw
    $c = $c -replace 'react-hooks/set-state-in-effect', 'react-hooks/exhaustive-deps'
    Set-Content $_.FullName $c
}
