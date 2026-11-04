// "The Tower That Started Falling Before It Was Finished" (History ep. 2) — shot plan, camera, lens, cast.
import TL from "./timeline.json";
import { Episode, Key, Dof, V3, ShotDef, FPS, dolly, zoom, orbit, pushK, smooth, seg, q, lerp } from "../toon/core";
import { Stage, CamInfo, card } from "../toon/cast";
import { fxBang, fxWhat, fxSparkle, fxImpact } from "../toon/fx";
import { fxStars, fxNote, Outfit } from "../toon/toon";
import { put, exprAt, FOLK, calendarCard, arrowCard } from "../toon/kit";
import { cat, gull, levelCard } from "../toon/animals";
import { buildSet } from "./set";

export const TOTAL = TL.total;
const L = TL.lines as Record<string, { t0: number; t1: number }>;
const tl = (id: string, d = 0) => L[id].t0 + d;

export const SEC: V3 = [3000, 0, 0], FH = 3.4, FR = 3.5;
const DEG = Math.PI / 180, EX = 1.5; // cartoon exaggeration of the lean
/** floors standing: 2 in the hook; 1→3 during "1173"; 3 through the war; 4→7 on return; bells (9th) at 1372 */
export const floorsAt = (t: number) => {
  if (t < tl("L02", 0)) return 2;
  if (t < tl("L06", 0.4)) return Math.min(3, 1 + Math.floor(seg(t, tl("L02", 1.0), tl("L02", 5.0)) * 3));
  if (t < tl("L07", 1.4)) return 3 + Math.min(5, Math.floor(seg(t, tl("L06", 0.4), tl("L06", 5.0)) * 5.99));
  return 9;
};
export const leanAt = (t: number) => {
  let d = 0;
  if (t < tl("L02", 0)) d = 1.5;
  else if (t < tl("L03", 0)) d = 0;
  else if (t < tl("L08", 0)) d = lerp(0, 1.6, smooth(seg(t, tl("L03", 0), tl("L03", 2.0)))) + lerp(0, 2.4, smooth(seg(t, tl("L06", 0), tl("L07", 3.0))));
  else if (t < tl("L10", 1.2)) d = 5.5;
  else d = lerp(5.5, 4.9, smooth(seg(t, tl("L10", 1.2), tl("L10", 3.0))));
  return d * DEG * EX;
};
export const bendAt = (t: number) => (t < tl("L06", 2.6) ? 0 : smooth(seg(t, tl("L06", 2.6), tl("L06", 4.6))) * 1.4 * DEG * EX);
export const bellsAt = (t: number) => (t > tl("L07", 1.4) && t < tl("L07", 3.6) ? 0.5 + 0.5 * Math.sin(t * 9) : 0);
export const leadAt = (t: number) => (t < tl("L09", 0.6) ? 0 : t > tl("L11", 0) ? 0 : smooth(seg(t, tl("L09", 0.6), tl("L09", 3.0))));
export const drillAt = (t: number) => (t > tl("L09", 3.4) && t < tl("L10", 4.0) ? 1 : 0);
export const fenceOn = (t: number) => t > tl("L08", 2.6) && t < tl("L11", 0);
export const lapseAt = (t: number) => (t > tl("L04", 3.2) && t < tl("L06", 0) ? 1 : 0);

const BUILDER: Outfit = { jacket: "#8a5a3a", pants: "#4a3a2a", boots: "#3a2a20", hat: "hood", cap: "#5d7a3a", skin: "#f5c9a0" };
const BUILDER2: Outfit = { ...BUILDER, cap: "#7a4a2a", skin: "#ecd0b6", build: "stout", moustache: "#5a3b2a" };
const OLD: Outfit = { ...BUILDER, moustache: "#d9d9d9", cap: "#5d7a3a" };
const OLD2: Outfit = { ...BUILDER2, moustache: "#e6e6e6" };
const SOLDIER: Outfit = { jacket: "#c0353a", pants: "#3d4440", boots: "#3a2a20", hat: "hood", cap: "#9aa0a8", skin: "#f5c9a0" };
const ENGINEER: Outfit = { jacket: "#f08a2c", pants: "#3b5b9a", boots: "#3a2a20", hat: "hardhat", cap: "#f2c230", skin: "#ecd0b6" };
const ENGINEER2: Outfit = { ...ENGINEER, hat: "hardhat", cap: "#ffffff", skin: "#c99067", moustache: "#2a201a", build: "stout" };

export const SHOTS: ShotDef[] = [
  { id: 1, a: 0, b: 175, light: "day", sunAz: 120, sunEl: 40 },
  { id: 2, a: 175, b: 420, light: "day", sunAz: 120, sunEl: 40 },
  { id: 3, a: 420, b: 510, light: "day", sunAz: 120, sunEl: 40 },
  { id: 4, a: 510, b: 668, light: "day", sunAz: 140, sunEl: 35 },
  { id: 5, a: 668, b: 806, light: "golden", sunAz: 30, sunEl: 10 },
  { id: 6, a: 806, b: 1008, light: "day", sunAz: 120, sunEl: 40 },
  { id: 7, a: 1008, b: 1146, light: "golden", sunAz: 40, sunEl: 12 },
  { id: 8, a: 1146, b: 1297, light: "day", sunAz: 120, sunEl: 40 },
  { id: 9, a: 1297, b: 1487, light: "day", sunAz: 110, sunEl: 45 },
  { id: 10, a: 1487, b: 1715, light: "day", sunAz: 110, sunEl: 45 },
  { id: 11, a: 1715, b: TOTAL, light: "golden", sunAz: 30, sunEl: 12 },
];
export const XFADE: Record<number, number> = { 3: 6, 5: 10, 6: 10, 8: 10, 11: 10 };
export const FLASH_AT = [Math.round(tl("L08", 0) * FPS) - 4];
const KICKS: [number, number][] = [[1.4, 0.6], [tl("L03", 1.0), 0.6], [tl("L06", 4.0), 0.5], [tl("L07", 1.4), 0.5], [tl("L10", 2.4), 0.6]];

const C = (base: V3, d: V3): V3 => [base[0] + d[0], base[1] + d[1], base[2] + d[2]];
const TOP = (n: number): V3 => [0, n * FH, 0];
export const CAMS: Record<number, Key[]> = {
  1: [
    { f: 0, s: (f) => dolly([3.0, 6.8, 9.5], [0.4, 6.6, 1.8], pushK(f, 0, 0.003), { fov: 40, roll: -0.04 }) }, // a builder on the stub with a spirit level
    { f: 96, dur: 30, s: (f) => dolly([12, 4, 26], [0, 4, 0], pushK(f, 96, 0.002), { fov: 42 }) }, // pull back: the stub already tilts
  ],
  2: [
    { f: 175, s: (f) => orbit([0, 6, 0], 40, 0.3 + 0.002 * (f - 175), 14, { fov: 44 }) }, // Pisa, 1173: building it
    { f: 320, cut: true, s: (f) => dolly(C(SEC, [2, 3, 40]), C(SEC, [0, 0, 0]), pushK(f, 320, 0.0025), { fov: 44 }) }, // the soil, the shallow foundation
  ],
  3: [{ f: 420, s: (f) => dolly(C(SEC, [3, 2, 32]), C(SEC, [0, 0.5, 0]), pushK(f, 420, 0.004, 0.008, 24), { fov: 42, roll: 0.05 }) }], // sinking
  4: [
    { f: 510, s: (f) => dolly([-14, 2.0, 22], [8, 2.2, 6], pushK(f, 510, 0.0025), { fov: 46 }) }, // off to war
    { f: 600, cut: true, s: (f) => zoom([10, 3, 34], [0, 5, 0], 44, pushK(f, 600, 0.002)) }, // ...the years fly by
  ],
  5: [{ f: 668, s: (f) => dolly([3.6, 12.6, 8.5], [0.2, 10.7, 1.8], pushK(f, 668, 0.003), { fov: 40 }) }], // a cat asleep on the stub
  6: [
    { f: 806, s: (f) => orbit([0, 10, 0], 34, 0.6 + 0.003 * (f - 806), 6, { fov: 46 }) }, // the builders are back
    { f: 930, cut: true, s: (f) => dolly([10, 26, 22], [0, 22, 0], pushK(f, 930, 0.003), { fov: 44, roll: -0.05 }) }, // the banana + a gull
  ],
  7: [{ f: 1008, s: (f) => dolly([8, 30, 20], [0, 28, 0], pushK(f, 1008, 0.003, 0.006, 30), { fov: 44 }) }], // bells on top
  8: [
    { f: 1146, s: (f) => zoom([24, 6, 56], [0, 14, 0], 46, pushK(f, 1146, 0.002)) }, // 1990, closed
    { f: 1220, cut: true, s: (f) => dolly([3, 1.6, 15], [0, 1.6, 7], pushK(f, 1220, 0.003), { fov: 40 }) },
  ],
  9: [
    { f: 1297, s: (f) => dolly([16, 3, 12], [FR, 1.5, 0], pushK(f, 1297, 0.003), { fov: 44 }) }, // lead blocks
    { f: 1400, cut: true, s: (f) => dolly(C(SEC, [4, 3, 40]), C(SEC, [2, 2, 0]), pushK(f, 1400, 0.003), { fov: 42 }) }, // drilling underneath
  ],
  10: [
    { f: 1487, s: (f) => zoom([22, 5, 50], [0, 14, 0], 46, pushK(f, 1487, 0.002)) }, // it comes back a little
    { f: 1580, cut: true, s: (f) => dolly([2, 30, 14], [-1, 29, 0], pushK(f, 1580, 0.003), { fov: 40, roll: 0.05 }) }, // the top: 40 cm
  ],
  11: [
    { f: 1715, s: (f) => dolly([-6, 1.6, 22], [0, 6, 0], pushK(f, 1715, 0.002), { fov: 46 }) }, // tourists holding it up
    { f: 1780, dur: 40, s: (f) => zoom([-14, 3, 48], [0, 14, 0], 44, pushK(f, 1780, 0.0015)) },
  ],
};
export const DOF: Dof[] = [
  { f: 0, cInf: 12 }, { f: 96, dur: 30, cInf: 0 }, { f: 175, cInf: 0 }, { f: 510, cInf: 6 }, { f: 600, cInf: 0 }, { f: 668, cInf: 12 },
  { f: 806, cInf: 0 }, { f: 1146, cInf: 0 }, { f: 1220, cInf: 10 }, { f: 1297, cInf: 6 }, { f: 1400, cInf: 0 }, { f: 1487, cInf: 0 },
  { f: 1580, cInf: 8 }, { f: 1715, cInf: 6 }, { f: 1780, dur: 40, cInf: 0 },
];

const stage = (id: number, t: number, cam: CamInfo, out: Stage) => {
  const lean = leanAt(t);
  const topOf = (n: number): V3 => [-Math.sin(lean) * n * FH, Math.cos(lean) * n * FH, 0];
  if (id === 1) {
    const s = topOf(2);
    put(cam, out, { i: 50, o: BUILDER, okey: "b1" }, t, s[0] + 0.6, s[1], 2.0, exprAt(t, [[0, "neutral"], [1.4, "shock"], [3.0, "nervous"]]), { scale: 1.05 });
    const u = 0.8 * seg(t, 0.4, 1.4) + 0.8 * seg(t, 2.2, 3.2);
    card(out, `lvl${q(u, 20)}`, (p) => levelCard(p, u), s[0] - 0.4, s[1] + 0.55, 2.3, 1.4, 0.42, { cw: 400, ch: 120, rot: lean });
    if (t > 1.4 && t < 2.2) card(out, "bang1", (p) => fxBang(p), s[0] + 0.7, s[1] + 2.5, 2.0, 0.4, 0.6, { cw: 200, ch: 300 });
  }
  if (id === 2 || id === 6) {
    const old = id === 6;
    [[-6, 6], [7, 5], [-2, 8]].forEach(([x, z], k) => {
      const o = old ? (k % 2 ? OLD2 : OLD) : k % 2 ? BUILDER2 : BUILDER;
      put(cam, out, { i: 51 + k, o, okey: `b${old ? "o" : ""}${k % 2}` }, t, x + Math.sin(t * 0.7 + k) * 1.5, 0, z, old ? (t > tl("L06", 4.4) ? "laugh" : "smile") : "grin", { mode: "stroll", phase: (t * 1.4 + k * 0.3) % 1, scale: 1.1 });
    });
    if (id === 6 && t > tl("L06", 4.0)) { const u = seg(t, tl("L06", 4.0), tl("L06", 6.0)); const s = topOf(7); card(out, `gull${q(u, 12)}`, (p) => gull(p, u), s[0] - 0.8 - u * 3, s[1] + 0.6 - u * u * 2, 2.5, 1.4, 0.9, { cw: 400, ch: 260 }); }
  }
  if (id === 3) {
    put(cam, out, { i: 50, o: BUILDER, okey: "b1" }, t, SEC[0] + 6, 0, SEC[2] - 0.5, exprAt(t, [[0, "nervous"], [tl("L03", 1.0), "shock"]]), { scale: 1.05 });
    if (t > tl("L03", 1.0)) card(out, "what3", (p) => fxWhat(p), SEC[0] + 6.1, 2.7, SEC[2] - 0.5, 0.4, 0.6, { cw: 200, ch: 300 });
  }
  if (id === 4) {
    for (let k = 0; k < 6; k++) {
      const x = -8 + k * 2.2 + (t - tl("L04", 0)) * 2.2;
      put(cam, out, { i: 60 + k, o: SOLDIER, okey: "sold" }, t, x, 0, 8 + (k % 2) * 1.2, k === 0 ? "stern" : "neutral", { mode: "march", phase: (t * 1.8) % 1, scale: 1.0, prop: ["hammer", 0.1] });
    }
    if (lapseAt(t)) card(out, `cal4${Math.floor(t * 4) % 12}`, (p) => calendarCard(p, Math.floor(t * 4) % 12), 3, 9, 4, 3, 3, { cw: 300, ch: 300 });
  }
  if (id === 5) {
    const s = topOf(3);
    card(out, `cat${q((t * 0.8) % 1, 5)}`, (p) => cat(p, "#e8964a", (t * 0.8) % 1), s[0] + 0.3, s[1] + 0.45, 2.0, 1.6, 1.04, { cw: 400, ch: 260 });
    card(out, `cal5${Math.floor(t * 5) % 12}`, (p) => calendarCard(p, Math.floor(t * 5) % 12), s[0] + 2.0, s[1] + 1.8, 1.0, 1.0, 1.0, { cw: 300, ch: 300 });
  }
  if (id === 7 && bellsAt(t) > 0) for (let k = 0; k < 3; k++) card(out, `note7${k}`, (p) => fxNote(p, k), topOf(8.6)[0] + (k - 1) * 2, topOf(8.6)[1] + 1.5 + ((t * 1.5 + k * 0.3) % 1) * 2, 1, 1, 1, { cw: 200, ch: 200 });
  if (id === 8) {
    [[-3, 8], [-0.5, 7.8], [2, 8.2]].forEach(([x, z], k) => put(cam, out, { i: 70 + k, o: FOLK[k + 1], okey: `fk${k + 1}` }, t, x, 0, z, t > tl("L08", 2.6) ? "pained" : "smile", { scale: 1.05 }));
  }
  if (id === 9 || id === 10) {
    const off = id === 10 && t > tl("L10", 1.6);
    put(cam, out, { i: 80, o: ENGINEER, okey: "en1" }, t, FR + 4.5, 0, 3.4, off ? "laugh" : exprAt(t, [[0, "neutral"], [tl("L09", 2.6), "grin"]]), { scale: 1.05, wave: off ? q(Math.sin(t * 9), 20) : undefined });
    put(cam, out, { i: 81, o: ENGINEER2, okey: "en2" }, t, FR + 7.5, 0, 1.0, off ? "grin" : "smile", { scale: 1.05 });
    if (id === 9 && t > tl("L09", 3.4)) put(cam, out, { i: 80, o: ENGINEER, okey: "en1" }, t, SEC[0] + 9, 0, SEC[2] - 0.5, "grin", { scale: 1.05 });
  }
  if (id === 10 && t > tl("L10", 2.4)) {
    const s = topOf(9);
    card(out, "arrow10", (p) => arrowCard(p, "#f2c230"), s[0] + 2.2, s[1] - 0.4, 1, 2.0, 0.8, { cw: 300, ch: 120 });
    if (t > tl("L10", 4.8)) card(out, "wink10", (p) => fxSparkle(p), s[0] - 1, s[1] + 1.5, 1, 0.8, 0.8, { cw: 200, ch: 200 });
  }
  if (id === 11) {
    [[-3.5, 9], [-1, 10], [1.5, 9.5], [4, 10.5]].forEach(([x, z], k) => put(cam, out, { i: 90 + k, o: FOLK[k % 6], okey: `fk${k % 6}` }, t, x, 0, z, k % 2 ? "grin" : "smile_closed", { scale: 1.05, wave: 1.0 }));
  }
  void fxStars; void fxImpact; void TOP; void lerp;
};

export const EPISODE: Episode = { id: "pisa", total: TOTAL, shots: SHOTS, xfade: XFADE, flashAt: FLASH_AT, cams: CAMS, kicks: KICKS, dof: DOF, build: buildSet, stage };
