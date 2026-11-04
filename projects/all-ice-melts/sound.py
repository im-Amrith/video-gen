"""What If ep. 3 — sound (constants mirror src/videos/ice/story.ts)."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, os.path.join(ROOT, "audio"))
from toon_audio import Mix  # noqa: E402

M = Mix(HERE, os.path.join(ROOT, "src/videos/ice/timeline.json"), bpm=108, key="C")
l = M.line
F = lambda f: f / 30.0
WET = l("L10", 3.9)
# beds
M.bed(0, F(197), "wind", 0.3, level=0.6)
M.bed(F(197), F(508), "wind", 0.35)
M.bed(F(508), F(781), "bubbles", 0.35, rate=8)          # the rising sea
M.bed(F(909), F(1070), "wind", 0.35)
M.bed(F(1245), F(1335), "rumble", 0.6)                  # Greenland falls
M.bed(F(1335), M.dur, "wind", 0.2, level=0.5)
# actions
M.fx(0.1, "splash", 0.35)
for k in range(5): M.fx(0.3 + k / 0.7, "splash", 0.25)   # fish jumping by the roof
M.fx(F(70) - 0.3, "whoosh", 0.6, d=1.2)
M.fx(F(140) - 0.05, "whoosh", 0.4, d=0.4)
M.fx(l("L01", 4.3), "boing", 0.6)
M.fx(l("L01", 4.35), "pop", 0.5)
M.fx(F(197) - 0.2, "whoosh", 0.5)
M.fx(l("L02", 3.5), "squeak", 0.4)                      # penguin flaps
for k in range(6): M.fx(l("L02", 3.6) + k * 0.17, "pop", 0.15)
M.fx(F(320) - 0.3, "whoosh", 0.4)
M.fx(F(402) - 0.05, "whoosh", 0.4, d=0.4)
M.fx(l("L03", 1.6), "ding", 0.5, m=96)                  # one tiny cube
M.fx(l("L03", 2.0), "slide_whistle", 0.4, f0=900, f1=500, d=0.5)
M.fx(F(508) - 0.2, "whoosh", 0.5)
M.fx(l("L04", 1.2), "splash", 0.5)
M.fx(l("L04", 2.4), "splash", 0.8)                      # over the boardwalk
M.fx(l("L04", 2.6), "whoa", 0.5)
M.fx(F(624) - 0.2, "whoosh", 0.5)
for k, d in enumerate([0.1, 1.4, 2.4]): M.fx(l("L05", d), "bubbles", 0.5, d=0.8, rate=20)   # first, fifth, tenth floor
M.fx(l("L05", 0.1), "thump", 0.5); M.fx(l("L05", 1.4), "thump", 0.5)
M.fx(F(712) - 0.05, "whoosh", 0.4, d=0.4)
M.fx(l("L05", 3.9), "gulp", 0.6)                        # fish window shopping
M.fx(F(781) - 0.2, "whoosh", 0.6, d=1.0)
M.fx(F(909) - 0.2, "whoosh", 0.5)
M.fx(l("L07", 2.2), "boing", 0.5, f0=300, f1=150)
M.fx(l("L07", 3.6), "pop", 0.5)
M.fx(F(1000) - 0.3, "whoosh", 0.3)
M.fx(F(1070) - 0.2, "whoosh", 0.5)
M.fx(l("L08", 0.6), "ding", 0.5, m=91)                  # ice cube clinks in the glass
M.fx(l("L08", 2.5), "sizzle", 0.2, d=2.0)
M.fx(l("L08", 4.6), "sparkle", 0.5)
M.fx(F(1245) - 0.2, "whoosh", 0.6)
M.fx(l("L09", 0.6), "impact", 0.8)                      # land ice crashes in
M.fx(l("L09", 0.7), "splash", 0.9)
M.fx(F(1335) - 0.2, "whoosh", 0.5)
M.fx(l("L10", 0.6), "tick", 0.3); M.fx(l("L10", 1.2), "tick", 0.3); M.fx(l("L10", 1.8), "tick", 0.3)
M.fx(F(1440) - 0.05, "whoosh", 0.4, d=0.4)
M.fx(WET - 0.1, "splash", 0.6)                          # toes get wet
M.fx(WET, "boing", 0.7)
M.fx(WET + 0.05, "whoa", 0.6)
M.fx(F(1517) - 0.2, "whoosh", 0.5)
for k in range(8): M.fx(l("L11", -0.4) + k * 0.31, "step", 0.25)
M.fx(l("L11", 2.4), "sparkle", 0.5)
# score
M.section(0, F(197), "sneak", "minor", 0.8)
M.section(F(197), F(508), "bounce", "major", 0.8)
M.section(F(508), F(781), "tension", "minor", 0.9)
M.section(F(781), F(909), "tension", "minor", 1.1, transpose=2)
M.section(F(909), F(1245), "wonder", "wonder", 0.8)
M.section(F(1245), F(1335), "tension", "minor", 1.0)
M.section(F(1335), WET, "wonder", "major", 0.6)
M.section(WET, WET + 0.1, "sting", "minor")
M.section(F(1517), M.dur, "march", "major", 0.9)
M.render()
