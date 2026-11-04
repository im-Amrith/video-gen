"""History ep. 3 — sound (constants mirror src/videos/emu/story.ts)."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, os.path.join(ROOT, "audio"))
from toon_audio import Mix  # noqa: E402

M = Mix(HERE, os.path.join(ROOT, "src/videos/emu/timeline.json"), bpm=112, key="D")
l = M.line
F = lambda f: f / 30.0
JAM, FIRE4 = l("L04", 3.9), l("L04", 2.8)
M.bed(0, M.dur, "wind", 0.25, level=0.7)                         # hot dry wind
for k in range(40): M.fx(l("L01", 1.5) + k * 0.08, "pop", 0.18)   # heads pop up
M.fx(l("L01", 5.6), "boing", 0.6)
M.fx(l("L01", 5.6), "sting" if False else "ding", 0.5, m=67)
M.fx(F(110) - 0.3, "whoosh", 0.4)
M.fx(F(168) - 0.05, "whoosh", 0.3, d=0.4)
M.fx(F(240) - 0.2, "whoosh", 0.5)
for k in range(24): M.fx(F(240) + 0.2 + k * 0.28, "step", 0.3)   # stampede
for k in range(6): M.fx(l("L02", 3.6) + k * 0.15, "crack", 0.35)  # fences flattened
M.fx(F(340) - 0.05, "whoosh", 0.3, d=0.4)
M.fx(F(455) - 0.2, "whoosh", 0.4)
M.fx(l("L03", 1.4), "engine", 0.5, d=2.4, f=55)                   # the truck arrives
M.fx(l("L03", 3.6), "thump", 0.5, f=70)
M.fx(F(600) - 0.05, "whoosh", 0.3, d=0.4)
M.fx(F(655) - 0.2, "whoosh", 0.4)
M.fx(l("L04", 1.0), "bubbles", 0.3, d=1.5, rate=5)                 # emus drinking
for k in range(int((JAM - FIRE4) / 0.1)): M.fx(FIRE4 + k * 0.1, "impact", 0.25, d=0.2)   # rat-a-tat
M.fx(JAM, "tick", 0.8); M.fx(JAM + 0.35, "tick", 0.8)              # click... click
M.fx(F(745) - 0.05, "whoosh", 0.3, d=0.4)
M.fx(JAM + 0.4, "whoosh", 0.8, d=1.2, hi=3000)                     # emus scatter
for k in range(10): M.fx(JAM + 0.4 + k * 0.12, "step", 0.3)
M.fx(F(790) - 0.05, "whoosh", 0.3, d=0.4)
M.fx(F(840) - 0.2, "whoosh", 0.5)
M.bed(F(840), F(1075), "engine", 0.5, f=60)                         # the truck chase
for k in range(int((F(1075) - F(840)) / 0.42)): M.fx(F(840) + k * 0.42, "thump", 0.3, f=55)   # bumps
for k in range(14): M.fx(l("L05", 1.0) + k * 0.12, "impact", 0.2, d=0.2)
M.fx(F(960) - 0.05, "whoosh", 0.3, d=0.4)
M.fx(F(1075) - 0.2, "whoosh", 0.4)
for k in range(30): M.fx(l("L06", 0.4) + k * 0.17, "ding", 0.12, m=96 + (k % 3))   # casings tinkle down
M.fx(l("L06", 4.5), "boing", 0.4)
M.fx(F(1305) - 0.05, "whoosh", 0.3, d=0.4)
for k in range(10): M.fx(l("L07", 0.2) + k * 0.12, "tick", 0.35)    # ten bullets
M.fx(l("L07", 1.5), "pop", 0.5)
M.fx(F(1390) - 0.2, "whoosh", 0.4)
M.fx(l("L08", 3.0), "impact", 0.6)                                  # twenty thousand emus
M.fx(l("L08", 3.05), "crowd", 0.5, d=2.0)
M.fx(F(1480) - 0.05, "whoosh", 0.4, d=0.5)
M.fx(F(1585) - 0.2, "whoosh", 0.4)
M.fx(l("L09", 0.2), "engine", 0.5, d=3.0, f=50)                     # army drives away
M.fx(l("L09", 2.0), "ding", 0.5, m=88)                              # bounty coins
M.fx(F(1680) - 0.05, "whoosh", 0.3, d=0.4)
M.fx(l("L09", 3.8), "sparkle", 0.4)
M.section(0, F(240), "march", "major", 0.9)
M.section(F(240), F(455), "bounce", "minor", 0.9)
M.section(F(455), F(655), "march", "major", 0.8)
M.section(F(655), FIRE4, "sneak", "minor", 0.8)
M.section(JAM, JAM + 0.1, "sting", "minor")
M.section(F(840), F(1075), "bounce", "major", 1.0, transpose=2)
M.section(F(1075), F(1390), "sneak", "minor", 0.7)
M.section(F(1390), M.dur, "march", "major", 0.9)
M.render()
