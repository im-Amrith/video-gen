# Owner feedback after watching all 10 local renders (2026-11-05) — saved verbatim

## Message 1 (Episode 02)

Episode 02 earth-stops-spinning: rendered and watched. Fix these (times from the render):
1. 0:00-0:05 and 0:13: Pip floats above the globe. Plant his feet on the surface (shadow contact) and make him smaller next to the Earth.
2. 0:03-0:05 and 0:18-0:23: the globe looks bulged (wide-angle distortion). Narrow the field of view to about 25-35 degrees and move the camera back so the sphere stays round.
3. 0:10-0:18: many things fly off, not one: several houses, cars, lamp posts and people tumbling away in the same direction, with dust.
4. 0:29-0:34: replace the flat orange slab with a real small boat (curved hull, rim, seat). Pip sits in it with his waist above the rim, with a waterline that bobs.
5. 0:38-0:44: keep normal leg length in every pose; no squash that shrinks the legs.
6. 0:45-0:48: attach the alarm clock's legs to its body.
7. 0:48-0:52: the Moon's tide must read as water, not an explosion. Remove the burst and show two gentle ocean bulges (opposite sides of the Earth) in sea blue with a soft white rim, no green smear.
8. 0:48-0:52: remove the thin green line across the sky above the Earth (probably an outline pass on an edge-on plane, e.g. an orbit ring). Check other globe shots for the same line.
Audio and timing stay the same. Push, tick it in PROGRESS.md as "re-render", and stop.

## Message 2 (all 10)

I watched all 10 renders. First, save ALL of this feedback verbatim to FEEDBACK.md and push, before any fixing
(credits may end at any time). Then fix in this order, pushing and ticking PROGRESS.md "re-render" after each item.
Keep the drawn cartoon style everywhere: "realistic" below means more detail and believable shapes, not photoreal.

A. SHARED FIXES (do these first: they fix many episodes at once)
1. Legs: characters get tiny/short legs in many shots (What If 03 opening + later scene, 05 at 0:41, 04 man on chair,
   History 01 at 0:30, 02 Spin 0:38-0:44). Fix in the shared cast code: leg length never shrinks with pose, squash or
   camera angle.
2. Contact: nobody floats or sinks. Feet touch the ground with a contact shadow. Nothing passes through anything
   (people, signs, vehicles, props). Check every episode for clipping after the fixes.
3. Globe and tides (shared globe code, What If 02/04/05): no wide-angle bulge (FOV 25-35 deg, camera further back), no
   thin green line across the sky, and tide bulges that read as water: smooth sea-blue swells with a soft white rim,
   no explosion bursts, no blurry green smears.

B. PER EPISODE
What If 02 earth-stops-spinning: Pip floats above the globe at 0:00-0:05 and 0:13 (plant his feet, smaller vs Earth);
  0:10-0:18 many things fly off (several houses, cars, lamp posts, people), not one; 0:29-0:34 replace the orange slab with
  a real small boat, Pip sitting with his waist above the rim; 0:45-0:48 attach the alarm clock's legs to its body.
What If 03 all-ice-melts: the sea is too transparent and doesn't read as sea level; make it opaque deep blue with a
  clear surface line and waves. The 20-storey building looks wrong: a clear tall building with floors you can count.
  The penguin must sit on top of or beside the ice, not trapped inside it. Centre the stars above the ice. The sea rises,
  then vanishes in the next shot: keep the water level continuous across cuts. Pip must look out of a window from inside
  the building, not stand in the air outside it. 0:46 Pip is sunk into the ground/planks: fix.
What If 04 sun-vanishes: the chair needs front legs (and the man normal legs). 0:42 Pip stands on the ground or swims
  in the water while the fish swim, not floating. Redraw the volcanic vents as believable rocky chimneys with smoke,
  not cones. Remove the matchstick-like structures on the seabed. Make the shrimp clearly wear glasses (frames over the
  eyes, visible lenses), not a masked-off face.
What If 05 moon-disappears: tide bulges look fake in several scenes: redo them with rule A3. From 0:35 Pip holds the
  North Pole pillar without passing through it (hands on its surface). 0:41 short legs (A1). When the Moon comes back at
  the end, the sea returns to its level from the opening.
History 01 shortest-war: 0:16 detailed warships (hulls, funnels with smoke, masts, guns, wake). 0:22 natural lamp glow
  (soft warm falloff) and a real barricade: wooden logs or planks nailed across the door, not boxes. 0:30 fix the legs
  and add detail to the sinking ship (tilt, smoke, splashes, debris). 0:37 the wall blocks the view of the Sultan's
  palace: reframe. 0:53 the person handing over the bill must be in frame and from the winning (British) side.
History 02 leaning-tower: the tower must look much taller and like the real monument (white marble, arcaded storeys,
  belfry), standing on a visible base/foundation, not sitting on top of the ground. 0:22 make the sleeping cat on top
  detailed and cute. 0:48 soil drilling: soil comes out of the side and piles up visibly.
History 03 emu-war: detailed machine guns in the opening frame (barrel, cooling jacket, tripod, ammo belt). More
  detailed, believable emus (feathers, proper legs and neck), still cartoon. 0:19 the officers overlap the truck: move
  them out. 0:28 make the vehicle look like a real 1930s truck in the drawn style.
History 04 1904-marathon: the man must sit inside the car, not float on it with his legs through it. Make the car a
  real early-1900s automobile. 0:13 the yellow noodle-like shape floats randomly and overlaps a board in the next shot:
  remove or fix it. 0:57 the gold medal hangs around the winner's neck.
History 05 war-of-the-bucket: 0:36 the BOLOGNA sign is invisible, then phases out of the building: fix its placement.

C. RULES: audio and timing stay unchanged; tsc clean and every episode renderable after each push; no verifier agents,
  at most 3 check stills per fix. Order: A, then B in the order listed. When done (or if I stop you), PROGRESS.md must
  say which items are fixed and which are still open.
