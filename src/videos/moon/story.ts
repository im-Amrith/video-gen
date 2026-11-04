// "What If the Moon Disappeared?" (What If ep. 5) — shot plan, camera, lens, cast.
import TL from "./timeline.json";
import { Episode, Key, Dof, V3, ShotDef, FPS, dolly, orbit, pushK, smooth, seg, q, lerp } from "../toon/core";
import { Stage, CamInfo, card } from "../toon/cast";
import { fxBang, fxWhat, fxSweat, fxSparkle } from "../toon/fx";
import { fxPuff, fxStars } from "../toon/toon";
import { pip, exprAt, calendarCard, sunCard } from "../toon/kit";
import { crab, hourglass } from "../toon/animals";
import { buildSet } from "./set";

export const TOTAL = TL.total;
const L = TL.lines as Record<string, { t0: number; t1: number }>;
const tl = (id: string, d = 0) => L[id].t0 + d;

export const SPACE: V3 = [3000, 0, 0], REEF: V3 = [-3000, 0, 0], GR = 6;
export const POP1 = tl("L01", 1.3);          // the Moon pops out of the beach sky
export const POP3 = tl("L03", 0.4);          // ...and out of space
export const CAL = tl("L05", 4.0);           // "lose their calendar"
export const BONK = tl("L08", 2.9);          // "Unluckily"
const BACK = tl("L09", 0.2);                 // the Moon is back
/** Moon scale: 1 = there, 0 = gone */
export const moonOn = (t: number) => (t < POP1 ? 1 : t < tl("L02", 0) ? 0 : t < POP3 ? 1 : t < BACK ? 0 : smooth(seg(t, BACK, BACK + 0.6)));
export const tideAt = (id: number, t: number) => (id === 1 ? lerp(0.3, -0.9, smooth(seg(t, POP1 + 0.4, POP1 + 2.5))) : id === 4 ? -0.9 : -0.4);
export const poolAt = (id: number, t: number) => (id === 4 ? 1 - smooth(seg(t, tl("L04", 0.2), tl("L04", 2.4))) : id === 1 ? 1 : 0.3);
/** axial tilt (rad): gentle 22.1-24.5 deg wobble with the Moon, wild swings (to ~85 deg) without it */
export const tiltAt = (t: number) => {
  const d = (x: number) => (x * Math.PI) / 180;
  if (t < tl("L07", 0)) return d(23.3 + 1.2 * Math.sin(t * 2.2));
  const u = seg(t, tl("L07", 0), tl("L07", 4.6));
  return d(lerp(23.3, 42, u) + lerp(1.2, 43, u) * Math.sin((t - tl("L07", 0)) * 3.2));
};

export const SHOTS: ShotDef[] = [
  { id: 1, a: 0, b: 162, light: "night", sunAz: 30, sunEl: 25 },
  { id: 2, a: 162, b: 371, light: "space", sunAz: 90, sunEl: 20 },
  { id: 3, a: 371, b: 516, light: "space", sunAz: 90, sunEl: 20 },
  { id: 4, a: 516, b: 625, light: "day", sunAz: 120, sunEl: 45 },
  { id: 5, a: 625, b: 811, light: "night", sunAz: 60, sunEl: 60 },
  { id: 6, a: 811, b: 1047, light: "space", sunAz: 100, sunEl: 15 },
  { id: 7, a: 1047, b: 1219, light: "space", sunAz: 100, sunEl: 15 },
  { id: 8, a: 1219, b: 1417, light: "day", sunAz: 140, sunEl: 40 },
  { id: 9, a: 1417, b: TOTAL, light: "night", sunAz: 30, sunEl: 25 },
];
export const XFADE: Record<number, number> = { 2: 6, 4: 6, 5: 8, 6: 8, 8: 8, 9: 10 };
export const FLASH_AT = [Math.round(POP1 * FPS)];
const KICKS: [number, number][] = [[POP1, 0.8], [POP3, 0.7], [tl("L07", 0.3), 0.6], [BONK, 0.9]];

const C = (base: V3, d: V3): V3 => [base[0] + d[0], base[1] + d[1], base[2] + d[2]];
const PB: V3 = [0.5, 0, 9.5];
export const CAMS: Record<number, Key[]> = {
  1: [
    { f: 0, s: (f) => dolly([0.9, 1.5, 3.6], [0.2, 3.6, 30], pushK(f, 0, 0.0025), { fov: 48 }) }, // Pip, the sea, the big Moon
    { f: 70, cut: true, s: (f) => dolly([-0.4, 1.3, 6.4], [0.6, 1.2, 12], pushK(f, 70, 0.004, 0.008, 30), { fov: 44, roll: -0.04 }) }, // the tide slips away
    { f: 118, dur: 30, s: (f) => dolly([-1, 0.6, 15], [2, 0.2, 30], pushK(f, 118, 0.002), { fov: 44 }) }, // look at the sea
  ],
  2: [
    { f: 162, s: (f) => orbit(SPACE, 34, 0.4 + 0.003 * (f - 162), 8, { fov: 46 }) }, // bulge toward the Moon, Earth spins under it
    { f: 270, dur: 36, s: (f) => orbit(SPACE, 26, 0.9 + 0.003 * (f - 270), 3, { fov: 44, roll: 0.05 }) },
  ],
  3: [{ f: 371, s: (f) => orbit(SPACE, 30, 1.4 + 0.002 * (f - 371), 6, { fov: 44 }) }],
  4: [
    { f: 516, s: (f) => dolly([1.4, 1.5, 13.5], [-0.5, 0.4, 6.5], pushK(f, 516, 0.003), { fov: 42 }) }, // rock pools dry up
    { f: 570, cut: true, s: (f) => dolly([1.0, 1.25, 13.0], [0.5, 1.1, 9.5], pushK(f, 570, 0.004, 0.008, 24), { fov: 38, roll: 0.05 }) }, // boring
  ],
  5: [
    { f: 625, s: (f) => dolly(C(REEF, [2, 2.5, 12]), C(REEF, [0, 1.2, -1]), pushK(f, 625, 0.0025), { fov: 46 }) },
    { f: 720, dur: 34, s: (f) => dolly(C(REEF, [0.5, 2.4, 8.5]), C(REEF, [0, 1.0, 0]), pushK(f, 720, 0.003), { fov: 42, roll: -0.04 }) },
  ],
  6: [
    { f: 811, s: (f) => dolly(C(SPACE, [6, 3, 28]), C(SPACE, [0, 0, 0]), pushK(f, 811, 0.002), { fov: 44 }) }, // the tilted axis, steady
    { f: 940, dur: 36, s: (f) => dolly(C(SPACE, [3, 9.5, 16]), C(SPACE, [0, 7.5, 0]), pushK(f, 940, 0.003), { fov: 42, roll: 0.05 }) },
  ],
  7: [
    { f: 1047, s: (f) => dolly(C(SPACE, [5, 4, 30]), C(SPACE, [0, 1, 0]), pushK(f, 1047, 0.002), { fov: 46, roll: -0.05 }) }, // wild swings
    { f: 1130, cut: true, s: (f) => dolly(C(SPACE, [2.5, 10, 14]), C(SPACE, [0, 7.5, 0]), pushK(f, 1130, 0.003), { fov: 44, roll: 0.08 }) }, // Pip hanging on
  ],
  8: [
    { f: 1219, s: (f) => dolly([1.5, 1.4, 14], [0.5, 1.1, 9.5], pushK(f, 1219, 0.003), { fov: 40 }) },
    { f: 1320, cut: true, s: (f) => dolly([0.8, 1.2, 12.6], [0.5, 1.2, 9.5], pushK(f, 1320, 0.004), { fov: 38, roll: 0.06 }) }, // bonkers
  ],
  9: [
    { f: 1417, s: (f) => dolly([0.9, 1.5, 3.6], [0.2, 3.6, 30], pushK(f, 1417, 0.002), { fov: 48 }) }, // thanks, Moon
    { f: 1530, dur: 40, s: (f) => dolly([1.2, 1.0, 1.4], [0.3, 7, 40], pushK(f, 1530, 0.0015), { fov: 50, roll: 0.03 }) },
  ],
};
export const DOF: Dof[] = [
  { f: 0, cInf: 6 }, { f: 70, cInf: 12 }, { f: 118, dur: 30, cInf: 4 }, { f: 162, cInf: 0 },
  { f: 516, cInf: 8 }, { f: 570, cInf: 13 }, { f: 625, cInf: 4 }, { f: 720, dur: 34, cInf: 10 },
  { f: 811, cInf: 0 }, { f: 1219, cInf: 10 }, { f: 1320, cInf: 13 }, { f: 1417, cInf: 6, focus: () => [0.5, 1.6, 9.5] }, { f: 1530, dur: 40, cInf: 2, focus: () => [0.5, 1.6, 9.5] },
];

const stage = (id: number, t: number, cam: CamInfo, out: Stage) => {
  if (id === 1 || id === 4 || id === 8 || id === 9) {
    let e = exprAt(t, [[0, "smile"], [POP1, "shock"], [tl("L01", 3.0), "nervous"]]);
    if (id === 4) e = exprAt(t, [[0, "neutral"], [tl("L04", 1.6), "dazed"]]);
    if (id === 8) e = t < BONK ? "smile_closed" : (Math.floor(t / 0.4) % 2 === 0 ? "pained" : "shock");
    if (id === 9) e = exprAt(t, [[0, "smile"], [tl("L09", 1.6), "grin"]]);
    pip(cam, out, t, PB[0], 0, PB[2], e, { mode: id === 8 && t < BONK ? "sit" : "stand", wave: id === 9 && t > tl("L09", 0.8) ? q(Math.sin(t * 8), 20) : undefined, look: id === 1 ? -1 : 0 });
    if (id === 1 && t > POP1 && t < POP1 + 0.6) { const u = q(seg(t, POP1, POP1 + 0.6), 20); card(out, `puff1${u}`, (p) => fxPuff(p, u), 40, 140, 420, 70, 70, { soft: true }); }
    if (id === 1 && t > POP1 && t < POP1 + 0.9) card(out, "bang1", (p) => fxBang(p), PB[0] + 0.2, 2.6, PB[2], 0.4, 0.6, { cw: 200, ch: 300 });
    if (id === 4) card(out, `crab${t > tl("L04", 1.0) ? 1 : 0}${q(Math.sin(t * 6), 4)}`, (p) => crab(p, t > tl("L04", 1.0), t * 6), -1.6, 0.3, 6.5, 0.8, 0.6, { cw: 400, ch: 300 });
    if (id === 8 && t < BONK) card(out, `hg8${q(seg(t, tl("L08", 0.3), BONK), 10)}`, (p) => hourglass(p, seg(t, tl("L08", 0.3), BONK)), PB[0] + 1.2, 1.4, PB[2] + 0.2, 0.6, 0.8, { cw: 300, ch: 400 });
    if (id === 8 && t > BONK) {
      const flip = Math.floor(t / 0.4) % 2 === 0;
      if (!flip) card(out, `sun8${q(t % 1, 6)}`, (p) => sunCard(p, t), PB[0] - 0.8, 3.0, PB[2] - 1.5, 1.2, 1.2, { cw: 300, ch: 300 });
      if (!flip) card(out, `sw8${q((t * 2) % 1, 8)}`, (p) => fxSweat(p), PB[0] + 0.45, 2.1, PB[2] + 0.2, 0.2, 0.3, { cw: 120, ch: 180 });
      card(out, `cal8${Math.floor(t / 0.2) % 12}`, (p) => calendarCard(p, Math.floor(t / 0.2) % 12, flip ? "#3f6fb5" : "#e2453c"), PB[0] + 1.25, 1.7, PB[2] + 0.4, 0.8, 0.8, { cw: 300, ch: 300 });
    }
    if (id === 9 && t > tl("L09", 2.4)) for (let k = 0; k < 4; k++) card(out, `spk9${k}`, (p) => fxSparkle(p), PB[0] - 1.6 + k * 1.0, 3.2 + 0.3 * Math.sin(t * 3 + k), PB[2] - 2, 0.25, 0.25, { cw: 200, ch: 200 });
  }
  if (id === 3 && t > POP3 && t < POP3 + 0.6) { const ma = 0.3 + t * 0.15, u = q(seg(t, POP3, POP3 + 0.6), 20); card(out, `puff3${u}`, (p) => fxPuff(p, u), SPACE[0] + Math.cos(ma) * 22, 1, SPACE[2] + Math.sin(ma) * 22, 6, 6, { soft: true }); }
  if (id === 5 && t > CAL) {
    for (let k = 0; k < 3; k++) card(out, `what5${k}`, (p) => fxWhat(p), REEF[0] - 2 + k * 2, 1.9 + 0.1 * Math.sin(t * 4 + k), REEF[2] + 0.5 * k, 0.35, 0.52, { cw: 200, ch: 300 });
    card(out, "cal5", (p) => calendarCard(p, 0, "#b06af0"), REEF[0] + 1.6, 2.6, REEF[2] + 1.2, 0.7, 0.7, { cw: 300, ch: 300 });
  }
  if (id === 7 && cam) {
    // Pip clinging to the top of the axis as it swings
    const tilt = tiltAt(t), top: V3 = [SPACE[0] - Math.sin(tilt) * (GR * 1.4 + 0.3), SPACE[1] + Math.cos(tilt) * (GR * 1.4 + 0.3) - 1.4, SPACE[2]];
    pip(cam, out, t, top[0], top[1], top[2] + 0.3, t < tl("L07", 1.6) ? "nervous" : "shock", { mode: "fall", face: true, roll: tilt * 0.8, noBlob: true, scale: 1.1 });
  }
  void fxStars;
};

export const EPISODE: Episode = { id: "moon", total: TOTAL, shots: SHOTS, xfade: XFADE, flashAt: FLASH_AT, cams: CAMS, kicks: KICKS, dof: DOF, build: buildSet, stage };
