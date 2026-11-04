# Progress

_Updated by every session. Newest first._

## Status (2026-11-04)
- **What If batch started.** 5 fact-checked briefs in `briefs/what-if/` (01 tunnel-through-earth = pilot, 02 earth-stops-spinning,
  03 all-ice-melts, 04 sun-vanishes, 05 moon-disappears).
- **Pilot ep. 1 `tunnel-through-earth`**: Lemo-Opuscar iso-infographic (Canvas 2D), rendered in the cloud (~0.1 s/frame).
  Project: `projects/tunnel-through-earth/` (SCRIPT.md with sources, TREATMENT.md, DECISIONS.md, build.sh).
  Delivery: `deliveries/what-if/01_tunnel-through-earth.mp4` (+ `_sheet.jpg`, `.md`). Brief status `review`.
  Locked look: `briefs/what-if/SERIES_LOOK.md`.

## Next
1. **Wait for the owner's approval of the pilot** (approval gate). Apply feedback to the pilot + SERIES_LOOK.md.
2. While waiting: reference study (`Shorts/`) and Gemini remix packs (`gemini-refs/`) once the owner pushes videos (`git pull origin main`).
3. After approval: ep. 2 `earth-stops-spinning` reusing `projects/tunnel-through-earth/` (engine.js, mix.py, build.sh pattern).
4. Then the History batch.

## How to rebuild the pilot
```bash
sh .claude/skills/lemo-opuscar/scripts/setup.sh && sh .claude/skills/lemo-opuscar/scripts/setup.sh deps voice
sh projects/tunnel-through-earth/build.sh      # picture + mix + master → projects/tunnel-through-earth/out/
```

## Problems / notes
- **Whisper model blocked:** huggingface.co, hf-mirror.com and GitHub releases are blocked here, so faster-whisper can't download a model
  and the speech-to-text check didn't run. Word timings (`voice/words.json`) are estimated from the audio. To fix: allow huggingface.co
  in the environment's network settings, or commit a faster-whisper `base.en` model folder.
- WebFetch can't reach arxiv.org / livescience.com (network policy); fact checks used web search results.
- Lemo-Opuscar library lives in `~/lemo-opuscar` (re-fetched by its setup script each session; not in the repo).
- Measured 2026-11-04: the 3D bridge short renders at ~40-77 s per frame (half size) in the cloud. The final renders for 3D shorts go to RENDER_LOCALLY.md.
- Kenney GLB props are not in the repo (optional; kenney.nl may be blocked).
