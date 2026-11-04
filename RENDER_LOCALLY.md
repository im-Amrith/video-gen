# Shorts to render on your PC

Both series (What If, History) now use the 3D cartoon look (`src/videos/toon/` engine). They are too slow to render in the cloud (no GPU). The cloud session prepares everything
(script, voice, shot plan, sound mix, check stills) and lists each one here. You render on your PC with a GPU.

## One-time setup (Windows, PowerShell, in this folder)

```powershell
git pull
npm install
# needs Node 20+, Google Chrome, and ffmpeg on PATH (D:\comp\ffmpeg-7.1.1-full_build\bin works)
$env:REMOTION_TMP = "D:\remotion-tmp"   # Remotion bundles are big; keep them off C:
```

## Render one short

```powershell
git pull
npx remotion render src/index.ts <CompositionId> out/<slug>/video.mp4 --codec h264 --crf 18 --gl=angle --concurrency=4
ffmpeg -y -i out/<slug>/video.mp4 -i projects/<slug>/audio/mix.wav -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 192k -shortest deliveries/<series>/<NN>_<slug>.mp4
```
Then `git add deliveries; git commit -m "render <slug>"; git push`, or just upload it.
Optional QA: `python scripts/short_qa.py deliveries/<series>/<NN>_<slug>.mp4 out/<slug>/qa`

## Queue (the cloud session adds rows)

| Series | NN | Slug | CompositionId | Audio ready | Rendered |
|---|---|---|---|---|---|
| what-if | 01 | tunnel-through-earth | WhatIf01Tunnel | yes (`projects/tunnel-through-earth/audio/mix.wav`, 65.33 s) | no |
| what-if | 02 | earth-stops-spinning | WhatIf02Spin | yes (`projects/earth-stops-spinning/audio/mix.wav`, 61.77 s) | no |
| what-if | 03 | all-ice-melts | WhatIf03Ice | yes (`projects/all-ice-melts/audio/mix.wav`, 55.43 s) | no |
| what-if | 04 | sun-vanishes | WhatIf04Sun | yes (`projects/sun-vanishes/audio/mix.wav`, 58.43 s) | no |
| what-if | 05 | moon-disappears | WhatIf05Moon | yes (`projects/moon-disappears/audio/mix.wav`, 55.23 s) | no |
| history | 01 | shortest-war | History01ShortestWar | yes (`projects/shortest-war/audio/mix.wav`, 62.13 s) | no |
| history | 02 | leaning-tower | History02LeaningTower | yes (`projects/leaning-tower/audio/mix.wav`, 63.07 s) | no |
| history | 03 | emu-war | History03EmuWar | yes (`projects/emu-war/audio/mix.wav`, 60.73 s) | no |
| history | 04 | 1904-marathon | History04Marathon1904 | yes (`projects/1904-marathon/audio/mix.wav`, 65.53 s) | no |

### Exact commands per short

**What If 01 — tunnel-through-earth** (1960 frames, 65.33 s)
```powershell
npx remotion render src/index.ts WhatIf01Tunnel out/tunnel/video.mp4 --codec h264 --crf 18 --gl=angle --concurrency=4
ffmpeg -y -i out/tunnel/video.mp4 -i projects/tunnel-through-earth/audio/mix.wav -map 0:v:0 -map 1:a:0 -c:v libx264 -crf 20 -preset slow -pix_fmt yuv420p -c:a aac -b:a 192k -shortest deliveries/what-if/01_tunnel-through-earth.mp4
```
Optional 2K: add `--scale 1.3333` to the render (1440x2560).

**what-if 02 — earth-stops-spinning** (1853 frames, 61.77 s)
```powershell
npx remotion render src/index.ts WhatIf02Spin out/spin/video.mp4 --codec h264 --crf 18 --gl=angle --concurrency=4
ffmpeg -y -i out/spin/video.mp4 -i projects/earth-stops-spinning/audio/mix.wav -map 0:v:0 -map 1:a:0 -c:v libx264 -crf 20 -preset slow -pix_fmt yuv420p -c:a aac -b:a 192k -shortest deliveries/what-if/02_earth-stops-spinning.mp4
```

**what-if 03 — all-ice-melts** (1663 frames, 55.43 s)
```powershell
npx remotion render src/index.ts WhatIf03Ice out/ice/video.mp4 --codec h264 --crf 18 --gl=angle --concurrency=4
ffmpeg -y -i out/ice/video.mp4 -i projects/all-ice-melts/audio/mix.wav -map 0:v:0 -map 1:a:0 -c:v libx264 -crf 20 -preset slow -pix_fmt yuv420p -c:a aac -b:a 192k -shortest deliveries/what-if/03_all-ice-melts.mp4
```

**what-if 04 — sun-vanishes** (1753 frames, 58.43 s)
```powershell
npx remotion render src/index.ts WhatIf04Sun out/sun/video.mp4 --codec h264 --crf 18 --gl=angle --concurrency=4
ffmpeg -y -i out/sun/video.mp4 -i projects/sun-vanishes/audio/mix.wav -map 0:v:0 -map 1:a:0 -c:v libx264 -crf 20 -preset slow -pix_fmt yuv420p -c:a aac -b:a 192k -shortest deliveries/what-if/04_sun-vanishes.mp4
```

**what-if 05 — moon-disappears** (1657 frames, 55.23 s)
```powershell
npx remotion render src/index.ts WhatIf05Moon out/moon/video.mp4 --codec h264 --crf 18 --gl=angle --concurrency=4
ffmpeg -y -i out/moon/video.mp4 -i projects/moon-disappears/audio/mix.wav -map 0:v:0 -map 1:a:0 -c:v libx264 -crf 20 -preset slow -pix_fmt yuv420p -c:a aac -b:a 192k -shortest deliveries/what-if/05_moon-disappears.mp4
```

**history 01 — shortest-war** (1864 frames, 62.13 s)
```powershell
npx remotion render src/index.ts History01ShortestWar out/zanzibar/video.mp4 --codec h264 --crf 18 --gl=angle --concurrency=4
ffmpeg -y -i out/zanzibar/video.mp4 -i projects/shortest-war/audio/mix.wav -map 0:v:0 -map 1:a:0 -c:v libx264 -crf 20 -preset slow -pix_fmt yuv420p -c:a aac -b:a 192k -shortest deliveries/history/01_shortest-war.mp4
```

**history 02 — leaning-tower** (1892 frames, 63.07 s)
```powershell
npx remotion render src/index.ts History02LeaningTower out/pisa/video.mp4 --codec h264 --crf 18 --gl=angle --concurrency=4
ffmpeg -y -i out/pisa/video.mp4 -i projects/leaning-tower/audio/mix.wav -map 0:v:0 -map 1:a:0 -c:v libx264 -crf 20 -preset slow -pix_fmt yuv420p -c:a aac -b:a 192k -shortest deliveries/history/02_leaning-tower.mp4
```

**history 03 — emu-war** (1822 frames, 60.73 s)
```powershell
npx remotion render src/index.ts History03EmuWar out/emu/video.mp4 --codec h264 --crf 18 --gl=angle --concurrency=4
ffmpeg -y -i out/emu/video.mp4 -i projects/emu-war/audio/mix.wav -map 0:v:0 -map 1:a:0 -c:v libx264 -crf 20 -preset slow -pix_fmt yuv420p -c:a aac -b:a 192k -shortest deliveries/history/03_emu-war.mp4
```

**history 04 — 1904-marathon** (1966 frames, 65.53 s)
```powershell
npx remotion render src/index.ts History04Marathon1904 out/marathon/video.mp4 --codec h264 --crf 18 --gl=angle --concurrency=4
ffmpeg -y -i out/marathon/video.mp4 -i projects/1904-marathon/audio/mix.wav -map 0:v:0 -map 1:a:0 -c:v libx264 -crf 20 -preset slow -pix_fmt yuv420p -c:a aac -b:a 192k -shortest deliveries/history/04_1904-marathon.mp4
```
