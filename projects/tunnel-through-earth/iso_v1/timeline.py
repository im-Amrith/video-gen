"""Single source of truth: line start times from voice/dur.json + named gaps. Writes timeline.json."""
import json, os
H = os.path.dirname(os.path.abspath(__file__))
dur = json.load(open(f"{H}/voice/dur.json"))
lines = json.load(open(f"{H}/lines.json"))
GAP = 0.22
EXTRA = {"L01": .25, "L03": .2, "L04": .85, "L08": 1.05, "L09": .35, "L11": .15, "L12": .5, "L14": .45}
t = 0.45
L = {}
for l in lines:
    i = l["id"]; L[i] = {"t0": round(t, 3), "t1": round(t + dur[i], 3), "text": l["text"]}
    t += dur[i] + GAP + EXTRA.get(i, 0)
DUR = round(L["L15"]["t1"] + 2.3, 2)
json.dump({"DUR": DUR, "L": L}, open(f"{H}/timeline.json", "w"), indent=1)
print("DUR", DUR); [print(k, v["t0"], v["t1"]) for k, v in L.items()]
