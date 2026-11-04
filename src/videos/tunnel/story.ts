// "What If You Jumped Into a Hole Through the Earth?" (What If ep. 1) — shot plan, camera, lens, cast, physics.
// Timing: timeline.json (scripts/toon_voice.py) = the voice lines; every reaction lands 0-3 f before its word.
import TL from "./timeline.json";
import {
  Episode, Key, Dof, V3, ShotDef, FPS, dolly, zoom, orbit, pushK, glide, clamp01, smooth, lin, hh, q, seg, lerp,
} from "../toon/core";
import { Stage, CamInfo, person, blob, card, lidAt, light2D, spinAbout, Who, Expr, Outfit } from "../toon/cast";
import { Pen, INK, fxBurst, fxPuff, fxStars } from "../toon/toon";
import { fxSpeed, fxSweat, fxHeat, fxImpact, fxBang, fxWhat, fxSparkle } from "../toon/fx";
import { swingKid } from "../toon/toon";
import { SU_SWING } from "../toon/cast";
import { buildSet } from "./set";

export const TOTAL = TL.total;
const L = TL.lines as Record<string, { t0: number; t1: number }>;
const fr = (id: string, d = 0) => Math.round((L[id].t0 + d) * FPS);
const tl = (id: string, d = 0) => L[id].t0 + d;

// ---------------- places ----------------
export const TUN: V3 = [2000, 0, 0], KOLA: V3 = [0, 0, -2000], SP: V3 = [0, 0, 2000], PG: V3 = [-2000, 0, 0];
export const PUMP: V3 = [5.6, 0, -2.6];
export const PLANE = { t0: tl("L13", -0.4), x: -14, z: -16 };
export const F = { SCROLL_PER_M: 0.016 };
export const DRILL_HOT = tl("L02", 4.3); // "...a hundred and eighty degrees"

// ---------------- physics: vacuum fall through a PREM-like Earth (km, s) ----------------
const gacc = (r: number) => { r = Math.abs(r); if (r >= 3480) return 9.82 + (10.68 - 9.82) * (6371 - r) / (6371 - 3480); const x = r / 3480; return 10.68 * x * (1.25 - 0.25 * x); };
const SZ: number[] = []; let TC = 0;
(() => { let r = 6371e3, v = 0, n = 0; const dt = 0.05; SZ.push(0); while (r > 0) { v += gacc(r / 1e3) * dt; r -= v * dt; n++; if (n % 20 === 0) SZ.push(6371 - r / 1e3); } TC = n * dt; })();
const T1 = 2 * TC;
const depthSim = (s: number) => { // km travelled along the tunnel, 0..12742
  const h = (x: number) => { x = Math.max(0, Math.min(SZ.length - 1, x)); const i = Math.floor(x), k = x - i; return SZ[i] + (SZ[Math.min(i + 1, SZ.length - 1)] - SZ[i]) * k; };
  return s <= TC ? h(s) : 12742 - h(2 * TC - s);
};
const S_CMB = SZ.findIndex((d) => d > 2891);
const TJ = 17.75; // the jump (film s): hero leaves the rim
export const TA = tl("L10", 2.75); // apex at the south pole ("far end")
const KN: [number, number][] = [[18.4, 0], [20.2, 50], [tl("L07", 0.6), S_CMB], [tl("L08", 0.5), TC - 7], [tl("L08", 5.0), TC + 7], [41.4, T1 - 60]];
const simT = (t: number) => lin(KN, t);
const AIR0 = tl("L12", -0.5), AIR1 = tl("L12", 6.2);
export const airOn = (id: number) => (id === 12 ? 1 : 0);
export const depthAt = (t: number) => (t >= AIR0 - 1 ? 6371 * smooth(seg(t, AIR0, AIR1)) : depthSim(simT(t)));
export const scrollAt = (t: number) => (t >= AIR0 - 1 ? (t - AIR0) * 1.6 : depthAt(t) * 1000 * F.SCROLL_PER_M);
const speedAt = (t: number) => (depthAt(t + 0.05) - depthAt(t - 0.05)) / 0.1; // km per film-second (visual)

// ---------------- shots ----------------
export const SHOTS: ShotDef[] = [
  { id: 1, a: 0, b: 178, light: "day", sunAz: 110, sunEl: 28 },
  { id: 2, a: 178, b: 388, light: "day", sunAz: 70, sunEl: 40 },
  { id: 3, a: 388, b: 512, light: "day", sunAz: 100, sunEl: 30 },
  { id: 4, a: 512, b: 556, light: "day", sunAz: 160, sunEl: 35 },
  { id: 5, a: 556, b: 651, light: "night", sunAz: 90, sunEl: -40 },
  { id: 6, a: 651, b: 809, light: "magma", sunAz: 60, sunEl: -50 },
  { id: 7, a: 809, b: 981, light: "magma", sunAz: 60, sunEl: -50 },
  { id: 8, a: 981, b: 1157, light: "magma", sunAz: 80, sunEl: -30 },
  { id: 9, a: 1157, b: 1245, light: "magma", sunAz: 60, sunEl: 40 },
  { id: 10, a: 1245, b: 1450, light: "day", sunAz: 120, sunEl: 25 },
  { id: 11, a: 1450, b: 1571, light: "golden" },
  { id: 12, a: 1571, b: 1838, light: "magma", sunAz: 70, sunEl: -40 },
  { id: 13, a: 1838, b: TOTAL, light: "golden", sunAz: 20, sunEl: 9 },
];
export const XFADE: Record<number, number> = { 2: 6, 3: 6, 10: 6, 11: 8, 12: 8, 13: 8 };
export const FLASH_AT = [546];
const KICKS: [number, number][] = [[DRILL_HOT, 1.2], [TJ + 0.05, 0.6], [tl("L07", 0.6), 1.0], [tl("L08", 0.3), 0.8], [TA, 0.9], [TA + 0.65, 0.6], [PLANE.t0 + 1.6, 0.4]];

// ---------------- camera ----------------
const T = (f: number) => f / FPS;
const tu = (y: number): V3 => [TUN[0], y, TUN[2]];
const C = (base: V3, d: V3): V3 => [base[0] + d[0], base[1] + d[1], base[2] + d[2]];
const HERO_NP: V3 = [-3.0, 0, 0.7], BEAR: V3 = [-7.4, 0, -2.6], SCI: V3 = [SP[0] + 3.2, 0, SP[2] - 1.4];
const KW: V3[] = [[KOLA[0] - 1.25, 0.4, KOLA[2] + 2.2], [KOLA[0] + 1.3, 0.4, KOLA[2] + 2.4]];
export const CAMS: Record<number, Key[]> = {
  1: [
    { f: 0, s: (f) => dolly([-4.9, 3.3, 3.5], [-1.2, 0.1, -0.2], pushK(f, 0, 0.003), { fov: 46, roll: -0.05 }) }, // frame 0: over Pip's shoulder into the black hole
    { f: 52, dur: 30, s: (f) => dolly([-1.0, 9.5, 3.0], [0, -3, 0], pushK(f, 52, 0.003), { fov: 46, roll: 0.05 }) }, // crane up: straight down the hole
    { f: 112, cut: true, s: (f) => dolly([-6.0, 1.6, 0.6], [-7.4, 1.45, -2.6], pushK(f, 112, 0.004, 0.008, 30), { fov: 36 }) }, // the bear's double take
  ],
  2: [
    { f: 178, s: (f) => zoom(C(KOLA, [9, 5.5, 18]), C(KOLA, [0, 6, 0]), 44, pushK(f, 178, 0.0022)) }, // the rig
    { f: 262, cut: true, s: (f) => dolly(C(KOLA, [0.6, 1.9, 6.0]), C(KOLA, [0, 1.2, 2.2]), pushK(f, 262, 0.003), { fov: 40, roll: 0.03 }) }, // workers peer in
    { f: 330, cut: true, s: (f) => dolly(C(KOLA, [0.4, 2.3, 10.5]), C(KOLA, [0, 1.5, 1.2]), pushK(f, 330, 0.004, 0.009, 24), { fov: 40, roll: -0.05 }) }, // red-hot pipe, thermometer, workers
  ],
  3: [
    { f: 388, s: (f) => dolly([-7.0, 1.9, 3.6], [3.4, 0.8, -1.9], pushK(f, 388, 0.0025), { fov: 44 }) }, // Pip in front, the hole, the pump behind: air sucked out
    { f: 452, dur: 26, s: (f) => dolly([-1.6, 1.25, 3.4], [-3.0, 1.05, 0.7], pushK(f, 452, 0.003), { fov: 38, roll: 0.04 }) }, // Pip: ready
  ],
  4: [
    { f: 512, s: (f) => dolly([0.4, -2.2, 0.6], [-1.6, 2.2, 0.5], pushK(f, 512, 0.004), { fov: 58, roll: -0.08 }) }, // from inside the hole, up at the sky
  ],
  5: [
    { f: 556, s: (f) => dolly(C(TUN, [1.3, -3.6, 1.4]), C(TUN, [0, 0.9, 0]), pushK(f, 556, 0.003), { fov: 60, roll: 0.06 }) },
    { f: 598, dur: 28, s: (f) => dolly(C(TUN, [2.2, -0.4, 1.0]), C(TUN, [-1.0, 0.5, -0.6]), pushK(f, 598, 0.003), { fov: 56, roll: -0.05 }) }, // sees the Kola bit go by
  ],
  6: [
    { f: 651, s: (f) => dolly(C(TUN, [2.3, 0.9, 0.9]), C(TUN, [0, 0.75, 0]), pushK(f, 651, 0.003), { fov: 50 }) },
    { f: 712, cut: true, s: (f) => dolly(C(TUN, [0.5, 4.2, 0.6]), C(TUN, [0, -40, 0]), pushK(f, 712, 0.0025), { fov: 62, roll: 0.0 }) }, // down past Pip at the far glow
    { f: 765, cut: true, s: (f) => dolly(C(TUN, [1.0, 0.95, 1.6]), C(TUN, [0, 0.95, 0]), pushK(f, 765, 0.004, 0.008, 24), { fov: 38, roll: 0.07 }) }, // CU: heavier!
  ],
  7: [
    { f: 809, s: (f) => orbit(C(TUN, [0, 0.6, 0]), 2.5, 0.6 + 0.012 * (f - 809), -0.6, { fov: 58 }) }, // into the liquid iron: orbit
    { f: 880, cut: true, s: (f) => dolly(C(TUN, [0.9, 1.0, 1.3]), C(TUN, [0, 1.05, 0]), pushK(f, 880, 0.004), { fov: 36, roll: -0.05 }) }, // sweaty CU
    { f: 930, dur: 22, s: (f) => orbit(C(TUN, [0, 0.6, 0]), 2.6, 2.6 + 0.01 * (f - 930), 1.1, { fov: 56, roll: 0.06 }) },
  ],
  8: [
    { f: 981, s: (f) => dolly(C(TUN, [0.8, -1.6, 1.4]), C(TUN, [0, 0.8, 0]), pushK(f, 981, 0.004, 0.01, 30), { fov: 64, roll: 0.1 }) }, // max speed
    { f: 1062, cut: true, s: (f) => orbit(C(TUN, [0, 0.9, 0]), 2.6, -0.6 + 0.006 * (f - 1062), 0.2, { fov: 48 }) }, // weightless: slow orbit
    { f: 1110, dur: 40, s: (f) => orbit(C(TUN, [0, 0.9, 0]), 1.9, -0.25 + 0.004 * (f - 1110), 0.1, { fov: 42 }) },
  ],
  9: [
    { f: 1157, s: (f) => dolly(C(TUN, [1.2, 3.6, 1.2]), C(TUN, [0, 1.3, 0]), pushK(f, 1157, 0.003), { fov: 54, roll: -0.05 }) }, // flipped, slowing
    { f: 1205, dur: 26, s: (f) => dolly(C(TUN, [2.0, 1.4, 1.4]), C(TUN, [0, 1.3, 0]), pushK(f, 1205, 0.003), { fov: 50 }) },
  ],
  10: [
    { f: 1245, s: (f) => zoom(C(SP, [10, 4.2, 14]), C(SP, [0, 0.8, -2]), 44, pushK(f, 1245, 0.002)) }, // South Pole: the hut, the pole, a scientist
    { f: 1300, cut: true, s: (f) => dolly(C(SP, [0.6, 0.55, 4.0]), C(SP, [0, 0.6, 0.6]), pushK(f, 1300, 0.003, 0.007, 30), { fov: 40, roll: 0.03 }) }, // rim level: up pops Pip
    { f: 1362, cut: true, s: (f) => dolly(C(SP, [0.4, 6.0, 1.4]), C(SP, [0, -6, 0]), pushK(f, 1362, 0.003), { fov: 48, roll: -0.06 }) }, // down the hole: away he goes
  ],
  11: [
    { f: 1450, s: (f) => dolly(C(PG, [0.2, 1.6, 6.4]), C(PG, [0, 1.3, 0]), pushK(f, 1450, 0.0025), { fov: 30 }) },
    { f: 1512, dur: 28, s: (f) => dolly(C(PG, [1.0, 1.3, 5.6]), C(PG, [0, 1.2, 0]), pushK(f, 1512, 0.0025), { fov: 30, roll: 0.04 }) },
  ],
  12: [
    { f: 1571, s: (f) => dolly(C(TUN, [1.8, -0.2, 1.4]), C(TUN, [0, 0.9, 0]), pushK(f, 1571, 0.0025), { fov: 50 }) }, // drifting through dusty air
    { f: 1650, dur: 30, s: (f) => dolly(C(TUN, [-1.2, 1.4, 1.8]), C(TUN, [0, 0.9, 0]), pushK(f, 1650, 0.0025), { fov: 46, roll: -0.04 }) },
    { f: 1735, cut: true, s: (f) => dolly(C(TUN, [0.8, 1.0, 1.6]), C(TUN, [0, 1.0, 0]), pushK(f, 1735, 0.003), { fov: 38 }) }, // the centre: stuck
    { f: 1790, dur: 40, s: (f) => dolly(C(TUN, [0.6, 6.0, 0.8]), C(TUN, [0, 0.4, 0]), pushK(f, 1790, 0.0015), { fov: 54, roll: 0.05 }) }, // "Forever": crane up the shaft
  ],
  13: [
    { f: 1838, s: (f) => dolly([-4.2, 1.2, 5.5], [-6.5, 1.6, -6], pushK(f, 1838, 0.002), { fov: 46 }) },
    { f: 1880, dur: 30, s: (f) => dolly([-3.4, 1.2, 4.0], [-4.4, 1.1, 1.6], pushK(f, 1880, 0.003), { fov: 40, roll: 0.03 }) }, // snacks
  ],
};

// ---------------- lens ----------------
export const DOF: Dof[] = [
  { f: 0, cInf: 14 }, { f: 52, dur: 30, cInf: 0 }, { f: 112, cInf: 12 },
  { f: 178, cInf: 0 }, { f: 262, cInf: 10 }, { f: 330, cInf: 14 },
  { f: 388, cInf: 0 }, { f: 452, dur: 26, cInf: 11 },
  { f: 512, cInf: 6 },
  { f: 556, cInf: 8 }, { f: 651, cInf: 8 }, { f: 712, cInf: 4 }, { f: 765, cInf: 14 },
  { f: 809, cInf: 9 }, { f: 880, cInf: 14 }, { f: 930, cInf: 9 },
  { f: 981, cInf: 10 }, { f: 1062, cInf: 12 },
  { f: 1157, cInf: 9 },
  { f: 1245, cInf: 0 }, { f: 1300, cInf: 13 }, { f: 1362, cInf: 6 },
  { f: 1450, cInf: 6 },
  { f: 1571, cInf: 10 }, { f: 1735, cInf: 13 }, { f: 1790, dur: 40, cInf: 4 },
  { f: 1838, cInf: 8 }, { f: 1880, dur: 30, cInf: 12 },
];

// ---------------- cast ----------------
const PIP: Outfit = { jacket: "#f2b531", pants: "#3b5b9a", boots: "#e2453c", hat: "cap", cap: "#e2453c", build: "kid" };
const WORKER: Outfit = { jacket: "#e07a2a", pants: "#3d4a5c", boots: "#4a3426", hat: "cap", cap: "#f2c230", skin: "#f5c9a0" };
const WORKER2: Outfit = { ...WORKER, skin: "#ecd0b6", moustache: "#4a3426", build: "stout" };
const SCIENTIST: Outfit = { jacket: "#d23b3b", pants: "#2f3542", boots: "#2b2b33", hat: "hair", hair: "#3a2a20", skin: "#c99067" };
const W_PIP: Who = { i: 1, o: PIP, okey: "pip" };
const PIP_S = 1.25; // Pip is drawn big: kid build at 1.25

/** polar bear (front, 600 x 1000 design, soles at 975) */
const bear = (p: Pen, expr: "calm" | "shock", lid: number) => {
  const W = "#f7f3ea", Sh = "#d9dce6";
  p.ell(300, 700, 210, 250, W, 12);
  p.ell(300, 760, 120, 150, Sh, 0);
  for (const s of [-1, 1]) { p.ell(300 + s * 120, 940, 70, 40, W, 12); p.ell(300 + s * 190, 640, 50, 120, W, 12); }
  p.ell(300, 380, 150, 135, W, 12);
  for (const s of [-1, 1]) { p.ell(300 + s * 105, 270, 38, 34, W, 12); p.ell(300 + s * 105, 272, 18, 16, Sh, 0); }
  p.ell(300, 430, 70, 52, "#efe8dc", 10);
  p.ell(300, 408, 26, 18, INK, 0);
  const ey = 352, open = expr === "shock" ? 24 : 12;
  for (const s of [-1, 1]) {
    if (lid > 0.6) p.stroke([[300 + s * 70 - 16, ey], [300 + s * 70 + 16, ey]], 8);
    else { if (expr === "shock") p.ell(300 + s * 70, ey, open, open, "#ffffff", 7); p.dot(300 + s * 70, ey, expr === "shock" ? 9 : 11); }
  }
  if (expr === "shock") p.ell(300, 465, 22, 28, "#5a1e28", 8); else p.arc(300, 448, 26, 14, 20, 160, 7);
};
/** red-hot drill pipe thermometer (300 x 600): u = level 0..1 */
const thermo = (p: Pen, u: number) => {
  p.poly([[120, 60], [180, 60], [180, 430], [120, 430]], "#ffffff", 12);
  p.ell(150, 480, 62, 62, "#e2453c", 12);
  p.poly([[134, 430 - 360 * u], [166, 430 - 360 * u], [166, 450], [134, 450]], "#e2453c", 0);
  for (let k = 0; k < 6; k++) p.stroke([[180, 100 + k * 60], [200, 100 + k * 60]], 6);
};
/** a clock pictogram (300 x 300) with hands at angle a */
const clock = (p: Pen, a: number) => {
  p.ell(150, 150, 120, 120, "#fff7e0", 12);
  for (let k = 0; k < 12; k++) { const b = (k / 12) * Math.PI * 2; p.stroke([[150 + 95 * Math.sin(b), 150 - 95 * Math.cos(b)], [150 + 108 * Math.sin(b), 150 - 108 * Math.cos(b)]], 6); }
  p.stroke([[150, 150], [150 + 60 * Math.sin(a / 12), 150 - 60 * Math.cos(a / 12)]], 12);
  p.stroke([[150, 150], [150 + 88 * Math.sin(a), 150 - 88 * Math.cos(a)]], 8);
  p.dot(150, 150, 12);
};

const pip = (cam: CamInfo, out: Stage, t: number, x: number, y: number, z: number, expr: Expr, o: { mode?: "stand" | "fall" | "sit"; face?: boolean; roll?: number; wave?: number; prop?: "icecream" | null; look?: number; swaps?: number[]; scale?: number } = {}) => {
  const sc = o.scale ?? PIP_S;
  if (o.face && o.roll) [x, y, z] = spinAbout(cam, [x, y + 1.05 * sc, z], 1.05 * sc, o.roll);
  out.places.push(person(cam, W_PIP, x, y, z, { side: false, mirror: false }, { mode: o.mode ?? "stand", expr, blink: lidAt(t, 1, o.swaps), wave: o.wave, prop: o.prop ?? null, look: o.look ?? 0 }, {}, sc,
    { face: o.face, roll: o.roll }));
};
const exprAt = (t: number, tab: [number, Expr][]) => { let e = tab[0][1]; for (const [a, x] of tab) if (t >= a - 2 / FPS) e = x; return e; };

const stage = (id: number, t: number, cam: CamInfo, out: Stage, f: number) => {
  const swaps: number[] = [];
  if (id === 1 || id === 3 || id === 4) {
    // Pip at the lip; the bear watching
    const jumpU = seg(t, TJ - 0.25, TJ + 0.45);
    const e = exprAt(t, [[0, "nervous"], [tl("L01", 2.2), "grin"], [tl("L03", 0.2), "smile"], [tl("L03", 2.5), "grin"], [tl("L04", -0.3), "laugh"]]);
    if (jumpU <= 0) pip(cam, out, t, HERO_NP[0], 0, HERO_NP[2], e, { look: id === 1 && t < 1.7 ? 1 : 0, swaps: [tl("L01", 2.2), tl("L03", 2.5)], wave: id === 3 && t > tl("L03", 2.6) ? q(Math.sin(t * 10), 20) : undefined });
    else if (jumpU < 1) {
      const x = lerp(HERO_NP[0], -0.2, jumpU), y = 1.6 * Math.sin(Math.PI * Math.min(1, jumpU * 1.3)) - 4 * Math.max(0, jumpU - 0.75) ** 2 * 6, z = lerp(HERO_NP[2], 0.1, jumpU);
      pip(cam, out, t, x, y, z, "laugh", { mode: "fall", face: id === 4, roll: -0.4 * jumpU });
    }
    if (jumpU <= 0) blob(cam, out, HERO_NP[0], 0, HERO_NP[2], PIP_S);
    const bearShock = t > tl("L01", 3.7);
    out.places.push({ key: `bear|${bearShock ? "s" : "c"}|${lidAt(t, 9, [tl("L01", 3.7)])}`, x: BEAR[0], y: 0, z: BEAR[2], scale: 1.35, size: [600, 1000, 1],
      draw: (p) => bear(p, bearShock ? "shock" : "calm", lidAt(t, 9, [tl("L01", 3.7)])) });
    blob(cam, out, BEAR[0], 0, BEAR[2], 1.6);
    if (id === 1 && bearShock && t < tl("L01", 4.6)) card(out, `bang`, (p) => fxBang(p), BEAR[0] + 0.3, 3.2, BEAR[2], 0.45, 0.7, { cw: 200, ch: 300 });
    if (id === 4 && t > TJ + 0.2) { const u = q(seg(t, TJ + 0.2, TJ + 0.8), 30); card(out, `puff${u}`, (p) => fxPuff(p, u), -0.4, 0.6, 0.3, 2.2, 2.2, { soft: true }); }
  }
  if (id === 2) {
    const hot = t > DRILL_HOT - 0.07;
    KW.forEach(([x, , z], i) => {
      const e: Expr = hot ? "shock" : i ? "nervous" : "neutral";
      out.places.push(person(cam, { i: 10 + i, o: i ? WORKER2 : WORKER, okey: `w${i}` }, x, 0.4, z, { side: false, mirror: false }, { mode: "stand", expr: e, blink: lidAt(t, 10 + i, [DRILL_HOT]), look: i ? -1 : 1 }, {}, 1.0));
      blob(cam, out, x, 0.4, z);
    });
    if (hot) {
      const u = q(seg(t, DRILL_HOT, DRILL_HOT + 0.5), 30);
      card(out, `thermo${q(seg(t, DRILL_HOT - 0.6, DRILL_HOT), 20)}`, (p) => thermo(p, 0.4 + 0.6 * seg(t, DRILL_HOT - 0.6, DRILL_HOT)), KOLA[0] + 0.62, 2.7, KOLA[2] + 0.5, 0.5, 1.0, { cw: 300, ch: 600 });
      if (u < 1) card(out, `imp${u}`, (p) => fxImpact(p, u), KOLA[0] + 0.62, 3.25, KOLA[2] + 0.6, 1.4, 1.4, { cw: 500, ch: 500 });
      card(out, `heat${q(t % 1, 15)}`, (p) => fxHeat(p, t), KOLA[0], 2.9, KOLA[2] + 0.2, 1.2, 1.6, { cw: 300, ch: 400, soft: true });
    } else if (t > DRILL_HOT - 1.5) card(out, `thermo${q(seg(t, DRILL_HOT - 1.5, DRILL_HOT), 20)}`, (p) => thermo(p, 0.15 + 0.5 * seg(t, DRILL_HOT - 1.5, DRILL_HOT)), KOLA[0] + 0.62, 2.7, KOLA[2] + 0.5, 0.5, 1.0, { cw: 300, ch: 600 });
  }
  if (id >= 5 && id <= 9) {
    const v = Math.abs(speedAt(t));
    let e: Expr = exprAt(t, [[0, "laugh"], [tl("L05", 1.2), "grin"], [tl("L06", 0.4), "shock"], [tl("L06", 2.6), "nervous"], [tl("L07", 0.4), "shock"], [tl("L07", 2.6), "pained"],
      [tl("L08", 0.2), "shock"], [tl("L08", 3.2), "dazed"], [tl("L08", 3.9), "laugh"], [tl("L09", 0.1), "relief"], [tl("L09", 1.6), "smile"]]);
    swaps.push(tl("L06", 0.4), tl("L07", 0.4), tl("L08", 0.2), tl("L08", 3.2), tl("L09", 0.1));
    const weightless = t > tl("L08", 3.0) && t < tl("L08", 5.6);
    const roll = id === 9 ? Math.PI : weightless ? (t - tl("L08", 3.0)) * 1.1 : 0.12 * Math.sin(t * 3);
    const bob = 0;
    pip(cam, out, t, TUN[0], bob, TUN[2], e, { mode: "fall", face: true, roll, swaps });
    // speed lines around the faller
    if (v > 300 && !weightless) for (let k = 0; k < 3; k++) {
      const a = k * 2.1 + 0.5;
      card(out, `spd${q((t * 3 + k * 0.33) % 1, 12)}`, (p) => fxSpeed(p, (t * 3 + k * 0.33) % 1), TUN[0] + Math.cos(a) * 1.1, 0.9, TUN[2] + Math.sin(a) * 1.1, 1.2, 2.6, { cw: 400, ch: 800, soft: true });
    }
    if (id === 7 && t > tl("L07", 2.0)) card(out, `sweat${q(t % 0.6, 10)}`, (p) => fxSweat(p), TUN[0] + 0.55, 2.05 - ((t * 1.6) % 0.6), TUN[2] + 0.2, 0.22, 0.33, { cw: 120, ch: 180 });
    if (weightless) {
      // cap and crumbs float free
      card(out, `stars${q(t % 1, 20)}`, (p) => fxStars(p, (t * 0.8) % 1), TUN[0], 2.6, TUN[2], 1.1, 0.8, { cw: 400, ch: 300 });
      for (let k = 0; k < 4; k++) card(out, `spark${k}`, (p) => fxSparkle(p), TUN[0] + Math.cos(t + k * 1.6) * 1.3, 1.0 + Math.sin(t * 0.8 + k) * 0.8, TUN[2] + Math.sin(t + k * 1.6) * 1.3, 0.25, 0.25, { cw: 200, ch: 200 });
    }
    if (id === 8 && t < tl("L08", 2.8)) card(out, `imp8${q(seg(t, tl("L08", 0.2), tl("L08", 0.7)), 30)}`, (p) => fxImpact(p, seg(t, tl("L08", 0.2), tl("L08", 0.7))), TUN[0], 1.0, TUN[2] - 0.4, 2.4, 2.4, { cw: 500, ch: 500, soft: true });
  }
  if (id === 10) {
    // the scientist; Pip's head rises to the rim, hangs, sinks
    const tau = t - TA, hang = 0.62;
    let y: number;
    if (tau < 0) y = -0.5 * 9.8 * tau * tau; else if (tau < hang) y = 0; else y = -0.5 * 9.8 * (tau - hang) ** 2;
    const hy = y - 0.85 * PIP_S; // Pip's waist level reaches the rim at the apex
    const e = exprAt(t, [[0, "smile"], [TA - 0.3, "grin"], [TA + 0.25, "nervous"], [TA + hang, "shock"], [TA + hang + 0.25, "pained"]]);
    if (hy > -3.5) pip(cam, out, t, SP[0], hy, SP[2] + 0.1, e, { mode: "fall", swaps: [TA - 0.3, TA + 0.25, TA + hang] });
    const se: Expr = t < TA - 0.4 ? "neutral" : t < TA + hang + 0.2 ? "shock" : "nervous";
    out.places.push(person(cam, { i: 20, o: SCIENTIST, okey: "sci" }, SCI[0], 0, SCI[2], { side: false, mirror: false }, { mode: "stand", expr: se, blink: lidAt(t, 20, [TA - 0.4]), look: -1, wave: t > TA && t < TA + hang ? q(Math.sin(t * 12), 20) : undefined }, {}, 1.05));
    blob(cam, out, SCI[0], 0, SCI[2], 1.05);
    if (t > TA - 0.35 && t < TA + 0.5) card(out, `what`, (p) => fxWhat(p), SCI[0] + 0.2, 2.75, SCI[2], 0.4, 0.6, { cw: 200, ch: 300 });
  }
  if (id === 11) {
    // swing analogy: fastest in the middle, stopped at each end
    const th = 0.75 * Math.cos(((t - tl("L11", 2.4)) * 2 * Math.PI) / 2.2), vel = Math.sin(((t - tl("L11", 2.4)) * 2 * Math.PI) / 2.2);
    const Lr = (1150 - 20) * SU_SWING, cx = PG[0] + Math.sin(th) * Lr, cy = 3.0 - Math.cos(th) * Lr, light = light2D(cam, false);
    const kick = q(0.35 + 0.55 * vel, 30), e: Expr = Math.abs(vel) > 0.6 ? "laugh" : "grin";
    card(out, `swing|${kick}|${e}|${q(light)}`, (p) => swingKid(p, PIP, kick, e, light, 0), cx, cy, PG[2], 700 * SU_SWING, 2300 * SU_SWING, { cw: 490, ch: 1610, k: 0.7, rot: -th });
  }
  if (id === 12) {
    const e = exprAt(t, [[0, "neutral"], [tl("L12", 3.0), "smile_closed"], [tl("L12", 5.3), "dazed"], [tl("L12", 6.6), "smile"]]);
    const settle = smooth(seg(t, AIR1 - 0.6, AIR1 + 0.6));
    pip(cam, out, t, TUN[0] + 0.15 * Math.sin(t * 0.9), 0.15 * Math.sin(t * 1.3), TUN[2], e, { mode: t > AIR1 ? "sit" : "fall", face: true, roll: 0.15 * Math.sin(t * 0.7) * (1 - settle), swaps: [tl("L12", 3.0), tl("L12", 5.3)] });
    if (t < AIR1 + 0.3) { const a = (t - AIR0) * 9; card(out, `clock${q(a % (Math.PI * 2), 24)}`, (p) => clock(p, a), TUN[0] - 1.1, 2.1, TUN[2] + 0.6, 0.7, 0.7, { cw: 300, ch: 300 }); }
    if (t > AIR1) card(out, `zzz${q(t % 1, 10)}`, (p) => fxStars(p, (t * 0.5) % 1), TUN[0], 2.7, TUN[2], 0.9, 0.6, { cw: 400, ch: 300 });
  }
  if (id === 13) {
    pip(cam, out, t, -4.4, 0, 1.6, exprAt(t, [[0, "smile"], [tl("L13", 1.3), "lick"]]), { prop: "icecream", swaps: [tl("L13", 1.3)] });
    blob(cam, out, -4.4, 0, 1.6, PIP_S);
    if (t > tl("L13", 1.3)) card(out, `burst${q(seg(t, tl("L13", 1.3), tl("L13", 1.8)), 20)}`, (p) => fxBurst(p, seg(t, tl("L13", 1.3), tl("L13", 1.8))), -4.4, 2.1, 1.7, 1.2, 1.2, { cw: 500, ch: 500, soft: true });
  }
  void f; void glide; void clamp01; void hh;
};

export const EPISODE: Episode = {
  id: "tunnel", total: TOTAL, shots: SHOTS, xfade: XFADE, flashAt: FLASH_AT, cams: CAMS, kicks: KICKS, dof: DOF,
  build: buildSet, stage,
};
