// "The Shortest War in History" (History ep. 1) — shot plan, camera, lens, cast.
import TL from "./timeline.json";
import { Episode, Key, Dof, V3, ShotDef, FPS, dolly, zoom, orbit, pushK, smooth, seg, q, lerp } from "../toon/core";
import { Stage, CamInfo, card } from "../toon/cast";
import { fxBang, fxWhat, fxSweat, fxImpact } from "../toon/fx";
import { fxBurst, fxSplash, fxPuff, Outfit } from "../toon/toon";
import { put, exprAt } from "../toon/kit";
import { Pen } from "../toon/toon";
import { buildSet, watchCard } from "./set";

export const TOTAL = TL.total;
const L = TL.lines as Record<string, { t0: number; t1: number }>;
const tl = (id: string, d = 0) => L[id].t0 + d;

export const PAL: V3 = [0, 0, -20], CONS: V3 = [30, 0, -16], YACHT: V3 = [-10, 0, 16];
export const SHIPS: [number, number][] = [[-22, 46], [2, 54], [26, 46]];
const FIRE = tl("L05", 1.4);                                  // "The ships open fire"
export const clockMin = { FIRE };
export const shipIn = (t: number) => smooth(seg(t, tl("L03", 0.8), tl("L03", 4.5)));
export const yachtSink = (t: number) => smooth(seg(t, tl("L06", 2.6), tl("L06", 5.2)));
export const fireAt = (t: number) => seg(t, tl("L06", 0.2), tl("L06", 1.2)) * (1 - seg(t, tl("L08", 0.5), tl("L09", 2.5)) * 0.7);
export const smokeAt = (t: number) => (t < tl("L06", 0) ? 0 : 0.3 + 0.7 * seg(t, tl("L06", 0), tl("L06", 2.0)));
/** minutes past nine on the watch: 59 → 0 at FIRE → 38 by the end of the war line */
const minutesAt = (t: number) => (t < FIRE ? lerp(54, 60, seg(t, tl("L05", 0), FIRE)) : lerp(0, 38, smooth(seg(t, FIRE, tl("L08", 1.4)))));
const hourAt = (t: number) => (t < FIRE ? 8 : 9);

const OFFICER: Outfit = { jacket: "#22305a", pants: "#f1efe6", boots: "#2b2b33", hat: "pith", cap: "#f4f1e6", moustache: "#6a4a2a", skin: "#ffe2c2", build: "stout", buttons: "#e8c45a" };
const KHALID: Outfit = { jacket: "#f4f1e6", pants: "#f1efe6", boots: "#6a4a2a", hat: "turban", cap: "#f4f1e6", sash: "#2f8a4f", skin: "#b07a52", moustache: "#2a201a" };
const NEWSULTAN: Outfit = { ...KHALID, cap: "#e9d9a8", sash: "#c0353a", skin: "#9c6a46" };
const SAILOR: Outfit = { jacket: "#f4f1e6", pants: "#22305a", boots: "#2b2b33", hat: "cap", cap: "#ffffff", skin: "#a8724c" };
const CLERK: Outfit = { jacket: "#3f6fb5", pants: "#2f3542", boots: "#2b2b33", hat: "turban", cap: "#d9c9a8", skin: "#b07a52" };
const GUARD: Outfit = { jacket: "#c0353a", pants: "#f1efe6", boots: "#2b2b33", hat: "turban", cap: "#c0353a", skin: "#a8724c" };

export const SHOTS: ShotDef[] = [
  { id: 1, a: 0, b: 188, light: "golden", sunAz: 40, sunEl: 14 },
  { id: 2, a: 188, b: 444, light: "day", sunAz: 120, sunEl: 40 },
  { id: 3, a: 444, b: 658, light: "golden", sunAz: 160, sunEl: 12 },
  { id: 4, a: 658, b: 752, light: "day", sunAz: 110, sunEl: 35 },
  { id: 5, a: 752, b: 856, light: "day", sunAz: 110, sunEl: 35 },
  { id: 6, a: 856, b: 1042, light: "day", sunAz: 120, sunEl: 30 },
  { id: 7, a: 1042, b: 1172, light: "day", sunAz: 120, sunEl: 30 },
  { id: 8, a: 1172, b: 1350, light: "day", sunAz: 120, sunEl: 45 },
  { id: 9, a: 1350, b: 1475, light: "golden", sunAz: 30, sunEl: 8 },
  { id: 10, a: 1475, b: 1690, light: "day", sunAz: 130, sunEl: 40 },
  { id: 11, a: 1690, b: TOTAL, light: "golden", sunAz: 40, sunEl: 12 },
];
export const XFADE: Record<number, number> = { 3: 8, 9: 10, 10: 8, 11: 10 };
export const FLASH_AT = [Math.round(FIRE * FPS)];
const KICKS: [number, number][] = [[FIRE, 1.2], [FIRE + 0.6, 0.8], [FIRE + 1.1, 0.8], [tl("L06", 0.3), 0.6], [tl("L10", 3.4), 0.6]];

const C = (base: V3, d: V3): V3 => [base[0] + d[0], base[1] + d[1], base[2] + d[2]];
const OFF: V3 = [14, 0.6, -5.2], BAL: V3 = [PAL[0] - 3, 8.1 + 0.25, PAL[2] + 7.0];
export const CAMS: Record<number, Key[]> = {
  1: [
    { f: 0, s: (f) => zoom([8, 6, 60], [0, 12, -10], 46, pushK(f, 0, 0.002)) }, // the harbour, the palace, a giant watch in the sky
    { f: 96, cut: true, s: (f) => dolly(C(OFF, [1.0, 1.7, 3.6]), C(OFF, [0, 1.7, 0]), pushK(f, 96, 0.004, 0.008, 30), { fov: 38, roll: 0.04 }) }, // the officer's watch
  ],
  2: [
    { f: 188, s: (f) => orbit(C(PAL, [0, 8, 6]), 34, -0.25 + 0.002 * (f - 188), 6, { fov: 46 }) }, // the palace
    { f: 330, cut: true, s: (f) => dolly(C(BAL, [1.2, 0.6, 5.0]), C(BAL, [0, 1.6, 0]), pushK(f, 330, 0.003), { fov: 40, roll: -0.04 }) }, // Khalid on the balcony
  ],
  3: [
    { f: 444, s: (f) => dolly([-6, 4, -2], [10, 3, 50], pushK(f, 444, 0.002), { fov: 48 }) }, // warships glide in
    { f: 560, cut: true, s: (f) => dolly(C(OFF, [0.9, 1.5, 3.0]), C(OFF, [0, 1.4, 0]), pushK(f, 560, 0.004), { fov: 38 }) }, // the note
  ],
  4: [{ f: 658, s: (f) => dolly(C(PAL, [3, 3, 18]), C(PAL, [0, 3.5, 6]), pushK(f, 658, 0.004, 0.008, 24), { fov: 42 }) }], // barricade
  5: [
    { f: 752, s: (f) => dolly([0, 18, 26], [0, 22, -20], pushK(f, 752, 0.004, 0.01, 30), { fov: 40 }) }, // the watch hits nine
    { f: Math.round(FIRE * FPS) - 2, cut: true, s: (f) => dolly([-30, 3, 20], [2, 3, 50], pushK(f, Math.round(FIRE * FPS), 0.003), { fov: 46, roll: 0.06 }) }, // the guns
  ],
  6: [
    { f: 856, s: (f) => zoom([10, 5, 50], [0, 10, -18], 46, pushK(f, 856, 0.002)) }, // palace burning
    { f: 940, cut: true, s: (f) => dolly(C(YACHT, [6, 2.5, 16]), C(YACHT, [1, 0.5, 0]), pushK(f, 940, 0.003), { fov: 44, roll: -0.05 }) }, // the yacht settles
  ],
  7: [{ f: 1042, s: (f) => dolly(C(PAL, [22, 2.0, 12]), C(PAL, [22, 1.6, 2]), pushK(f, 1042, 0.003), { fov: 44 }) }], // Khalid slips out the back
  8: [
    { f: 1172, s: (f) => dolly([0, 18, 26], [0, 22, -20], pushK(f, 1172, 0.003), { fov: 40 }) }, // 9:40
    { f: 1240, cut: true, s: (f) => dolly(C(BAL, [1.4, 0.5, 6]), C(BAL, [0, 1.6, 0]), pushK(f, 1240, 0.003), { fov: 40, roll: 0.04 }) }, // the new sultan
  ],
  9: [{ f: 1350, s: (f) => zoom([-14, 4, 46], [0, 10, -20], 44, pushK(f, 1350, 0.0015)) }], // quiet: the smoking palace
  10: [
    { f: 1475, s: (f) => dolly(C(PAL, [1.5, 1.6, 12]), C(PAL, [0, 1.6, 7.5]), pushK(f, 1475, 0.003), { fov: 40 }) }, // the bill slides under the door
    { f: 1580, cut: true, s: (f) => dolly(C(PAL, [0.8, 1.7, 10]), C(PAL, [0, 1.7, 7.6]), pushK(f, 1580, 0.004, 0.009, 24), { fov: 36, roll: -0.05 }) },
  ],
  11: [
    { f: 1690, s: (f) => dolly(C(OFF, [0.9, 1.7, 3.2]), C(OFF, [0, 1.7, 0]), pushK(f, 1690, 0.003), { fov: 38 }) }, // snap the watch shut
    { f: 1760, dur: 40, s: (f) => zoom([8, 6, 60], [0, 12, -10], 46, pushK(f, 1760, 0.0015)) },
  ],
};
export const DOF: Dof[] = [
  { f: 0, cInf: 0 }, { f: 96, cInf: 13 }, { f: 188, cInf: 0 }, { f: 330, cInf: 11 }, { f: 444, cInf: 0 }, { f: 560, cInf: 13 },
  { f: 658, cInf: 6 }, { f: 752, cInf: 0 }, { f: 940, cInf: 6 }, { f: 1042, cInf: 8 }, { f: 1172, cInf: 0 }, { f: 1240, cInf: 11 },
  { f: 1350, cInf: 0 }, { f: 1475, cInf: 9 }, { f: 1580, cInf: 13 }, { f: 1690, cInf: 13 }, { f: 1760, dur: 40, cInf: 0 },
];

/** paper note with a clock at nine; invoice with a shell and coins */
const noteCard = (p: Pen) => { p.poly([[40, 30], [260, 40], [250, 270], [30, 260]], "#fffaf0", 10); p.ell(150, 150, 70, 70, "#ffffff", 8); p.stroke([[150, 150], [150, 95]], 10); p.stroke([[150, 150], [95, 150]], 12); p.stroke([[60, 230], [230, 236]], 6, "#c0353a"); };
const billCard = (p: Pen) => {
  p.poly([[40, 20], [260, 30], [250, 290], [30, 280]], "#fffaf0", 10);
  p.poly([[80, 80], [120, 80], [120, 150], [100, 170], [80, 150]], "#8a8f9a", 8);
  for (let k = 0; k < 4; k++) p.ell(190, 160 - k * 18, 36, 12, "#e8c45a", 7);
  for (let k = 0; k < 3; k++) p.stroke([[60, 200 + k * 22], [230, 204 + k * 22]], 6);
};
const flame = (p: Pen, k: number) => { const w = 1 + 0.1 * Math.sin(k); p.poly([[150, 380], [60 * w, 250], [110, 120], [150, 20], [190, 130], [240 / w, 250]], "#ff8a2a", 10); p.poly([[150, 360], [100, 270], [150, 150], [200, 270]], "#ffd25a", 0); };

const stage = (id: number, t: number, cam: CamInfo, out: Stage) => {
  // the giant watch in the harbour sky (hook, 9:00, 9:40, end)
  if (id === 1 || id === 5 || id === 8 || id === 11) { const m = q(minutesAt(t), 6), hr = hourAt(t); card(out, `watch${m}|${hr}`, (p) => watchCard(p, m % 60, hr), 0, 22, -20, 10, 10.5, { cw: 600, ch: 620 }); }
  if (id === 1 || id === 3 || id === 11) {
    const e = id === 1 ? exprAt(t, [[0, "neutral"], [tl("L01", 3.4), "smile"]]) : id === 3 ? "stern" : "smile_closed";
    put(cam, out, { i: 40, o: OFFICER, okey: "off" }, t, OFF[0], OFF[1], OFF[2], e, { scale: 1.15, look: -1 });
    if (id === 1 || id === 11) { const m = q(minutesAt(t), 6), hr = hourAt(t); card(out, `pw${m}|${hr}`, (p) => watchCard(p, m % 60, hr), OFF[0] + 0.32, 1.45, OFF[2] + 0.4, 0.35, 0.37, { cw: 600, ch: 620 }); }
    if (id === 3 && t > tl("L03", 4.6)) card(out, "note3", (p) => noteCard(p), OFF[0] + 0.35, 1.45, OFF[2] + 0.45, 0.42, 0.42, { cw: 300, ch: 300 });
  }
  if (id === 2 || id === 4) {
    const e = id === 2 ? exprAt(t, [[0, "smile"], [tl("L02", 5.0), "grin"]]) : "stern";
    put(cam, out, { i: 41, o: KHALID, okey: "kh" }, t, BAL[0], BAL[1], BAL[2], e, { scale: 1.1, wave: id === 2 && t > tl("L02", 5.6) ? q(Math.sin(t * 7), 20) : undefined, noBlob: true });
    if (id === 4) for (let k = 0; k < 2; k++) put(cam, out, { i: 42 + k, o: GUARD, okey: "gd" }, t, PAL[0] - 3 + k * 6, 0.6, PAL[2] + 7.5, "stern", { scale: 1.05 });
    if (id === 4) for (let k = 0; k < 6; k++) if (t > tl("L04", 0.2 + k * 0.25)) card(out, "crate", (p) => { p.poly([[30, 30], [270, 30], [270, 270], [30, 270]], "#b0703f", 10); p.stroke([[30, 30], [270, 270]], 8); p.stroke([[270, 30], [30, 270]], 8); }, PAL[0] - 1.6 + (k % 3) * 1.1, 1.15 + Math.floor(k / 3) * 1.05, PAL[2] + 7.0, 1.0, 1.0, { cw: 300, ch: 300 });
  }
  if (id === 5 && t > FIRE) {
    SHIPS.forEach(([x, z], k) => { for (const d of [0, 0.6, 1.1]) { const u = q(seg(t, FIRE + d + k * 0.12, FIRE + d + k * 0.12 + 0.35), 20); if (u > 0 && u < 1) card(out, `gun${u}`, (p) => fxBurst(p, u, "#fff3b0"), x - 8.8, 2.6, z, 4, 4, { cw: 500, ch: 500, soft: true }); } });
    for (const d of [0.4, 0.9, 1.4]) { const u = q(seg(t, FIRE + d, FIRE + d + 1.0), 30); if (u > 0 && u < 1) card(out, `spl${u}`, (p) => fxSplash(p, u), -6 + d * 10, 1.0, 4, 8, 8, { cw: 800, ch: 800 }); }
  }
  if (id === 6 || id === 8 || id === 9) {
    const f = fireAt(t);
    if (f > 0.05) for (let k = 0; k < 7; k++) card(out, `flame${k % 3}${q(Math.sin(t * 9 + k), 4)}`, (p) => flame(p, t * 9 + k), PAL[0] - 12 + k * 4, 15.4 + 1.6 * f * (1 + 0.15 * Math.sin(t * 7 + k)), PAL[2] + 4, 2.4 * f, 3.2 * f, { cw: 300, ch: 400 });
  }
  if (id === 6) {
    const ys = yachtSink(t);
    put(cam, out, { i: 44, o: SAILOR, okey: "sail" }, t, YACHT[0] + 4 + ys * 6, -0.3, YACHT[2] + 4 + ys * 3, ys < 0.4 ? "shock" : "relief", { mode: "sit", wave: ys > 0.4 ? q(Math.sin(t * 8), 20) : undefined, noBlob: true, scale: 1.0 });
    if (ys > 0.05 && ys < 0.95) { const u = q((t * 1.5) % 1, 20); card(out, `bub6${u}`, (p) => fxPuff(p, u), YACHT[0], 0.2, YACHT[2], 4, 3, { soft: true }); }
  }
  if (id === 7) {
    const u = seg(t, tl("L07", 0.6), tl("L07", 3.4));
    put(cam, out, { i: 41, o: KHALID, okey: "kh" }, t, PAL[0] + 18 + u * 9, 0, PAL[2] + 2, exprAt(t, [[0, "nervous"], [tl("L07", 2.0), "whistle"]]), { mode: "stroll", phase: (t * 2) % 1, scale: 1.1 });
    card(out, `sw7${q((t * 2) % 1, 8)}`, (p) => fxSweat(p), PAL[0] + 18.5 + u * 9, 2.0 - ((t * 1.2) % 0.4), PAL[2] + 2.2, 0.2, 0.3, { cw: 120, ch: 180 });
  }
  if (id === 8) {
    put(cam, out, { i: 45, o: NEWSULTAN, okey: "ns" }, t, BAL[0], BAL[1], BAL[2], exprAt(t, [[0, "smile"], [tl("L08", 3.0), "grin"]]), { scale: 1.1, wave: t > tl("L08", 3.0) ? q(Math.sin(t * 7), 20) : undefined, noBlob: true });
  }
  if (id === 10) {
    const slide = smooth(seg(t, tl("L10", 3.2), tl("L10", 3.9)));
    put(cam, out, { i: 46, o: CLERK, okey: "clerk" }, t, PAL[0] - 0.8, 0.6, PAL[2] + 7.6, exprAt(t, [[0, "smile"], [tl("L10", 3.4), "shock"], [tl("L10", 5.4), "dazed"]]), { scale: 1.1 });
    card(out, "bill10", (p) => billCard(p), PAL[0] + 0.3 + (1 - slide) * 1.5, 0.75 + 0.6 * slide, PAL[2] + 7.9, 0.5, 0.55, { cw: 300, ch: 300, rot: (1 - slide) * 0.5 });
    if (t > tl("L10", 3.4) && t < tl("L10", 4.2)) card(out, "bang10", (p) => fxBang(p), PAL[0] - 0.6, 2.9, PAL[2] + 7.6, 0.4, 0.6, { cw: 200, ch: 300 });
  }
  void fxWhat; void fxImpact; void FPS;
};

export const EPISODE: Episode = { id: "zanzibar", total: TOTAL, shots: SHOTS, xfade: XFADE, flashAt: FLASH_AT, cams: CAMS, kicks: KICKS, dof: DOF, build: buildSet, stage };
