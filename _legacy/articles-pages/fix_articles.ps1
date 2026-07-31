# Fix article formatting and remove special characters
$files = Get-ChildItem *.html

foreach ($file in $files) {
    Write-Host "Processing: $($file.Name)"
    
    # Read file with UTF-8 encoding
    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    
    # Fix div formatting - ensure proper newline
    $content = $content -replace '">\s*<div class="text-gray-300', "">`n                <div class=""text-gray-300"
    
    # Remove the special character (appears as empty in some encodings)
    # Try different representations
    $content = $content -replace [char]0x2022, ''  # Bullet point
    $content = $content -replace [char]0x2013, '-'  # En dash
    $content = $content -replace [char]0x2014, '--'  # Em dash
    $content = $content -replace [char]0x2018, "'"  # Left single quote
    $content = $content -replace [char]0x2019, "'"  # Right single quote
    $content = $content -replace [char]0x201C, '"'  # Left double quote
    $content = $content -replace [char]0x201D, '"'  # Right double quote
    $content = $content -replace [char]0x2026, '...'  # Ellipsis
    
    # Remove any remaining problematic characters
    $content = $content -replace '', ''
    
    # Write back with UTF-8 encoding
    [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
}

Write-Host "Done processing all files!"


