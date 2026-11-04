"""What If ep. 5 — sound (constants mirror src/videos/moon/story.ts)."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, os.path.join(ROOT, "audio"))
from toon_audio import Mix  # noqa: E402

M = Mix(HERE, os.path.join(ROOT, "src/videos/moon/timeline.json"), bpm=96, key="Eb")
l = M.line
F = lambda f: f / 30.0
POP1, POP3, CAL, BONK, BACK = l("L01", 1.3), l("L03", 0.4), l("L05", 4.0), l("L08", 2.9), l("L09", 0.2)
M.bed(0, F(162), "wind", 0.3, level=0.5)
M.bed(0, POP1 + 2.5, "bubbles", 0.3, rate=5)            # waves on the beach
M.bed(F(516), F(625), "wind", 0.25)
M.bed(F(625), F(811), "bubbles", 0.4, rate=7)           # the reef
M.bed(F(1219), F(1417), "wind", 0.3)
M.bed(F(1417), M.dur, "wind", 0.25, level=0.5)
M.fx(POP1, "pop", 0.8)                                  # the Moon pops
M.fx(POP1 + 0.02, "impact", 0.5)
M.fx(POP1 + 0.5, "whoosh", 0.6, d=2.0, hi=900)          # the tide slides out
M.fx(F(70) - 0.05, "whoosh", 0.3, d=0.4)
M.fx(F(118) - 0.3, "whoosh", 0.4)
M.fx(F(162) - 0.2, "whoosh", 0.6)
for k in range(4): M.fx(F(162) + 0.6 + k * 1.2, "whoosh", 0.25, d=0.8, hi=700)  # Earth turning under the bulge
M.fx(F(371) - 0.2, "whoosh", 0.4)
M.fx(POP3, "pop", 0.8)
M.fx(POP3 + 0.2, "slide_whistle", 0.5, f0=900, f1=400, d=1.6)   # bulge shrinks
M.fx(F(516) - 0.2, "whoosh", 0.5)
M.fx(l("L04", 1.0), "slide_whistle", 0.4, f0=500, f1=250, d=0.8)  # sad crab
M.fx(l("L04", 1.6), "ooh", 0.3, kind="sigh") if False else M.fx(l("L04", 1.6), "gulp", 0.3)
M.fx(F(570) - 0.05, "whoosh", 0.3, d=0.4)
M.fx(F(625) - 0.2, "whoosh", 0.5)
M.fx(l("L05", 1.2), "sparkle", 0.4)
M.fx(CAL, "pop", 0.4); M.fx(CAL + 0.15, "pop", 0.3); M.fx(CAL + 0.3, "pop", 0.3)
M.fx(F(811) - 0.2, "whoosh", 0.5)
for k in range(5): M.fx(F(811) + 0.8 + k * 1.4, "squeak", 0.2, fwd=k % 2 == 0)   # gentle wobble
M.fx(F(1047) - 0.2, "whoosh", 0.5)
for k in range(6): M.fx(l("L07", 0.6) + k * 0.98, "whoosh", 0.5, d=0.6, hi=2500)   # wild swings
M.fx(F(1130) - 0.05, "whoa", 0.6)
M.fx(F(1219) - 0.2, "whoosh", 0.4)
for k in range(4): M.fx(l("L08", 0.4) + k * 0.6, "tick", 0.3)
M.fx(BONK, "boing", 0.7)
for k in range(8): M.fx(BONK + 0.4 * k, "sizzle" if k % 2 else "whoosh", 0.25, d=0.35)   # summer / winter / summer...
M.fx(F(1417) - 0.2, "whoosh", 0.5)
M.fx(BACK, "sparkle", 0.6)
M.fx(l("L09", 2.4), "sparkle", 0.4)
M.section(0, POP1, "wonder", "wonder", 0.7)
M.section(POP1, POP1 + 0.1, "sting", "minor")
M.section(F(162), F(516), "wonder", "major", 0.8)
M.section(F(516), F(625), "sneak", "minor", 0.7)
M.section(F(625), F(811), "wonder", "wonder", 0.7, transpose=-2)
M.section(F(811), F(1047), "bounce", "major", 0.7)
M.section(F(1047), F(1219), "tension", "minor", 1.0)
M.section(F(1219), BONK, "wonder", "major", 0.6)
M.section(BONK, F(1417), "bounce", "minor", 1.0, transpose=3)
M.section(F(1417), M.dur, "wonder", "wonder", 0.9)
M.render()
