# Remove Facebook and Twitter social links, keep Instagram
cd 'c:\Users\alien\Desktop\Projects\Test Projects\Weight-Loss-Plan-Generator'
$content = Get-Content -Path 'src/index.tsx' -Raw

# Remove Facebook and Twitter links using specific SVG paths
$facebook_pattern = '<a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">\s*<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12\.073c0-6\.627.*?<\/a>'
$twitter_pattern = '<a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">\s*<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23\.953 4\.57.*?<\/a>'

$content = $content -replace $facebook_pattern, ''
$content = $content -replace $twitter_pattern, ''

# Remove extra whitespace
$content = $content -replace '\s{2,}<a href="#" className="text-gray-400', '`n                <a href="#" className="text-gray-400'

[System.IO.File]::WriteAllText('src/index.tsx', $content)
Write-Host "Social links removed successfully"
