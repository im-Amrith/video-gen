"""Toon shorts: generic sound kit on top of the bridge DSP (dsp.py, instruments.py, sfx_gen.py).
An episode's projects/<slug>/sound.py builds a Mix: SFX events (one per visible action), score sections (original,
synthesized), then mix.render() writes projects/<slug>/audio/mix.wav (48 kHz stereo 24-bit, exact film length),
stems and cues.md. Standard: music +3 dB (bed ~ -10 LU under the voice, ducked 3 dB more while it speaks),
SFX -6 dB, voice unchanged; master -14 LUFS, true peak <= -1.2 dBTP."""
import os, sys, json
import numpy as np
from scipy import signal
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from dsp import SR, ns, tt, dbg, rng, lp, hp, bp, st, read_wav, write_wav, integrated, true_peak, fades, colored  # noqa: E402
import instruments as I  # noqa: E402
import sfx_gen as G  # noqa: E402

R = rng(7)


def _mono(x):
    x = np.asarray(x, float)
    return x.mean(0) if x.ndim == 2 else x


# ---------------------------------------------------------------- sfx library (mono, peak ~1)
def norm(x, p=1.0):
    x = _mono(x); m = np.abs(x).max()
    return x * (p / m) if m > 0 else x


def s_whoosh(d=0.6, hi=2400):
    return norm(G.whoosh(d, R, peak=d * 0.45, f_lo=300, f_hi=hi))


def s_thump(f=60, d=0.5):
    t = tt(d); x = np.sin(2 * np.pi * f * t * (1 + 0.8 * np.exp(-t / 0.03))) * np.exp(-t / 0.12) + 0.4 * lp(colored(len(t), R, 1.0), 400) * np.exp(-t / 0.04)
    return norm(fades(x))


def s_pop(f=900):
    t = tt(0.12); x = np.sin(2 * np.pi * f * t * (1 + 2 * np.exp(-t / 0.01))) * np.exp(-t / 0.03)
    return norm(fades(x))


def s_ding(m=88, vel=0.8):
    return norm(_mono(I.glock(I.m2f(m), vel=vel, r=R)))


def s_sparkle(base=84):
    out = np.zeros(ns(1.0))
    for k, m in enumerate([base, base + 4, base + 7, base + 12]):
        x = _mono(I.glock(I.m2f(m), vel=0.5, r=R, dur=0.7)); i = ns(0.06 * k); out[i:i + len(x)] += x[: len(out) - i]
    return norm(out)


def s_boing(f0=180, f1=520, d=0.45):
    t = tt(d); f = f0 + (f1 - f0) * (1 - np.exp(-t / 0.08)); ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sin(ph + 0.6 * np.sin(2 * np.pi * 22 * t)) * np.exp(-t / 0.18)
    return norm(fades(x))


def s_slide_whistle(f0=500, f1=1400, d=0.6):
    t = tt(d); f = np.exp(np.log(f0) + (np.log(f1) - np.log(f0)) * (t / d)); ph = 2 * np.pi * np.cumsum(f * (1 + 0.01 * np.sin(2 * np.pi * 6 * t))) / SR
    return norm(fades(np.sin(ph) * np.minimum(1, t / 0.05) * np.minimum(1, (d - t) / 0.08)))


def s_impact(d=0.9):
    t = tt(d); nz = colored(len(t), R, 0.8)
    x = 0.9 * np.sin(2 * np.pi * 48 * t) * np.exp(-t / 0.25) + lp(nz, 1800) * np.exp(-t / 0.08) + 0.3 * hp(nz, 3000) * np.exp(-t / 0.03)
    return norm(fades(x))


def s_sizzle(d=1.2):
    t = tt(d); nz = colored(len(t), R, 0.2)
    x = hp(nz, 3500) * (0.6 + 0.4 * np.abs(np.sin(2 * np.pi * 9 * t))) * np.minimum(1, t / 0.05) * np.exp(-t / (d * 0.6))
    return norm(fades(x))


def s_rumble(d=3.0, f=40):
    t = tt(d); x = lp(colored(len(t), R, 1.6), 120) + 0.4 * np.sin(2 * np.pi * f * t)
    return norm(fades(x * np.minimum(1, t / 0.4) * np.minimum(1, (d - t) / 0.6)))


def s_tick():
    t = tt(0.05); return norm(fades(bp(colored(len(t), R, 0.0), 2500, 6000) * np.exp(-t / 0.006)))


def s_bubbles(d=2.0, rate=14):
    return norm(G.bubbles(d, R, rate))


def s_splash():
    return norm(G.splash_big(R))


def s_wind(d=4.0, level=1.0):
    return norm(G.breeze(d, R, level=level))


def s_hammer():
    return norm(G.hammer_hit(R))


def s_step():
    return norm(G.stroll_step(R))


def s_squeak(fwd=True):
    return norm(G.swing_squeak(R, fwd=fwd))


def s_engine(d=4.0, f=70):
    t = tt(d); saw = signal.sawtooth(2 * np.pi * f * t * (1 + 0.15 * t / d)); x = lp(saw, 900) * (0.7 + 0.3 * np.sin(2 * np.pi * f / 4 * t))
    return norm(fades(x * np.minimum(1, t / 0.5)))


def s_gulp():
    t = tt(0.25); f = 300 - 200 * t / 0.25; ph = 2 * np.pi * np.cumsum(f) / SR
    return norm(fades(np.sin(ph) * np.exp(-((t - 0.08) / 0.06) ** 2)))


def s_beep(f=1200, d=0.14):
    t = tt(d); return norm(fades(np.sign(np.sin(2 * np.pi * f * t)) * 0.5 * np.minimum(1, (d - t) / 0.02)))


def s_crack():
    return norm(G.wood_crack(R))


def s_whip():
    return norm(G.chain_whip(R))


def s_crowd(d=3.0):
    return norm(G.applause(d, R, people=30))


def s_ooh(kind="oof"):
    return norm(G.oof(R, kind=kind))


def s_whoa():
    return norm(G.whoa(R))


def s_lick():
    t = tt(0.2); return norm(fades(bp(colored(len(t), R, 0.3), 800, 3000) * np.sin(np.pi * t / 0.2) ** 2))


SFX = {k[2:]: v for k, v in globals().items() if k.startswith("s_")}

# ---------------------------------------------------------------- score (original, synthesized)
KEYS = {"C": 60, "D": 62, "Eb": 63, "F": 65, "G": 67, "A": 69, "Bb": 70}
PROG = {"major": [[0, 4, 7], [5, 9, 12], [7, 11, 14], [0, 4, 7]], "minor": [[0, 3, 7], [8, 12, 15], [5, 8, 12], [7, 11, 14]],
        "wonder": [[0, 4, 7, 11], [5, 9, 12, 16], [9, 12, 16, 19], [7, 11, 14, 17]]}


class Mix:
    def __init__(self, project, timeline_json, bpm=104, key="D"):
        self.P = project
        self.T = json.load(open(timeline_json))
        self.dur = self.T["total"] / self.T["fps"]
        self.N = ns(self.dur)
        self.music = np.zeros((2, self.N)); self.sfx = np.zeros((2, self.N)); self.amb = np.zeros((2, self.N))
        self.bpm, self.root = bpm, KEYS[key]
        self.beat = 60.0 / bpm
        self.cues = []

    def line(self, i, d=0.0):
        return self.T["lines"][i]["t0"] + d

    def end(self, i, d=0.0):
        return self.T["lines"][i]["t1"] + d

    @staticmethod
    def _put(buf, x, t, gain=1.0, pan=0.0):
        x = _mono(x) * gain; i = ns(t)
        if i >= buf.shape[1]: return
        if i < 0: x = x[-i:]; i = 0
        n = min(len(x), buf.shape[1] - i)
        l, r = np.cos((pan + 1) * np.pi / 4) * 1.414, np.sin((pan + 1) * np.pi / 4) * 1.414
        buf[0, i:i + n] += x[:n] * l; buf[1, i:i + n] += x[:n] * r

    def fx(self, t, name, gain=1.0, pan=0.0, **kw):
        """one SFX event: name = key of SFX (whoosh, thump, pop, ding, sparkle, boing, impact, ...)"""
        self._put(self.sfx, SFX[name](**kw), t, gain, pan)
        self.cues.append((round(t, 3), name, round(gain, 2)))

    def bed(self, t0, t1, name, gain=0.3, **kw):
        x = SFX[name](d=t1 - t0, **kw) if "d" in SFX[name].__code__.co_varnames else SFX[name](**kw)
        self._put(self.amb, x, t0, gain)
        self.cues.append((round(t0, 3), f"bed:{name}->{round(t1, 2)}", round(gain, 2)))

    # ---- score ----
    def _note(self, inst, m, t, d, vel, pan=0.0):
        f = I.m2f(m)
        if inst == "pluck": x = I.pluck(f, vel=vel, r=R, dur=max(0.35, d))
        elif inst == "glock": x = I.glock(f, vel=vel, r=R, dur=max(0.8, d))
        elif inst == "vibes": x = I.vibes(f, vel=vel, r=R, dur=max(1.0, d))
        elif inst == "box": x = I.musicbox(f, vel=vel, r=R, dur=max(0.8, d))
        elif inst == "tuba": x = I.brass(f, d, vel=vel, r=R, kind="tuba")
        elif inst == "horn": x = I.brass(f, d, vel=vel, r=R, kind="horn") if True else None
        else: x = I.pluck(f, vel=vel, r=R)
        self._put(self.music, x, t, 1.0, pan)

    def section(self, t0, t1, style, mode="major", vel=1.0, transpose=0):
        """style: bounce (pizz + tuba + brush), wonder (vibes arps + pad), tension (pad + timpani pulse + ticks),
        march (tuba oompah + snare + glock tune), sneak (staccato low plucks), sting (one chord hit), silence"""
        b = self.beat; root = self.root + transpose; prog = PROG.get(mode, PROG["major"])
        n_bars = max(1, int(round((t1 - t0) / (4 * b))))
        if style == "sting":
            for k, iv in enumerate(prog[0]): self._note("vibes", root + 12 + iv, t0 + 0.01 * k, 1.6, 0.7 * vel)
            self._put(self.music, I.cymbal(vel=0.4 * vel, r=R), t0, 0.5)
            return
        t = t0; bar = 0
        while t < t1 - 0.05:
            ch = prog[bar % len(prog)]
            for beat in range(4):
                tb = t + beat * b
                if tb >= t1: break
                if style == "bounce":
                    if beat in (0, 2): self._note("tuba", root - 24 + ch[0] + (7 if beat == 2 else 0), tb, b * 0.8, 0.55 * vel)
                    else:
                        for k, iv in enumerate(ch[:3]): self._note("pluck", root + iv, tb + 0.005 * k, 0.3, 0.45 * vel, -0.3 + 0.3 * k)
                    self._put(self.music, I.brush(vel=0.25 * vel, r=R), tb + b / 2, 0.6)
                    if beat == 3 and bar % 2: self._note("glock", root + 24 + ch[(bar // 2) % 3], tb, 0.6, 0.35 * vel, 0.4)
                elif style == "wonder":
                    for k in range(2):
                        m = root + 12 + ch[(beat * 2 + k) % len(ch)]
                        self._note("vibes" if k == 0 else "box", m, tb + k * b / 2, b, 0.4 * vel, -0.4 + 0.8 * ((beat + k) % 2))
                    if beat == 0: self._put(self.music, I.pad([I.m2f(root - 12 + iv) for iv in ch[:3]], 4 * b, vel=0.35 * vel, r=R), tb, 0.8)
                elif style == "tension":
                    if beat == 0: self._put(self.music, I.pad([I.m2f(root - 12 + iv) for iv in ch[:3]], 4 * b, vel=0.4 * vel, r=R, warm=600), tb, 0.8)
                    self._put(self.music, I.timpani(I.m2f(root - 24), vel=(0.45 if beat % 2 == 0 else 0.25) * vel, r=R, dur=1.0), tb, 0.8)
                    self._note("pluck", root + 12 + ch[beat % 3], tb + b / 2, 0.2, 0.3 * vel, 0.5)
                elif style == "march":
                    self._note("tuba", root - 24 + ch[0] + (0 if beat % 2 == 0 else 7), tb, b * 0.6, 0.6 * vel)
                    self._put(self.music, I.snare(vel=(0.5 if beat % 2 else 0.3) * vel, r=R), tb, 0.6)
                    self._note("glock", root + 12 + ch[beat % 3] + (12 if beat == 3 else 0), tb, b, 0.4 * vel, 0.3)
                elif style == "sneak":
                    if beat % 2 == 0: self._note("pluck", root - 12 + ch[0] + (beat // 2) * 3, tb, 0.2, 0.55 * vel, -0.3)
                    self._note("pluck", root + ch[(beat + bar) % 3], tb + b / 2, 0.15, 0.35 * vel, 0.4)
            t += 4 * b; bar += 1
        _ = n_bars

    # ---- master ----
    def render(self, music_lu=-10.0, sfx_db=-6.0, amb_db=-8.0, duck_db=-3.0, target=-14.0):
        v, sr = read_wav(f"{self.P}/voice/voice.wav")
        v = _mono(v)
        v = np.pad(v, (0, max(0, self.N - len(v))))[: self.N]
        voice = st(v)
        # duck key from the line times
        key = np.zeros(self.N)
        for ln in self.T["lines"].values(): key[ns(ln["t0"] - 0.08): ns(ln["t1"] + 0.12)] = 1
        key = np.convolve(key, np.ones(ns(0.12)) / ns(0.12), "same")
        def lvl(x):
            L = integrated(x); return L if np.isfinite(L) else -70
        Lv = lvl(voice)
        m = self.music * dbg(Lv + music_lu + 3.0 - lvl(self.music)) if np.abs(self.music).max() > 0 else self.music  # +3 dB music standard
        m = m * dbg(duck_db * key)[None, :]
        s = self.sfx * dbg(Lv + sfx_db - lvl(self.sfx)) if np.abs(self.sfx).max() > 0 else self.sfx
        a = self.amb * dbg(Lv + amb_db - 6 - lvl(self.amb)) if np.abs(self.amb).max() > 0 else self.amb
        a = a * dbg(-4 * key)[None, :]
        mix = voice + m + s + a
        g = dbg(target - lvl(mix)); mix *= g
        # soft limiter (look-ahead peak follower) to <= -1.2 dBTP
        ceil = dbg(-2.2); pk = np.abs(mix).max(0)
        from scipy.ndimage import maximum_filter1d, uniform_filter1d
        env = maximum_filter1d(pk, ns(0.01)); gain = np.minimum(1, ceil / np.maximum(env, 1e-9)); gain = uniform_filter1d(gain, ns(0.005))
        mix = mix * gain[None, :]
        os.makedirs(f"{self.P}/audio", exist_ok=True)
        write_wav(f"{self.P}/audio/mix.wav", mix)
        for nm, x in (("voice", voice * g), ("music", m * g), ("sfx", s * g), ("amb", a * g)): write_wav(f"{self.P}/audio/stem_{nm}.wav", x)
        rep = f"integrated {integrated(mix):.1f} LUFS, true peak {true_peak(mix):.1f} dBTP, length {self.N / SR:.3f} s"
        with open(f"{self.P}/audio/cues.md", "w") as fh:
            fh.write(f"# Sound cues\n\n{rep}\n\n| t (s) | event | gain |\n|---|---|---|\n")
            for t, nm, gn in sorted(self.cues): fh.write(f"| {t} | {nm} | {gn} |\n")
        print(rep, "|", len(self.cues), "cues")
