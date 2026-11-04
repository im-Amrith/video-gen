"""History ep. 5 — sound (constants mirror src/videos/bucket/story.ts)."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, os.path.join(ROOT, "audio"))
from toon_audio import Mix  # noqa: E402

M = Mix(HERE, os.path.join(ROOT, "src/videos/bucket/timeline.json"), bpm=96, key="Eb")
l = M.line
F = lambda f: f / 30.0
FLIP, GRAB = l("L03", 0.9), l("L07", 4.4)
M.bed(0, F(245), "wind", 0.12, level=0.3)                      # hushed hall
M.bed(F(245), F(1280), "wind", 0.25, level=0.7)
M.bed(F(1280), F(1615), "wind", 0.12, level=0.3)
M.fx(0.4, "sparkle", 0.4)
for k in range(4): M.fx(1.0 + k * 1.3, "step", 0.25)            # guard shifts
M.fx(F(150) - 0.3, "whoosh", 0.4)
M.fx(l("L01", 6.6), "ding", 0.6, m=72)                          # "...a bucket."
M.fx(l("L01", 6.65), "boing", 0.4, f0=220, f1=160)
M.fx(F(245) - 0.3, "whoosh", 0.5)
M.fx(l("L02", 2.0), "ding", 0.3, m=67); M.fx(l("L02", 3.2), "ding", 0.3, m=70)   # two city bells
M.fx(F(415) - 0.2, "whoosh", 0.4)
M.fx(FLIP, "pop", 0.8)                                           # flag swap
M.fx(FLIP + 0.3, "impact", 0.4)
M.fx(F(556) - 0.2, "whoosh", 0.5)
for k in range(16): M.fx(F(556) + 0.4 + k * 0.3, "step", 0.2)    # armies shuffle
M.fx(F(650) - 0.05, "whoosh", 0.3, d=0.4)
M.fx(F(736) - 0.2, "whoosh", 0.4)
for k in range(8): M.fx(F(736) + 0.3 + k * 0.45, "splash", 0.35)  # fake crossing
M.fx(F(810) - 0.05, "whoosh", 0.3, d=0.4)
M.fx(l("L05", 1.0), "slide_whistle", 0.4, f0=500, f1=900, d=0.5)  # heads turn
M.fx(F(876) - 0.2, "whoosh", 0.5)
for k in range(10): M.fx(F(876) + 0.3 + k * 0.32, "step", 0.25)
M.fx(l("L06", 2.2), "whoa", 0.6)                                 # Bologna runs
for k in range(14): M.fx(l("L06", 2.3) + k * 0.2, "step", 0.3)
M.fx(F(970) - 0.05, "whoosh", 0.3, d=0.4)
M.fx(F(1066) - 0.2, "whoosh", 0.4)
M.fx(F(1170) - 0.05, "whoosh", 0.3, d=0.4)
M.fx(GRAB - 0.3, "squeak", 0.5)                                  # rope creaks
M.fx(GRAB, "sparkle", 0.7)                                       # the trophy
M.fx(GRAB + 0.2, "crowd", 0.4, d=1.8)
for k in range(6): M.fx(GRAB + 0.4 + k * 0.3, "step", 0.3)
M.fx(F(1280) - 0.3, "whoosh", 0.4)
M.fx(l("L08", 4.4), "pop", 0.4); M.fx(l("L08", 4.55), "pop", 0.4)
M.fx(F(1420) - 0.05, "whoosh", 0.3, d=0.4)
M.fx(F(1540) - 0.2, "whoosh", 0.3)
M.fx(F(1615) - 0.1, "whoosh", 0.4, d=0.5)
M.fx(l("L09", 3.4), "slide_whistle", 0.4, f0=700, f1=300, d=0.9)  # Bologna sighs
M.section(0, F(245), "wonder", "wonder", 0.6)
M.section(F(245), F(556), "march", "major", 0.8)
M.section(FLIP, FLIP + 0.1, "sting", "minor")
M.section(F(556), F(876), "tension", "minor", 0.8)
M.section(F(876), F(1280), "bounce", "major", 1.0, transpose=2)
M.section(GRAB, GRAB + 0.1, "sting", "major")
M.section(F(1280), M.dur, "wonder", "wonder", 0.7)
M.render()
