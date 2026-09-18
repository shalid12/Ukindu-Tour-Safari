$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$files = Get-ChildItem -Path $root -Recurse -Filter *.html
$replacements = [ordered]@{
    'â€™' = '’'
    'â€˜' = '‘'
    'â€œ' = '“'
    'â€' = '”'
    'â€‘' = '‑'
    'â€“' = '–'
    'â€”' = '—'
    'Â©' = '©'
    'Â ' = ' '
    'Ã¡' = 'á'
    'Ã©' = 'é'
    'Ã­' = 'í'
    'Ã³' = 'ó'
    'Ãº' = 'ú'
    'Ã±' = 'ñ'
    'Ã¼' = 'ü'
    'Ã' = 'Á'
    'Ã‰' = 'É'
    'Ã' = 'Í'
    'Ã“' = 'Ó'
    'Ãš' = 'Ú'
    'Ãœ' = 'Ü'
    'Ã‘' = 'Ñ'
    'Ã€' = 'À'
    'Ãˆ' = 'È'
    'ÃŒ' = 'Ì'
    'Ã’' = 'Ò'
    'Ã™' = 'Ù'
    'Ã¢' = 'â'
    'Ãª' = 'ê'
    'Ã®' = 'î'
    'Ã´' = 'ô'
    'Ãµ' = 'õ'
    'Ã§' = 'ç'
    'ÃŸ' = 'ß'
    'Ã¥' = 'å'
    'Ã¦' = 'æ'
    'Ã¸' = 'ø'
    'Ã…' = 'Å'
    'Ã‡' = 'Ç'
    'Ã—' = '×'
    'Ã ' = 'à'
    'â€' = '"'
}

$count = 0
foreach ($file in $files) {
    $bytes = [System.IO.File]::ReadAllBytes($file.FullName)
    $text = $null
    try {
        $text = [System.Text.Encoding]::UTF8.GetString($bytes)
    }
    catch {
        $text = [System.Text.Encoding]::GetEncoding(1252).GetString($bytes)
    }

    $original = $text
    foreach ($key in $replacements.Keys) {
        $text = $text.Replace($key, $replacements[$key])
    }

    if ($text -ne $original) {
        [System.IO.File]::WriteAllText($file.FullName, $text, [System.Text.UTF8Encoding]::new($false))
        $count++
    }
}

Write-Host "Fixed $count HTML files"
