# Shorts to render on your PC

3D shorts (cartoon-3d-short) are too slow to render in the cloud (no GPU). The cloud session prepares everything
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
ffmpeg -y -i out/<slug>/video.mp4 -i shorts/<slug>/audio/mix.wav -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 192k -shortest deliveries/<series>/<NN>_<slug>.mp4
```
Then `git add deliveries; git commit -m "render <slug>"; git push`, or just upload it.
Optional QA: `python scripts/short_qa.py deliveries/<series>/<NN>_<slug>.mp4 out/<slug>/qa`

## Queue (the cloud session adds rows)

| Series | NN | Slug | CompositionId | Audio ready | Rendered |
|---|---|---|---|---|---|
