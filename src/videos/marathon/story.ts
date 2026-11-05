// "The Worst Olympic Marathon Ever Run" (History ep. 4) — shot plan, camera, lens, cast.
import TL from "./timeline.json";
import { Episode, Key, Dof, V3, ShotDef, FPS, dolly, zoom, pushK, smooth, seg, q, hh, lerp } from "../toon/core";
import { Stage, CamInfo, card } from "../toon/cast";
import { fxBang, fxWhat, fxSweat, fxSparkle, fxHeat } from "../toon/fx";
import { fxStars, fxPuff, Outfit, Pen } from "../toon/toon";
import { put, exprAt, FOLK } from "../toon/kit";
import { buildSet } from "./set";

export const TOTAL = TL.total;
const L = TL.lines as Record<string, { t0: number; t1: number }>;
const tl = (id: string, d = 0) => L[id].t0 + d;

export const WELL: V3 = [-60, 0, 6.6], ORCH: V3 = [60, 0, -12], FIN: V3 = [200, 0, 0];
const BREAK = tl("L03", 3.8);
type Car = { on: boolean; x: number; bump: number; tilt: number; broken: boolean };
export const carAt = (id: number, t: number): Car => {
  if (id === 1) { const x = -20 + (t - 0) * 7; return { on: true, x, bump: 0.05 * Math.abs(Math.sin(t * 9)), tilt: 0.02 * Math.sin(t * 7), broken: false }; }
  if (id === 3) { const x = t < BREAK ? 120 + (t - tl("L03", 0)) * 7 : 120 + (BREAK - tl("L03", 0)) * 7; return { on: t < tl("L03", 6.0), x, bump: t < BREAK ? 0.05 * Math.abs(Math.sin(t * 9)) : 0, tilt: t < BREAK ? 0 : 0.18, broken: t >= BREAK }; }
  if (id === 10) return { on: true, x: FIN[0] - 30, bump: 0, tilt: 0.18, broken: true };
  return { on: false, x: 0, bump: 0, tilt: 0, broken: false };
};
export const dustAt = (id: number, t: number) => ({ on: id === 1 || id === 2 || (id === 3 && t < BREAK), x: id === 1 ? carAt(1, t).x - 1 : id === 3 ? carAt(3, t).x - 1 : -40 + t * 2 });

const RUNNER = (vest: string, skin: string, hat: Outfit["hat"] = "hair", hair = "#3a2a20", extra: Partial<Outfit> = {}): Outfit => ({ jacket: vest, pants: "#2f3542", boots: "#3a2a20", hat, hair, skin, ...extra });
const LORZ = RUNNER("#f4f1e6", "#ffe2c2", "hair", "#5a3b2a");
const HICKS = RUNNER("#f4f1e6", "#f5c9a0", "hair", "#2a201a", { sash: "#c0353a" });
const CARVAJAL = RUNNER("#ffffff", "#c99067", "cap", "#2a201a", { cap: "#3f6fb5", pants: "#3b3f52" });
const TRAINER: Outfit = { jacket: "#3a3a48", pants: "#2f3542", boots: "#2b2b33", hat: "tophat", skin: "#ecd0b6", moustache: "#5a3b2a" };
const TRAINER2: Outfit = { ...TRAINER, hat: "boater", cap: "#e9cf7a", skin: "#f5c9a0", moustache: undefined };
const OFFICIAL: Outfit = { jacket: "#2f3542", pants: "#2f3542", boots: "#2b2b33", hat: "tophat", skin: "#f5c9a0", moustache: "#d9d9d9", build: "stout" };

export const SHOTS: ShotDef[] = [
  { id: 1, a: 0, b: 235, light: "day", sunAz: 130, sunEl: 55 },
  { id: 2, a: 235, b: 465, light: "golden", sunAz: 140, sunEl: 50 },
  { id: 3, a: 465, b: 715, light: "day", sunAz: 120, sunEl: 50 },
  { id: 4, a: 715, b: 795, light: "day", sunAz: 120, sunEl: 50 },
  { id: 5, a: 795, b: 1050, light: "golden", sunAz: 130, sunEl: 32 },
  { id: 6, a: 1050, b: 1275, light: "day", sunAz: 120, sunEl: 45 },
  { id: 7, a: 1275, b: 1375, light: "golden", sunAz: 40, sunEl: 15 },
  { id: 8, a: 1375, b: 1590, light: "golden", sunAz: 40, sunEl: 15 },
  { id: 9, a: 1590, b: 1695, light: "golden", sunAz: 30, sunEl: 12 },
  { id: 10, a: 1695, b: TOTAL, light: "day", sunAz: 120, sunEl: 40 },
];
export const XFADE: Record<number, number> = { 2: 6, 5: 6, 7: 8, 8: 8, 10: 10 };
export const FLASH_AT = [Math.round(tl("L01", 5.4) * FPS)];
const KICKS: [number, number][] = [[BREAK, 0.9], [tl("L04", 0.2), 0.5], [tl("L05", 4.5), 0.5], [tl("L07", 0.3), 0.6], [tl("L07", 1.4), 0.5], [tl("L10", 3.0), 0.6]];

const runX = (t: number, t0: number, x0: number, v: number) => x0 + (t - t0) * v;
/** owner rule #4 (every shot moves): swing the camera around its look point by `yaw` rad/frame, raise it `rise` m/frame */
const arc = (pos: V3, look: V3, f: number, f0: number, yaw: number, rise = 0): V3 => {
  const a = yaw * (f - f0), dx = pos[0] - look[0], dz = pos[2] - look[2];
  return [look[0] + dx * Math.cos(a) - dz * Math.sin(a), pos[1] + rise * (f - f0), look[2] + dx * Math.sin(a) + dz * Math.cos(a)];
};
export const CAMS: Record<number, Key[]> = {
  1: [
    { f: 0, s: (f) => { const x = carAt(1, f / FPS).x; return dolly([x + 2.5, 1.9, 2.6], [x - 0.6, 1.7, -1.6], 1, { fov: 42, roll: 0.03 }); } }, // Lorz waving from a car
    { f: 110, cut: true, s: (f) => { const x = carAt(1, f / FPS).x; return dolly([x - 22, 2.6, 6], [x - 6, 1.4, 0], 1, { fov: 46 }); } }, // runners behind, eating dust
  ],
  2: [
    { f: 235, s: (f) => zoom(arc([-40, 3.0, 10], [-80, 1.4, 0], f, 235, 0.0018, 0.03), [-80, 1.4, 0], 46, pushK(f, 235, 0.002)) }, // hot, dusty road
    { f: 350, cut: true, s: (f) => dolly(arc([WELL[0] + 3, 1.7, WELL[2] + 7], [WELL[0], 1.2, WELL[2]], f, 350, -0.0035), [WELL[0], 1.2, WELL[2]], pushK(f, 350, 0.003), { fov: 42, roll: -0.04 }) }, // one water station
  ],
  3: [
    { f: 465, s: (f) => { const x = carAt(3, f / FPS).x; return dolly([x + 6, 1.6, 7], [x, 1.2, -1.6], 1, { fov: 44 }); } }, // car breaks down
    { f: 600, cut: true, s: (f) => dolly(arc([FIN[0] + 10, 2.0, 2.5], [FIN[0], 1.6, 0], f, 600, 0.004, 0.01), [FIN[0], 1.6, 0], pushK(f, 600, 0.003), { fov: 46 }) }, // cheered at the finish
  ],
  4: [{ f: 715, s: (f) => dolly(arc([FIN[0] + 4.5, 1.6, 2.6], [FIN[0] + 2, 1.6, 0.4], f, 715, -0.004), [FIN[0] + 2, 1.6, 0.4], pushK(f, 715, 0.004, 0.009, 24), { fov: 40, roll: 0.05 }) }], // "it was a joke"
  5: [
    { f: 795, s: (f) => { const x = runX(f / FPS, tl("L05", 0), 0, 1.5); return dolly(arc([x + 3, 1.6, 6], [x, 1.5, 0], f, 795, 0.003), [x, 1.5, 0], 1, { fov: 44 }); } }, // Hicks + his pit crew
    { f: 930, cut: true, s: (f) => { const x = runX(f / FPS, tl("L05", 0), 0, 1.5); return dolly([x + 1.6, 1.9, 2.8], [x, 1.9, 0], 1, { fov: 40, roll: 0.12 * Math.sin(f / 9) }); } }, // eyes spinning, world wobbling
  ],
  6: [
    { f: 1050, s: (f) => { const x = runX(f / FPS, tl("L06", 0), ORCH[0] - 14, 1.6); return dolly(arc([x + 4, 1.4, 6], [x, 1.3, 0], f, 1050, -0.003), [x, 1.3, 0], 1, { fov: 44 }); } }, // Carvajal in cut-off trousers
    { f: 1180, cut: true, s: (f) => dolly(arc([ORCH[0] - 2, 2.0, -2], [ORCH[0] - 4, 2.4, -10], f, 1180, 0.004, 0.01), [ORCH[0] - 4, 2.4, -10], pushK(f, 1180, 0.003), { fov: 44 }) }, // the orchard
  ],
  7: [{ f: 1275, s: (f) => dolly(arc([ORCH[0] - 3, 1.2, -3.6], [ORCH[0] - 4, 0.9, -8], f, 1275, -0.004, 0.006), [ORCH[0] - 4, 0.9, -8], pushK(f, 1275, 0.004, 0.008, 30), { fov: 40, roll: -0.04 }) }], // bad apple, nap
  8: [
    { f: 1375, s: (f) => dolly(arc([FIN[0] + 9, 2.2, 6], [FIN[0], 1.4, 0], f, 1375, 0.0035, 0.015), [FIN[0], 1.4, 0], pushK(f, 1375, 0.0025), { fov: 46 }) }, // half carried over the line
    { f: 1490, cut: true, s: (f) => dolly(arc([FIN[0] + 3.0, 1.6, 2.4], [FIN[0], 1.6, 0], f, 1490, -0.004), [FIN[0], 1.6, 0], pushK(f, 1490, 0.004), { fov: 40 }) },
  ],
  9: [{ f: 1590, s: (f) => dolly(arc([FIN[0] + 6, 1.4, 4], [FIN[0] - 2, 1.4, 0], f, 1590, 0.0035, 0.01), [FIN[0] - 2, 1.4, 0], pushK(f, 1590, 0.003), { fov: 44, roll: 0.04 }) }], // Carvajal, fourth
  10: [
    { f: 1695, s: (f) => dolly(arc([FIN[0] + 2.4, 1.8, 2.4], [FIN[0], 1.9, 0], f, 1695, -0.004), [FIN[0], 1.9, 0], pushK(f, 1695, 0.003), { fov: 40 }) }, // Hicks's gold
    { f: 1800, cut: true, s: (f) => { const x = runX(f / FPS, tl("L10", 3.0), FIN[0] - 34, 2.4); return dolly([x + 5, 1.5, 5], [x - 2, 1.4, -1.0], 1, { fov: 44, roll: 0.04 }); } }, // Lorz runs past his broken car, on foot
  ],
};
export const DOF: Dof[] = [
  { f: 0, cInf: 12 }, { f: 110, cInf: 0 }, { f: 235, cInf: 0 }, { f: 350, cInf: 10 }, { f: 465, cInf: 6 }, { f: 600, cInf: 4 },
  { f: 715, cInf: 13 }, { f: 795, cInf: 6 }, { f: 930, cInf: 13 }, { f: 1050, cInf: 6 }, { f: 1180, cInf: 4 }, { f: 1275, cInf: 12 },
  { f: 1375, cInf: 4 }, { f: 1490, cInf: 12 }, { f: 1590, cInf: 6 }, { f: 1695, cInf: 13 }, { f: 1800, cInf: 6 },
];

const CROWD: [number, number][] = Array.from({ length: 20 }, (_, i) => [FIN[0] - 14 + (i % 10) * 3, (i < 10 ? -1 : 1) * (6.6 + (i % 3) * 0.9)]);
const crowd = (cam: CamInfo, out: Stage, t: number, cheer: boolean) => CROWD.forEach(([x, z], i) => {
  const r = Math.floor(Math.abs(z) - 6.4 + 0.5);
  put(cam, out, { i: 200 + i, o: FOLK[i % 6], okey: `fk${i % 6}` }, t, x, Math.max(0, r) * 0.5 + 0.5, z, cheer ? (i % 2 ? "laugh" : "grin") : "smile", { scale: 1.0, wave: cheer && i % 3 !== 1 ? q(Math.sin(t * 9 + i), 20) : undefined, noBlob: true });
});
const appleCard = (bitten: boolean) => (p: import("../toon/toon").Pen) => { p.ell(100, 110, 70, 64, "#d23b3b", 9); p.stroke([[100, 50], [108, 20]], 7, "#5a3b2a"); if (bitten) p.ell(160, 100, 26, 30, "#fff3d6", 6); };

// owner rule #5: places say who they are (unlit painted cards, drawn with fillText)
const txt = (p: Pen, s: string, x: number, y: number, px: number, col: string) => { const g = p.g; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = col; g.font = `bold ${px}px sans-serif`; g.fillText(s, x, y); };
const board = (p: Pen, lines: [string, number, string][], bg = "#f4e3bf") => { p.poly([[275, 380], [325, 380], [325, 760], [275, 760]], "#8a5a32", 10); p.poly([[20, 30], [580, 30], [580, 400], [20, 400]], bg, 12); lines.forEach(([s, px, col], k) => txt(p, s, 300, 30 + (370 * (k + 0.5)) / lines.length, px, col)); };
const stlSign = (p: Pen) => board(p, [["ST. LOUIS", 92, "#c0353a"], ["OLYMPIC", 58, "#2a3f6a"], ["MARATHON 1904", 52, "#2a3f6a"]]);
const waterSign = (p: Pen) => board(p, [["WATER", 110, "#2a6ab0"], ["(the only one)", 46, "#3a2f28"]]);
const bostonSign = (p: Pen) => board(p, [["BOSTON", 104, "#c0353a"], ["MARATHON", 72, "#2a3f6a"], ["1905", 64, "#3a2f28"]]);
const finishSign = (p: Pen) => { p.poly([[20, 20], [980, 20], [980, 220], [20, 220]], "#fff8e8", 12); txt(p, "FINISH", 500, 125, 150, "#c0353a"); };

const stage = (id: number, t: number, cam: CamInfo, out: Stage, f: number) => {
  if (id === 2) { card(out, "stlSign", stlSign, WELL[0] - 2.4, 1.3, WELL[2] + 0.4, 2.0, 2.53, { cw: 600, ch: 760 }); card(out, "waterSign", waterSign, WELL[0] + 1.6, 0.72, WELL[2] + 1.2, 1.1, 1.4, { cw: 600, ch: 760 }); }
  if ((id === 3 && f >= 600) || id === 4 || id === 8 || id === 9 || (id === 10 && f < 1800)) card(out, "finishSign", finishSign, FIN[0], 3.75, 0, 3.4, 0.75, { cw: 1000, ch: 240 });
  if (id === 10 && f >= 1800) card(out, "bostonSign", bostonSign, FIN[0] - 37, 1.3, -4.0, 2.0, 2.53, { cw: 600, ch: 760 });
  if (id === 1) {
    const x = carAt(1, t).x;
    put(cam, out, { i: 300, o: LORZ, okey: "lorz" }, t, x - 0.6, 1.5, -1.6, exprAt(t, [[0, "grin"], [tl("L01", 4.0), "smile_closed"]]), { mode: "seat", wave: q(Math.sin(t * 8), 20), noBlob: true });
    for (let k = 0; k < 4; k++) put(cam, out, { i: 310 + k, o: k % 2 ? HICKS : CARVAJAL, okey: `rn${k}` }, t, x - 10 - k * 3, 0, 1.0 + (k % 2) * 1.2, "pained", { mode: "stroll", phase: (t * 1.8 + k * 0.3) % 1, scale: 1.0 });
  }
  if (id === 2) {
    for (let k = 0; k < 4; k++) put(cam, out, { i: 320 + k, o: k % 2 ? HICKS : CARVAJAL, okey: `rn${k}` }, t, WELL[0] + 1.2 + k * 1.1, 0, WELL[2] - 1.4, k === 0 ? "relief" : "pained", { scale: 1.0, look: -1 });
    card(out, `heat2${q(t % 1, 12)}`, (p) => fxHeat(p, t), WELL[0] - 2, 2, WELL[2], 1.5, 2.0, { cw: 300, ch: 400, soft: true });
    for (let k = 0; k < 3; k++) card(out, `sw2${k}${q((t * 2 + k * 0.3) % 1, 6)}`, (p) => fxSweat(p), WELL[0] + 1.6 + k * 1.1, 2.2 - ((t + k * 0.3) % 0.5), WELL[2] - 1.2, 0.18, 0.27, { cw: 120, ch: 180 });
  }
  if (id === 3) {
    const x = carAt(3, t).x;
    if (t < BREAK + 0.6) put(cam, out, { i: 300, o: LORZ, okey: "lorz" }, t, x - 0.6, 1.5, -1.6, t < BREAK ? "grin" : "shock", { mode: "seat", noBlob: true });
    else if (t < tl("L03", 6.0)) put(cam, out, { i: 300, o: LORZ, okey: "lorz" }, t, x + (t - BREAK - 0.6) * 3, 0, -0.5, "whistle", { mode: "stroll", phase: (t * 2) % 1 });
    if (t > BREAK && t < BREAK + 0.8) { const u = q(seg(t, BREAK, BREAK + 0.8), 12); card(out, `boom3${u}`, (p) => fxPuff(p, u), x + 1.6, 1.4, -1.6, 2.6, 2.6, { soft: true }); }
    if (t > tl("L03", 6.0)) { put(cam, out, { i: 300, o: LORZ, okey: "lorz" }, t, FIN[0] + 1, 0, 0.4, "laugh", { wave: q(Math.sin(t * 9), 20) }); crowd(cam, out, t, true); }
  }
  if (id === 4) {
    put(cam, out, { i: 300, o: LORZ, okey: "lorz" }, t, FIN[0] + 1.2, 0, 0.4, exprAt(t, [[0, "nervous"], [tl("L04", 1.2), "smile"]]));
    put(cam, out, { i: 330, o: OFFICIAL, okey: "off" }, t, FIN[0] + 3.0, 0, 0.0, "stern", { scale: 1.05 });
    if (t > tl("L04", 1.2)) card(out, "what4", (p) => fxWhat(p), FIN[0] + 3.1, 2.8, 0.0, 0.4, 0.6, { cw: 200, ch: 300 });
  }
  if (id === 5) {
    const x = runX(t, tl("L05", 0), 0, 1.5), dazed = t > tl("L05", 4.5);
    put(cam, out, { i: 340, o: HICKS, okey: "hicks" }, t, x, 0, 0, dazed ? "dazed" : "pained", { mode: "stroll", phase: (t * 1.5) % 1, scale: 1.1 });
    put(cam, out, { i: 341, o: TRAINER, okey: "tr1" }, t, x - 1.6, 0, -0.6, "stern", { mode: "stroll", phase: (t * 1.5 + 0.3) % 1 });
    put(cam, out, { i: 342, o: TRAINER2, okey: "tr2" }, t, x + 1.6, 0, -0.6, "grin", { mode: "stroll", phase: (t * 1.5 + 0.6) % 1 });
    const items = [{ at: 1.2, d: (p: import("../toon/toon").Pen) => { p.ell(100, 120, 48, 62, "#fff8e8", 8); } }, { at: 2.4, d: (p: import("../toon/toon").Pen) => { p.poly([[80, 60], [120, 60], [130, 190], [70, 190]], "#c07a3a", 8); p.poly([[90, 30], [110, 30], [110, 60], [90, 60]], "#7a4a2a", 6); } }, { at: 3.6, d: (p: import("../toon/toon").Pen) => { p.poly([[85, 80], [115, 80], [115, 180], [85, 180]], "#7ad08a", 8); p.poly([[92, 50], [108, 50], [108, 80], [92, 80]], "#3a2f28", 6); } }];
    items.forEach(({ at, d }, k) => { if (t > tl("L05", at) && t < tl("L05", at + 1.4)) card(out, `item5${k}`, d, x + 0.8, 1.6, 0.4, 0.4, 0.4, { cw: 200, ch: 200 }); });
    if (dazed) card(out, `st5${q(t % 1, 10)}`, (p) => fxStars(p, (t * 0.8) % 1), x, 2.9, 0, 1.0, 0.7, { cw: 400, ch: 300 });
  }
  if (id === 6) {
    const x = runX(t, tl("L06", 0), ORCH[0] - 14, 1.6);
    if (t < tl("L06", 4.2)) put(cam, out, { i: 350, o: CARVAJAL, okey: "carv" }, t, x, 0, 0, exprAt(t, [[0, "pained"], [tl("L06", 3.2), "grin"]]), { mode: "stroll", phase: (t * 1.6) % 1, scale: 1.05 });
    else put(cam, out, { i: 350, o: CARVAJAL, okey: "carv" }, t, ORCH[0] - 4, 0, -7.4, "grin", { scale: 1.05, look: -1 });
    if (t > tl("L06", 5.2)) card(out, "apple6", appleCard(false), ORCH[0] - 3.5, 1.5, -7.0, 0.32, 0.32, { cw: 200, ch: 200 });
  }
  if (id === 7) {
    const nap = t > tl("L07", 1.6);
    put(cam, out, { i: 350, o: CARVAJAL, okey: "carv" }, t, ORCH[0] - 4, 0, -7.4, exprAt(t, [[0, "smile"], [tl("L07", 0.3), "pained"], [tl("L07", 1.6), "smile_closed"]]), { mode: nap ? "sit" : "stand", scale: 1.05 });
    if (!nap) card(out, `apple7${t > tl("L07", 0.2) ? 1 : 0}`, appleCard(t > tl("L07", 0.2)), ORCH[0] - 3.5, 1.5, -7.0, 0.32, 0.32, { cw: 200, ch: 200 });
    if (nap) card(out, `zz7${q(t % 1, 10)}`, (p) => fxStars(p, (t * 0.5) % 1), ORCH[0] - 4, 2.0, -7.4, 0.8, 0.55, { cw: 400, ch: 300 });
  }
  if (id === 8) {
    const x = FIN[0] - 6 + seg(t, tl("L08", 0), tl("L08", 3.4)) * 7;
    put(cam, out, { i: 340, o: HICKS, okey: "hicks" }, t, x, 0.35 + 0.08 * Math.sin(t * 9), 0, "dazed", { mode: "fall", scale: 1.1, noBlob: true });
    put(cam, out, { i: 341, o: TRAINER, okey: "tr1" }, t, x - 0.9, 0, -0.3, "pained", { mode: "stroll", phase: (t * 1.6) % 1 });
    put(cam, out, { i: 342, o: TRAINER2, okey: "tr2" }, t, x + 0.9, 0, -0.3, "pained", { mode: "stroll", phase: (t * 1.6 + 0.5) % 1 });
    crowd(cam, out, t, t > tl("L08", 3.0));
  }
  if (id === 9) {
    const x = FIN[0] - 8 + seg(t, tl("L09", 0), tl("L09", 2.4)) * 9;
    put(cam, out, { i: 350, o: CARVAJAL, okey: "carv" }, t, x, 0, 0, "grin", { mode: "stroll", phase: (t * 1.8) % 1, scale: 1.05 });
    crowd(cam, out, t, true);
  }
  if (id === 10) {
    if (t < tl("L10", 3.0)) {
      put(cam, out, { i: 340, o: HICKS, okey: "hicks" }, t, FIN[0] + 0.2, 0, 0, exprAt(t, [[0, "relief"], [tl("L10", 1.2), "smile_closed"]]), { scale: 1.1 });
      card(out, "medal10", (p) => { p.stroke([[80, 20], [100, 90]], 10, "#3f6fb5"); p.stroke([[120, 20], [100, 90]], 10, "#d23b3b"); p.ell(100, 130, 46, 46, "#e8c45a", 9); }, FIN[0] + 0.25, 1.35, 0.3, 0.32, 0.32, { cw: 200, ch: 200 });
      card(out, "spk10", (p) => fxSparkle(p), FIN[0] + 0.6, 1.7, 0.35, 0.2, 0.2, { cw: 200, ch: 200 });
    } else {
      const x = runX(t, tl("L10", 3.0), FIN[0] - 34, 2.4);
      put(cam, out, { i: 300, o: LORZ, okey: "lorz" }, t, x, 0, -0.2, exprAt(t, [[0, "grin"], [tl("L10", 5.6), "smile_closed"]]), { mode: "stroll", phase: (t * 2) % 1, scale: 1.05 });
    }
  }
  void fxBang; void hh; void lerp; void smooth;
};

export const EPISODE: Episode = { id: "marathon", total: TOTAL, shots: SHOTS, xfade: XFADE, flashAt: FLASH_AT, cams: CAMS, kicks: KICKS, dof: DOF, build: buildSet, stage };
