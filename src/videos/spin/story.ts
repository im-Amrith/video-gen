// "What If the Earth Stopped Spinning?" (What If ep. 2) — shot plan, camera, lens, cast.
import TL from "./timeline.json";
import { Episode, Key, Dof, V3, ShotDef, FPS, dolly, zoom, orbit, pushK, smooth, seg, q, hh, lerp } from "../toon/core";
import { Stage, CamInfo, card } from "../toon/cast";
import { fxSpeed, fxBang, fxWhat, fxImpact, fxSweat, fxSparkle } from "../toon/fx";
import { fxSplash, fxStars, fxPuff } from "../toon/toon";
import { pip, put, exprAt, FOLK, clockCard, alarmCard, calendarCard, sunCard } from "../toon/kit";
import { buildSet } from "./set";

export const TOTAL = TL.total;
const L = TL.lines as Record<string, { t0: number; t1: number }>;
const tl = (id: string, d = 0) => L[id].t0 + d;

// ---------------- places + story functions ----------------
export const SPACE: V3 = [3000, 0, 0], FLOOD: V3 = [0, 0, -3000], PRE: V3 = [-3000, 0, 0];
export const GR = 6, MOON = 26;
const STOP = tl("L01", 5.2);          // "...stopped?"
const EAST = tl("L02", 2.6);          // "keeps going east"
const HOUSE = tl("L02", 4.3);         // "your house"
const OCEAN = tl("L02", 5.3);         // "and the ocean"
const BRAKE = tl("L03", 3.4);         // "slow it down gently"
/** globe spin angle: fast in the hook (stops dead on "stopped"), spins again for "Luckily", brakes gently, then still */
export const spinAt = (t: number) => {
  if (t < STOP) return t * 2.2;
  const t0 = tl("L03", 0);
  if (t < t0) return STOP * 2.2;
  let a = STOP * 2.2;
  const n = 60, dt = (t - t0) / n;
  for (let i = 0; i < n; i++) { const u = t0 + (i + 0.5) * dt; a += 2.2 * (1 - smooth(seg(u, BRAKE, BRAKE + 4))) * dt; }
  return a;
};
export const oceanAt = (t: number) => smooth(seg(t, tl("L05", 1.6), tl("L05", 4.4)));
export const bulgeAt = (t: number) => (t < tl("L05", 1.2) ? 0.08 : 0.08 * (1 - smooth(seg(t, tl("L05", 1.2), tl("L05", 2.4)))));
export const brakeAt = (t: number) => smooth(seg(t, BRAKE - 0.5, BRAKE + 0.2));
export const houseSlide = (t: number) => seg(t, HOUSE - 0.1, HOUSE + 1.4);

// ---------------- shots ----------------
export const SHOTS: ShotDef[] = [
  { id: 1, a: 0, b: 216, light: "space", sunAz: 110, sunEl: 25 },
  { id: 2, a: 216, b: 410, light: "day", sunAz: 120, sunEl: 40 },
  { id: 3, a: 410, b: 584, light: "space", sunAz: 100, sunEl: 20 },
  { id: 4, a: 584, b: 750, light: "space", sunAz: 90, sunEl: 25 },
  { id: 5, a: 750, b: 890, light: "space", sunAz: 90, sunEl: 25 },
  { id: 6, a: 890, b: 1015, light: "day", sunAz: 120, sunEl: 35 },
  { id: 7, a: 1015, b: 1160, light: "space", sunAz: 80, sunEl: 25 },
  { id: 8, a: 1160, b: 1262, light: "day", sunAz: 160, sunEl: 60 },
  { id: 9, a: 1262, b: 1352, light: "night", sunAz: 60, sunEl: 40 },
  { id: 10, a: 1352, b: 1436, light: "night", sunAz: 60, sunEl: 40 },
  { id: 11, a: 1436, b: 1572, light: "space", sunAz: 100, sunEl: 20 },
  { id: 12, a: 1572, b: 1712, light: "golden", sunAz: 10, sunEl: 8 },
  { id: 13, a: 1712, b: TOTAL, light: "golden", sunAz: 30, sunEl: 10 },
];
export const XFADE: Record<number, number> = { 6: 6, 8: 6, 9: 10, 12: 8, 13: 8 };
export const FLASH_AT = [Math.round(STOP * FPS) + 2];
const KICKS: [number, number][] = [[STOP, 1.2], [EAST, 1.0], [HOUSE, 0.7], [OCEAN, 1.2], [BRAKE, 0.6], [tl("L10", 3.0), 0.5]];

// ---------------- camera ----------------
const C = (base: V3, d: V3): V3 => [base[0] + d[0], base[1] + d[1], base[2] + d[2]];
const TOP: V3 = C(SPACE, [0, GR, 0]);
const PIP_T: V3 = [-2, 0, 1.5], FOLKS: V3[] = [[2.5, 0, 2.6], [-6.5, 0, -2.0]];
const moonAt = (t: number): V3 => { const ma = 0.4 + t * 0.12; return [SPACE[0] + Math.cos(ma) * MOON, SPACE[1] + 1.5, SPACE[2] + Math.sin(ma) * MOON]; };
const moonCam = (f: number, back: number, up: number, roll: number) => {
  const m = moonAt(f / FPS), dx = m[0] - SPACE[0], dz = m[2] - SPACE[2], d = Math.hypot(dx, dz);
  return dolly([m[0] + (dx / d) * back + (-dz / d) * 2.5, m[1] + up + 1.4, m[2] + (dz / d) * back + (dx / d) * 2.5], [SPACE[0], SPACE[1] + 1, SPACE[2]], 1, { fov: 40, roll });
};
export const CAMS: Record<number, Key[]> = {
  1: [
    { f: 0, s: (f) => dolly(C(TOP, [2.2, 1.6, 3.6]), C(TOP, [0, 1.2, 0]), pushK(f, 0, 0.003), { fov: 46, roll: -0.08 }) }, // Pip on a tiny spinning planet
    { f: 70, dur: 40, s: (f) => orbit(C(SPACE, [0, 3, 0]), 17, 0.4 + 0.004 * (f - 70), 5, { fov: 50, roll: 0.05 }) }, // pull back: the whole little world
    { f: 150, cut: true, s: (f) => dolly(C(TOP, [0.8, 1.5, 2.5]), C(TOP, [0, 1.35, 0]), pushK(f, 150, 0.003, 0.008, 30), { fov: 40 }) }, // "...stopped?"
  ],
  2: [
    { f: 216, s: (f) => zoom([-14, 3.2, 5], [6, 1.5, -2], 46, pushK(f, 216, 0.002)) }, // the street
    { f: 296, cut: true, s: (f) => dolly([6, 1.2, 6.5], [0, 1.4, 1.5], pushK(f, 296, 0.003), { fov: 52, roll: 0.08 }) }, // everyone flies past, east
    { f: 345, cut: true, s: (f) => dolly([-8, 3, 4], [10, 3, -10.5], pushK(f, 345, 0.002), { fov: 46 }) }, // your house
    { f: 385, cut: true, s: (f) => dolly([-4, 2.2, 8], [4, 3.5, -2], pushK(f, 385, 0.003), { fov: 56, roll: -0.08 }) }, // and the ocean
  ],
  3: [
    { f: 410, s: (f) => orbit(C(SPACE, [0, 1, 0]), 32, -0.3 + 0.003 * (f - 410), 5, { fov: 46 }) },
    { f: 505, dur: 30, s: (f) => dolly(C(SPACE, [GR + 4, 3.5, 14]), C(SPACE, [GR + 1.5, 1.0, 0]), pushK(f, 505, 0.0025), { fov: 44, roll: 0.05 }) }, // the brake
  ],
  4: [
    { f: 584, s: (f) => dolly(C(SPACE, [0, 1.5, 21]), C(SPACE, [0, 0.5, 0]), pushK(f, 584, 0.002), { fov: 42 }) }, // side on: the fat middle
    { f: 668, cut: true, s: (f) => dolly(C(SPACE, [3.6, 0.6, GR + 3.2]), C(SPACE, [1.6, 0.2, GR - 0.4]), pushK(f, 668, 0.003), { fov: 40, roll: -0.05 }) }, // Pip with the tape
  ],
  5: [
    { f: 750, s: (f) => orbit(C(SPACE, [0, 0, 0]), 31, 0.9 + 0.005 * (f - 750), 10 - 0.05 * (f - 750), { fov: 44 }) }, // oceans slide to the poles
  ],
  6: [
    { f: 890, s: (f) => dolly(C(FLOOD, [2.0, 1.8, 7.5]), C(FLOOD, [0.3, 1.6, -4]), pushK(f, 890, 0.0025), { fov: 46 }) },
    { f: 952, dur: 30, s: (f) => dolly(C(FLOOD, [-2, 0.9, 4]), C(FLOOD, [0, 1.3, 0]), pushK(f, 952, 0.003), { fov: 40, roll: 0.05 }) },
  ],
  7: [
    { f: 1015, s: (f) => orbit(C(SPACE, [0, 0, 0]), 30, 2.0 + 0.006 * (f - 1015), 3, { fov: 46, roll: 0.06 }) }, // the ring continent
  ],
  8: [
    { f: 1160, s: (f) => dolly([-3.5, 1.4, 6.5], [-2, 1.3, 1.5], pushK(f, 1160, 0.003), { fov: 42 }) }, // six months of day
    { f: 1215, dur: 26, s: (f) => dolly([-1.2, 1.3, 4.6], [-2, 1.4, 1.5], pushK(f, 1215, 0.003), { fov: 40, roll: 0.05 }) },
  ],
  9: [
    { f: 1262, s: (f) => dolly([-3.0, 1.6, 6.8], [-2, 1.3, 1.5], pushK(f, 1262, 0.003), { fov: 44, roll: -0.04 }) }, // six months of night
  ],
  10: [
    { f: 1352, s: (f) => dolly([-0.9, 1.8, 5.6], [-1.5, 1.6, 1.5], pushK(f, 1352, 0.004, 0.008, 30), { fov: 40 }) }, // the alarm clock
  ],
  11: [
    { f: 1436, s: (f) => moonCam(f, 13, 4.5, 0) }, // over the Moon (Pip waving) at the Earth behind
    { f: 1505, dur: 34, s: (f) => moonCam(f, 7.5, 2.2, 0.06) },
  ],
  12: [
    { f: 1572, s: (f) => zoom(C(PRE, [4, 2.2, 12]), C(PRE, [-2, 4, -20]), 50, pushK(f, 1572, 0.002)) }, // 1.4 billion years ago
    { f: 1640, cut: true, s: (f) => dolly(C(PRE, [1.6, 1.3, 5.0]), C(PRE, [0, 1.4, 1]), pushK(f, 1640, 0.003), { fov: 40, roll: -0.05 }) },
  ],
  13: [
    { f: 1712, s: (f) => dolly([-3.0, 1.4, 6.2], [-2, 1.3, 1.5], pushK(f, 1712, 0.002), { fov: 42 }) },
    { f: 1770, dur: 30, s: (f) => dolly([-1.6, 1.25, 4.4], [-2, 1.4, 1.5], pushK(f, 1770, 0.003), { fov: 38, roll: 0.04 }) },
  ],
};

export const DOF: Dof[] = [
  { f: 0, cInf: 12 }, { f: 70, dur: 40, cInf: 0 }, { f: 150, cInf: 13 },
  { f: 216, cInf: 0 }, { f: 296, cInf: 10 }, { f: 345, cInf: 0 }, { f: 385, cInf: 8 },
  { f: 410, cInf: 0 }, { f: 505, dur: 30, cInf: 6 },
  { f: 584, cInf: 0 }, { f: 668, cInf: 12 },
  { f: 750, cInf: 0 },
  { f: 890, cInf: 6 }, { f: 952, dur: 30, cInf: 12 },
  { f: 1015, cInf: 0 },
  { f: 1160, cInf: 10 }, { f: 1262, cInf: 10 }, { f: 1352, cInf: 14 },
  { f: 1436, cInf: 0 },
  { f: 1572, cInf: 4 }, { f: 1640, cInf: 12 },
  { f: 1712, cInf: 10 }, { f: 1770, dur: 30, cInf: 13 },
];

// ---------------- cast ----------------
const stage = (id: number, t: number, cam: CamInfo, out: Stage) => {
  if (id === 1 || id === 3 || id === 4 || id === 5 || id === 7) {
    // Pip rides the little planet: on top (1, 3, 5), at the equator with the tape (4), strolling the equator (7)
    if (id === 4) pip(cam, out, t, SPACE[0] + 1.6, -0.2, SPACE[2] + GR + 0.45, exprAt(t, [[0, "smile"], [tl("L04", 3.0), "grin"]]), { wave: q(Math.sin(t * 6), 20) * 0.5, noBlob: true });
    else if (id === 7) { /* wide orbit only: the ring continent is the star */ }
    else {
      const stopped = id === 1 && t > STOP;
      const e = id === 1 ? exprAt(t, [[0, "laugh"], [tl("L01", 3.0), "grin"], [STOP, "shock"]]) : id === 3 ? exprAt(t, [[0, "relief"], [tl("L03", 2.4), "nervous"], [BRAKE, "grin"]]) : exprAt(t, [[0, "neutral"], [tl("L05", 1.8), "shock"]]);
      const tilt = id === 1 && !stopped ? -8 : stopped ? 18 * Math.max(0, 1 - (t - STOP) * 2) : 0;
      pip(cam, out, t, SPACE[0], GR - 0.05, SPACE[2], e, { tilt, swaps: [STOP], noBlob: true, wave: id === 3 && t > BRAKE ? q(Math.sin(t * 8), 20) : undefined });
      if (id === 1 && !stopped) card(out, `spd1${q((t * 2) % 1, 12)}`, (p) => fxSpeed(p, (t * 2) % 1), SPACE[0] - 1.4, GR + 1.2, SPACE[2], 1.0, 2.0, { cw: 400, ch: 800, soft: true, rot: Math.PI / 2 });
      if (stopped && t < STOP + 0.8) card(out, "bang1", (p) => fxBang(p), SPACE[0] + 0.5, GR + 3.0, SPACE[2], 0.5, 0.75, { cw: 200, ch: 300 });
    }
  }
  if (id === 2) {
    // a normal street... then everything flies east (+x)
    const fly = (t0: number, i: number) => { const u = Math.max(0, t - t0); return { dx: u * u * 9 + u * 6, dy: Math.min(1.6, u * 3) - Math.max(0, u - 0.6) * 1.5 }; };
    const pd = fly(EAST, 0);
    const pe = t < EAST ? exprAt(t, [[0, "smile"], [tl("L02", 1.0), "nervous"]]) : "shock";
    pip(cam, out, t, PIP_T[0] + pd.dx, pd.dy, PIP_T[2], pe, { mode: t > EAST ? "fall" : "stand", tilt: t > EAST ? 30 : 0, noBlob: t > EAST, swaps: [EAST] });
    FOLKS.forEach((p, i) => {
      const d = fly(EAST + 0.12 * (i + 1), i + 1);
      put(cam, out, { i: 30 + i, o: FOLK[i], okey: `fk${i}` }, t, p[0] + d.dx, d.dy, p[2], t > EAST ? "shock" : "smile", { mode: t > EAST ? "fall" : "stand", tilt: t > EAST ? 25 : 0, noBlob: t > EAST });
    });
    if (t > EAST && t < EAST + 1.5) for (let k = 0; k < 3; k++) card(out, `spd2${k}${q((t * 3 + k * 0.3) % 1, 12)}`, (p) => fxSpeed(p, (t * 3 + k * 0.3) % 1), 1 + k * 2, 1.6, 1.5 + k, 1.4, 2.8, { cw: 400, ch: 800, soft: true, rot: Math.PI / 2 });
    if (t > OCEAN) { const u = q(seg(t, OCEAN, OCEAN + 1.1), 30); card(out, `splash${u}`, (p) => fxSplash(p, u), 1.5, 2.6, -3, 14, 14, { cw: 800, ch: 800 }); }
  }
  if (id === 6) put(cam, out, { i: 1, o: { jacket: "#f2b531", pants: "#3b5b9a", boots: "#e2453c", hat: "cap", cap: "#e2453c", build: "kid" }, okey: "pip" }, t, FLOOD[0], 0.2 + 0.12 * Math.sin(t * 2.2), FLOOD[2] + 0.3,
    exprAt(t, [[0, "nervous"], [tl("L06", 2.0), "dazed"]]), { mode: "sit", scale: 1.25, noBlob: true });
  if (id === 8 || id === 9 || id === 10 || id === 13) {
    const night = id === 9 || id === 10;
    const e = id === 8 ? exprAt(t, [[0, "smile"], [tl("L08", 3.2), "pained"]]) : id === 9 ? "dazed" : id === 10 ? exprAt(t, [[0, "dazed"], [tl("L09", 0.9), "shock"]]) : exprAt(t, [[0, "neutral"], [tl("L12", 1.4), "smile_closed"]]);
    pip(cam, out, t, PIP_T[0], 0, PIP_T[2], e, { mode: id === 13 ? "stand" : "sit" });
    if (id === 8) {
      card(out, `cal${Math.min(6, Math.floor(seg(t, tl("L08", 2.2), tl("L08", 4.6)) * 7))}`, (p) => calendarCard(p, Math.min(6, Math.floor(seg(t, tl("L08", 2.2), tl("L08", 4.6)) * 7))), PIP_T[0] + 1.25, 1.7, PIP_T[2] + 0.4, 0.8, 0.8, { cw: 300, ch: 300 });
      card(out, `sun${q(t % 1, 8)}`, (p) => sunCard(p, t), PIP_T[0] - 1.0, 3.2, PIP_T[2] - 1.5, 1.2, 1.2, { cw: 300, ch: 300 });
      if (t > tl("L08", 3.2)) card(out, `sweat${q((t * 2) % 1, 10)}`, (p) => fxSweat(p), PIP_T[0] + 0.45, 2.0 - ((t * 1.2) % 0.5), PIP_T[2] + 0.2, 0.2, 0.3, { cw: 120, ch: 180 });
    }
    if (night) card(out, `cal${6 + Math.min(6, Math.floor(seg(t, tl("L08", 4.7), tl("L08", 6.0)) * 7))}`, (p) => calendarCard(p, 6 + Math.min(6, Math.floor(seg(t, tl("L08", 4.7), tl("L08", 6.0)) * 7)), "#3f6fb5"), PIP_T[0] + 1.25, 1.7, PIP_T[2] + 0.4, 0.8, 0.8, { cw: 300, ch: 300 });
    if (id === 10) {
      const ring = t > tl("L09", 0.5) ? (t * 3) % 1 : 0;
      card(out, `alarm${q(ring, 12)}`, (p) => alarmCard(p, ring), PIP_T[0] + 0.9, 1.5, PIP_T[2] + 0.8, 0.75, 0.85, { cw: 300, ch: 340 });
      if (t > tl("L09", 0.9)) card(out, "what10", (p) => fxWhat(p), PIP_T[0] - 0.1, 2.75, PIP_T[2], 0.4, 0.6, { cw: 200, ch: 300 });
    }
    if (id === 13) { const a = (t - tl("L12", 0)) * 6; card(out, `clk${q(a % (Math.PI * 2), 24)}`, (p) => clockCard(p, a), PIP_T[0] + 1.2, 2.0, PIP_T[2] + 0.3, 0.7, 0.7, { cw: 300, ch: 300 }); }
    if (id === 9) card(out, `zz${q(t % 1, 10)}`, (p) => fxStars(p, (t * 0.5) % 1), PIP_T[0], 2.6, PIP_T[2], 0.9, 0.6, { cw: 400, ch: 300 });
  }
  if (id === 11) {
    // Pip sits on the Moon, waving; a squeal of brakes as the tide drags
    const [mx, , mz] = moonAt(t);
    pip(cam, out, t, mx, 1.5 + GR * 0.27 - 0.1, mz, exprAt(t, [[0, "smile"], [tl("L10", 3.0), "grin"]]), { mode: "sit", wave: q(Math.sin(t * 7), 20), noBlob: true, scale: 1.0 });
    if (t > tl("L10", 3.0) && t < tl("L10", 3.8)) card(out, `imp11${q(seg(t, tl("L10", 3.0), tl("L10", 3.5)), 20)}`, (p) => fxImpact(p, seg(t, tl("L10", 3.0), tl("L10", 3.5)), "#fff3b0", "#ffcf3a"), SPACE[0] + GR * 0.9, 1, SPACE[2] + GR * 0.5, 3, 3, { cw: 500, ch: 500 });
  }
  if (id === 12) {
    pip(cam, out, t, PRE[0], 0, PRE[2] + 1, exprAt(t, [[0, "shock"], [tl("L11", 2.6), "dazed"]]), { look: Math.sin(t * 3) > 0 ? 1 : -1 });
    const a = (t - tl("L11", 0)) * 10; card(out, `clk12${q(a % (Math.PI * 2), 24)}`, (p) => clockCard(p, a), PRE[0] + 1.3, 2.2, PRE[2] + 1.2, 0.8, 0.8, { cw: 300, ch: 300 });
    for (let k = 0; k < 3; k++) card(out, `spk12${k}`, (p) => fxSparkle(p), PRE[0] - 1.5 + k * 1.4, 2.8 + 0.3 * Math.sin(t * 3 + k), PRE[2] - 2, 0.25, 0.25, { cw: 200, ch: 200 });
  }
  void hh; void lerp; void fxPuff;
};

export const EPISODE: Episode = { id: "spin", total: TOTAL, shots: SHOTS, xfade: XFADE, flashAt: FLASH_AT, cams: CAMS, kicks: KICKS, dof: DOF, build: buildSet, stage };
