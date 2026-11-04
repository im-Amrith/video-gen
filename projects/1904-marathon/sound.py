"""History ep. 4 — sound (constants mirror src/videos/marathon/story.ts)."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, os.path.join(ROOT, "audio"))
from toon_audio import Mix  # noqa: E402

M = Mix(HERE, os.path.join(ROOT, "src/videos/marathon/timeline.json"), bpm=120, key="G")
l = M.line
F = lambda f: f / 30.0
BREAK = l("L03", 3.8)
M.bed(0, M.dur, "wind", 0.2, level=0.6)
M.bed(0, F(235), "engine", 0.55, f=48)                         # the 1904 car putt-putt
M.fx(0.3, "beep", 0.5, f=420, d=0.35)                          # honk
M.fx(F(110) - 0.05, "whoosh", 0.4, d=0.4)
for k in range(10): M.fx(F(110) + 0.2 + k * 0.4, "step", 0.25)
M.fx(F(110) + 1.0, "ooh", 0.4, kind="oof")                      # cough in the dust
M.fx(F(235) - 0.2, "whoosh", 0.5)
M.fx(F(350) - 0.05, "whoosh", 0.3, d=0.4)
M.fx(l("L02", 5.6), "bubbles", 0.4, d=1.2, rate=10)            # the one well
M.fx(l("L02", 5.8), "gulp", 0.5)
M.fx(F(465) - 0.2, "whoosh", 0.4)
M.bed(F(465), BREAK, "engine", 0.55, f=50)
M.fx(BREAK, "impact", 0.8)                                     # breakdown
M.fx(BREAK + 0.05, "boing", 0.6, f0=300, f1=100)
M.fx(BREAK + 0.2, "sizzle", 0.4, d=1.2)
for k in range(8): M.fx(BREAK + 0.7 + k * 0.32, "step", 0.3)
M.fx(F(600) - 0.05, "whoosh", 0.4, d=0.4)
M.fx(l("L03", 6.2), "crowd", 0.6, d=2.4)                       # cheered as the winner
M.fx(F(715) - 0.2, "whoosh", 0.3)
M.fx(l("L04", 0.2), "slide_whistle", 0.5, f0=900, f1=400, d=0.6)
M.fx(l("L04", 1.2), "pop", 0.5)
M.fx(F(795) - 0.2, "whoosh", 0.4)
for k in range(16): M.fx(F(795) + 0.3 + k * 0.4, "step", 0.25)
M.fx(l("L05", 1.2), "pop", 0.4); M.fx(l("L05", 2.4), "gulp", 0.5); M.fx(l("L05", 3.6), "pop", 0.4)
M.fx(F(930) - 0.05, "whoosh", 0.3, d=0.4)
M.fx(l("L05", 4.5), "slide_whistle", 0.5, f0=400, f1=1200, d=1.2)   # woozy
M.fx(l("L05", 5.0), "sparkle", 0.4)
M.fx(F(1050) - 0.2, "whoosh", 0.4)
for k in range(10): M.fx(F(1050) + 0.3 + k * 0.38, "step", 0.25)
M.fx(F(1180) - 0.05, "whoosh", 0.3, d=0.4)
M.fx(l("L06", 5.2), "pop", 0.5)                                # grabs an apple
M.fx(l("L07", 0.2), "crack", 0.4)                              # crunch
M.fx(l("L07", 0.3), "gulp", 0.6)
M.fx(l("L07", 0.9), "ooh", 0.5, kind="oof")                     # cramps
M.fx(l("L07", 1.6), "slide_whistle", 0.4, f0=600, f1=250, d=0.8)   # flops down for a nap
M.fx(F(1375) - 0.2, "whoosh", 0.4)
M.fx(l("L08", 3.0), "crowd", 0.6, d=2.6)
M.fx(F(1490) - 0.05, "whoosh", 0.3, d=0.4)
M.fx(F(1590) - 0.2, "whoosh", 0.4)
M.fx(l("L09", 1.6), "crowd", 0.5, d=1.6)
M.fx(F(1695) - 0.2, "whoosh", 0.4)
M.fx(l("L10", 0.4), "sparkle", 0.6)                            # gold
M.fx(F(1800) - 0.05, "whoosh", 0.4, d=0.4)
for k in range(10): M.fx(F(1800) + 0.2 + k * 0.3, "step", 0.3)
M.fx(l("L10", 5.6), "ding", 0.5, m=84)
M.section(0, F(235), "bounce", "major", 1.0)
M.section(F(235), F(465), "sneak", "minor", 0.7)
M.section(F(465), F(715), "march", "major", 0.9)
M.section(BREAK, BREAK + 0.1, "sting", "minor")
M.section(F(795), F(1050), "tension", "minor", 0.8)
M.section(F(1050), F(1375), "bounce", "major", 0.8)
M.section(F(1375), M.dur, "march", "major", 1.0)
M.render()
