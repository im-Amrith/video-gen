"""What If ep. 4 — sound (constants mirror src/videos/sun/story.ts)."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, os.path.join(ROOT, "audio"))
from toon_audio import Mix  # noqa: E402

M = Mix(HERE, os.path.join(ROOT, "src/videos/sun/timeline.json"), bpm=100, key="G")
l = M.line
F = lambda f: f / 30.0
VANISH, OUT, FLY = 1.6, l("L04", 0.3), l("L05", 1.6)
M.bed(0, OUT, "wind", 0.2, level=0.4)                        # a calm sunny day (birds via sparkle-ish air)
M.bed(F(904), F(1182), "wind", 0.5, level=1.2)               # freezing wind
M.bed(F(1182), F(1410), "bubbles", 0.4, rate=6)
M.bed(F(1410), M.dur, "rumble", 0.5)                         # the vents
M.bed(F(1410), M.dur, "bubbles", 0.35, rate=10)
for k in range(5): M.fx(0.4 + k * 0.9, "lick", 0.35)
M.fx(VANISH, "pop", 0.7)                                     # the Sun pops
M.fx(VANISH + 0.02, "whoosh", 0.4, d=0.5)
M.fx(F(62) - 0.05, "whoosh", 0.3, d=0.4)
M.fx(F(118) - 0.3, "whoosh", 0.4)
M.fx(F(170) - 0.2, "whoosh", 0.6)
M.fx(l("L02", 0.0), "impact", 0.6)                           # the Sun shrinks away
M.fx(l("L02", 0.6), "slide_whistle", 0.4, f0=300, f1=900, d=3.5)   # the darkness front travels
for k in range(8): M.fx(F(336) + k * 0.5, "tick", 0.3)        # eight minutes ticking
M.fx(OUT - 0.1, "slide_whistle", 0.6, f0=900, f1=150, d=0.6)
M.fx(OUT, "thump", 0.9, f=40)                                # lights out
M.fx(OUT + 0.4, "splash", 0.3)                               # ice cream drops
M.fx(l("L04", 1.3), "slide_whistle", 0.4, f0=700, f1=300, d=1.0)  # Moon dims
M.fx(F(604) - 0.2, "whoosh", 0.5)
M.fx(FLY, "whoosh", 0.9, d=1.6, hi=3500)                     # Earth flies off
M.fx(FLY + 0.05, "whip", 0.5)
M.fx(F(786) - 0.2, "whoosh", 0.4)
M.fx(F(904) - 0.2, "whoosh", 0.5)
M.fx(l("L06", 2.0), "slide_whistle", 0.5, f0=1000, f1=300, d=3.5)  # thermometer falls
M.fx(l("L06", 4.2), "ooh", 0.5, kind="oof")
M.fx(F(1090) - 0.1, "crack", 0.6)                            # frozen town
M.fx(l("L07", 0.3), "ding", 0.4, m=96)
M.fx(F(1182) - 0.2, "whoosh", 0.5)
M.fx(l("L08", 0.6), "crack", 0.4)                            # ice lid
for k in range(6): M.fx(l("L08", 1.2) + k * 0.8, "step", 0.25)   # Pip walking on the ice
M.fx(F(1410) - 0.2, "whoosh", 0.5)
M.fx(l("L09", 3.0), "sparkle", 0.4)
M.fx(F(1592) - 0.05, "pop", 0.5)                            # shades on
for k in range(10): M.fx(F(1592) + 0.2 + k * 0.3, "boing", 0.15, f0=300 + 40 * (k % 3), f1=500)   # shrimp hopping
M.fx(l("L10", 1.6), "pop", 0.4)
M.section(0, OUT, "bounce", "major", 0.8)
M.section(OUT, OUT + 0.1, "sting", "minor")
M.section(F(604), F(904), "wonder", "minor", 0.7, transpose=-2)
M.section(F(904), F(1182), "tension", "minor", 0.8)
M.section(F(1182), F(1410), "wonder", "wonder", 0.6)
M.section(F(1410), F(1592), "sneak", "minor", 0.7)
M.section(F(1592), M.dur, "bounce", "major", 1.0, transpose=2)
M.render()
