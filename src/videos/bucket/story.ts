// "The War of the Bucket" (History ep. 5) — shot plan, camera, lens, cast.
import TL from "./timeline.json";
import { Episode, Key, Dof, V3, ShotDef, FPS, dolly, zoom, orbit, pushK, smooth, seg, q, hh, lerp } from "../toon/core";
import { Stage, CamInfo, card } from "../toon/cast";
import { fxBang, fxWhat, fxSparkle } from "../toon/fx";
import { fxSplash, fxPuff, Outfit, Pen } from "../toon/toon";
import { put, exprAt, FOLK } from "../toon/kit";
import { buildSet } from "./set";

export const TOTAL = TL.total;
const L = TL.lines as Record<string, { t0: number; t1: number }>;
const tl = (id: string, d = 0) => L[id].t0 + d;

export const MOD: V3 = [-70, 0, -70], BOL: V3 = [70, 0, -70], CASTLE: V3 = [0, 0, -100], WELL: V3 = [40, 0, -30], HALL: V3 = [0, 0, 3000];
const FLIP = tl("L03", 0.9);
export const castleFlip = (t: number) => t > FLIP;
const GRAB = tl("L07", 4.4);
/** where the bucket is: on the cushion (hall), hanging at the well, then on a Modenese shoulder */
export const bucketAt = (id: number, t: number): { p: V3; tilt: number; yaw: number; s: number } => {
  if (id === 1 || id === 8 || id === 9 && t < tl("L09", 2.4)) return { p: [HALL[0], 1.68, HALL[2] - 3], tilt: 0, yaw: t * 0.05, s: 1 };
  if (id === 7) {
    if (t < GRAB) return { p: [WELL[0] + 3, 1.7, WELL[2]], tilt: 0, yaw: 0, s: 1 };
    const u = seg(t, GRAB, GRAB + 3.2), x = WELL[0] + 3 - u * 5;
    return { p: [x, 2.35 + 0.05 * Math.sin(t * 9), WELL[2] + 1.2], tilt: 0.15, yaw: 0, s: 1 };
  }
  return { p: [0, -50, 0], tilt: 0, yaw: 0, s: 1 };
};

const GUARD: Outfit = { jacket: "#3f6fb5", pants: "#f2c230", boots: "#2b2b33", hat: "hood", cap: "#f2c230", skin: "#f5c9a0", moustache: "#5a3b2a", build: "stout" };
const MODS: Outfit = { jacket: "#3f6fb5", pants: "#f2c230", boots: "#3a2a20", hat: "hood", cap: "#f2c230", skin: "#f5c9a0" };
const BOLS: Outfit = { jacket: "#c0353a", pants: "#f4f1e6", boots: "#3a2a20", hat: "hood", cap: "#f4f1e6", skin: "#ecd0b6" };
const BOLCIT: Outfit = { jacket: "#8a3b4a", pants: "#3b3f52", boots: "#3a2a20", hat: "hair", hair: "#3a2a20", skin: "#ecd0b6", moustache: "#3a2a20" };

export const SHOTS: ShotDef[] = [
  { id: 1, a: 0, b: 245, light: "golden", sunAz: 150, sunEl: 35 },
  { id: 2, a: 245, b: 415, light: "golden", sunAz: 90, sunEl: 15 },
  { id: 3, a: 415, b: 556, light: "day", sunAz: 120, sunEl: 40 },
  { id: 4, a: 556, b: 736, light: "day", sunAz: 110, sunEl: 35 },
  { id: 5, a: 736, b: 876, light: "day", sunAz: 110, sunEl: 35 },
  { id: 6, a: 876, b: 1066, light: "golden", sunAz: 20, sunEl: 8 },
  { id: 7, a: 1066, b: 1280, light: "golden", sunAz: 20, sunEl: 6 },
  { id: 8, a: 1280, b: 1540, light: "golden", sunAz: 150, sunEl: 35 },
  { id: 9, a: 1540, b: TOTAL, light: "golden", sunAz: 150, sunEl: 30 },
];
export const XFADE: Record<number, number> = { 2: 10, 6: 8, 8: 10 };
export const FLASH_AT = [Math.round(tl("L01", 6.6) * FPS)];
const KICKS: [number, number][] = [[tl("L01", 6.6), 0.7], [FLIP, 0.7], [tl("L05", 1.0), 0.5], [GRAB, 0.6], [tl("L08", 4.4), 0.6]];

const C = (base: V3, d: V3): V3 => [base[0] + d[0], base[1] + d[1], base[2] + d[2]];
const BK: V3 = [HALL[0], 1.68, HALL[2] - 3];
/** owner rule #4 (every shot moves): swing the camera position around the look point by `yaw` rad/frame and raise it `rise` m/frame */
const arc = (pos: V3, look: V3, f: number, f0: number, yaw: number, rise = 0): V3 => {
  const a = yaw * (f - f0), dx = pos[0] - look[0], dz = pos[2] - look[2];
  return [look[0] + dx * Math.cos(a) - dz * Math.sin(a), pos[1] + rise * (f - f0), look[2] + dx * Math.sin(a) + dz * Math.cos(a)];
};
const A = (pos: V3, look: V3, f: number, f0: number, yaw: number, rise = 0) => ({ p: arc(pos, look, f, f0, yaw, rise), l: look });
/** the trophy shot pans with the soldier who marches off with the bucket */
const carry = (f: number) => 4.2 * smooth(seg(f / FPS, GRAB, GRAB + 3.2));
export const CAMS: Record<number, Key[]> = {
  1: [
    { f: 0, s: (f) => { const { p, l } = A(C(HALL, [2.6, 2.4, 6]), C(HALL, [0, 1.6, -3]), f, 0, 0.0032, -0.004); return dolly(p, l, pushK(f, 0, 0.003), { fov: 42 }); } }, // the guarded treasure... (orbit round the plinth)
    { f: 150, dur: 34, s: (f) => { const { p, l } = A(C(BK, [0.5, 0.6, 3.6]), C(BK, [0, 0.05, 0]), f, 150, -0.003); return dolly(p, l, pushK(f, 150, 0.003, 0.006, 30), { fov: 38, roll: 0.04 }); } }, // ...is a bucket
  ],
  2: [{ f: 245, s: (f) => { const { p, l } = A([-128, 26, -22], [60, 6, -78], f, 245, 0.0008, -0.03); return dolly(p, l, pushK(f, 245, 0.0018), { fov: 46 }); } }], // two rival cities: descending crane past the signpost
  3: [{ f: 415, s: (f) => { const { p, l } = A(C(CASTLE, [6, 10, 34]), C(CASTLE, [0, 12, 0]), f, 415, 0.0028, 0.035); return dolly(p, l, pushK(f, 415, 0.003, 0.007, 30), { fov: 42 }); } }], // the castle changes hands: rising orbit
  4: [
    { f: 556, s: (f) => zoom(arc([0, 30, 60], [0, 0, 0], f, 556, 0.0022, -0.06), [0, 0, 0], 48, pushK(f, 556, 0.002)) }, // the armies face off: swooping crane
    { f: 650, cut: true, s: (f) => { const { p, l } = A([-14, 2, 16], [-8, 1.6, 2], f, 650, -0.003); return dolly(p, l, pushK(f, 650, 0.003), { fov: 44, roll: 0.04 }); } }, // seven thousand
  ],
  5: [
    { f: 736, s: (f) => { const { p, l } = A([2, 2.4, 18], [-2, 1.2, 6], f, 736, 0.003); return dolly(p, l, pushK(f, 736, 0.003), { fov: 44 }); } }, // the fake crossing
    { f: 810, cut: true, s: (f) => { const { p, l } = A([14, 2, 0], [8, 1.6, -6], f, 810, -0.003); return dolly(p, l, pushK(f, 810, 0.004, 0.008, 24), { fov: 40, roll: -0.05 }); } }, // Bologna turns to look
  ],
  6: [
    { f: 876, s: (f) => zoom(arc([-30, 18, 40], [10, 0, -10], f, 876, -0.0025, -0.05), [10, 0, -10], 46, pushK(f, 876, 0.002)) }, // around the back
    { f: 970, cut: true, s: (f) => { const { p, l } = A([30, 2, 6], [44, 2, -20], f, 970, 0.0035); return dolly(p, l, pushK(f, 970, 0.003), { fov: 46, roll: 0.05 }); } }, // running home at sunset
  ],
  7: [
    { f: 1066, s: (f) => { const { p, l } = A(C(WELL, [-6, 3, 14]), C(WELL, [0, 3, -4]), f, 1066, -0.003, -0.01); return dolly(p, l, pushK(f, 1066, 0.003), { fov: 44 }); } }, // to the walls of Bologna
    { f: 1170, cut: true, s: (f) => { const d = carry(f); return dolly(arc(C(WELL, [2.4 - d, 2.2, 7.0]), C(WELL, [1.6 - d, 1.9, 1.0]), f, 1170, 0.0025), C(WELL, [1.6 - d, 1.9, 1.0]), pushK(f, 1170, 0.003, 0.006, 30), { fov: 40 }); } }, // the trophy: pan with the thief
  ],
  8: [
    { f: 1280, s: (f) => { const { p, l } = A(C(HALL, [0.4, 1.9, 8]), C(HALL, [0, 1.5, -2.5]), f, 1280, 0.0028, 0.006); return dolly(p, l, pushK(f, 1280, 0.0025), { fov: 44 }); } }, // tourists stare
    { f: 1420, cut: true, s: (f) => { const { p, l } = A(C(BK, [0.4, 0.5, 3.4]), C(BK, [0, 0.05, 0]), f, 1420, 0.0032); return dolly(p, l, pushK(f, 1420, 0.003, 0.006, 24), { fov: 38, roll: -0.04 }); } },
  ],
  9: [
    { f: 1540, s: (f) => { const { p, l } = A(C(HALL, [1.6, 2.0, 5.5]), C(HALL, [0, 1.6, -3]), f, 1540, -0.003); return dolly(p, l, pushK(f, 1540, 0.003), { fov: 42 }); } },
    { f: 1615, cut: true, s: (f) => { const { p, l } = A(C(WELL, [3.6, 1.8, 7]), C(WELL, [2.3, 1.5, 0.6]), f, 1615, 0.003, 0.012); return dolly(p, l, pushK(f, 1615, 0.003), { fov: 40, roll: 0.04 }); } }, // Bologna's empty well
  ],
};
export const DOF: Dof[] = [
  { f: 0, cInf: 10 }, { f: 150, dur: 34, cInf: 14 }, { f: 245, cInf: 0 }, { f: 556, cInf: 0 }, { f: 650, cInf: 8 }, { f: 736, cInf: 4 },
  { f: 810, cInf: 10 }, { f: 876, cInf: 0 }, { f: 970, cInf: 6 }, { f: 1066, cInf: 4 }, { f: 1170, cInf: 12 }, { f: 1280, cInf: 8 },
  { f: 1420, cInf: 14 }, { f: 1540, cInf: 10 }, { f: 1615, cInf: 12 },
];

const army = (cam: CamInfo, out: Stage, t: number, o: Outfit, key: string, n: number, x0: number, z0: number, dx: number, dz: number, opt: { run?: number; look?: number; expr?: "stern" | "shock" | "pained" | "grin" | "nervous" | "neutral" | "laugh" } = {}) => {
  for (let k = 0; k < n; k++) {
    const x = x0 + (k % 6) * dx + hh(k, 3) * 0.6 + (opt.run ?? 0), z = z0 + Math.floor(k / 6) * dz + hh(k, 4) * 0.6;
    put(cam, out, { i: 400 + k + (key === "b" ? 100 : 0), o, okey: key }, t, x, 0, z, opt.expr ?? "stern", { mode: opt.run ? "stroll" : "stand", phase: (t * 2 + hh(k, 5)) % 1, look: opt.look ?? 0, scale: 1.0 });
  }
};

// owner rule #5: the payoff places say who they are (unlit painted cards, drawn with fillText)
const txt = (p: Pen, s: string, x: number, y: number, px: number, col: string) => { const g = p.g; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = col; g.font = `bold ${px}px sans-serif`; g.fillText(s, x, y); };
/** hall banner (1200 x 420): Modena's town hall */
const hallBanner = (p: Pen) => { p.poly([[30, 30], [1170, 30], [1170, 330], [600, 400], [30, 330]], "#7a1f2a", 14); p.poly([[70, 64], [1130, 64], [1130, 300], [600, 360], [70, 300]], null, 6); txt(p, "PALAZZO COMUNALE", 600, 135, 92, "#f2c230"); txt(p, "MODENA", 600, 250, 120, "#fff4dc"); };
/** museum placard on a stand (500 x 760) */
const placard = (p: Pen) => { p.poly([[230, 380], [270, 380], [270, 740], [230, 740]], "#d9a640", 10); p.poly([[150, 720], [350, 720], [350, 750], [150, 750]], "#d9a640", 8); p.poly([[20, 30], [480, 30], [480, 400], [20, 400]], "#fff6e2", 12); txt(p, "THE STOLEN", 250, 110, 66, "#7a1f2a"); txt(p, "BUCKET", 250, 200, 92, "#7a1f2a"); txt(p, "Taken from Bologna, 1325", 250, 320, 34, "#3a2f28"); };
/** signpost (600 x 900): Modena one way, Bologna the other */
const signpost = (p: Pen) => { p.poly([[275, 180], [325, 180], [325, 900], [275, 900]], "#8a5a32", 10); p.poly([[10, 120], [300, 120], [300, 260], [10, 260], [-30, 190]].map(([x, y]) => [x + 40, y] as [number, number]), "#3f6fb5", 12); txt(p, "MODENA", 185, 192, 58, "#f2c230"); p.poly([[300, 300], [560, 300], [600, 370], [560, 440], [300, 440]], "#c0353a", 12); txt(p, "BOLOGNA", 440, 372, 56, "#ffffff"); };
/** Bologna's well sign (700 x 420): the bucket never came back */
const wellSign = (p: Pen) => { p.poly([[20, 20], [680, 20], [680, 400], [20, 400]], "#f4e3bf", 12); txt(p, "BOLOGNA", 350, 120, 110, "#c0353a"); txt(p, "WELL BUCKET:", 350, 245, 52, "#3a2f28"); txt(p, "MISSING SINCE 1325", 350, 330, 52, "#3a2f28"); };
/** city gate sign (900 x 260) */
export const gateSign = (p: Pen) => { p.poly([[20, 20], [880, 20], [880, 240], [20, 240]], "#c0353a", 12); txt(p, "BOLOGNA", 450, 135, 150, "#ffffff"); };
const hallSigns = (out: Stage) => {
  card(out, "hallBanner", hallBanner, HALL[0], 5.1, HALL[2] - 7.0, 4.6, 1.6, { cw: 1200, ch: 420 });
  card(out, "placard", placard, HALL[0] - 1.15, 0.62, HALL[2] - 2.0, 0.82, 1.25, { cw: 500, ch: 760 });
};

const stage = (id: number, t: number, cam: CamInfo, out: Stage, f: number) => {
  if (id === 1 || id === 8 || (id === 9 && f < 1615)) hallSigns(out);
  if (id === 2) card(out, "signpost", signpost, -65.4, 4.0, -24.3, 5.4, 8.1, { cw: 600, ch: 900 });
  // (the BOLOGNA gate sign is now a flat board fixed on the wall in set.ts: a billboard here swung into the wall)
  if (id === 9 && f >= 1615) card(out, "wellSign", wellSign, WELL[0] + 2.65, 1.55, WELL[2] + 1.25, 1.3, 0.78, { cw: 700, ch: 420 });
  if (id === 1) put(cam, out, { i: 380, o: GUARD, okey: "guard" }, t, HALL[0] + 1.3, 0, HALL[2] - 2.4, exprAt(t, [[0, "stern"], [tl("L01", 6.6), "smile"]]), { scale: 1.1 });
  if (id === 3) {
    if (t > FLIP && t < FLIP + 0.7) { const u = q(seg(t, FLIP, FLIP + 0.7), 12); card(out, `puff3${u}`, (p) => fxPuff(p, u), CASTLE[0] + 1.1, 16.4, CASTLE[2], 4, 4, { soft: true }); }
    if (t > FLIP + 0.3) card(out, "bang3", (p) => fxBang(p), CASTLE[0] - 2, 19, CASTLE[2], 1.2, 1.8, { cw: 200, ch: 300 });
  }
  if (id === 4) { army(cam, out, t, BOLS, "b", 30, 6, -14, 1.8, 2.2, { look: -1 }); army(cam, out, t, MODS, "m", 9, -14, 0, 1.8, 2.2, { look: 1, expr: "grin" }); }
  if (id === 5) {
    army(cam, out, t, MODS, "m", 6, -6, 4, 1.4, 2.0, { expr: "grin" });
    for (let k = 0; k < 4; k++) { const u = q(((t * 1.2) + k * 0.25) % 1, 15); card(out, `spl5${k}${u}`, (p) => fxSplash(p, u), -5 + k * 2.2, 0.8, 6.4, 3, 3, { cw: 800, ch: 800 }); }
    const look = t > tl("L05", 1.0);
    army(cam, out, t, BOLS, "b", 18, 6, -12, 1.8, 2.2, { look: look ? -1 : 0, expr: look ? "nervous" : "stern" });
    if (look) for (let k = 0; k < 3; k++) card(out, `what5${k}`, (p) => fxWhat(p), 7 + k * 3, 3.1, -12 + k * 1.5, 0.4, 0.6, { cw: 200, ch: 300 });
  }
  if (id === 6) {
    const run = t > tl("L06", 2.2);
    army(cam, out, t, MODS, "m", 9, -20 + (t - tl("L06", 0)) * 4, -24, 1.8, 2.2, { run: 0.001, expr: "grin" });
    army(cam, out, t, BOLS, "b", 18, 20, -12, 1.8, 2.2, { run: run ? (t - tl("L06", 2.2)) * 6 : 0, expr: run ? "shock" : "nervous", look: run ? 1 : -1 });
  }
  if (id === 7) {
    const grab = t > GRAB, u = seg(t, GRAB, GRAB + 3.2);
    put(cam, out, { i: 470, o: MODS, okey: "m" }, t, WELL[0] + 3 - u * 5 + (grab ? 0 : -1.2), 0, WELL[2] + 1.2, grab ? "laugh" : "grin", { mode: grab ? "march" : "stand", phase: (t * 1.6) % 1, scale: 1.1 });
    if (!grab) for (let k = 0; k < 4; k++) put(cam, out, { i: 480 + k, o: MODS, okey: "m" }, t, WELL[0] - 4 + k * 1.6, 0, WELL[2] + 4, "grin", { scale: 1.0 });
    if (grab && t < GRAB + 0.8) card(out, "spk7", (p) => fxSparkle(p), WELL[0] + 3, 3.1, WELL[2] + 1.2, 0.5, 0.5, { cw: 200, ch: 200 });
  }
  if (id === 8) {
    [[-3.2, 2.2], [-1.9, 3.0], [1.9, 2.9], [3.2, 2.0]].forEach(([x, z], k) => put(cam, out, { i: 490 + k, o: FOLK[(k + 1) % 6], okey: `fk${(k + 1) % 6}` }, t, HALL[0] + x, 0, HALL[2] + z, t > tl("L08", 4.4) ? "nervous" : "smile", { scale: 1.05, look: x > 0 ? -1 : 1 }));
    if (t > tl("L08", 4.4)) for (let k = 0; k < 2; k++) card(out, `what8${k}`, (p) => fxWhat(p), HALL[0] - 1 + k * 2.2, 3.3, HALL[2] + 1.6, 0.4, 0.6, { cw: 200, ch: 300 });
  }
  if (id === 9) {
    if (t < tl("L09", 2.4)) for (let k = 0; k < 3; k++) card(out, `spk9${k}`, (p) => fxSparkle(p), BK[0] - 0.5 + k * 0.5, BK[1] + 0.6 + 0.1 * Math.sin(t * 4 + k), BK[2] + 0.4, 0.18, 0.18, { cw: 200, ch: 200 });
    else put(cam, out, { i: 495, o: BOLCIT, okey: "bc" }, t, WELL[0] + 1.6, 0, WELL[2] + 0.8, exprAt(t, [[0, "pained"], [tl("L09", 3.4), "nervous"]]), { scale: 1.1, look: 1 });
  }
  void lerp; void smooth; void zoom;
};

export const EPISODE: Episode = { id: "bucket", total: TOTAL, shots: SHOTS, xfade: XFADE, flashAt: FLASH_AT, cams: CAMS, kicks: KICKS, dof: DOF, build: buildSet, stage };
