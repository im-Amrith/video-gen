# Remix v2: igexport-Dc4sSw1jF-D  (armor, ~16 s, 9:16)

v2 of the pack on branch `claude/quirky-cori-xzitpn`, rewritten to the new skill format: images first, one
continuous 8 s shot per generation, no negative-prompt list, an edit list instead of a "combine" prompt.

**Concept kept:** a lone hero, seen over the shoulder, stands his ground as a colossal horned armoured giant arrives,
raises a glowing weapon and strikes at him; four slow, heavy beats ending on the hero's calm face.
**What changes:** the giant rises out of a flooded salt flat in a storm (not a landing on clouds); its halo becomes a
crown of floating white embers; the drawn sword becomes a spear dragged up from the lake bed that ignites; the slash
becomes a downward thrust that stops a metre from the hero; the hero ends by lowering his visor.

## Reference shot list (4 shots of ~4 s; orchestral booms, no voice, ~78 BPM)
| # | Time | Reel shot | Camera | Transition |
|---|---|---|---|---|
| 1 | 0-4.2 s | Giant slams down onto a sea of clouds; shockwave at the man in the foreground | over the shoulder, low, locked | hard cut |
| 2 | 4.2-8.9 s | Giant's clawed arm draws a glowing blade | close, slow slide | hard cut |
| 3 | 8.9-13.2 s | Giant swings the blade toward the man | over the shoulder, locked | hard cut |
| 4 | 13.2-15.8 s | Man's calm face lit by the passing blade | close-up, locked | end |

## Plan: 4 generations of 8 s → 4 cuts (~16 s)
| Gen | Remixes | Moment | Piece the edit takes |
|---|---|---|---|
| G1 | 1 | Titan rises, spray wall | 1.5-5.7 s (the rise to the spray hit) |
| G2 | 2 | Spear dragged up, ignites | 2.5-7.0 s |
| G3 | 3 | Thrust, impact | 1.0-5.3 s |
| G4 | 4 | Knight's face, visor down | 3.0-6.0 s |

Budget: 4 × Veo 3.1 Fast (~80 credits). If one is bad, re-roll only that one. Quality is optional for G1.

## STYLE LOCK
Photorealistic black-and-white film footage, true monochrome, deep blacks and silver highlights, heavy 35 mm grain,
soft halation. The only colour is the pale ice-blue glow of the titan's weapon. Storm light, falling rain, a thin
mirror of water on the ground reflecting everything. Vertical 9:16.

## CAST LOCK
- **The knight:** an original knight of about 30, short dark wet hair, stubble, a thin scar across his left cheek,
  worn silver plate armour, a visored helm hanging at his hip, a frayed grey cape, a plain longsword held low.
- **The titan:** a colossal armoured giant a hundred metres tall, smooth black obsidian plate armour, ridged clawed
  gauntlets, a crown of long jagged backswept horns, a slow ring of floating white embers above its head.

## Images (Gemini app → Nano Banana, 9:16)

### Character sheet: the knight
```text
[STYLE LOCK] Character reference sheet on a plain grey background: [CAST LOCK: the knight]. Full body front view on
the left, close-up of his face on the right, neutral pose, even light. Vertical 9:16.
```

### Character sheet: the titan
```text
[STYLE LOCK] Character reference of [CAST LOCK: the titan], standing straight on a flat grey ground, full body,
front view, tiny human figure at its feet for scale. Vertical 9:16.
```

### Start frame G1
```text
[STYLE LOCK] Low over-the-shoulder wide shot, 24 mm. The knight seen from behind fills the lower right third, standing
ankle-deep on an endless flooded salt flat under a black storm sky. Far ahead the water surface bulges into a huge
dome, the tips of black horns just breaking through, rain streaking across the frame. Vertical 9:16.
```

### Start frame G2
```text
[STYLE LOCK] Low-angle close shot, 50 mm, of the titan's black clawed gauntlet gripping the shaft of a colossal spear
half under the water, mud and water sheeting off the metal, rain hammering the surface, the titan's armoured knee
looming out of focus behind. The spearhead is still dark. Vertical 9:16.
```

### Start frame G3
```text
[STYLE LOCK] Over-the-shoulder wide shot, 28 mm. The knight from behind in the lower left, the titan towering over the
flooded flat, its ember crown circling its horns, holding a giant spear high above its head with both hands, the
spearhead glowing ice-blue and lighting the rain around it. Vertical 9:16.
```

### Start frame G4
```text
[STYLE LOCK] Close-up, 85 mm, of the knight's wet face filling the frame, half lit cold ice-blue from the right, rain
running over the scar on his cheek, eyes calm and fixed upward, the helm held in both hands just below his chin.
Vertical 9:16.
```

## G1 · 8 s  (reel shot 1: crash-landing on clouds → rising out of a flooded salt flat)
```text
Low over-the-shoulder wide shot, 24 mm, locked camera with a slight shake. In the first 2 seconds the water dome far
ahead swells and breaks: the titan rises straight up out of the flat, horns first, then shoulders, huge sheets of
water pouring off its armour. At 4 seconds a wall of spray rolls across the flat toward the camera; the knight turns
his shoulder and raises his forearm as it hits him, cape snapping back. The titan keeps rising behind the spray,
slow and enormous. Sound: rain, a deep rising rumble, roaring water, the spray wall hissing past; no music.
No on-screen text.
```

## G2 · 8 s  (reel shot 2: sword drawn from a sheath → spear dragged up and ignited)
```text
Low-angle close shot, 50 mm, slow slide left to right along the titan's arm. For the first 3 seconds the clawed
gauntlet drags the spear up out of the water, mud and water streaming off the shaft. Then the spearhead ignites from
its base to its tip with a pale ice-blue glow, the only colour in the frame, lighting the falling rain around it.
It ends held across the frame, fully lit and humming. Sound: heavy water, a low metallic grind, then a rising
electric hum; no music. No on-screen text.
```

## G3 · 8 s  (reel shot 3: sweeping slash → downward thrust that stops in front of him)
```text
Over-the-shoulder wide shot, 28 mm, locked. In one slow, heavy second the titan drives the glowing spear down toward
the knight; the spearhead plunges into the water a metre in front of him and blasts up a column of steam and spray.
Blue light floods over his silver armour. He does not move. The steam slowly rolls past him for the rest of the shot
while the spear hisses in the water. Sound: rushing air, a huge deep impact, steam hiss, then rain; no music.
No on-screen text.
```

## G4 · 8 s  (reel shot 4: calm face lit by the blade → visor comes down)
```text
Close-up, 85 mm, locked, very slow push-in. The knight's face is half lit by the flickering blue glow beside him,
rain running down his scar. For 3 seconds he only breathes, eyes steady on the titan. Then he lifts the helm, puts it
on and lowers the visor with one firm hand. The shot ends on the closed steel visor reflecting the blue glow.
Sound: rain, the electric hum, a final metallic clack of the visor; no music. No on-screen text.
```

Text-only fallback (no start frames): put the STYLE LOCK and the CAST LOCK in front of each G prompt.

## EDIT LIST (~16 s)
| # | Clip | In-out (s) | Role | Transition / beat |
|---|---|---|---|---|
| 1 | G1 | 1.5-5.7 | hook: the titan rises, the spray hits | open, hit on the spray |
| 2 | G2 | 2.5-7.0 | the spear ignites | hard cut on a low drum |
| 3 | G3 | 1.0-5.3 | the thrust and impact | hard cut right after the impact |
| 4 | G4 | 3.0-6.0, then hold 0.5 s | the visor comes down | cut to black |

One black-and-white grade across all clips, ice-blue glow the only colour, no text overlays.
**Music:** dark orchestral trailer pulse, ~78 BPM, low brass, drum hits on the rise, the ignition and the impact.
The owner picks the track.
