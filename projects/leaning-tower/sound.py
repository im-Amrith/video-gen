"""History ep. 2 — sound (constants mirror src/videos/pisa/story.ts)."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, os.path.join(ROOT, "audio"))
from toon_audio import Mix  # noqa: E402

M = Mix(HERE, os.path.join(ROOT, "src/videos/pisa/timeline.json"), bpm=100, key="F")
l = M.line
F = lambda f: f / 30.0
M.bed(0, M.dur, "wind", 0.2, level=0.5)
M.fx(0.4, "slide_whistle", 0.4, f0=600, f1=900, d=1.0)        # the bubble slides
M.fx(1.4, "ding", 0.7, m=96)                                  # plink
M.fx(1.45, "boing", 0.5)
M.fx(2.2, "slide_whistle", 0.4, f0=600, f1=900, d=1.0)
M.fx(F(96) - 0.3, "whoosh", 0.5)
M.fx(F(175) - 0.2, "whoosh", 0.5)
for k in range(3): M.fx(l("L02", 1.0) + k * 1.33, "thump", 0.6, f=80)   # floors go up
for k in range(10): M.fx(l("L02", 0.5) + k * 0.6, "step", 0.25)
M.fx(F(320) - 0.05, "whoosh", 0.4, d=0.4)
M.fx(F(420) - 0.2, "whoosh", 0.4)
M.fx(l("L03", 0.2), "crack", 0.6)                              # sinking
M.fx(l("L03", 0.5), "slide_whistle", 0.5, f0=500, f1=200, d=1.6)
M.fx(l("L03", 1.0), "whoa", 0.4)
M.fx(F(510) - 0.2, "whoosh", 0.4)
for k in range(12): M.fx(l("L04", 0.0) + k * 0.28, "step", 0.4)   # marching off to war
for k in range(14): M.fx(l("L04", 3.2) + k * 0.25, "tick", 0.3)   # years flying by
M.fx(F(600) - 0.3, "whoosh", 0.6, d=1.2)
M.fx(F(668) - 0.2, "whoosh", 0.4)
M.fx(l("L05", 0.4), "lick", 0.3)                               # the cat purrs-ish
for k in range(5): M.fx(l("L05", 0.6) + k * 0.8, "gulp", 0.2)
M.fx(F(806) - 0.2, "whoosh", 0.5)
for k in range(5): M.fx(l("L06", 0.4) + k * 0.9, "thump", 0.5, f=85)    # new floors
M.fx(F(930) - 0.05, "whoosh", 0.4, d=0.4)
M.fx(l("L06", 4.0), "squeak", 0.5)                             # gull lands...
M.fx(l("L06", 4.6), "slide_whistle", 0.5, f0=900, f1=400, d=1.2)   # ...and slides off
M.fx(F(1008) - 0.2, "whoosh", 0.4)
for k in range(5): M.fx(l("L07", 1.4) + k * 0.45, "ding", 0.55, m=[72, 76, 79, 76, 72][k])   # the bells
M.fx(F(1146) - 0.2, "whoosh", 0.5)
M.fx(l("L08", 2.6), "beep", 0.4, f=900, d=0.3)                 # closed
M.fx(F(1220) - 0.05, "whoosh", 0.3, d=0.4)
M.fx(F(1297) - 0.2, "whoosh", 0.4)
for k in range(12): M.fx(l("L09", 0.6) + k * 0.2, "thump", 0.35, f=60)   # lead blocks
M.fx(l("L09", 3.4), "engine", 0.5, d=3.0, f=90)                # the drill
M.fx(F(1400) - 0.05, "whoosh", 0.3, d=0.4)
M.fx(F(1487) - 0.2, "whoosh", 0.5)
M.fx(l("L10", 1.2), "squeak", 0.6)                             # creak back
M.fx(l("L10", 1.6), "crowd", 0.4, d=2.0)
M.fx(F(1580) - 0.05, "whoosh", 0.3, d=0.4)
M.fx(l("L10", 4.8), "sparkle", 0.5)                            # wink
M.fx(F(1715) - 0.2, "whoosh", 0.5)
M.fx(l("L11", 2.4), "boing", 0.4)
M.section(0, F(175), "sneak", "minor", 0.7)
M.section(F(175), F(510), "march", "major", 0.7)
M.section(F(510), F(668), "march", "minor", 0.9)
M.section(F(668), F(806), "wonder", "wonder", 0.6)
M.section(F(806), F(1146), "bounce", "major", 0.8)
M.section(F(1146), F(1487), "tension", "minor", 0.7)
M.section(F(1487), M.dur, "bounce", "major", 0.9)
M.render()
