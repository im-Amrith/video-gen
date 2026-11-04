# Treatment: What If You Jumped Into a Hole Through the Earth?

Style: **Isometric Infographic** (Lemo-Opuscar `iso-infographic`), vertical 1080x1920, 30 fps, Canvas 2D only (renders in the cloud).
Voice: Kokoro `am_michael`, speed 1.1. Captions burned in as map-label cards. Length ~66 s.

## 1. Three structures
1. **The fall as one vertical dive** (chosen). The vertical frame *is* the tunnel: the camera rides one person down a column of strata,
   gauges counting time, speed, gravity and heat. Bookended by a scale reveal (our real 12 km hole is a hair on the planet) and a twist ending
   where the person ends up parked at the centre.
2. **Two boards compared**: the Kola borehole board vs the dream-tunnel board, alternating. Strong for scale, weak for the fall's thrill.
3. **A countdown clock**: a 38:11 timer as the spine, cutting to stations. Clear, but the clock would upstage the physics.
Why 1: the topic is a vertical journey through layers; 9:16 and the style's "tilt through strata" native move fit it exactly.

## 2. Logline and arc
A person jumps into a pole-to-pole vacuum tunnel and falls through the whole planet in 38 minutes, then learns that with air in the tunnel they'd end up stuck at the centre.
Setup (hole, Kola scale) → turn (the fall, gravity rising, liquid iron, 6,000 °C, weightless at the centre) → ending (stop at the far side; the air twist; "take the plane").

## 3. Benchmark
- Learn: *Powers of Ten* (one continuous log zoom from human to planet); Kurzgesagt (one metaphor per step, scale changes when a number is too big);
  Isotype (numbers as icons). Don't take: any of their shots, characters, palettes, icons or music.

## 4. Shot list
| # | Framing | Move | Dur | Why |
|---|---|---|---|---|
| 1 | Close: person at the hole lip on a polar ice board | slow push in | 6.3 s | hook: the subject and the hole, readable at once |
| 2 | Close → extreme wide | fast log pull-out (signature, ~4 orders of magnitude) | 7.2 s | the 12 km Kola line shrinks to a hair: scale reveal |
| 3 | Wide → medium on the column top | push back in; cut line draws, front skin slides away (cutaway) | 5.0 s | the tunnel opens in the medium's own grammar |
| 4 | Medium, tracked subject | follow cam down (tilt through strata) | 9 s | the journey; gauges rise |
| 5 | Medium in the outer core | follow, slower; core liquid shimmer; sun icon inset | 9 s | heat number made physical |
| 6 | Close on the centre, "you are here" ring | locked frame, near-silence | 6 s | the peak: weightless |
| 7 | Medium → wide | follow up, deceleration, arrive at the far side | 9 s | slowing down is felt |
| 8 | Wide: whole column with a ping-pong path line; inset chart | lateral hold while a damped wave draws | 9 s | the twist as a drawn line |
| 9 | Wide end frame: legend, plane icon over the top | slow pull-out | 4 s | echo the opening: the surface, the easy way |

## 5. Beat sheet
Built from the voice durations; the exact second-by-second sheet is `timeline.js` (exported to `timeline.json`).

## 6. Cue map
Music: 100 BPM (0.6 s beat), marimba + kalimba + woodblock + synth bass, synthesized in numpy (no sample download).
- 0-13 s: kalimba motif (the subject's motif) over a soft pulse.
- 13-18 s: drop-out for "Jump!", one woodblock tick, then the bass enters on the fall.
- 18-36 s: driving eighths, a low-pass that slowly closes as we go deeper.
- 36-40 s: near-silence at the centre (a single glock note on "nothing at all").
- 40-58 s: music returns reversed in feel (rising arpeggio), then thins on the twist.
- 58-end: kalimba motif once more, resolved.
Key hits: "Jump!" = woodblock + whoosh; each layer boundary = a soft thump; far-side stop = ding; end title = motif resolution.

## 7. Sound design
| Section | Ambience | Foley | Music |
|---|---|---|---|
| Surface | polar wind (low, filtered) | ice crunch on step | kalimba motif |
| Fall: mantle | low rumble rising | layer thumps, rushing whoosh | pulse + bass |
| Outer core | deep liquid drone | bubbling | low-passed |
| Centre | almost nothing | one glock ping | silent |
| Return / far side | rumble falling | ding on stop, slip whoosh | rising arpeggio |
| Air twist | soft air hiss | wind whooshes, getting shorter | thin |
| End | polar wind | plane whoosh | motif resolves |

## 8. Subtitles and titles
Map-label caption cards: pale card, ink border, tiny iso cube chip, Jost-like geometric sans (we use the library's Fredoka), ~44 px, centred
in the lower zone (kept clear of the subject). Gauges: label pins with big numbers (time mm:ss, km/h, g, °C). Title: isometric caps on the end board.
Sources line on the end card: "Klotz 2015, Am. J. Phys." 
