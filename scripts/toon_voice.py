"""Lay the voiced lines of a toon short on one timeline.
usage: python3 scripts/toon_voice.py projects/<slug> src/videos/<slug>
reads  <project>/lines.json, <project>/voice/<id>.wav + dur.json, <project>/gaps.json ({"lead": s, "tail": s, "gap": s, "after": {id: s}})
writes <project>/voice/voice.wav (48 kHz mono, exact film length), <project>/voice/words.json (word timings),
       <src>/timeline.json ({fps, total, dur, lines: {id: {t0, t1, text}}}) — the single source of timing for story.ts and the mix.
Word timings are estimated from each line's voiced audio (20 ms RMS frames) split by character count, because the
Whisper model download is blocked in the cloud container; re-run faster-whisper locally to refine them if wanted."""
import json, sys, os
import numpy as np, soundfile as sf
try:
    import soxr
    rs = lambda x, a, b: soxr.resample(x, a, b)
except ImportError:
    from scipy.signal import resample_poly
    rs = lambda x, a, b: resample_poly(x, b, a)

P, S = sys.argv[1], sys.argv[2]
lines = json.load(open(f"{P}/lines.json"))
dur = json.load(open(f"{P}/voice/dur.json"))
G = json.load(open(f"{P}/gaps.json")) if os.path.exists(f"{P}/gaps.json") else {}
lead, tail, gap, after = G.get("lead", 0.35), G.get("tail", 1.8), G.get("gap", 0.25), G.get("after", {})
SR, FPS = 48000, 30
t = lead; L = {}; words = []; clips = []
for l in lines:
    i = l["id"]
    x, sr = sf.read(f"{P}/voice/{i}.wav", dtype="float32")
    if x.ndim > 1: x = x.mean(1)
    x = rs(x, sr, SR).astype(np.float32)
    d = len(x) / SR
    L[i] = {"t0": round(t, 3), "t1": round(t + d, 3), "text": l["text"]}
    clips.append((t, x))
    fr = int(0.02 * SR); e = np.array([np.sqrt(np.mean(x[k:k + fr] ** 2)) for k in range(0, max(1, len(x) - fr), fr)])
    tv = np.flatnonzero(e > e.max() * 0.06) * 0.02
    if len(tv) < 2: tv = np.array([0, d])
    ws = l["text"].split(); w = np.array([len(s) for s in ws], float); c = np.concatenate([[0], np.cumsum(w) / w.sum()])
    idx = np.clip((c * (len(tv) - 1)).round().astype(int), 0, len(tv) - 1)
    for j, s in enumerate(ws):
        words.append({"line": i, "word": s, "start": round(t + tv[idx[j]], 3), "end": round(t + tv[idx[j + 1]] + 0.02, 3)})
    t += d + gap + after.get(i, 0)
total_s = t - gap + tail
total = int(round(total_s * FPS))
buf = np.zeros(int(total / FPS * SR) + 1, np.float32)
for t0, x in clips:
    a = int(t0 * SR); buf[a:a + len(x)] += x[: len(buf) - a]
os.makedirs(f"{P}/voice", exist_ok=True)
sf.write(f"{P}/voice/voice.wav", buf, SR, subtype="PCM_24")
json.dump({"note": "estimated from voiced audio + character counts (Whisper blocked in the cloud)", "words": words}, open(f"{P}/voice/words.json", "w"), indent=0)
json.dump({"fps": FPS, "total": total, "dur": round(total / FPS, 3), "lines": L}, open(f"{S}/timeline.json", "w"), indent=1)
print("total", total, "frames =", round(total / FPS, 2), "s")
for k, v in L.items(): print(k, v["t0"], v["t1"], "f", round(v["t0"] * FPS), round(v["t1"] * FPS))
