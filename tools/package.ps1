$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$outputRoot = Join-Path $projectRoot 'output'
$releaseRoot = Join-Path $outputRoot 'physics2-site'
$zipPath = Join-Path $outputRoot 'physics2-site.zip'

New-Item -ItemType Directory -Force -Path $releaseRoot | Out-Null
foreach ($name in @('index.html', 'netlify.toml', 'img', 'downloads')) {
    Copy-Item -LiteralPath (Join-Path $projectRoot $name) -Destination $releaseRoot -Recurse -Force
}

# Package only the deployable files, never temporary inspection files.
$releaseFiles = @('index.html', 'netlify.toml', 'img', 'downloads') | ForEach-Object {
    Join-Path $releaseRoot $_
}
Compress-Archive -LiteralPath $releaseFiles -DestinationPath $zipPath -Force
Get-Item -LiteralPath $zipPath | Select-Object FullName, Length
