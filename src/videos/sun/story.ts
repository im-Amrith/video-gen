// "What If the Sun Vanished?" (What If ep. 4) — shot plan, camera, lens, cast.
import TL from "./timeline.json";
import { Episode, Key, Dof, V3, ShotDef, FPS, dolly, orbit, pushK, smooth, seg, q, lerp } from "../toon/core";
import { Stage, CamInfo, card } from "../toon/cast";
import { fxBang, fxWhat, fxSparkle } from "../toon/fx";
import { fxPuff, fxStars } from "../toon/toon";
import { pip, exprAt, thermoCard, sunCard, moonCard } from "../toon/kit";
import { fish, shrimp } from "../toon/animals";
import { buildSet } from "./set";

export const TOTAL = TL.total;
const L = TL.lines as Record<string, { t0: number; t1: number }>;
const tl = (id: string, d = 0) => L[id].t0 + d;

export const SPACE: V3 = [3000, 0, 0], SNOW: V3 = [0, 0, -3000], CUT: V3 = [-3000, 0, 0], VENT: V3 = [0, 0, 3000];
export const ORB = 42;
const VANISH = 1.6;                     // the Sun pops (story time); the light front reaches Earth at OUT
const OUT = tl("L04", 0.3);             // "lights out"
const FLY = tl("L05", 1.6);             // Earth leaves the orbit
export const sunGone = (t: number) => (t < tl("L02", 0) ? 0 : smooth(seg(t, tl("L02", 0), tl("L02", 0.6))));
/** radius of the darkness front around the Sun (it expands from "That's how long..." and reaches the orbit at OUT) */
export const frontR = (t: number) => (t < tl("L02", 0.6) ? 0 : ORB * ((t - tl("L02", 0.6)) / (OUT - tl("L02", 0.6))));
/** the Earth: on its circular orbit until FLY, then straight along the tangent */
export const earthAt = (t: number): V3 => {
  const w = 0.12, a = (u: number) => 0.3 + u * w;
  if (t < FLY) return [SPACE[0] + Math.cos(a(t)) * ORB, SPACE[1], SPACE[2] + Math.sin(a(t)) * ORB];
  const a0 = a(FLY), p: V3 = [SPACE[0] + Math.cos(a0) * ORB, SPACE[1], SPACE[2] + Math.sin(a0) * ORB], v = ORB * w, dt = t - FLY;
  return [p[0] - Math.sin(a0) * v * dt * 1.6, p[1], p[2] + Math.cos(a0) * v * dt * 1.6];
};
export const snowAt = (t: number) => smooth(seg(t, tl("L06", 1.0), tl("L06", 4.0)));

export const SHOTS: ShotDef[] = [
  { id: 1, a: 0, b: 170, light: "day", sunAz: 140, sunEl: 45 },
  { id: 2, a: 170, b: 336, light: "space", sunAz: 100, sunEl: 20 },
  { id: 3, a: 336, b: 466, light: "space", sunAz: 100, sunEl: 20 },
  { id: 4, a: 466, b: 604, light: "night", sunAz: 60, sunEl: 40 },
  { id: 5, a: 604, b: 786, light: "space", sunAz: 80, sunEl: 10 },
  { id: 6, a: 786, b: 904, light: "space", sunAz: 80, sunEl: 10 },
  { id: 7, a: 904, b: 1090, light: "night", sunAz: 60, sunEl: 40 },
  { id: 8, a: 1090, b: 1182, light: "night", sunAz: 60, sunEl: 40 },
  { id: 9, a: 1182, b: 1410, light: "night", sunAz: 80, sunEl: 50 },
  { id: 10, a: 1410, b: 1592, light: "night", sunAz: 60, sunEl: 40 },
  { id: 11, a: 1592, b: TOTAL, light: "night", sunAz: 60, sunEl: 40 },
];
export const XFADE: Record<number, number> = { 2: 6, 5: 6, 7: 8, 9: 8, 10: 10 };
export const FLASH_AT = [Math.round(OUT * FPS)];
const KICKS: [number, number][] = [[VANISH, 0.6], [OUT, 1.0], [FLY, 0.8], [tl("L07", 0.3), 0.6]];

const C = (base: V3, d: V3): V3 => [base[0] + d[0], base[1] + d[1], base[2] + d[2]];
const earthCam = (f: number, back: number, up: number, side: number, roll = 0) => {
  const e = earthAt(f / FPS), dx = e[0] - SPACE[0], dz = e[2] - SPACE[2], d = Math.hypot(dx, dz);
  return { pos: [e[0] + (dx / d) * back + (-dz / d) * side, e[1] + up, e[2] + (dz / d) * back + (dx / d) * side] as V3, look: [lerp(e[0], SPACE[0], 0.25), e[1], lerp(e[2], SPACE[2], 0.25)] as V3, fov: 46, roll };
};
export const CAMS: Record<number, Key[]> = {
  1: [
    { f: 0, s: (f) => dolly([1.6, 1.6, 6.5], [0.3, 1.6, -1.5], pushK(f, 0, 0.0025), { fov: 46 }) }, // Pip, deck chair, the Sun in the sky
    { f: 62, cut: true, s: (f) => dolly([0.5, 1.15, 2.8], [0, 1.15, 0.3], pushK(f, 62, 0.003), { fov: 40, roll: 0.04 }) }, // licking, no idea
    { f: 118, dur: 30, s: (f) => dolly([0.8, 1.2, 3.4], [-1.0, 7.0, -12], pushK(f, 118, 0.002), { fov: 46 }) }, // up at the empty sky... still bright
  ],
  2: [
    { f: 170, s: (f) => orbit(SPACE, 70, 0.5 + 0.003 * (f - 170), 22, { fov: 50 }) }, // the Sun pops; the darkness front spreads
    { f: 260, dur: 36, s: (f) => orbit(SPACE, 58, 0.9 + 0.003 * (f - 260), 8, { fov: 48, roll: 0.05 }) },
  ],
  3: [{ f: 336, s: (f) => earthCam(f, 14, 3 + 0.01 * (f - 336), 6 - 0.08 * (f - 336), -0.05) }], // Earth still circling nothing
  4: [
    { f: 466, s: (f) => dolly([1.4 - 0.025 * (f - 466), 1.4, 5.0], [0.2, 1.4, -0.5], pushK(f, 466, 0.003), { fov: 44 }) },
    { f: 530, cut: true, s: (f) => dolly([0.5 - 0.012 * (f - 530), 1.35, 2.7], [0.1, 1.3, 0.2], pushK(f, 530, 0.004, 0.009, 24), { fov: 38, roll: -0.05 }) }, // the moon goes dark
  ],
  5: [
    { f: 604, s: (f) => earthCam(f, 16, 4 - 0.02 * (f - 604), -8 + 0.06 * (f - 604), 0.04) },
    { f: 690, dur: 30, s: (f) => earthCam(f, 26, 10, 10, -0.06) }, // pull out: straight line, off the circle
  ],
  6: [{ f: 786, s: (f) => earthCam(f, 18 - 0.03 * (f - 786), 2 + 0.03 * (f - 786), 4 + 0.08 * (f - 786), 0.05) }], // the Moon tags along
  7: [
    { f: 904, s: (f) => dolly(C(SNOW, [1.5 - 0.03 * (f - 904), 1.6 + 0.008 * (f - 904), 9]), C(SNOW, [0, 1.4, 1]), pushK(f, 904, 0.0025), { fov: 44 }) },
    { f: 1000, dur: 30, s: (f) => dolly(C(SNOW, [0.8 + 0.012 * (f - 1000), 1.3, 4.5]), C(SNOW, [0, 1.5, 1]), pushK(f, 1000, 0.003), { fov: 40, roll: 0.04 }) },
  ],
  8: [{ f: 1090, s: (f) => dolly(C(SNOW, [-3 + 0.04 * (f - 1090), 2.5 + 0.03 * (f - 1090), 11]), C(SNOW, [0, 2, -4]), pushK(f, 1090, 0.004, 0.008, 30), { fov: 46 }) }], // frozen town
  9: [
    { f: 1182, s: (f) => dolly(C(CUT, [-0.03 * (f - 1182), 1.0 - 0.035 * (f - 1182), 26]), C(CUT, [0, -4.5, 0]), pushK(f, 1182, 0.0025), { fov: 46 }) }, // the cutaway
    { f: 1300, dur: 34, s: (f) => dolly(C(CUT, [3 - 0.04 * (f - 1300), -5, 12]), C(CUT, [0, -6, 0]), pushK(f, 1300, 0.003), { fov: 42, roll: 0.04 }) },
  ],
  10: [
    { f: 1410, s: (f) => dolly(C(VENT, [3 - 0.03 * (f - 1410), 6 - 0.03 * (f - 1410), 14]), C(VENT, [0, 2.5, -4]), pushK(f, 1410, 0.0025), { fov: 46 }) }, // vents
    { f: 1500, dur: 30, s: (f) => dolly(C(VENT, [1.0 + 0.02 * (f - 1500), 1.4, 8.5]), C(VENT, [0.2, 1.0, 2.9]), pushK(f, 1500, 0.003), { fov: 42, roll: -0.04 }) },
  ],
  11: [
    { f: 1592, s: (f) => dolly(C(VENT, [0.5, 1.2, 7.4]), C(VENT, [0.2, 1.0, 2.9]), pushK(f, 1592, 0.004, 0.009, 30), { fov: 40 }) }, // the shrimp, in shades
    { f: 1660, dur: 36, s: (f) => dolly(C(VENT, [2 - 0.02 * (f - 1660), 3 + 0.03 * (f - 1660), 10]), C(VENT, [0, 2, -2]), pushK(f, 1660, 0.002), { fov: 46, roll: 0.03 }) },
  ],
};
export const DOF: Dof[] = [
  { f: 0, cInf: 8 }, { f: 62, cInf: 13 }, { f: 118, dur: 30, cInf: 4 },
  { f: 170, cInf: 0 }, { f: 466, cInf: 10 }, { f: 530, cInf: 13 }, { f: 604, cInf: 0 },
  { f: 904, cInf: 6 }, { f: 1000, dur: 30, cInf: 12 }, { f: 1090, cInf: 0 }, { f: 1182, cInf: 0 },
  { f: 1410, cInf: 4 }, { f: 1500, dur: 30, cInf: 12 }, { f: 1592, cInf: 14 }, { f: 1660, dur: 36, cInf: 5 },
];

const SHRIMP: [number, number, number][] = [[-1.0, 0.4, 3.0], [0.5, 0.25, 3.3], [1.4, 0.7, 2.8], [-0.4, 1.2, 2.9], [0.8, 1.5, 2.6]];
const stage = (id: number, t: number, cam: CamInfo, out: Stage) => {
  if (id === 1 || id === 4) {
    const dark = id === 4;
    const e = dark ? exprAt(t, [[0, "shock"], [tl("L04", 2.0), "dazed"]]) : exprAt(t, [[0, "lick"], [tl("L01", 2.5), "smile_closed"], [tl("L01", 3.6), "lick"]]);
    pip(cam, out, t, 0, 0.32, 0.75, e, { mode: "sit", prop: dark ? null : "icecream", swaps: [OUT] });
    if (!dark && t < VANISH + 0.5) card(out, `sun1${q(t % 1, 6)}`, (p) => sunCard(p, t), -1.0, 7.5, -12, 4, 4, { cw: 300, ch: 300 });
    if (!dark && t >= VANISH && t < VANISH + 0.6) { const u = q(seg(t, VANISH, VANISH + 0.6), 20); card(out, `puff1${u}`, (p) => fxPuff(p, u), -1.0, 7.5, -12, 5, 5, { soft: true }); }
    if (dark) {
      const mk = seg(t, tl("L04", 1.3), tl("L04", 2.6));
      card(out, `moon4${q(mk, 6)}`, (p) => { moonCard(p); if (mk > 0) { p.g.globalAlpha = mk * 0.85; p.ell(150, 150, 118, 118, "#1a1d2e", 0); p.g.globalAlpha = 1; } }, -0.9, 3.0, -2.5, 1.0, 1.0, { cw: 300, ch: 300 });
      if (t < OUT + 0.9) card(out, "bang4", (p) => fxBang(p), 0.25, 2.6, 0.2, 0.4, 0.6, { cw: 200, ch: 300 });
      if (t > OUT + 0.3 && t < OUT + 1.5) card(out, `ic4${q(seg(t, OUT + 0.3, OUT + 1.5), 20)}`, (p) => { p.poly([[100, 160], [140, 280], [180, 160]], "#e0a860", 8); p.ell(140, 130, 50, 45, "#f6b6c8", 8); }, 0.3, 1.0 - 0.9 * seg(t, OUT + 0.3, OUT + 0.8), 0.6, 0.35, 0.35, { cw: 300, ch: 300 });
    }
  }
  if (id === 7 || id === 8) {
    const e = id === 7 ? exprAt(t, [[0, "smile"], [tl("L06", 2.4), "nervous"], [tl("L06", 4.2), "pained"]]) : "dazed";
    pip(cam, out, t, SNOW[0], 0, SNOW[2] + 1, e, { tilt: id === 8 ? 3 * Math.sin(t * 25) : 0 });
    if (id === 7) card(out, `th7${q(1 - seg(t, tl("L06", 2.0), tl("L06", 5.5)), 20)}`, (p) => thermoCard(p, 0.85 - 0.8 * seg(t, tl("L06", 2.0), tl("L06", 5.5)), "#3f8fe0"), SNOW[0] + 1.1, 2.0, SNOW[2] + 1.2, 0.5, 1.0, { cw: 300, ch: 600 });
    if (id === 8) card(out, `zz8${q(t % 1, 10)}`, (p) => fxStars(p, (t * 0.5) % 1, ), SNOW[0], 2.6, SNOW[2] + 1, 0.9, 0.6, { cw: 400, ch: 300 });
  }
  if (id === 9) {
    pip(cam, out, t, CUT[0] - 2, 0.6, CUT[2], exprAt(t, [[0, "nervous"], [tl("L08", 2.0), "smile"], [tl("L08", 4.0), "grin"]]), { mode: "stroll", phase: (t * 1.2) % 1, noBlob: true });
    for (let k = 0; k < 5; k++) { const x = CUT[0] - 8 + ((t * (0.8 + 0.2 * k) + k * 3.3) % 16); card(out, `fish9${k}${q(Math.sin(t * 6 + k), 4)}`, (p) => fish(p, ["#f08a2c", "#f2c230", "#7fc8f0", "#e2453c", "#8fe08a"][k], Math.sin(t * 6 + k)), x, -2.5 - k * 1.7, CUT[2] + (k % 2 ? 1 : -1) * 0.8, 1.6, 0.96, { cw: 400, ch: 240 }); }
  }
  if (id === 10 || id === 11) {
    const shades = id === 11;
    SHRIMP.forEach(([x, y, z], k) => {
      const bob = 0.15 * Math.sin(t * 3 + k), hop = shades ? Math.abs(Math.sin(t * 6 + k)) * 0.25 : 0;
      card(out, `shrimp${shades ? 1 : 0}${k % 2}${q(Math.sin(t * 6 + k), 4)}`, (p) => shrimp(p, shades, t * 6 + k), VENT[0] + x, y + bob + hop + 0.3, VENT[2] + z, 0.8, 0.6, { cw: 400, ch: 300, rot: shades ? 0.2 * Math.sin(t * 6 + k) : 0 });
    });
    if (shades) for (let k = 0; k < 6; k++) card(out, `spk11${k}`, (p) => fxSparkle(p, ["#ff6ad5", "#6af0ff", "#fff36a"][k % 3]), VENT[0] - 2 + k * 0.8, 1.6 + 0.6 * Math.sin(t * 4 + k), VENT[2] + 2.4, 0.3, 0.3, { cw: 200, ch: 200 });
    if (id === 11 && t > tl("L10", 1.6)) card(out, "what11", (p) => fxWhat(p), VENT[0] + 1.6, 2.1, VENT[2] + 2.7, 0.3, 0.45, { cw: 200, ch: 300 });
  }
};

export const EPISODE: Episode = { id: "sun", total: TOTAL, shots: SHOTS, xfade: XFADE, flashAt: FLASH_AT, cams: CAMS, kicks: KICKS, dof: DOF, build: buildSet, stage };
