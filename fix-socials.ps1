# Fix social links - remove Facebook and Twitter, keep only Instagram
cd 'c:\Users\alien\Desktop\Projects\Test Projects\Weight-Loss-Plan-Generator'
$content = Get-Content -Path 'src/index.tsx' -Raw

# First, fix the literal `n characters
$content = $content -replace '\`n', "`n"

# Now remove Facebook link (M24 12.073)
$content = $content -replace '<a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">\s*<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12\.073[^"]*"\/><\/svg>\s*<\/a>\s*', ''

# Now remove Twitter link (M23.953 4.57)
$content = $content -replace '<a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">\s*<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23\.953 4\.57[^"]*"\/><\/svg>\s*<\/a>\s*', ''

# Write back
[System.IO.File]::WriteAllText('src/index.tsx', $content, [System.Text.Encoding]::UTF8)
Write-Host "File updated successfully"

# Verify by checking if FB path still exists
if ($content -like '*M24 12.073c0-6.627*') {
    Write-Host "WARNING: Facebook link may still exist"
} else {
    Write-Host "✓ Facebook link removed"
}

if ($content -like '*M23.953 4.57*') {
    Write-Host "WARNING: Twitter link may still exist"
} else {
    Write-Host "✓ Twitter link removed"
}

if ($content -like '*M12 0C8.74*') {
    Write-Host "✓ Instagram link preserved"
} else {
    Write-Host "ERROR: Instagram link was removed!"
}
