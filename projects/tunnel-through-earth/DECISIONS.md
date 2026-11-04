# Decisions — tunnel-through-earth (3D cartoon rebuild, 2026-11-04)

- Owner switched both series to the cartoon-3d-short look; the cloud builds everything up to the render, the owner renders locally.
- Built a shared **toon engine** (`src/videos/toon/`): the bridge short's look modules (ink, lens blur, grade, two-tone shading,
  card shading, toon characters, painted textures) + a generic world (sky presets day/golden/night/space/magma, stars, clouds,
  camera-relative sun per shot), cast pool, effects (glows, particles, effect cards) and composition. Episodes are data + sets.
- Recurring What If host **Pip** (yellow parka, red cap, kid build drawn at 1.25x) so the series has a face.
- The shaft is a 400 m **treadmill**: Pip stays at the origin, walls/lamps/dust scroll by the simulated depth; wall colour,
  glow and fog follow depth (crust → glowing mantle → liquid iron → inner core). The Kola drill bit is stuck in the wall at 12 km.
- No captions or labels (cartoon style + owner feedback); numbers are in the voice, pictograms (thermometer, clock) carry the rest.
- Whisper model download is blocked here: word timings estimated (scripts/toon_voice.py). Every beat is keyed to line starts.
- Sound: `audio/toon_audio.py` (bridge DSP + instruments); 107 cues, one per visible action; original synthesized score.
- Look checks: 5 + 9 + 7 stills at --scale 0.5; fixes: portrait framing (subjects stacked in depth), hole void disc, Kola glow,
  core overexposure, spin about the body centre, warm plane paint.
