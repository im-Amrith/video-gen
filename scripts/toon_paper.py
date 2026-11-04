"""Paperwork for a toon short.
usage: python3 scripts/toon_paper.py <series> <NN> <slug> <src-folder-name> <CompositionId> <voice desc>
reads  projects/<slug>/SOURCES.md (sources block), projects/<slug>/DELIVERY.md (title/description/hashtags), timeline.json
writes projects/<slug>/SCRIPT.md, deliveries/<series>/<NN>_<slug>.md, and the RENDER_LOCALLY.md row + commands (idempotent)."""
import json, sys, os, re
series, nn, slug, src, comp, voice = sys.argv[1:7]
T = json.load(open(f"src/videos/{src}/timeline.json"))
P = f"projects/{slug}"
srcs = open(f"{P}/SOURCES.md").read().strip()
title = open(f"{P}/DELIVERY.md").read().strip()
s = f"# SCRIPT — {slug} ({series} ep. {int(nn)}, 3D cartoon)\n\n## Sources\n{srcs}\n\n## Voice — {voice}; word timings in voice/words.json (estimated)\n\n| id | t0 (s) | line |\n|---|---|---|\n"
for k, v in T["lines"].items(): s += f"| {k} | {v['t0']:.2f} | {v['text']} |\n"
s += f"\nLength {T['dur']} s ({T['total']} frames @ 30 fps).\n"
open(f"{P}/SCRIPT.md", "w").write(s)
os.makedirs(f"deliveries/{series}", exist_ok=True)
open(f"deliveries/{series}/{nn}_{slug}.md", "w").write(title + "\n\n**Sources**\n" + srcs + "\n")
R = open("RENDER_LOCALLY.md").read()
row = f"| {series} | {nn} | {slug} | {comp} | yes (`{P}/audio/mix.wav`, {T['dur']:.2f} s) | no |"
if f"| {comp} |" not in R:
    lines = R.split("\n")
    hdr = next(i for i, ln in enumerate(lines) if ln.startswith("### Exact commands per short"))
    idx = max(i for i, ln in enumerate(lines[:hdr]) if ln.startswith("| "))
    lines.insert(idx + 1, row)
    R = "\n".join(lines)
    R += f"""
**{series} {nn} — {slug}** ({T['total']} frames, {T['dur']:.2f} s)
```powershell
npx remotion render src/index.ts {comp} out/{src}/video.mp4 --codec h264 --crf 18 --gl=angle --concurrency=4
ffmpeg -y -i out/{src}/video.mp4 -i {P}/audio/mix.wav -map 0:v:0 -map 1:a:0 -c:v libx264 -crf 20 -preset slow -pix_fmt yuv420p -c:a aac -b:a 192k -shortest deliveries/{series}/{nn}_{slug}.mp4
```
"""
    open("RENDER_LOCALLY.md", "w").write(R)
print("paper ok", slug)
