// Toon engine core: the episode contract + the camera grammar of the bridge short, made generic.
// An episode (src/videos/<slug>/story.ts) exports an Episode: shots, camera keys, kicks, lens table, a set builder
// (static + per-frame posed meshes) and a stage (characters + effect cards per frame). world.ts and Short.tsx do the rest.
import * as THREE from "three";
import type { LightName } from "./lights";
import type { Stage, CamInfo } from "./cast";
import type { Ray } from "./build";

export const FPS = 30;
export type V3 = [number, number, number];
export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const smooth = (x: number) => { const u = clamp01(x); return u * u * (3 - 2 * u); };
export const easeOut = (u: number) => 1 - (1 - clamp01(u)) ** 3;
export const easeIn = (u: number) => clamp01(u) ** 2;
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const seg = (x: number, a: number, b: number) => clamp01((x - a) / (b - a));
export const lin = (pts: [number, number][], x: number) => {
  if (x <= pts[0][0]) return pts[0][1];
  for (let i = 1; i < pts.length; i++) if (x <= pts[i][0]) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
    return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
  }
  return pts[pts.length - 1][1];
};
export const hh = (i: number, s = 0) => { const v = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return v - Math.floor(v); };
/** quantise (keeps the canvas cache small) */
export const q = (v: number, n = 120) => Math.round(v * n) / n;

// ---------------- shots ----------------
/** one shot: frames [a, b), its light preset, optional fixed sun (degrees, camera-relative: 0 = backlight, 90 = screen right) */
export type ShotDef = { id: number; a: number; b: number; light: LightName; sunAz?: number; sunEl?: number; place?: string };

// ---------------- camera ----------------
export type Cam = { pos: V3; look: V3; fov: number; roll: number };
export type Shot = Partial<Cam> & { pos: V3; look: V3 };
export type Key = { f: number; dur?: number; cut?: boolean; s: (f: number) => Shot };
/** reference camera ease: symmetric smootherstep */
export const glide = (u: number) => { const x = clamp01(u); return x * x * x * (x * (6 * x - 15) + 10); };
const mixCam = (a: Cam, b: Cam, k: number): Cam => ({
  pos: a.pos.map((v, i) => v + (b.pos[i] - v) * k) as V3, look: a.look.map((v, i) => v + (b.look[i] - v) * k) as V3,
  fov: a.fov + (b.fov - a.fov) * k, roll: a.roll + (b.roll - a.roll) * k,
});
const full = (c: Shot): Cam => ({ fov: 40, roll: 0, ...c });
export const runKeys = (keys: Key[], f: number) => {
  let cur = full(keys[0].s(f));
  for (let i = 1; i < keys.length; i++) {
    const k = keys[i];
    if (f < k.f) break;
    cur = k.cut ? full(k.s(f)) : mixCam(cur, full(k.s(f)), glide((f - k.f) / (k.dur ?? 24)));
  }
  return cur;
};
/** push-in factor since f0 (subject grows ~rate per frame; `punch` raises it for the first n frames) */
export const pushK = (f: number, f0: number, rate: number, punch = 0, n = 35) => {
  const x = Math.max(0, f - f0);
  let s = rate * x;
  if (punch > rate) for (let i = 0; i < Math.min(x, n); i++) s += (punch - rate) * Math.max(0, Math.min(1, (i + 0.5) / 8, (n - i - 0.5) / 8));
  return Math.exp(-s);
};
/** dolly push: camera slides toward the look point by factor k */
export const dolly = (pos: V3, look: V3, k: number, rest: Partial<Cam> = {}): Shot =>
  ({ pos: [look[0] + (pos[0] - look[0]) * k, look[1] + (pos[1] - look[1]) * k, look[2] + (pos[2] - look[2]) * k], look, ...rest });
/** zoom push (camera stays put): tan(fov/2) shrinks by k */
export const zoom = (pos: V3, look: V3, fov: number, k: number, rest: Partial<Cam> = {}): Shot =>
  ({ pos, look, fov: (360 / Math.PI) * Math.atan(Math.tan((fov * Math.PI) / 360) * k), ...rest });
/** orbit: camera on a circle of radius r around look, angle a (rad, 0 = +z side), height h over look */
export const orbit = (look: V3, r: number, a: number, h: number, rest: Partial<Cam> = {}): Shot =>
  ({ pos: [look[0] + r * Math.sin(a), look[1] + h, look[2] + r * Math.cos(a)], look, ...rest });
export const rolled = (s: (f: number) => Shot, roll: number) => (f: number): Shot => ({ ...s(f), roll });

/** impact kicks: image offset flips sign every frame, decays to 0 in 7 f */
export const kickAt = (kicks: [number, number][], t: number) => {
  let a = 0;
  for (const [t0, g] of kicks) {
    const n = Math.floor((t - t0) * FPS + 1e-6);
    if (n >= 0 && n < 7) a += g * (n % 2 ? -1 : 1) * (1 - n / 7) ** 1.5;
  }
  return a;
};

// ---------------- lens ----------------
export type Dof = { f: number; dur?: number; cInf: number; focus?: (f: number) => V3 };
export const dofFrom = (tab: Dof[], f: number) => {
  let i = 0; while (i + 1 < tab.length && f >= tab[i + 1].f) i++;
  const d = tab[i], p = tab[Math.max(0, i - 1)];
  const k = d.dur ? Math.min(1, (f - d.f) / d.dur) : 1;
  return { cInf: p.cInf + (d.cInf - p.cInf) * k, focus: d.focus };
};

// ---------------- the episode contract ----------------
/** what an episode's set builder gets once */
export type BuildCtx = { root: THREE.Group };
/** per-frame posing of the episode's own meshes (dynamic set pieces, emissive glows, particles) */
export type PoseCtx = { id: number; f: number; t: number; cam: THREE.PerspectiveCamera; light: LightName };
export type SetHandle = { pose?: (c: PoseCtx) => void };
export type Episode = {
  id: string;
  total: number;
  shots: ShotDef[];
  /** crossfade length (frames) into shot id */
  xfade?: Record<number, number>;
  /** white flash frames (4-frame decay) */
  flashAt?: number[];
  cams: Record<number, Key[]>;
  kicks?: [number, number][];
  dof: Dof[];
  build: (ctx: BuildCtx) => SetHandle;
  stage: (id: number, t: number, cam: CamInfo, out: Stage, f: number) => void;
  /** sight lines: props/houses that would block these rays are not built */
  sight?: () => Ray[];
  /** clouds in day/golden skies (default true) */
  clouds?: boolean;
};

export const shotAt = (ep: Episode, f: number) => ep.shots.find((s) => f >= s.a && f < s.b) ?? ep.shots[ep.shots.length - 1];
export const layersAt = (ep: Episode, f: number): { id: number; alpha: number }[] => {
  for (const s of ep.shots) {
    const x = ep.xfade?.[s.id];
    if (x && f >= s.a - x / 2 && f < s.a + x / 2) return [{ id: s.id - 1, alpha: 1 }, { id: s.id, alpha: (f - (s.a - x / 2) + 1) / (x + 1) }];
  }
  return [{ id: shotAt(ep, f).id, alpha: 1 }];
};
export const camAt = (ep: Episode, id: number, f: number): Cam => {
  const c = runKeys(ep.cams[id], f), a = kickAt(ep.kicks ?? [], f / FPS);
  if (!a) return c;
  const d: V3 = [c.look[0] - c.pos[0], c.look[1] - c.pos[1], c.look[2] - c.pos[2]];
  const L = Math.hypot(...d), h = Math.hypot(d[0], d[2]) || 1;
  const m = (3 / 640) * Math.tan((c.fov * Math.PI) / 360) * L * a;
  return { ...c, look: [c.look[0] - (d[2] / h) * m, c.look[1] + 0.6 * m, c.look[2] + (d[0] / h) * m], roll: c.roll + a * 0.004 };
};
export const flashAlpha = (ep: Episode, f: number) => {
  for (const a of ep.flashAt ?? []) if (f >= a && f < a + 4) return [1, 0.75, 0.45, 0.2][f - a];
  return 0;
};
