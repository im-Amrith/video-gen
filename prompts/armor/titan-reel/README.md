# Titan reel: shot images (ChatGPT) + motion prompts (Kaggle Wan 2.2)

A ~17 s black-and-white reel in 6 clips: a colossal armoured titan rises out of a flooded plain, ignites a spear and
drives it into the water a metre in front of a knight who never flinches, then closes his visor.
Remix of `gemini-refs/armor/igexport-Dc4sSw1jF-D.mp4` (see `../igexport-Dc4sSw1jF-D_remix_v2.md`).

## How to use
1. Make the images in **one ChatGPT chat**, in order: the two character sheets first, then shots 1-6. For every shot,
   say "use the knight / titan from the sheets above" so they stay the same.
2. Ask for **portrait (1024x1536)**. The notebook crops the image to 9:16 from the centre, cutting about 7% off each
   side: keep everything important away from the left and right edges.
3. Save the images as `shot01.png` ... `shot06.png` into `kaggle_jobs/` next to the `.txt` prompts (already written).
4. Upload the `kaggle_jobs/` folder as a Kaggle Dataset, add it to the notebook (`kaggle/wan22_i2v_batch.ipynb`),
   Run All.
5. Each image **is the first frame** of its clip. If a shot doesn't come out framed as described, regenerate the image
   before you spend GPU time on it.

## Shared text (already inside every prompt below)
- **Look:** photorealistic black-and-white film still, true monochrome, deep blacks, silver highlights, heavy 35 mm
  grain, soft halation, storm light, falling rain, a thin mirror of water on the ground. The only colour allowed is the
  pale ice-blue glow of the titan's spear.
- **The knight:** about 30, short dark wet hair, stubble, a thin scar across his left cheek, worn silver plate armour,
  a frayed grey cape, a plain longsword held low.
- **The titan:** about a hundred metres tall, smooth black obsidian plate armour, ridged clawed gauntlets, a crown of
  long jagged backswept horns, a slow ring of floating white embers above its head.

## Character sheets

**Sheet A: the knight**
```text
Photorealistic black-and-white film still, true monochrome, heavy 35 mm grain. Character reference sheet on a plain
mid-grey background: an original knight of about 30 with short dark wet hair, stubble and a thin scar across his left
cheek, wearing worn silver plate armour, a frayed grey cape and a plain longsword held low. Left: full body, front
view, standing straight. Right: close-up of his face, calm expression. A steel helmet with a raised visor shown on its
own at the bottom. Even soft light. No text.
```

**Sheet B: the titan**
```text
Photorealistic black-and-white film still, true monochrome, heavy 35 mm grain. Character reference of a colossal
armoured giant about a hundred metres tall, standing straight on a flat wet grey plain: smooth black obsidian plate
armour, ridged clawed gauntlets, a crown of long jagged backswept horns, a slow ring of floating white embers above its
head. Full body, front view. A tiny human figure at its feet for scale. Overcast light, light rain. No text.
```

## Shot images

**Shot 1 · the rise** (start: before the titan appears)
```text
Use the knight from the sheet above. Photorealistic black-and-white film still, true monochrome, deep blacks, heavy
35 mm grain, storm light, hard rain. Low over-the-shoulder wide shot, 24 mm lens, portrait frame. The knight is seen
from behind in the lower centre of the frame, waist up, standing ankle-deep on an endless flooded salt flat, grey cape
hanging wet. Far ahead, in the centre of the frame, the water bulges up into a huge smooth dome, with the tips of black
jagged horns just breaking through its top. Black storm sky, rain streaks, the flat water mirroring the sky. No text.
```

**Shot 2 · the spray wall** (start: the spray is coming)
```text
Use the knight from the sheet above. Photorealistic black-and-white film still, true monochrome, heavy 35 mm grain,
storm light. Medium shot from slightly behind and to the side of the knight, 35 mm lens, portrait frame. He stands
ankle-deep in the flooded plain, body turned three-quarters away from camera, looking ahead. Behind him in the distance
a towering wall of white spray and mist is rolling across the water toward him, filling the upper half of the frame,
the dark silhouette of a gigantic horned figure barely visible inside it. Rain in the air. No text.
```

**Shot 3 · the spear** (start: spearhead still dark)
```text
Use the titan from the sheet above. Photorealistic black-and-white film still, true monochrome, heavy 35 mm grain,
hard rain. Low-angle close shot, 50 mm lens, portrait frame. The titan's huge black clawed gauntlet grips the ridged
shaft of a colossal spear rising diagonally out of the flooded ground, mud and water sheeting off the metal. The long
spearhead is still dark and wet, just leaving the water at the bottom of the frame. The titan's armoured knee looms
out of focus behind. Raindrops hitting the water surface. No text.
```

**Shot 4 · the thrust** (start: spear raised high)
```text
Use the knight and the titan from the sheets above. Photorealistic black-and-white film still, true monochrome, heavy
35 mm grain, storm light, rain. The only colour: a pale ice-blue glow. Over-the-shoulder wide shot, 28 mm lens,
portrait frame. The knight seen from behind in the lower centre, standing in the flooded plain, longsword low. The
colossal titan towers over him in the distance, filling the upper frame, ring of white embers circling its horns,
holding a giant spear high above its head with both hands; the long spearhead glows ice-blue and lights the rain
around it. No text.
```

**Shot 5 · the face**
```text
Use the knight from the sheet above. Photorealistic black-and-white film still, true monochrome, heavy 35 mm grain.
The only colour: pale ice-blue light. Close-up, 85 mm lens, portrait frame. The knight's wet face fills the centre of
the frame, no helmet, half lit cold ice-blue from the right side and half in shadow, rain running over the scar on his
left cheek, eyes calm and looking up and slightly to the right. Water droplets on his stubble. Dark blurred rain
behind. No text.
```

**Shot 6 · the visor** (start: visor still up)
```text
Use the knight from the sheet above. Photorealistic black-and-white film still, true monochrome, heavy 35 mm grain.
The only colour: pale ice-blue reflections. Close-up, 85 mm lens, portrait frame. The knight now wears his steel
helmet with the visor raised, his calm eyes visible inside; his armoured right hand rests on the edge of the visor,
about to push it down. Rain beads on the polished steel, a flickering ice-blue glow reflected on the helmet's side.
Dark rainy background. No text.
```

## Fix after the first render (2026-11-10): helmet continuity, shots 5 → 6
Shot 5 had no helmet and the helmet popped on in shot 6. New shot 5: **edit the shot 6 image in ChatGPT** so the
helmet is identical (upload `shot6.png`, then):
```text
Edit this image. Keep the same knight, the same steel helmet with its visor raised, the same rain, grain and
black-and-white look. Remove his raised hand: both arms down, out of frame. He looks up and slightly to the right with
calm eyes. His face inside the open helmet is half lit pale ice-blue from the right side, the other half in shadow.
Same framing and lens. No text.
```
Save it as `shot5.png` and re-render only shot 5 (delete `outputs/shot5*.mp4` first). The motion prompt `shot05.txt`
still fits. Shot 6 itself worked: the visor closes cleanly.

Other notes from the renders: shot 2 is usable for its first ~2.5 s (later he turns toward the camera and dissolves
into the spray); in shot 4 the blue light floods the whole titan, so cut it at the thrust (~0-3 s).

## Motion prompts (Kaggle)
Already saved as `kaggle_jobs/shot01.txt` ... `shot06.txt`. Each is 5 s (81 frames) at the notebook default.

## Edit list (~17 s)
| # | Clip | In-out (s) | Beat |
|---|---|---|---|
| 1 | shot01 | 0.5-4.5 | hook: the titan rises out of the water |
| 2 | shot02 | 1.0-3.5 | the spray wall hits the knight |
| 3 | shot03 | 1.0-4.8 | the spear comes up and ignites (cut on the ignition hit) |
| 4 | shot04 | 0.3-3.8 | the thrust and impact (cut right after the impact) |
| 5 | shot05 | 1.0-3.5 | his face in blue light |
| 6 | shot06 | 0.5-3.0, hold last frame 0.5 s | visor shuts, cut to black |

One black-and-white grade, the ice-blue glow is the only colour, no text. Music: dark orchestral trailer pulse ~78 BPM,
drum hits on the rise, the ignition and the impact. Wan clips are 16 fps: in CapCut, use "smooth slow-mo"/frame
interpolation or export at 24 fps with optical flow so the motion doesn't stutter.

## If a clip fails
- Shot 6 (hand on the visor) is the riskiest: hands warp on a 4-step model. Fallback: end on shot 5 held 1 s.
- Colour creeping in: keep "black-and-white" at the start of the motion prompt (already there) and desaturate in the
  edit, then mask the blue glow back if needed, or accept a fully grey glow.
- Titan looks small or toy-like in shot 1: regenerate the image with the dome bigger and further away.
