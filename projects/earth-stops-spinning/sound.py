"""What If ep. 2 — sound (constants mirror src/videos/spin/story.ts)."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, os.path.join(ROOT, "audio"))
from toon_audio import Mix  # noqa: E402

M = Mix(HERE, os.path.join(ROOT, "src/videos/spin/timeline.json"), bpm=116, key="F")
l = M.line
F = lambda f: f / 30.0
STOP, EAST, HOUSE, OCEAN, BRAKE = l("L01", 5.2), l("L02", 2.6), l("L02", 4.3), l("L02", 5.3), l("L03", 3.4)

# beds
M.bed(0, STOP, "wind", 0.35, level=0.6)                    # rushing spin
M.bed(F(216), F(410), "wind", 0.3)
M.bed(F(890), F(1015), "wind", 0.25)
M.bed(F(1572), F(1712), "rumble", 0.35)                    # volcanoes
M.bed(F(1712), M.dur, "wind", 0.2)
# actions
M.fx(0.05, "whoosh", 0.5, d=1.0)
for k in range(5): M.fx(0.6 + k * 0.95, "whoosh", 0.25, d=0.5, hi=3000)   # the planet whipping round
M.fx(F(70) - 0.3, "whoosh", 0.5, d=1.0)
M.fx(STOP - 0.15, "slide_whistle", 0.6, f0=1400, f1=300, d=0.3)
M.fx(STOP, "impact", 1.0)                                  # screech-stop
M.fx(STOP + 0.02, "thump", 0.8, f=45)
M.fx(STOP + 0.05, "pop", 0.5)
M.fx(F(216) - 0.2, "whoosh", 0.5)
M.fx(l("L02", 1.0), "step", 0.4)
M.fx(EAST - 0.05, "whip", 0.7)
M.fx(EAST, "whoosh", 0.9, d=1.2, hi=3500)                  # everyone flies east
M.fx(EAST + 0.1, "whoa", 0.7)
M.fx(EAST + 0.3, "ooh", 0.5, kind="oof")
M.fx(F(296) - 0.05, "whoosh", 0.4, d=0.4)
M.fx(F(345) - 0.05, "whoosh", 0.4, d=0.4)
M.fx(HOUSE, "crack", 0.8)                                  # the house rips off
M.fx(HOUSE + 0.1, "whoosh", 0.7, d=1.4, hi=900)
M.fx(F(385) - 0.05, "whoosh", 0.4, d=0.4)
M.fx(OCEAN, "splash", 1.0)                                 # the ocean
M.fx(OCEAN + 0.05, "impact", 0.6)
M.fx(F(410) - 0.2, "whoosh", 0.5)
M.fx(l("L03", 0.3), "sparkle", 0.4)
M.fx(BRAKE - 0.5, "whoosh", 0.5, d=0.6)
M.fx(BRAKE, "sizzle", 0.6, d=2.5)                          # brake pad sparks
M.fx(BRAKE + 0.1, "slide_whistle", 0.4, f0=1200, f1=700, d=2.5)
M.fx(F(584) - 0.2, "whoosh", 0.4)
M.fx(F(668) - 0.05, "whoosh", 0.3, d=0.4)
M.fx(l("L04", 3.0), "boing", 0.6, f0=200, f1=420)          # tape snaps round the fat middle
M.fx(l("L05", 1.2), "slide_whistle", 0.5, f0=600, f1=300, d=1.0)   # bulge sinks
M.fx(l("L05", 1.6), "bubbles", 0.5, d=2.8)                 # oceans pour toward the poles
M.fx(l("L05", 1.8), "whoosh", 0.5, d=2.5, hi=900)
M.fx(F(890) - 0.2, "whoosh", 0.5)
M.fx(F(890) + 0.4, "bubbles", 0.4, d=1.5, rate=6)
M.fx(l("L06", 2.0), "ding", 0.4, m=79)                     # church bell under water
M.fx(F(1015) - 0.2, "whoosh", 0.5)
for k in range(8): M.fx(F(1090) + 0.36 + k * 0.36, "step", 0.25)   # strolling the equator
M.fx(F(1160) - 0.2, "whoosh", 0.4)
for k in range(6): M.fx(l("L08", 2.2) + k * 0.34, "tick", 0.4)  # calendar pages
M.fx(l("L08", 3.2), "sizzle", 0.3, d=1.2)
M.fx(F(1262) - 0.2, "whoosh", 0.4)
for k in range(6): M.fx(l("L08", 4.7) + k * 0.2, "tick", 0.35)
M.fx(l("L09", 0.5), "beep", 0.6, f=1500, d=0.12)
for k in range(10): M.fx(l("L09", 0.5) + k * 0.12, "beep", 0.45, f=1500 + 200 * (k % 2), d=0.08)   # alarm
M.fx(l("L09", 0.9), "pop", 0.5)
M.fx(F(1436) - 0.2, "whoosh", 0.5)
M.fx(l("L10", 3.0), "squeak", 0.8)                         # tidal "brake"
M.fx(l("L10", 3.05), "impact", 0.5)
M.fx(F(1572) - 0.2, "whoosh", 0.6)
for k in range(10): M.fx(l("L11", 0.3) + k * 0.25, "tick", 0.3)
M.fx(l("L11", 2.6), "boing", 0.5)
M.fx(F(1712) - 0.2, "whoosh", 0.4)
M.fx(l("L12", 1.4), "sparkle", 0.4)
# score
M.section(0, STOP, "bounce", "major", 1.0)
M.section(STOP, STOP + 0.1, "sting", "minor")
M.section(F(216), F(410), "sneak", "minor", 0.8)
M.section(F(410), F(584), "bounce", "major", 0.8)
M.section(F(584), F(890), "wonder", "wonder", 0.8)
M.section(F(890), F(1015), "sneak", "minor", 0.7)
M.section(F(1015), F(1160), "wonder", "wonder", 0.9)
M.section(F(1160), F(1262), "bounce", "major", 0.7)
M.section(F(1262), F(1436), "wonder", "minor", 0.6, transpose=-3)
M.section(F(1436), F(1712), "tension", "minor", 0.7)
M.section(F(1712), M.dur, "march", "major", 0.9)
M.section(l("L12", 1.6), l("L12", 1.7), "sting", "major")
M.render()
