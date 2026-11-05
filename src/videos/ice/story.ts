// "What If All the Ice on Earth Melted?" (What If ep. 3) — shot plan, camera, lens, cast.
import TL from "./timeline.json";
import { Episode, Key, Dof, V3, ShotDef, FPS, dolly, zoom, orbit, pushK, smooth, seg, q, lerp } from "../toon/core";
import { Stage, CamInfo, card } from "../toon/cast";
import { fxBang, fxWhat, fxSweat, fxSparkle, fxImpact } from "../toon/fx";
import { fxSplash, Pen } from "../toon/toon";
import { pip, put, exprAt } from "../toon/kit";
import { bear, penguin, fish, hourglass } from "../toon/animals";
import { buildSet } from "./set";

export const TOTAL = TL.total;
const L = TL.lines as Record<string, { t0: number; t1: number }>;
const tl = (id: string, d = 0) => L[id].t0 + d;

export const TOWER: V3 = [26, 0, -34], HILL: V3 = [-70, 0, -70], ICE: V3 = [0, 0, -3000], FLOE: V3 = [3000, 0, 0], GLASS: V3 = [-3000, 0, 0], GREEN: V3 = [0, 0, 3000];
export const FLOORS = 20, FLOORH = 3.2;
/** the town sea: at the tower roof in the hook, then climbing (beach → boardwalk → floors), drowned aerial, today's level later */
export const SEA6 = 5 * FLOORH - 0.2; // drowned-town level: just under Pip's 5th-floor window sill
export const seaAt = (id: number, t: number) => {
  if (id === 1) return FLOORS * FLOORH + 0.2;
  if (id === 4) return lerp(-0.6, 2.6, smooth(seg(t, tl("L04", 0.6), tl("L04", 3.4))));
  if (id === 5) return lerp(2.6, SEA6, smooth(seg(t, tl("L05", 0), tl("L05", 4.6))));
  if (id === 6) return SEA6; // owner: same level as the end of shot 5 (continuous across the cut)
  if (id === 10) return lerp(-0.6, -0.05, smooth(seg(t, tl("L10", 3.4), tl("L10", 4.6))));
  return -0.6;
};
export const cubeAt = (t: number) => smooth(seg(t, tl("L08", 1.0), tl("L08", 5.0)));

export const SHOTS: ShotDef[] = [
  { id: 1, a: 0, b: 197, light: "day", sunAz: 110, sunEl: 35 },
  { id: 2, a: 197, b: 402, light: "day", sunAz: 120, sunEl: 30 },
  { id: 3, a: 402, b: 508, light: "day", sunAz: 120, sunEl: 30 },
  { id: 4, a: 508, b: 624, light: "day", sunAz: 100, sunEl: 40 },
  { id: 5, a: 624, b: 781, light: "day", sunAz: 110, sunEl: 40 },
  { id: 6, a: 781, b: 909, light: "day", sunAz: 140, sunEl: 55 },
  { id: 7, a: 909, b: 1070, light: "day", sunAz: 100, sunEl: 25 },
  { id: 8, a: 1070, b: 1245, light: "golden", sunAz: 40, sunEl: 12 },
  { id: 9, a: 1245, b: 1335, light: "day", sunAz: 120, sunEl: 30 },
  { id: 10, a: 1335, b: 1517, light: "golden", sunAz: 30, sunEl: 10 },
  { id: 11, a: 1517, b: TOTAL, light: "golden", sunAz: 20, sunEl: 9 },
];
export const XFADE: Record<number, number> = { 2: 6, 4: 6, 7: 8, 8: 8, 10: 8, 11: 8 };
export const FLASH_AT = [197];
const WET = tl("L10", 3.9);
const KICKS: [number, number][] = [[tl("L01", 4.3), 0.6], [tl("L05", 0.1), 0.6], [tl("L05", 1.4), 0.6], [tl("L09", 0.6), 0.8], [WET, 0.9]];

const C = (base: V3, d: V3): V3 => [base[0] + d[0], base[1] + d[1], base[2] + d[2]];
const ROOF: V3 = [TOWER[0], FLOORS * FLOORH + 1.0, TOWER[2]];
const PIP4: V3 = [2, 1.0, 4.2];
export const CAMS: Record<number, Key[]> = {
  1: [
    { f: 0, s: (f) => dolly(C(ROOF, [2.6 - 0.02 * f, 3.4 - 0.012 * f, 10.5]), C(ROOF, [0.3, -2.0, 3.0]), pushK(f, 0, 0.003), { fov: 42, roll: -0.05 }) }, // Pip on the roof edge, the drowned tower through the water
    { f: 70, dur: 40, s: (f) => dolly(C(ROOF, [14, 9, 30]), C(ROOF, [0, 0, 0]), pushK(f, 70, 0.002), { fov: 46, roll: 0.04 }) }, // crane out: nothing but sea
    { f: 140, cut: true, s: (f) => dolly(C(ROOF, [1.2, 0.6, 6.6]), C(ROOF, [0.4, 1.0, 2.5]), pushK(f, 140, 0.004, 0.008, 30), { fov: 38 }) }, // "twenty-storey building"
  ],
  2: [
    { f: 197, s: (f) => orbit(C(ICE, [-6, 1.6, -2]), 11 * pushK(f, 197, 0.0025), -0.25 + 0.004 * (f - 197), 1.6 + 0.01 * (f - 197), { fov: 44 }) }, // the big pile (91 %)
    { f: 320, dur: 30, s: (f) => dolly(C(ICE, [2.0 - 0.025 * (f - 320), 2.0, 7.5]), C(ICE, [1.9, 0.9, 1.3]), pushK(f, 320, 0.0025), { fov: 42, roll: 0.04 }) }, // Greenland pile (8 %)
  ],
  3: [{ f: 402, s: (f) => orbit(C(ICE, [4.2, 0.8, 2.8]), 5.9 * pushK(f, 402, 0.004, 0.008, 30), 0.42 + 0.0045 * (f - 402), 0.7, { fov: 40, roll: -0.05 }) }], // one tiny cube
  4: [
    { f: 508, s: (f) => dolly([5 - 0.04 * (f - 508), 1.2, 16], [1, 1.2, 3], pushK(f, 508, 0.003), { fov: 46 }) }, // the beach, the boardwalk
    { f: 570, dur: 26, s: (f) => dolly([4, 1.6, 9.5], [2, 1.6, 4], pushK(f, 570, 0.003), { fov: 42, roll: 0.05 }) },
  ],
  5: [
    { f: 624, s: (f) => { const y = seaAt(5, f / FPS); return dolly(C(TOWER, [9, y + 2.5, 22]), C(TOWER, [0, y + 1.5, 0]), 1, { fov: 44 }); } }, // the waterline climbs the tower
    { f: 712, cut: true, s: (f) => dolly(C(TOWER, [1.5, 6 * FLOORH + 1.4, 12]), C(TOWER, [0, 5 * FLOORH + 1.6, 6]), pushK(f, 712, 0.004), { fov: 40, roll: -0.04 }) }, // window shopping
  ],
  6: [{ f: 781, s: (f) => orbit([26, 27, -34], 162 * pushK(f, 781, 0.001), -1.93 + 0.0008 * (f - 781), 23 - 0.02 * (f - 781), { fov: 50 }) }], // drowned town: the hill-top house in front, the tower rising from the sea behind (arc)
  7: [
    { f: 909, s: (f) => orbit(C(FLOE, [0, 1.4, 1.5]), 11, 0.4 + 0.004 * (f - 909), 3.0, { fov: 44 }) }, // bear on the floe, gauge steady
    { f: 1000, dur: 30, s: (f) => dolly(C(FLOE, [5.6, 1.6, 9]), C(FLOE, [4.5, 1.6, 4]), pushK(f, 1000, 0.003), { fov: 40 }) }, // the gauge: barely moves
  ],
  8: [
    { f: 1070, s: (f) => orbit(C(GLASS, [0, 1.6, 0]), 4.25 * pushK(f, 1070, 0.003), 0.14 + 0.004 * (f - 1070), 0.6, { fov: 38 }) },
    { f: 1160, dur: 30, s: (f) => dolly(C(GLASS, [0.3 + 0.008 * (f - 1160), 1.95 - 0.003 * (f - 1160), 2.1]), C(GLASS, [0, 1.85, 0]), pushK(f, 1160, 0.003), { fov: 36, roll: 0.04 }) }, // the line holds
  ],
  9: [{ f: 1245, s: (f) => zoom(C(GREEN, [10 - 0.12 * (f - 1245), 8 + 0.03 * (f - 1245), 60]), C(GREEN, [-10, 10, -60]), 46, pushK(f, 1245, 0.003, 0.007, 30), { roll: -0.04 }) }],
  10: [
    { f: 1335, s: (f) => orbit([2, 1.0, 7.4], 4.3 * pushK(f, 1335, 0.0025), 0.36 - 0.004 * (f - 1335), 0.2, { fov: 42 }) }, // deck chair
    { f: 1440, cut: true, s: (f) => dolly([3.6, 1.0, 11.7], [2, 0.8, 7.4], pushK(f, 1440, 0.004, 0.009, 24), { fov: 40, roll: 0.06 }) }, // the toes get wet
  ],
  11: [
    { f: 1517, s: (f) => dolly(C(HILL, [24, 10, 46]), C(HILL, [6, 14, 14]), pushK(f, 1517, 0.002), { fov: 44 }) }, // up the hill
    { f: 1580, dur: 30, s: (f) => dolly(C(HILL, [10 - 0.02 * (f - 1580), 21 + 0.012 * (f - 1580), 28]), C(HILL, [4, 22, 18]), pushK(f, 1580, 0.003), { fov: 40, roll: 0.04 }) },
  ],
};
export const DOF: Dof[] = [
  { f: 0, cInf: 12 }, { f: 70, dur: 40, cInf: 0 }, { f: 140, cInf: 13 },
  { f: 197, cInf: 0 }, { f: 320, dur: 30, cInf: 8 }, { f: 402, cInf: 14 },
  { f: 508, cInf: 0 }, { f: 570, dur: 26, cInf: 9 },
  { f: 624, cInf: 0 }, { f: 712, cInf: 11 }, { f: 781, cInf: 0 },
  { f: 909, cInf: 4 }, { f: 1000, dur: 30, cInf: 10 },
  { f: 1070, cInf: 10 }, { f: 1160, dur: 30, cInf: 13 },
  { f: 1245, cInf: 0 }, { f: 1335, cInf: 9 }, { f: 1440, cInf: 14 }, { f: 1517, cInf: 0 }, { f: 1580, dur: 30, cInf: 8 },
];

// painted sign cards (unlit, read instantly), 640 x 1000: post + board
const signCard = (top: string, l1: string, l2: string, col = "#c9302c", board = "#f4e3bf") => (p: Pen) => {
  const g = p.g;
  p.poly([[295, 520], [345, 520], [345, 1000], [295, 1000]], "#8a5a32", 10);
  p.poly([[20, 40], [620, 40], [620, 560], [20, 560]], board, 14);
  g.textAlign = "center"; g.textBaseline = "middle";
  g.fillStyle = "#2a3f6a"; g.font = "bold 58px sans-serif"; g.fillText(top, 320, 120);
  g.fillStyle = col; g.font = "bold 130px sans-serif"; g.fillText(l1, 320, 285); g.font = "bold 70px sans-serif"; g.fillText(l2, 320, 450);
};
const S_ANT = signCard("ANTARCTICA", "91%", "OF ALL ICE"), S_GRN = signCard("GREENLAND", "8%", "OF ALL ICE");
const S_GLA = signCard("GLACIERS", "1%", "(ALL OF THEM)"), S_NP = signCard("YOU ARE AT THE", "NORTH", "POLE", "#2a6fb5", "#eef6fb");
const S_HILL = signCard("HILL HOUSE", "FOR SALE", "DRY FEET!", "#2f8a3a");
/** Pip looks out from INSIDE the tower: a lit room behind him, the window frame + wall below the sill in front */
const ROOM = (p: Pen) => { p.poly([[0, 0], [300, 0], [300, 240], [0, 240]], "#4a5070", 0); p.ell(230, 60, 26, 26, "#ffe7a6", 6); p.poly([[20, 150], [110, 150], [110, 240], [20, 240]], "#7a5a3a", 6); };
const WINDOW = (p: Pen) => {
  p.poly([[0, 240], [360, 240], [360, 400], [0, 400]], "#d9c9a8", 8);           // wall below the sill (hides the legs)
  p.poly([[0, 0], [360, 0], [360, 22], [0, 22]], "#d9c9a8", 8);                   // lintel
  p.poly([[0, 0], [30, 0], [30, 400], [0, 400]], "#f4efe6", 8); p.poly([[330, 0], [360, 0], [360, 400], [330, 400]], "#f4efe6", 8);
  p.poly([[-6, 230], [366, 230], [366, 256], [-6, 256]], "#f4efe6", 8);         // sill
  p.poly([[30, 22], [330, 22], [330, 34], [30, 34]], "#f4efe6", 6);
};
const hillY = (x: number, z: number) => 22 * Math.sqrt(Math.max(0, 1 - ((x - HILL[0]) / 42) ** 2 - ((z - HILL[2]) / 34) ** 2));
const stage = (id: number, t: number, cam: CamInfo, out: Stage) => {
  if (id === 2 || id === 3) {
    card(out, "sAnt", S_ANT, ICE[0] - 6.9, 1.0, ICE[2] + 1.3, 1.3, 2.0, { cw: 640, ch: 1000 });
    card(out, "sGrn", S_GRN, ICE[0] + 0.5, 0.8, ICE[2] + 2.4, 1.0, 1.6, { cw: 640, ch: 1000 });
    card(out, "sGla", S_GLA, ICE[0] + 5.4, 0.7, ICE[2] + 2.0, 0.9, 1.4, { cw: 640, ch: 1000 });
  }
  if (id === 7) card(out, "sNP", S_NP, FLOE[0] - 0.4, 0.6 + 1.1, FLOE[2] - 0.6, 1.4, 2.2, { cw: 640, ch: 1000 });
  if (id === 11) card(out, "sHill", S_HILL, HILL[0] + 3.5, hillY(HILL[0] + 3.5, HILL[2] + 16) + 1.0, HILL[2] + 16, 1.3, 2.0, { cw: 640, ch: 1000 });
  if (id === 1) {
    pip(cam, out, t, ROOF[0] + 0.4, ROOF[1], ROOF[2] + 5.4, exprAt(t, [[0, "nervous"], [tl("L01", 3.0), "shock"], [tl("L01", 4.6), "dazed"]]), { mode: "sit" });
    const jump = ((t * 0.7) % 1); if (jump < 0.5) card(out, `fishj${q(jump, 20)}`, (p) => fish(p, "#f08a2c", Math.sin(t * 20)), ROOF[0] + 3.5 - jump * 2, ROOF[1] - 1.2 + Math.sin(jump * Math.PI * 2) * 1.6, ROOF[2] + 4, 0.8, 0.48, { cw: 400, ch: 240, rot: -0.6 + jump * 1.2 });
    if (t > tl("L01", 4.3) && t < tl("L01", 5.2)) card(out, "bang1", (p) => fxBang(p), ROOF[0] + 0.6, ROOF[1] + 2.4, ROOF[2] + 2.5, 0.4, 0.6, { cw: 200, ch: 300 });
  }
  if (id === 2 || id === 3) {
    const lid = 0;
    out.places.push({ key: `peng|${t > tl("L02", 3.5) ? 1 : 0}|${q((t * 3) % 1, 4)}`, x: ICE[0] - 4.6, y: 0, z: ICE[2] + 2.3, scale: 0.6, size: [600, 1000, 1],
      draw: (p) => penguin(p, t > tl("L02", 3.5), lid, Math.abs(Math.sin(t * 6)) * (t > tl("L02", 3.5) ? 1 : 0.2)) });
    pip(cam, out, t, ICE[0] + 3.6, 0, ICE[2] + 3.4, exprAt(t, [[0, "smile"], [tl("L02", 4.5), "grin"], [tl("L03", 0.5), "nervous"], [tl("L03", 2.0), "pained"]]), { mode: id === 3 ? "sit" : "stand", look: -1 });
    if (id === 3) for (let k = 0; k < 3; k++) card(out, `spk3${k}`, (p) => fxSparkle(p), ICE[0] + 4.2 + (k - 1) * 0.32, 1.15 + 0.12 * (k % 2) + 0.12 * Math.sin(t * 4 + k), ICE[2] + 2.8, 0.18, 0.18, { cw: 200, ch: 200 });
  }
  if (id === 4) {
    const back = smooth(seg(t, tl("L04", 1.4), tl("L04", 3.4)));
    pip(cam, out, t, PIP4[0], PIP4[1], PIP4[2] - back * 2.5, exprAt(t, [[0, "smile"], [tl("L04", 1.2), "nervous"], [tl("L04", 2.6), "shock"]]), { look: 1 });
    const u = q(seg(t, tl("L04", 2.4), tl("L04", 3.4)), 30); if (u > 0 && u < 1) card(out, `spl4${u}`, (p) => fxSplash(p, u), 1.5, 1.4, 6.0, 5, 5, { cw: 800, ch: 800 });
  }
  if (id === 5) {
    const y = 5 * FLOORH + 0.45;
    if (t > tl("L05", 2.8)) {
      card(out, "room5", ROOM, TOWER[0] + 0.5, y + 1.35, TOWER[2] + 6.03, 1.5, 1.2, { cw: 300, ch: 240 });
      card(out, "win5", WINDOW, TOWER[0] + 0.5, y + 0.95, TOWER[2] + 6.32, 1.8, 2.0, { cw: 360, ch: 400 });
      pip(cam, out, t, TOWER[0] + 0.5, y, TOWER[2] + 6.15, exprAt(t, [[0, "shock"], [tl("L05", 3.9), "dazed"]]), { noBlob: true });
      for (let k = 0; k < 3; k++) { const x = TOWER[0] - 3 + ((t * 1.2 + k * 1.7) % 6); card(out, `fish5${k}${q(Math.sin(t * 8 + k), 4)}`, (p) => fish(p, ["#f08a2c", "#f2c230", "#e2453c"][k], Math.sin(t * 8 + k)), x, y - 1.6 - k * 1.1, TOWER[2] + 6.6 + k * 0.4, 0.9, 0.54, { cw: 400, ch: 240 }); }
    }
  }
  if (id === 7) {
    out.places.push({ key: `bear7|${t > tl("L07", 2.2) ? 1 : 0}`, x: FLOE[0] - 2.5, y: 0.6, z: FLOE[2] + 0.5, scale: 1.3, size: [600, 1000, 1], draw: (p) => bear(p, t > tl("L07", 2.2) && t < tl("L07", 3.6)) });
    pip(cam, out, t, FLOE[0] + 1.8, 0.6, FLOE[2] + 2.0, exprAt(t, [[0, "smile"], [tl("L07", 2.2), "shock"], [tl("L07", 3.9), "grin"]]));
    if (t > tl("L07", 3.6)) card(out, "what7", (p) => fxWhat(p), FLOE[0] + 1.9, 3.3, FLOE[2] + 2.0, 0.4, 0.6, { cw: 200, ch: 300 });
  }
  if (id === 8) {
    put(cam, out, { i: 1, o: { jacket: "#f2b531", pants: "#3b5b9a", boots: "#e2453c", hat: "cap", cap: "#e2453c", build: "kid" }, okey: "pip" }, t, GLASS[0] + 1.4, 1.0, GLASS[2] + 0.2,
      exprAt(t, [[0, "neutral"], [tl("L08", 3.0), "smile"], [tl("L08", 4.6), "grin"]]), { scale: 0.75 });
    if (cubeAt(t) > 0.95) card(out, "spk8", (p) => fxSparkle(p), GLASS[0] + 0.55, 2.0, GLASS[2] + 0.4, 0.2, 0.2, { cw: 200, ch: 200 });
  }
  if (id === 10) {
    const wet = t > WET;
    pip(cam, out, t, 2, 0, 7.4, exprAt(t, [[0, "smile_closed"], [tl("L10", 2.4), "smile"], [WET, "shock"]]), { mode: wet ? "stand" : "sit", swaps: [WET] });
    if (!wet) card(out, `hg${q(seg(t, tl("L10", 0.4), tl("L10", 3.2)), 10)}`, (p) => hourglass(p, seg(t, tl("L10", 0.4), tl("L10", 3.2))), 3.1, 1.3, 7.5, 0.6, 0.8, { cw: 300, ch: 400 });
    if (wet && t < WET + 0.8) card(out, "bang10", (p) => fxBang(p), 2.2, 2.9, 7.4, 0.4, 0.6, { cw: 200, ch: 300 });
    if (wet) if (t < WET + 0.45) card(out, `imp10${q(seg(t, WET, WET + 0.4), 12)}`, (p) => fxImpact(p, seg(t, WET, WET + 0.4), "#e8f8ff", "#7fc8f0"), 2.4, 0.15, 7.5, 0.7, 0.7, { cw: 500, ch: 500, soft: true });
  }
  if (id === 11) {
    const u = seg(t, tl("L11", -0.5), tl("L11", 2.6)), x = HILL[0] + lerp(14, 6, u), z = HILL[2] + lerp(26, 18, u), y = 22 * Math.sqrt(Math.max(0, 1 - ((x - HILL[0]) / 42) ** 2 - ((z - HILL[2]) / 34) ** 2));
    pip(cam, out, t, x, y, z, exprAt(t, [[0, "smile"], [tl("L11", 2.4), "grin"]]), { mode: u < 1 ? "stroll" : "stand", phase: (t * 1.6) % 1, wave: u >= 1 ? q(Math.sin(t * 8), 20) : undefined });
  }
  void fxSweat;
};

export const EPISODE: Episode = { id: "ice", total: TOTAL, shots: SHOTS, xfade: XFADE, flashAt: FLASH_AT, cams: CAMS, kicks: KICKS, dof: DOF, build: buildSet, stage };
