# Render + mux every toon short on the owner's PC (Windows PowerShell, installed Chrome, GPU via ANGLE). Run from the repo root.
# Usage:
#   .\scripts\render_all.ps1                                  # all shorts whose delivery mp4 doesn't exist yet
#   .\scripts\render_all.ps1 -Only WhatIf01Tunnel             # one short
#   .\scripts\render_all.ps1 -Concurrency 2                   # more tabs (concurrency 4 ran out of memory on the test PC)
#   .\scripts\render_all.ps1 -Force                           # re-render even if the delivery mp4 exists
# Measured on the owner's PC (Node 26, Chrome, 1 tab): ~0.68 s/frame. Remotion's own headless-shell download doesn't
# work there, so we always use the installed Chrome in chrome-for-testing mode.
param(
  [string]$Only = "",
  [int]$Concurrency = 1,
  [string]$Chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe",
  [switch]$Force
)
if (-not $env:REMOTION_TMP) { $env:REMOTION_TMP = "D:\remotion-tmp" }
New-Item -ItemType Directory -Force -Path $env:REMOTION_TMP | Out-Null
$env:TEMP = $env:REMOTION_TMP; $env:TMP = $env:REMOTION_TMP
$shorts = @(
  @{ id = "WhatIf01Tunnel";          src = "tunnel";   proj = "tunnel-through-earth"; out = "deliveries/what-if/01_tunnel-through-earth.mp4" },
  @{ id = "WhatIf02Spin";            src = "spin";     proj = "earth-stops-spinning"; out = "deliveries/what-if/02_earth-stops-spinning.mp4" },
  @{ id = "WhatIf03Ice";             src = "ice";      proj = "all-ice-melts";        out = "deliveries/what-if/03_all-ice-melts.mp4" },
  @{ id = "WhatIf04Sun";             src = "sun";      proj = "sun-vanishes";         out = "deliveries/what-if/04_sun-vanishes.mp4" },
  @{ id = "WhatIf05Moon";            src = "moon";     proj = "moon-disappears";      out = "deliveries/what-if/05_moon-disappears.mp4" },
  @{ id = "History01ShortestWar";    src = "zanzibar"; proj = "shortest-war";         out = "deliveries/history/01_shortest-war.mp4" },
  @{ id = "History02LeaningTower";   src = "pisa";     proj = "leaning-tower";        out = "deliveries/history/02_leaning-tower.mp4" },
  @{ id = "History03EmuWar";         src = "emu";      proj = "emu-war";              out = "deliveries/history/03_emu-war.mp4" },
  @{ id = "History04Marathon1904";   src = "marathon"; proj = "1904-marathon";        out = "deliveries/history/04_1904-marathon.mp4" },
  @{ id = "History05WarOfTheBucket"; src = "bucket";   proj = "war-of-the-bucket";    out = "deliveries/history/05_war-of-the-bucket.mp4" }
)
$done = @(); $failed = @(); $skipped = @()
foreach ($s in $shorts) {
  if ($Only -and $s.id -ne $Only) { continue }
  if ((Test-Path $s.out) -and -not $Force -and -not $Only) { Write-Host "-- skip $($s.id): $($s.out) exists"; $skipped += $s.id; continue }
  Write-Host "== render $($s.id)"
  New-Item -ItemType Directory -Force -Path "out/$($s.src)" | Out-Null
  Remove-Item -ErrorAction SilentlyContinue "out/$($s.src)/video.mp4"
  npx remotion render src/index.ts $s.id "out/$($s.src)/video.mp4" --codec h264 --crf 18 `
    --gl=angle --concurrency=$Concurrency --browser-executable="$Chrome" --chrome-mode=chrome-for-testing
  if ($LASTEXITCODE -ne 0 -or -not (Test-Path "out/$($s.src)/video.mp4")) { Write-Host "!! render failed: $($s.id) (mux skipped)"; $failed += $s.id; continue }
  Write-Host "== mux $($s.id)"
  ffmpeg -y -i "out/$($s.src)/video.mp4" -i "projects/$($s.proj)/audio/mix.wav" -map 0:v:0 -map 1:a:0 -c:v libx264 -crf 20 -preset slow -pix_fmt yuv420p -c:a aac -b:a 192k -shortest $s.out
  if ($LASTEXITCODE -ne 0) { Write-Host "!! mux failed: $($s.id)"; $failed += $s.id; continue }
  $done += $s.id
}
Write-Host ""
Write-Host "done:    $($done -join ', ')"
Write-Host "skipped: $($skipped -join ', ')"
Write-Host "failed:  $($failed -join ', ')"
