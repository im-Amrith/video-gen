// "The Army That Lost to Birds" (History ep. 3) — shot plan, camera, lens, cast.
import TL from "./timeline.json";
import { Episode, Key, Dof, V3, ShotDef, FPS, dolly, zoom, orbit, pushK, smooth, seg, q, hh, lerp } from "../toon/core";
import { Stage, CamInfo, card } from "../toon/cast";
import { fxBang, fxWhat, fxSweat, fxImpact } from "../toon/fx";
import { fxBurst, fxPuff, Outfit } from "../toon/toon";
import { put, exprAt } from "../toon/kit";
import { emu } from "../toon/animals";
import { buildSet } from "./set";

export const TOTAL = TL.total;
const L = TL.lines as Record<string, { t0: number; t1: number }>;
const tl = (id: string, d = 0) => L[id].t0 + d;

export const DAM: V3 = [30, 0, -18], FARM: V3 = [-22, 0, -14], CASINGS: V3 = [6, 0, -6];
export const JAM = tl("L04", 3.9);
const FIRE4 = tl("L04", 2.8);
export const fenceFall = (t: number, i: number) => smooth(seg(t, tl("L02", 3.6) + (i % 6) * 0.15, tl("L02", 4.4) + (i % 6) * 0.15));
export const casingAt = (t: number) => Math.floor(900 * smooth(seg(t, tl("L06", 0.4), tl("L06", 5.5))));
type Truck = { on: boolean; x: number; z: number; yaw: number; pitch: number; roll: number; bump: number };
/** the truck: arrives at the farm (shot 3), chases across rough ground (shot 5), drives away (shot 9) */
export const truckAt = (id: number, t: number): Truck => {
  if (id === 3) { const u = smooth(seg(t, tl("L03", 1.4), tl("L03", 3.6))); return { on: true, x: lerp(-70, FARM[0] + 8, u), z: 6, yaw: 0, pitch: 0, roll: 0, bump: 0 }; }
  if (id === 5) { const x = -40 + (t - tl("L05", 0)) * 6; return { on: true, x, z: 6, yaw: 0, pitch: 0.08 * Math.sin(t * 9), roll: 0.06 * Math.sin(t * 7.3), bump: 0.25 * Math.abs(Math.sin(t * 6.1)) }; }
  if (id === 9) { const u = seg(t, tl("L09", 0), tl("L09", 3.0)); return { on: true, x: FARM[0] + 8 + u * u * 60, z: 6, yaw: 0, pitch: 0, roll: 0, bump: 0.05 * Math.abs(Math.sin(t * 8)) }; }
  return { on: false, x: 0, z: 0, yaw: 0, pitch: 0, roll: 0, bump: 0 };
};
export const gunPos = (id: number, t: number, tr: Truck) => {
  if (id === 1) return { on: true, x: 1.2, y: 0, z: 9.0, yaw: Math.PI / 2 + 0.2 };
  if (id === 4) return { on: true, x: DAM[0] - 12, y: 0, z: DAM[2] + 10, yaw: -0.6 };
  if (id === 5) return { on: true, x: tr.x - 1.4, y: 1.25 + tr.bump, z: tr.z, yaw: 0 };
  return { on: false, x: 0, y: 0, z: 0, yaw: 0 };
};

const MAJOR: Outfit = { jacket: "#8a8a5a", pants: "#6a6a4a", boots: "#3a2a20", hat: "boater", cap: "#8a7a4a", sash: "#3a2f28", moustache: "#5a3b2a", skin: "#f5c9a0", build: "stout", buttons: "#e8c45a" };
const GUNNER: Outfit = { jacket: "#8a8a5a", pants: "#6a6a4a", boots: "#3a2a20", hat: "boater", cap: "#8a7a4a", sash: "#3a2f28", skin: "#ecd0b6" };
const FARMER: Outfit = { jacket: "#3f6fb5", pants: "#5a4a3a", boots: "#3a2a20", hat: "boater", cap: "#e9cf7a", skin: "#f5c9a0", moustache: "#7a5a3a" };
const FARMER2: Outfit = { jacket: "#b5653f", pants: "#3b3f52", boots: "#3a2a20", hat: "hair", hair: "#8a4a2a", skin: "#ffe2c2" };

export const SHOTS: ShotDef[] = [
  { id: 1, a: 0, b: 240, light: "golden", sunAz: 30, sunEl: 14 },
  { id: 2, a: 240, b: 455, light: "day", sunAz: 120, sunEl: 55 },
  { id: 3, a: 455, b: 655, light: "day", sunAz: 120, sunEl: 45 },
  { id: 4, a: 655, b: 840, light: "day", sunAz: 110, sunEl: 40 },
  { id: 5, a: 840, b: 1075, light: "day", sunAz: 120, sunEl: 45 },
  { id: 6, a: 1075, b: 1305, light: "day", sunAz: 120, sunEl: 40 },
  { id: 7, a: 1305, b: 1390, light: "day", sunAz: 120, sunEl: 40 },
  { id: 8, a: 1390, b: 1585, light: "golden", sunAz: 20, sunEl: 10 },
  { id: 9, a: 1585, b: TOTAL, light: "golden", sunAz: 20, sunEl: 8 },
];
export const XFADE: Record<number, number> = { 2: 6, 3: 6, 6: 8, 8: 8, 9: 8 };
export const FLASH_AT = [Math.round(tl("L01", 5.6) * FPS)];
const KICKS: [number, number][] = [[tl("L01", 5.6), 0.6], [FIRE4, 0.6], [FIRE4 + 0.35, 0.6], [JAM, 0.4], [tl("L05", 1.0), 0.5], [tl("L08", 3.0), 0.8]];

const C = (base: V3, d: V3): V3 => [base[0] + d[0], base[1] + d[1], base[2] + d[2]];
export const CAMS: Record<number, Key[]> = {
  1: [
    { f: 0, s: (f) => dolly([-1.2, 1.5, 12.8], [1.0, 1.4, 8.6], pushK(f, 0, 0.003), { fov: 40, roll: 0.03 }) }, // a gunner faces the wheat...
    { f: 110, dur: 34, s: (f) => dolly([-2.6, 2.6, 15], [6, 1.2, -20], pushK(f, 110, 0.002), { fov: 46 }) }, // ...and the heads pop up
    { f: 168, cut: true, s: (f) => dolly([8, 1.2, -6], [10, 1.5, -12], pushK(f, 168, 0.004, 0.009, 30), { fov: 40, roll: -0.05 }) }, // "The emus won."
  ],
  2: [
    { f: 240, s: (f) => zoom([0, 10, 30], [0, 1, -10], 46, pushK(f, 240, 0.002)) }, // a drought; twenty thousand emus
    { f: 340, cut: true, s: (f) => dolly([-8, 1.2, 9], [-12, 1.0, 2.5], pushK(f, 340, 0.003), { fov: 42, roll: 0.05 }) }, // fences flattened
  ],
  3: [
    { f: 455, s: (f) => dolly([FARM[0] + 2, 1.6, 0], [FARM[0], 1.5, -8], pushK(f, 455, 0.003), { fov: 44 }) }, // the farmers ask for help
    { f: 520, cut: true, s: (f) => zoom([FARM[0] + 14, 3, 22], [FARM[0] + 2, 1.5, 6], 44, pushK(f, 520, 0.002)) }, // the army arrives
    { f: 600, cut: true, s: (f) => dolly([FARM[0] + 6.5, 1.7, 9.5], [FARM[0] + 5.5, 1.7, 6.2], pushK(f, 600, 0.004, 0.008, 30), { fov: 40 }) }, // Major Meredith
  ],
  4: [
    { f: 655, s: (f) => dolly(C(DAM, [-16, 1.2, 14]), C(DAM, [0, 1.0, 0]), pushK(f, 655, 0.0025), { fov: 46 }) }, // ambush at the dam
    { f: 745, cut: true, s: (f) => dolly(C(DAM, [-10.5, 1.6, 12.4]), C(DAM, [-12, 1.2, 10]), pushK(f, 745, 0.004, 0.009, 24), { fov: 38, roll: -0.06 }) }, // ...click.
    { f: 790, cut: true, s: (f) => dolly(C(DAM, [-6, 2.5, 16]), C(DAM, [2, 1.0, -4]), pushK(f, 790, 0.003), { fov: 46 }) }, // emus scatter
  ],
  5: [
    { f: 840, s: (f) => { const x = -40 + (f / FPS - tl("L05", 0)) * 6; return dolly([x - 2, 2.2, 15], [x + 6, 1.2, 4], 1, { fov: 46, roll: 0.03 * Math.sin(f / 5) }); } }, // tracking the chase
    { f: 960, cut: true, s: (f) => { const x = -40 + (f / FPS - tl("L05", 0)) * 6; return dolly([x + 16, 1.0, 9], [x + 6, 1.4, 6], 1, { fov: 44, roll: -0.04 }); } }, // the emus look back
  ],
  6: [
    { f: 1075, s: (f) => dolly(C(CASINGS, [3, 2.4, 9]), C(CASINGS, [0, 1.0, 0]), pushK(f, 1075, 0.0025), { fov: 44 }) }, // the casings pile up
    { f: 1200, dur: 30, s: (f) => dolly(C(CASINGS, [5, 4.5, 12]), C(CASINGS, [0, 1.6, 0]), pushK(f, 1200, 0.002), { fov: 46, roll: 0.04 }) },
  ],
  7: [{ f: 1305, s: (f) => dolly(C(CASINGS, [1.2, 1.4, 5.0]), C(CASINGS, [0, 1.4, 1.5]), pushK(f, 1305, 0.004, 0.009, 24), { fov: 40 }) }], // ten bullets, one emu
  8: [
    { f: 1390, s: (f) => dolly([FARM[0] + 8, 1.6, 10], [FARM[0] + 7.5, 1.0, 4.4], pushK(f, 1390, 0.003), { fov: 42 }) }, // ten thousand bullets...
    { f: 1480, cut: true, s: (f) => zoom([-10, 5, 30], [-10, 10, -70], 44, pushK(f, 1480, 0.002, 0.006, 30)) }, // ...twenty thousand emus
  ],
  9: [
    { f: 1585, s: (f) => zoom([FARM[0] - 2, 3, 22], [FARM[0] + 20, 1.5, 6], 46, pushK(f, 1585, 0.002)) }, // the army leaves
    { f: 1680, cut: true, s: (f) => dolly([-7, 13.6, -52], [-10, 13.2, -66], pushK(f, 1680, 0.003), { fov: 40, roll: 0.03 }) }, // the emu in the major's hat
  ],
};
export const DOF: Dof[] = [
  { f: 0, cInf: 12 }, { f: 110, dur: 34, cInf: 0 }, { f: 168, cInf: 12 }, { f: 240, cInf: 0 }, { f: 340, cInf: 10 }, { f: 455, cInf: 8 },
  { f: 520, cInf: 0 }, { f: 600, cInf: 13 }, { f: 655, cInf: 4 }, { f: 745, cInf: 13 }, { f: 790, cInf: 0 }, { f: 840, cInf: 4 },
  { f: 1075, cInf: 6 }, { f: 1305, cInf: 13 }, { f: 1390, cInf: 10 }, { f: 1480, cInf: 0 }, { f: 1585, cInf: 0 }, { f: 1680, cInf: 12 },
];

const emuCard = (out: Stage, key: string, x: number, z: number, s: number, ph: number, shock = false, hat = false, look = 0, y = 0) =>
  card(out, `emu|${key}|${ph < 0 ? -1 : q(ph, 8)}|${shock ? 1 : 0}|${hat ? 1 : 0}|${look}`, (p) => emu(p, ph, shock, hat, look), x, y + 0.9 * s, z, 1.2 * s, 1.8 * s, { cw: 400, ch: 600 });

const stage = (id: number, t: number, cam: CamInfo, out: Stage) => {
  if (id === 1) {
    put(cam, out, { i: 100, o: GUNNER, okey: "gun1" }, t, 0.0, 0, 9.0, exprAt(t, [[0, "stern"], [tl("L01", 3.8), "nervous"], [tl("L01", 5.6), "shock"]]), { scale: 1.1 });
    const n = Math.floor(40 * smooth(seg(t, tl("L01", 1.5), tl("L01", 5.0))));
    for (let k = 0; k < n; k++) { const x = -20 + hh(k, 1) * 50, z = -6 - hh(k, 2) * 30, pop = seg(t, tl("L01", 1.5) + k * 0.08, tl("L01", 1.7) + k * 0.08); emuCard(out, "h", x, z, 1.0, -1, false, false, hh(k, 3) > 0.5 ? 1 : -1, -1.4 + pop * 1.0); }
    if (t > tl("L01", 5.6)) emuCard(out, "w", 10, -12, 1.2, -1, false, false, 0);
  }
  if (id === 2) {
    for (let k = 0; k < 40; k++) { const x = -40 + ((hh(k, 1) * 80 + (t - tl("L02", 0)) * (6 + hh(k, 2) * 4)) % 80), z = -2 - hh(k, 3) * 30; emuCard(out, "r", x, z, 1.0, ((t * 2.2 + hh(k, 4)) % 1), false, false, 1); }
  }
  if (id === 3) {
    put(cam, out, { i: 101, o: FARMER, okey: "farm1" }, t, FARM[0] - 1, 0, -6.5, exprAt(t, [[0, "pained"], [tl("L03", 1.4), "relief"]]), { scale: 1.1, wave: t > tl("L03", 1.6) ? q(Math.sin(t * 8), 20) : undefined });
    put(cam, out, { i: 102, o: FARMER2, okey: "farm2" }, t, FARM[0] + 1.4, 0, -6.0, exprAt(t, [[0, "nervous"], [tl("L03", 1.6), "smile"]]), { scale: 1.05 });
    if (t > tl("L03", 3.6)) put(cam, out, { i: 103, o: MAJOR, okey: "maj" }, t, FARM[0] + 5.5, 0, 6.2, exprAt(t, [[0, "stern"], [tl("L03", 5.0), "smile"]]), { scale: 1.15 });
  }
  if (id === 4) {
    const fired = t > FIRE4, jam = t > JAM;
    put(cam, out, { i: 100, o: GUNNER, okey: "gun1" }, t, DAM[0] - 12.8, 0, DAM[2] + 10.8, jam ? (t > JAM + 0.6 ? "dazed" : "shock") : fired ? "grin" : "stern", { scale: 1.1 });
    if (fired && !jam) { const u = q((t * 6) % 1, 6); card(out, `gf${u}`, (p) => fxBurst(p, u, "#fff3b0"), DAM[0] - 11.4, 1.1, DAM[2] + 10, 1.0, 1.0, { cw: 500, ch: 500, soft: true }); }
    if (jam && t < JAM + 1.0) card(out, "what4", (p) => fxWhat(p), DAM[0] - 12.6, 3.0, DAM[2] + 10.8, 0.4, 0.6, { cw: 200, ch: 300 });
    for (let k = 0; k < 9; k++) {
      const run = t > JAM + 0.4, a = hh(k, 1) * Math.PI * 2, r = 5 + hh(k, 2) * 3;
      const x = DAM[0] + Math.cos(a) * r + (run ? (t - JAM - 0.4) * 12 : 0), z = DAM[2] + Math.sin(a) * r - (run ? (t - JAM - 0.4) * 6 : 0);
      emuCard(out, "d", x, z, 1.0, run ? ((t * 2.4 + hh(k, 3)) % 1) : -1, t > JAM && t < JAM + 0.6, false, run ? 1 : (hh(k, 4) > 0.5 ? 1 : -1));
    }
    if (t > JAM + 0.4 && t < JAM + 1.4) { const u = q(seg(t, JAM + 0.4, JAM + 1.4), 15); card(out, `dust4${u}`, (p) => fxPuff(p, u), DAM[0] + 4, 1.2, DAM[2] - 2, 8, 6, { soft: true }); }
  }
  if (id === 5) {
    const x0 = -40 + (t - tl("L05", 0)) * 6;
    put(cam, out, { i: 100, o: GUNNER, okey: "gun1" }, t, x0 - 2.2, 1.25 + 0.25 * Math.abs(Math.sin(t * 6.1)), 6.0, exprAt(t, [[0, "grin"], [tl("L05", 3.0), "pained"]]), { scale: 1.0, noBlob: true, tilt: 8 * Math.sin(t * 9) });
    for (let k = 0; k < 6; k++) emuCard(out, "c", x0 + 9 + k * 2.4 + Math.sin(t + k) * 0.8, 3 + (k % 3) * 2.5, 1.0, ((t * 2.6 + hh(k, 2)) % 1), false, false, t > tl("L05", 4.0) ? -1 : 1);
  }
  if (id === 6 || id === 7) {
    if (id === 6) { put(cam, out, { i: 100, o: GUNNER, okey: "gun1" }, t, CASINGS[0] - 4, 0, CASINGS[2] + 2, exprAt(t, [[0, "neutral"], [tl("L06", 4.0), "dazed"]]), { scale: 1.05 }); emuCard(out, "top", CASINGS[0] + 0.3, CASINGS[2] + 0.2, 1.0, -1, false, false, -1, 1.7 * smooth(seg(t, tl("L06", 4.5), tl("L06", 5.5)))); }
    if (id === 7) {
      for (let k = 0; k < 10; k++) card(out, "bullet", (p) => { p.poly([[90, 40], [110, 40], [115, 160], [85, 160]], "#e0b040", 7); p.ell(100, 40, 10, 22, "#c08a30", 6); }, CASINGS[0] - 1.6 + k * 0.18, 1.1, CASINGS[2] + 2.2, 0.2, 0.3, { cw: 200, ch: 200 });
      emuCard(out, "one", CASINGS[0] + 0.6, CASINGS[2] + 1.6, 1.0, -1, false, false, -1);
    }
  }
  if (id === 8) {
    if (t < tl("L08", 3.0)) put(cam, out, { i: 103, o: MAJOR, okey: "maj" }, t, FARM[0] + 6.5, 0, 6.0, "smile", { scale: 1.15 });
    else {
      for (let k = 0; k < 70; k++) { const x = -40 + hh(k, 1) * 60, z = -58 - hh(k, 2) * 14, y = 12 * Math.sqrt(Math.max(0, 1 - ((x + 10) / 40) ** 2 - ((z + 70) / 22) ** 2)); emuCard(out, "hill", x, z, 1.4, -1, false, false, hh(k, 3) > 0.5 ? 1 : -1, y - 0.2); }
    }
  }
  if (id === 9) {
    put(cam, out, { i: 101, o: FARMER, okey: "farm1" }, t, FARM[0] - 1, 0, 2, exprAt(t, [[0, "smile"], [tl("L09", 2.0), "grin"]]), { scale: 1.1 });
    if (t > tl("L09", 2.0)) card(out, "coins9", (p) => { for (let k = 0; k < 5; k++) p.ell(100, 160 - k * 22, 46, 14, "#e8c45a", 7); }, FARM[0] - 0.3, 1.2, 2.4, 0.4, 0.4, { cw: 200, ch: 200 });
    emuCard(out, "gen", -10, -66, 1.6, -1, false, true, -1, 11.7);
  }
  void fxBang; void fxSweat; void fxImpact; void orbit; void lerp;
};

export const EPISODE: Episode = { id: "emu", total: TOTAL, shots: SHOTS, xfade: XFADE, flashAt: FLASH_AT, cams: CAMS, kicks: KICKS, dof: DOF, build: buildSet, stage };
