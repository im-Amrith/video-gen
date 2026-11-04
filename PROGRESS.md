# Progress

_Updated by every session. Newest first._

## Status (2026-11-04, ~18:10 UTC)
Owner's plan: **build all, render on the owner's PC**. Both series switched to the 3D cartoon look (cartoon-3d-short:
Remotion + three.js). The cloud builds everything up to the render; only 3-6+ check stills per video at --scale 0.5.

**All 10 shorts are built and render-ready** (registered compositions, `npx tsc --noEmit` clean for every new folder,
mix.wav, SCRIPT.md with sources, words.json, story.ts shot plan, sets, cast, stills sheet, RENDER_LOCALLY row):

| Series | NN | Slug | Composition | Length |
|---|---|---|---|---|
| What If | 01 | tunnel-through-earth | WhatIf01Tunnel | 65.3 s |
| What If | 02 | earth-stops-spinning | WhatIf02Spin | 61.8 s |
| What If | 03 | all-ice-melts | WhatIf03Ice | 55.4 s |
| What If | 04 | sun-vanishes | WhatIf04Sun | 58.4 s |
| What If | 05 | moon-disappears | WhatIf05Moon | 55.2 s |
| History | 01 | shortest-war | History01ShortestWar | 62.1 s |
| History | 02 | leaning-tower | History02LeaningTower | 63.1 s |
| History | 03 | emu-war | History03EmuWar | 60.7 s |
| History | 04 | 1904-marathon | History04Marathon1904 | 65.5 s |
| History | 05 | war-of-the-bucket | History05WarOfTheBucket | 57.4 s |

Render all on the PC: `.\scripts\render_all.ps1` (RENDER_LOCALLY.md). Stills sheets: `deliveries/<series>/<NN>_<slug>_stills.jpg`.

## Feedback #2 pass (dressing: real props, 3 depth layers, small life) — RE-RENDER THESE
Engine change for all: drifting low clouds, bird flocks and dust motes in day/golden shots (src/videos/toon/world.ts),
painted tuft cards / rocks / posts / brass casings / icebergs / mountains (src/videos/toon/dress.ts).
Episodes changed (re-render only these; audio unchanged unless noted):
- [x] History 03 emu-war (wheat tufts, brass casings, painted fence, hills + mountains + trees)
- [x] History 04 1904-marathon (corn tufts, painted fences, rocks, trees + hill ring)

## Feedback #3 pass (no dark/empty > 1.5 s, visual progression, faces in frame, every shot moves, payoffs read) — IN PROGRESS
Engine change for all: every camera key arcs slowly around its look point (core.ts `DRIFT`), so all 10 need a re-render.
When every box below is ticked, ALL 10 are ready to re-render in one go (`.\scripts\render_all.ps1 -Force -Concurrency 2`).
- [x] What If 01 tunnel: glowing hole (no black interior), distinct layer looks (grey crust -> dark red -> magma with embers ->
      liquid iron -> white-hot core with glints -> cooling back), CUs re-aimed at the face, Kola rig orbit crane, South Pole
      payoff with penguins + SOUTH POLE sign + a bright crane shot (replaces the 3 s down-the-hole shot), Pip pops higher.

## How it's built
- **Engine** `src/videos/toon/`: the bridge short's look modules (ink, lens blur, grade, two-tone shading, card shading,
  toon characters, painted textures) + generic world (light presets day/golden/night/space/magma, stars, clouds, camera-relative
  sun per shot), cast pool, effects (glows, particles, effect cards), `kit.ts` (Pip, pictograms, globe shader, sea),
  `animals.ts` (bear, penguin, fish, shrimp, crab, cat, gull, emu, hourglass, spirit level), `Short.tsx` (post chain).
  New hats in toon.ts: turban, hardhat, pith, hood, boater.
- **Episode** `src/videos/<name>/`: `timeline.json` (from scripts/toon_voice.py), `story.ts` (shots, cameras, kicks, DOF, cast),
  `set.ts` (places built once, posed per frame), `<Name>.tsx`. Registered in `src/Root.tsx`.
- **Voice**: Kokoro (Lemo-Opuscar library at ~/lemo-opuscar), What If = `am_michael`, History = `bm_george`.
  `scripts/toon_voice.py projects/<slug> src/videos/<name>` lays lines out + writes voice.wav, words.json, timeline.json.
- **Sound**: `audio/toon_audio.py` (bridge DSP + instruments) driven by `projects/<slug>/sound.py` → `projects/<slug>/audio/mix.wav`
  (-14 LUFS, ≤ -1.5 dBTP; music +3 dB standard, SFX -6 dB). Stems are git-ignored (rebuilt by sound.py).
- **Paperwork**: `scripts/toon_paper.py` writes SCRIPT.md, the delivery .md and the RENDER_LOCALLY row.

## Next
1. Owner renders ep. 1 (tonight) and gives feedback → apply to all, re-run stills.
2. Gemini remix packs at the gates (12 reels waiting: armor/igexport-Dc4sSw1jF-D + 11 in gemini-refs/real world/).
3. Reference study when the owner adds Shorts/.

## Problems / notes
- Whisper model download blocked (huggingface.co / GitHub releases) → no speech-to-text check; words.json estimated from audio.
- WebFetch blocked for most sites; facts checked via web search results (sources in each SCRIPT.md).
- Cloud stills take ~35-50 s each (software GL); full renders are for the owner's GPU.
- `src/videos/bridge/` has 6 pre-existing tsc errors (nullable JSX children in Bridge.tsx); the new folders are clean.
- iso-infographic v1 of ep. 1 is kept in `projects/tunnel-through-earth/iso_v1/` and `deliveries/what-if/01_tunnel-through-earth_iso_v1.mp4`.
