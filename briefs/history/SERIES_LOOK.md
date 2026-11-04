# History — series look

Engine: `cartoon-3d-short` 3D cartoon look (same engine as What If, `src/videos/toon/`).

## Owner feedback — 2026-11-04 (applies to EVERY episode from now on, both series)
- **Engine change:** both series use the 3D cartoon look (`cartoon-3d-short`: Remotion + three.js, 2D characters in a 3D world).
  The cloud builds everything up to the render; the owner renders the finals on their PC (RENDER_LOCALLY.md). Cloud renders only
  3-6 check stills per video at `--scale 0.5`.
- **Something new every 1.5-3 s** (cut, camera move, gag, effect, expression change). No long holds.
- **Real camera moves:** dollies, cranes, orbits, whip-pans, push-ins, kicks on impacts.
- **Bigger, more expressive characters:** close and medium shots, clear expression changes, big poses.
- **Detailed world:** painted textures, glow, particles, atmosphere (dust, sparks, snow, bubbles, stars).
- **No caption box that repeats the voice-over.** (No captions at all, per the cartoon style.)
- **Strong first-frame hook:** frame 0 is already an arresting image and the first line is the absurd fact.
- **A joke / payoff beat** in every episode (deadpan "Luckily... / Unluckily..." or a callback twist).
- **SFX for every action** (every fall, hit, glow, pop, whoosh, step).
- Every short ships: SCRIPT.md with sources, voice + words.json, story.ts shot plan, world, cast, mix.wav, a registered composition,
  `npx tsc --noEmit` clean, and a RENDER_LOCALLY.md row with exact render + mux commands.

## Owner feedback — 2026-11-04 #2 (from the check stills; applies to ALL episodes)
- **No placeholder props**: no plain cones or cylinders. Grass/wheat = clustered tufts with an ink outline; bullet casings = brass
  casings with a rim and a highlight; rocks, fences and bushes with painted texture (src/videos/toon/dress.ts).
- **Fill empty landscapes: 3 depth layers** — foreground props, midground set dressing, background hills or skyline; varied trees;
  small life (birds, dust, drifting clouds — built into the engine world).
- Keep: the close-ups, expressions, glow and effects.
