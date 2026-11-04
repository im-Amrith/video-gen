"""History ep. 1 — sound (constants mirror src/videos/zanzibar/story.ts)."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, os.path.join(ROOT, "audio"))
from toon_audio import Mix  # noqa: E402

M = Mix(HERE, os.path.join(ROOT, "src/videos/zanzibar/timeline.json"), bpm=104, key="Bb")
l = M.line
F = lambda f: f / 30.0
FIRE = l("L05", 1.4)
M.bed(0, M.dur, "wind", 0.2, level=0.5)                       # sea breeze
M.bed(0, M.dur, "bubbles", 0.15, rate=3)                      # harbour lapping
for k in range(int(F(188) / 0.5)): M.fx(0.25 + k * 0.5, "tick", 0.35)    # the watch ticking (hook)
M.fx(F(96) - 0.05, "whoosh", 0.4, d=0.4)
M.fx(l("L01", 3.4), "ding", 0.4, m=84)
M.fx(F(188) - 0.2, "whoosh", 0.5)
M.fx(l("L02", 5.6), "pop", 0.4)                                # Khalid waves
M.fx(F(330) - 0.05, "whoosh", 0.3, d=0.4)
M.fx(F(444) - 0.2, "whoosh", 0.5)
M.fx(l("L03", 1.0), "engine", 0.5, d=3.5, f=38)                # ships steaming in
M.fx(l("L03", 3.0), "beep", 0.3, f=500, d=0.5)                 # ship horn-ish
M.fx(F(560) - 0.05, "whoosh", 0.3, d=0.4)
M.fx(l("L03", 4.6), "lick", 0.4)                               # pen scratch on the note
for k in range(6): M.fx(l("L04", 0.2 + k * 0.25), "thump", 0.35, f=90)   # crates stack up
for k in range(int((FIRE - F(752)) / 0.5)): M.fx(F(752) + k * 0.5, "tick", 0.5)   # the last ticks
M.fx(FIRE - 0.05, "ding", 0.7, m=72)                           # nine o'clock
for d in (0, 0.6, 1.1): M.fx(FIRE + d, "impact", 0.9)           # the guns
for d in (0.4, 0.9, 1.4): M.fx(FIRE + d + 0.2, "splash", 0.6)
M.fx(F(856) - 0.2, "whoosh", 0.4)
M.fx(l("L06", 0.2), "sizzle", 0.5, d=4.0)                      # fire
M.fx(l("L06", 2.6), "bubbles", 0.5, d=2.8, rate=18)            # the yacht settles
M.fx(l("L06", 3.5), "slide_whistle", 0.4, f0=700, f1=200, d=1.4)
M.fx(F(1042) - 0.2, "whoosh", 0.4)
for k in range(9): M.fx(l("L07", 0.6) + k * 0.3, "step", 0.3)  # tiptoe
M.fx(l("L07", 2.0), "slide_whistle", 0.3, f0=900, f1=1100, d=0.6)
M.fx(F(1172) - 0.2, "whoosh", 0.4)
M.fx(l("L08", 1.4), "ding", 0.5, m=79)                         # 9:40
M.fx(F(1240) - 0.05, "whoosh", 0.3, d=0.4)
M.fx(l("L08", 3.0), "crowd", 0.35, d=2.0)                      # a cheer for the new sultan
M.fx(F(1475) - 0.3, "whoosh", 0.3)
M.fx(l("L10", 3.2), "whoosh", 0.4, d=0.6, hi=4000)              # the bill slides under the door
M.fx(l("L10", 3.4), "boing", 0.6)
M.fx(F(1580) - 0.05, "whoosh", 0.3, d=0.4)
M.fx(l("L11", 1.6), "thump", 0.5, f=120)                       # watch snaps shut
M.fx(l("L11", 1.65), "ding", 0.4, m=88)
M.section(0, F(444), "march", "major", 0.7)
M.section(F(444), F(752), "sneak", "minor", 0.8)
M.section(F(752), FIRE, "tension", "minor", 1.0)
M.section(FIRE, FIRE + 0.1, "sting", "minor")
M.section(F(856), F(1172), "tension", "minor", 0.8)
M.section(F(1172), F(1350), "march", "major", 0.8)
M.section(F(1475), F(1690), "sneak", "minor", 0.7)
M.section(F(1690), M.dur, "march", "major", 0.8)
M.render()
