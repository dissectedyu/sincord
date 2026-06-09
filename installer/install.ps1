$link = "https://github.com/Sincord/Sinlotl/releases/latest/download/SinlotlCli.exe"

$outfile = "$env:TEMP\SinlotlCli.exe"

Write-Output "Downloading installer to $outfile"

Invoke-WebRequest -Uri "$link" -OutFile "$outfile"

Write-Output ""

Start-Process -Wait -NoNewWindow -FilePath "$outfile"

# Cleanup
Remove-Item -Force "$outfile"
