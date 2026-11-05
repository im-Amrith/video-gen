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

## Feedback #4 (FEEDBACK.md, after watching all 10 renders) — A1, A3 and all B items fixed (2026-11-05); A2 partly. Re-render ALL 10 (shared code changed): `.\scripts\render_all.ps1 -Force -Concurrency 2`
- [x] A1 legs never shrink — re-render ALL (toon.ts: sit = knees-up full-length legs, new "seat" mode with hanging shins + card lowered onto the seat, fall legs scale with build; seat used for deck chair, car, boat, Moon, yacht). Alarm-clock legs attached (kit.ts).
- [~] A2 contact — fixed where reported: seat mode puts hips on seats (deck chair, car, boats, Moon, yacht); Pip planted on the globe with a contact shadow (02); walks on the ice lid with a shadow (04); off the planks (03); inside the window (03); hangs beside the axis rod (05); Major clear of the truck (H03); Lorz inside the car (H04); BOLOGNA sign on the wall (H05). STILL OPEN: a full every-shot clipping sweep of all 10 was not done (budget); watch the renders for any remaining overlaps.
- [x] A3 globe — re-render What If 02, 04, 05: globe shots re-lensed to 32 deg with the camera moved back (core.ts `tele`); the green line was the far town ground seen edge-on from space: static far meshes hidden in space shots (kit.ts `farFrom`); tides = sea-blue shell with soft white rim, no ink, fades head-on (kit.ts `tideShell`); brake burst removed from the tide shot.
- [x] B What If 02 spin — re-render: Pip planted on the globe top (follows the squash) with contact shadow, scale 0.8; 14-item debris stream flies east (cars, houses, lamp posts, tumbling people, dust); real boat (curved hull, rim, seat, foam waterline that bobs), Pip seated waist above the rim; alarm legs attached; legs + globe + tide via A1/A3.
- [x] B What If 03 ice — re-render: town sea opaque deep blue + white foam line at the tower; a slab band at every floor (20 countable floors); penguin beside the ice pile; sparkles centred above the cube; water level continuous (shot 5 rises to the drowned-town level of shot 6); Pip looks out from inside a 5th-floor window (room behind, frame + wall below the sill); shot 10 Pip on the sand in front of the boardwalk (was sunk in the planks); legs via A1. Not checked in stills: shots 6 and 10.
- [x] B What If 04 sun — re-render: deck chair has front legs + side rails + crossbar, Pip seated with hanging legs (A1 seat); shot 9 Pip walks on the ice lid with a contact shadow (was walking in place, no shadow); vents = stacked rocky chimneys with a dark lip, smoke from the top; matchstick tube worms removed; shrimp wear real glasses (framed lenses, bridge, arm, shine). Not checked: the walk keeps Pip in frame for the whole shot.
- [x] B What If 05 moon — re-render: tide bulges via A3 tideShell; Pip hangs beside the axis rod under the knob, hand at its surface (no longer through it); the sea rises back to the opening level when the Moon returns (shot 9); legs via A1.
- [x] B History 01 shortest-war — re-render: warships detailed (painted hull with portholes + red boot-topping, twin-barrel turrets fore/aft, two masts with yards, funnel smoke, V wake + bow foam); torch glow soft (larger, dimmer falloff); barricade = planks nailed across the door one by one; sinking yacht gets splashes, smoke and floating debris (planks, barrel, life ring); 0:37 reframed (Khalid in front, palace behind, no wall); 0:53 a British officer hands over the bill, both in frame; legs via A1.
- [x] B History 02 leaning-tower — re-render: tower 35 % taller (4.6 m per floor, camera heights scaled to match), stands on a two-step marble plinth, open galleries ringed with white columns (floors 1-6), smaller belfry on top; detailed cute sleeping cat (curled body, tail wrapped, tabby stripes, tucked paws, pink ears + nose, closed smiling eyes, whiskers, breathing, zz); drilling sprays soil out of the side onto a growing pile (piazza rig and the cross-section). Not checked in stills: the far wide shots (tower top must stay in frame).
- [x] B History 03 emu-war — re-render: detailed machine gun (finned cooling jacket, muzzle, receiver, pan magazine, wooden stock + grip, braced tripod with feet, ammo box + brass cartridge belt); emus redrawn (shaggy drooping feathers, blue throat skin, backward ankle, scaly shins, three toes, crest); Major moved clear of the parked truck (0:19); 1930s truck (long bonnet, grille, headlamps, curved mudguards, spoked wheels, running boards, roofed cab + windscreen, slatted bed + canvas tilt). Not checked: emu close-ups.
- [x] B History 04 1904-marathon — re-render: early-1900s open car (tall spoked wheels + mudguards, open tub with brass trim, tufted leather benches, short bonnet + brass radiator, steering column + wheel, brass lamps + horn); Lorz sits inside on the rear bench, waist above the side (A1 seat); the yellow heat-shimmer "noodle" removed (0:13); gold medal on a ribbon around Hicks's neck (0:57).
- [x] B History 05 war-of-the-bucket — re-render: the BOLOGNA sign is a flat painted board fixed on the wall above the gate (was a camera-facing card that swung into the wall and vanished).

## Feedback #3 pass (no dark/empty > 1.5 s, visual progression, faces in frame, every shot moves, payoffs read) — DONE: ALL 10 READY TO RE-RENDER
Engine change for all: every camera key arcs slowly around its look point (core.ts `DRIFT`), so all 10 need a re-render.
All 10 are ticked (2026-11-04): re-render all 10 in one go (`.\scripts\render_all.ps1 -Force -Concurrency 2`).
- [x] What If 01 tunnel: glowing hole (no black interior), distinct layer looks (grey crust -> dark red -> magma with embers ->
      liquid iron -> white-hot core with glints -> cooling back), CUs re-aimed at the face, Kola rig orbit crane, South Pole
      payoff with research-station crew in parkas (replaced the penguins: none live at the Pole) + SOUTH POLE sign + a bright crane shot (replaces the 3 s down-the-hole shot), Pip pops higher.
- [x] What If 02 earth-stops-spinning: star field, nebula + sun glows in space; lit lamps + fireflies on the six-month-night street; held keys now orbit/crane; painted EUROPE (UNDERWATER) and 1.4 BYA / DAY = 18 HRS signs.
- [x] What If 03 all-ice-melts: dress.ts ice slabs, icebergs, mountains, posts (no plain cones); dune grass, fences, hill + picnic layers; ANTARCTICA 91% / GREENLAND 8% / GLACIERS 1% / NORTH POLE / HILL HOUSE FOR SALE signs; held keys move; drowned-town aerial reframed.
- [x] What If 04 sun-vanishes: star field + nebulae; Earth city lights after lights-out; lit lamps and window glow in the dark park/town; plankton + lantern glow in the ocean cutaway; painted vents, rocks, kelp, snow tufts; held keys move.
- [x] History 03 emu-war: held keys now orbit/crane; dam ambush at golden dawn (breaks the long day stretch); CAMPION, WESTERN AUSTRALIA 1932 sign + ROUNDS 9,860 / EMUS 986 tally board.
- [x] History 04 1904-marathon: held keys now orbit/crane; day/golden alternate by beat (shots 2, 5 golden); ST. LOUIS 1904, WATER (the only one), FINISH, BOSTON MARATHON 1905 signs.
- [x] History 05 war-of-the-bucket: feedback #2 dressing (inked tufts in 3 layers, painted rocks at the ford/banks, fences, well posts, bushes/trees, hill ring); town hall relit (brick + marble, arched windows, red carpet, sun in front instead of the washed-out purple backlight); PALAZZO COMUNALE MODENA banner, THE STOLEN BUCKET placard, MODENA/BOLOGNA signpost, BOLOGNA gate sign, well sign "BUCKET MISSING SINCE 1325"; every key orbits/cranes.
- [x] What If 05 moon-disappears: night beach lit (jetty lanterns, striped lighthouse, lantern boat, moon glitter); sand slopes so the tide visibly runs out; painted rocks, dune grass, hill line; reef with coral rocks, sea grass, fish; per-section nebula colours in space; Pip + Moon both in frame at open/end; held keys move.
- [x] History 01 shortest-war: barricade beat at night (lit windows, gate torches); harbour dressed (palms, grass, rocks, trees, hills); ZANZIBAR 1896 + GERMAN CONSULATE signs; camera tracks Khalid to the consulate; held keys move.
- [x] History 02 leaning-tower: lawn in 3 depth layers; soil cross-section set in a landscape; PISA 1173 + CLOSED 1990 signs; every held key moves.

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
