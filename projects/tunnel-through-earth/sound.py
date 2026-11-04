"""What If ep. 1 — sound: every visible action gets a sound, an original score by section, voice on top.
Times come from src/videos/tunnel/timeline.json (= story.ts); constants mirror story.ts (DRILL_HOT, TJ, TA, AIR0/1, PLANE).
run: python3 projects/tunnel-through-earth/sound.py  ->  projects/tunnel-through-earth/audio/mix.wav"""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, os.path.join(ROOT, "audio"))
from toon_audio import Mix  # noqa: E402

M = Mix(HERE, os.path.join(ROOT, "src/videos/tunnel/timeline.json"), bpm=112, key="D")
l, e = M.line, M.end
F = lambda f: f / 30.0
DRILL_HOT, TJ, TA, HANG = l("L02", 4.3), 17.75, l("L10", 2.75), 0.62
AIR0, AIR1, PLANE0 = l("L12", -0.5), l("L12", 6.2), l("L13", -0.4)
SWING0 = l("L11", 2.4)

# ---- ambience beds ----
M.bed(0, F(512), "wind", 0.5)
M.bed(F(1245), F(1450), "wind", 0.5)
M.bed(F(1838), M.dur, "wind", 0.35)
M.bed(F(178), F(388), "engine", 0.35, f=48)                 # the drill rig
M.bed(F(388), F(512), "engine", 0.45, f=62)                 # the vacuum pump
M.bed(F(556), F(1157), "rumble", 0.8)                       # the shaft roar
M.bed(F(809), F(1062), "bubbles", 0.5, rate=18)             # liquid iron
M.bed(F(1571), F(1838), "wind", 0.25, level=0.5)            # the air run: soft hiss
M.bed(F(1838), M.dur, "engine", 0.5, f=74)                  # the plane

# ---- one sound per action ----
M.fx(0.05, "rumble", 0.5, d=1.6)                            # a growl from the hole on frame 0
M.fx(F(52) - 0.2, "whoosh", 0.6, d=0.7)                     # crane up over the hole
M.fx(F(112) - 0.05, "whoosh", 0.4, d=0.4)                   # cut to the bear
M.fx(l("L01", 3.7) - 0.05, "boing", 0.8)                    # bear's double take
M.fx(l("L01", 3.7), "pop", 0.6)                             # "!" pops
M.fx(F(178) - 0.2, "whoosh", 0.6)                           # to the drill site
M.fx(F(262) - 0.1, "whoosh", 0.4, d=0.4)
M.fx(DRILL_HOT - 1.5, "slide_whistle", 0.5, f0=400, f1=1500, d=1.45)  # thermometer climbing
M.fx(DRILL_HOT, "impact", 0.9)                              # thermometer bursts
M.fx(DRILL_HOT + 0.02, "crack", 0.5)
M.fx(DRILL_HOT + 0.1, "whoa", 0.6)                          # the workers
M.fx(DRILL_HOT + 0.2, "sizzle", 0.6, d=2.4)                 # red-hot pipe
M.fx(F(330) - 0.08, "whoosh", 0.4, d=0.4)
M.fx(F(388) - 0.2, "whoosh", 0.6)                           # back to the pole
M.fx(F(388) + 0.2, "whoosh", 0.5, d=3.4, hi=900)            # air sucked down the hole
M.fx(F(452) - 0.3, "whoosh", 0.35)
M.fx(l("L03", 2.6), "pop", 0.4)                             # Pip waves
M.fx(TJ - 0.25, "step", 0.8)                                # crouch
M.fx(TJ - 0.05, "slide_whistle", 0.6, f0=700, f1=1300, d=0.35)  # the leap
M.fx(TJ + 0.3, "slide_whistle", 0.6, f0=1300, f1=250, d=0.9)    # ...and down
M.fx(TJ + 0.2, "whoosh", 0.8, d=1.0)
M.fx(F(546), "impact", 0.5)                                 # into the dark (flash)
M.fx(F(556), "whoosh", 0.7, d=0.8)                          # in the shaft
M.fx(F(598) - 0.3, "whoosh", 0.4)
M.fx(20.2, "ding", 0.6, m=91)                               # the Kola drill bit flies past
M.fx(20.15, "whoosh", 0.6, d=0.35, hi=3500)
M.fx(F(651) - 0.2, "whoosh", 0.5)
M.fx(F(712) - 0.05, "whoosh", 0.5, d=0.4)
M.fx(F(765), "thump", 0.8, f=50)                            # heavier!
M.fx(F(765) + 0.05, "boing", 0.5, f0=260, f1=120)
M.fx(l("L07", 0.6), "impact", 0.9)                          # into the liquid iron
M.fx(l("L07", 0.65), "splash", 0.7)
M.fx(F(880) - 0.05, "whoosh", 0.4, d=0.4)
for k in range(4): M.fx(l("L07", 2.0) + 0.38 * k, "pop", 0.25)  # sweat drops
M.fx(F(930) - 0.2, "whoosh", 0.4)
M.fx(l("L08", 0.3), "impact", 0.8)                          # max speed
M.fx(l("L08", 0.2), "whoosh", 0.9, d=1.2, hi=4000)
M.fx(F(1062) - 0.05, "whoosh", 0.3, d=0.5)
M.fx(l("L08", 3.2), "sparkle", 0.7)                         # weightless
M.fx(l("L08", 3.9), "ding", 0.5, m=96)
M.fx(F(1157) - 0.1, "slide_whistle", 0.5, f0=900, f1=500, d=0.6)  # flip: gravity pulls back
M.fx(F(1157) + 0.1, "boing", 0.4, f0=300, f1=180)
M.fx(F(1205) - 0.3, "whoosh", 0.3)
M.fx(F(1245) - 0.2, "whoosh", 0.6)                          # South Pole
M.fx(F(1300) - 0.05, "whoosh", 0.4, d=0.4)
M.fx(TA - 1.1, "slide_whistle", 0.6, f0=300, f1=1100, d=1.05)    # rising to the rim
M.fx(TA, "pop", 0.8)                                        # the head pops up...
M.fx(TA + 0.05, "ding", 0.5, m=86)
M.fx(TA + 0.1, "whoa", 0.6)                                 # the scientist
M.fx(TA + HANG, "slide_whistle", 0.7, f0=1100, f1=200, d=1.1)    # ...and drops
M.fx(TA + HANG + 0.1, "whoosh", 0.6, d=1.0)
M.fx(F(1362) - 0.05, "whoosh", 0.4, d=0.4)
M.fx(F(1450) - 0.2, "whoosh", 0.5)                          # the swing
for k in range(5):
    tk = SWING0 + 1.1 * k - 2.2
    if F(1450) < tk < F(1571): M.fx(tk, "squeak", 0.5, fwd=k % 2 == 0)
    if F(1450) < tk + 0.55 < F(1571): M.fx(tk + 0.3, "whoosh", 0.25, d=0.5)
M.fx(F(1571) - 0.2, "whoosh", 0.5)                          # back in the shaft, with air
t = AIR0
while t < AIR1:
    M.fx(t, "tick", 0.25); t += 0.25                        # the clock spinning
M.fx(F(1650) - 0.3, "whoosh", 0.3)
M.fx(F(1735) - 0.05, "whoosh", 0.3, d=0.4)
M.fx(AIR1, "thump", 0.5, f=70)                              # settles at the centre
M.fx(AIR1 + 0.1, "ding", 0.5, m=81)
M.fx(F(1790) - 0.3, "whoosh", 0.5, d=1.4, hi=1200)          # crane up: "forever"
M.fx(F(1838) - 0.2, "whoosh", 0.5)
M.fx(PLANE0 + 1.0, "whoosh", 0.7, d=1.6, hi=1500)           # take-off
M.fx(l("L13", 1.3), "lick", 0.7)                            # snacks
M.fx(l("L13", 1.32), "sparkle", 0.5)

# ---- score ----
M.section(0, F(178), "sneak", "minor", 0.8)
M.section(F(178), F(388), "bounce", "major", 0.9)
M.section(DRILL_HOT, DRILL_HOT + 0.1, "sting", "minor")
M.section(F(388), F(512), "march", "major", 0.9)
M.section(TJ, TJ + 0.1, "sting", "major")
M.section(F(556), F(809), "bounce", "major", 1.0, transpose=2)
M.section(F(809), F(981), "tension", "minor", 1.0)
M.section(F(981), F(1062), "tension", "minor", 1.2, transpose=2)
M.section(F(1062), F(1157), "wonder", "wonder", 0.7)
M.section(F(1157), F(1245), "bounce", "major", 0.8)
M.section(F(1245), F(1450), "sneak", "minor", 0.8)
M.section(TA, TA + 0.1, "sting", "minor")
M.section(F(1450), F(1571), "wonder", "wonder", 0.8)
M.section(F(1571), F(1838), "wonder", "wonder", 0.6, transpose=-2)
M.section(F(1838), M.dur, "march", "major", 1.0)
M.section(l("L13", 1.3), l("L13", 1.4), "sting", "major")
M.render()
