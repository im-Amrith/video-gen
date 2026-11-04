"""Score + ambience + foley + voice → out/mix.wav (48 kHz stereo). Run with the library's .venv python.
Everything is synthesized here (no sample downloads). Reads timeline.json, events.json and voice/*.wav."""
import json, os, sys
import numpy as np, soundfile as sf, soxr
LIB = os.environ.get("LIB", "/root/lemo-opuscar"); sys.path.insert(0, f"{LIB}/core/audio")
from sfx import SR, t_, env_exp, bp, lp, hp, noise, brown, click, clack, whoosh, thump, ding, pop, creak, compress, limit, add

H = os.path.dirname(os.path.abspath(__file__))
TL = json.load(open(f"{H}/timeline.json")); L = TL["L"]; DUR = TL["DUR"]
EV = json.load(open(f"{H}/events.json"))["ev"]
N = int((DUR + .5) * SR)
mus, amb, fx, vo = (np.zeros((N, 2), np.float32) for _ in range(4))
rng = np.random.default_rng(11)
BEAT = 0.6  # 100 BPM
mf = lambda m: 440 * 2 ** ((m - 69) / 12)

# ---------------- instruments ----------------
def kalimba(m, v=1.0, d=1.6):
    f = mf(m); t = t_(d); e = np.exp(-t / .55) * (1 - np.exp(-t / .002))
    x = np.sin(2 * np.pi * f * t) + .28 * np.sin(2 * np.pi * f * 5.4 * t) * np.exp(-t / .06) + .12 * np.sin(2 * np.pi * f * 2.0 * t) * np.exp(-t / .2)
    return (x * e * v * .5).astype(np.float32)
def marimba(m, v=1.0, d=1.0):
    f = mf(m); t = t_(d); e = np.exp(-t / .32) * (1 - np.exp(-t / .002))
    x = np.sin(2 * np.pi * f * t) + .35 * np.sin(2 * np.pi * f * 4 * t) * np.exp(-t / .05) + .1 * np.sin(2 * np.pi * f * 10 * t) * np.exp(-t / .015)
    return (x * e * v * .45).astype(np.float32)
def glock(m, v=1.0, d=3.0):
    f = mf(m); t = t_(d); x = (np.sin(2 * np.pi * f * t) + .4 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t / .3)) * np.exp(-t / 1.1) * (1 - np.exp(-t / .001))
    return (x * v * .4).astype(np.float32)
def bass(m, v=1.0, d=.5):
    f = mf(m); t = t_(d); e = np.exp(-t / .22) * (1 - np.exp(-t / .004))
    x = np.sin(2 * np.pi * f * t) + .45 * np.sin(4 * np.pi * f * t) + .2 * np.sin(6 * np.pi * f * t)
    return (x * e * v * .55).astype(np.float32)
def wood(v=1.0, f=1150):
    t = t_(.08); x = np.sin(2 * np.pi * f * t) * np.exp(-t / .018) + .3 * bp(noise(.08), 1500, 4000) * np.exp(-t / .006)
    return (x * v * .5).astype(np.float32)
def shaker(v=1.0):
    t = t_(.09); return (hp(noise(.09), 5000) * np.exp(-t / .025) * (1 - np.exp(-t / .006)) * v * .25).astype(np.float32)
def padnote(m, d, v=1.0):
    t = t_(d); f = mf(m); e = np.minimum(1, t / .8) * np.minimum(1, (d - t) / .8)
    x = sum(np.sin(2 * np.pi * f * (1 + dt) * t) for dt in (-.003, 0, .004)) / 3
    return (lp(x, 1200) * e * v * .18).astype(np.float32)

# ---------------- score ----------------
PENT = [62, 64, 66, 69, 71]  # D major pentatonic (D E F# A B)
MOTIF = [(0, 74), (1, 78), (1.5, 76), (2, 81), (3, 78), (3.5, 76), (4, 74), (6, 69)]
def motif(t0, v=1.0, up=0):
    for b, m in MOTIF: add(mus, kalimba(m + up, .8 * v), t0 + b * BEAT, .9, -.2 + .1 * (m % 5))
CH = [[50, 57, 62, 66], [47, 54, 59, 62], [43, 50, 55, 59], [45, 52, 57, 61]]   # D  Bm  G  A
def chords(t0, t1, v=1.0, roll=True):
    t = t0; i = 0
    while t < t1 - .1:
        c = CH[i % 4]
        for j, m in enumerate(c[1:]): add(mus, marimba(m, .45 * v), t + (j * .06 if roll else 0), .8, -.3 + .3 * j)
        t += 4 * BEAT; i += 1
def groove(t0, t1, v=1.0, bassv=1.0):
    t = t0; n = 0
    while t < t1 - .05:
        if n % 2 == 0: add(mus, shaker(v), t, .8, .3)
        if n % 8 in (0, 3, 6): add(mus, bass(CH[(n // 16) % 4][0] - 12 + 12, bassv * v), t, .9)
        if n % 8 == 4: add(mus, wood(.5 * v), t, .7, -.3)
        t += BEAT / 2; n += 1
s = lambda i: L[i]["t0"]; e = lambda i: L[i]["t1"]
FS = 17.05
motif(0.15); chords(0.15, 12.4, .8); motif(4.95, .7, 0)
groove(7.3, 12.3, .55, .6)
chords(12.4, 16.3, .5)
add(mus, wood(1.0, 900), 16.85, .9)                        # "Jump!"
groove(FS, s("L09") - .9, 1.0, 1.0); chords(FS, s("L09") - .9, .7)
for k in range(8): add(mus, kalimba(PENT[k % 5] + 12, .4), FS + 2.4 + k * 2.4, .5, .5)
add(mus, glock(86, .9), s("L09") + 4.2)                     # "...you weigh nothing at all"
add(mus, glock(81, .5), s("L09") + 4.8)
# return: rising arpeggio, slowing with the fall
t = s("L10"); i = 0
while t < 47.1:
    add(mus, marimba(PENT[i % 5] + 12 + 12 * (i // 5 % 2), .55), t, .8, -.4 + .16 * (i % 5)); i += 1; t += BEAT / 2 * (1 + .6 * max(0, (t - s("L11")) / 3))
add(mus, glock(78, .8), 47.155)
groove(49.9, 52.6, .9, .8)                                  # ping-pong
for k in range(12): add(mus, marimba(PENT[k % 5] + 24, .5), 49.9 + k * .22, .7, .5 if k % 2 else -.5)
# air: thin and slow
chords(53.0, 63.0, .45, roll=True)
for b in range(0, 16, 2): add(mus, kalimba(PENT[(b // 2) % 5] + 12, .35), 53.2 + b * BEAT, .6, .4)
add(mus, padnote(50, 10.0, 1.0), 53.0); add(mus, padnote(57, 10.0, .8), 53.0)
add(mus, glock(74, .8), 61.84)
# ending
motif(63.75, 1.0); add(mus, marimba(62, .6), 63.75 + 6 * BEAT); add(mus, marimba(66, .5), 63.75 + 6 * BEAT + .05); add(mus, marimba(69, .5), 63.75 + 6 * BEAT + .1)
add(mus, glock(74, .6), 63.75 + 6 * BEAT + .1)

# ---------------- ambience ----------------
def bed(x, t0, t1, gain, pan=0.0, fade=.6):
    n0, n1 = int(t0 * SR), min(N, int(t1 * SR)); x = x[: n1 - n0]; k = int(fade * SR)
    w = np.ones(len(x)); w[:k] = np.linspace(0, 1, min(k, len(x)))[: len(w[:k])]; w[-k:] = np.minimum(w[-k:], np.linspace(1, 0, k)[: len(w[-k:])])
    add(amb, (x * w).astype(np.float32), t0, gain, pan)
wind = lp(bp(noise(20), 150, 900), 600) * (0.6 + .4 * np.sin(2 * np.pi * .13 * t_(20)))
bed(wind, 0, 17.0, .22); bed(wind, 63.6, DUR + .5, .2)
rum = lp(brown(30), 110); spd = np.interp(t_(30), [0, 2, 10, 17.5, 21, 24], [.2, .6, .85, 1, .7, .4])
bed(rum * spd, FS, FS + 30, .55)                          # rumble that follows the speed
drone = lp(noise(9), 90) * 2 + .25 * np.sin(2 * np.pi * 55 * t_(9))
bed(drone, s("L07") + .8, s("L09") - .2, .3)               # liquid core
bub = np.zeros(int(8 * SR), np.float32)
for k in range(40): bub_t = rng.uniform(0, 7.6); f = rng.uniform(180, 420); tt = t_(.07); seg_ = np.sin(2 * np.pi * f * tt * (1 + tt * 6)) * np.exp(-tt / .02); i0 = int(bub_t * SR); bub[i0:i0 + len(tt)] += seg_ * .25
bed(bub, s("L07") + 1, s("L08") + 6, .3)
hiss = lp(hp(noise(11), 300), 1400)
bed(hiss, 52.9, 63.2, .05)

# ---------------- foley from events ----------------
def scratch(d=.9):
    t = t_(d); return (bp(noise(d), 2000, 5000) * (.6 + .4 * np.sin(2 * np.pi * 23 * t)) * np.minimum(1, t / .05) * np.exp(-t / (d * .8)) * .35).astype(np.float32)
for ev in EV:
    t, ty = ev["t"], ev["type"]
    if ty == "pin": add(fx, pop(.6), t, .45, .3)
    elif ty == "drill": add(fx, scratch(1.6) * .8, t, .5, .2); add(fx, creak(.5), t + .4, .25)
    elif ty == "cut": add(fx, scratch(1.05), t, .55)
    elif ty == "slide": add(fx, whoosh(.55, .9), t, .6, .4)
    elif ty == "whoosh": add(fx, whoosh(.5, .7), t, .45)
    elif ty == "crouch": add(fx, click(.6, .7), t, .4)
    elif ty == "jump": add(fx, whoosh(.8, 1.0), t, .7); add(fx, thump(.5, 90), t - .05, .4)
    elif ty == "layer": add(fx, thump(.8, 60), t, .6); add(fx, whoosh(.3, .5), t, .25)
    elif ty == "centre": add(fx, ding(.4), t, .25)
    elif ty == "stop": add(fx, ding(.8), t, .45); add(fx, thump(.6, 80), t, .35)
    elif ty == "grab": add(fx, clack(1.1, .7), t, .45)
    elif ty == "slip": add(fx, whoosh(.7, 1.0), t, .65)
    elif ty == "trip": add(fx, click(1.2 + .1 * ev.get("n", 0), .8), t, .4, .2 if ev.get("n", 0) % 2 else -.2)
    elif ty == "air": add(fx, whoosh(1.2, .6), t, .4)
    elif ty == "pop": add(fx, pop(.9), t, .55)
    elif ty == "stuck": add(fx, thump(.4, 70), t, .3)
    elif ty == "plane": add(fx, lp(whoosh(1.8, 1.0), 2500) * 1.0, t, .55, -.3)
    elif ty == "title": add(fx, click(.9, .6), t, .3)

# ---------------- voice ----------------
duck = np.zeros(N, np.float32)
for i, l in L.items():
    x, sr = sf.read(f"{H}/voice/{i}.wav", dtype="float32")
    if x.ndim > 1: x = x.mean(1)
    x = soxr.resample(x, sr, SR); x = hp(x, 80); x = compress(x / max(1e-6, np.abs(x).max()), thr=.3, ratio=3.0)
    add(vo, x.astype(np.float32), l["t0"], 1.0)
    a, b = int((l["t0"] - .12) * SR), min(N, int((l["t1"] + .15) * SR)); duck[max(0, a):b] = 1
from scipy.ndimage import uniform_filter1d
duck = uniform_filter1d(duck, int(.12 * SR))
rms = lambda x: np.sqrt(np.mean(x[np.abs(x).max(1) > 1e-4] ** 2)) if np.any(np.abs(x) > 1e-4) else 1
vo *= .2 / rms(vo)
mus *= (.2 / rms(mus)) * 10 ** (-10 / 20)                   # music ~10 dB under voice
mus *= (1 - duck * (1 - 10 ** (-7 / 20)))[:, None]           # ...and ducked further under speech
amb *= (1 - duck * (1 - 10 ** (-4 / 20)))[:, None]
fx *= (1 - duck * (1 - 10 ** (-3 / 20)))[:, None]
# low-pass on the music as we go deep (closing on the way down, opening on the way back)
mix = vo + mus + amb + fx
for c in range(2): mix[:, c] = limit(mix[:, c], .95)
os.makedirs(f"{H}/out", exist_ok=True)
sf.write(f"{H}/out/mix.wav", mix, SR, subtype="PCM_24")
for nm, x in (("voice", vo), ("music", mus), ("amb", amb), ("fx", fx)): print(nm, "rms dB", round(20 * np.log10(rms(x) + 1e-9), 1))
print("wrote out/mix.wav", round(len(mix) / SR, 2), "s")
