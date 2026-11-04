// Toon engine effects: 2D effect drawings (cards) in the same plum-ink language as toon.ts, plus 3D glows and
// particle systems (THREE.Points) posed deterministically from time. Glows/particles use HDR colours (> 1) so the
// bloom pass (threshold 1.0) picks them up; they live on the NOINK layer.
import * as THREE from "three";
import { Pen, INK } from "./toon";
import { NOINK } from "./ink";
import { hh } from "./core";
import { ctex } from "./paint";

type P2 = [number, number];
const rad = (d: number) => (d * Math.PI) / 180;

// ---------------- 2D effect drawings (design canvas = the card's cw x ch at k = 1) ----------------
/** speed lines streaming up/down a card (400 x 800): t = phase 0..1 */
export const fxSpeed = (p: Pen, t: number, col = "#fff6e0") => {
  for (let i = 0; i < 14; i++) {
    const x = 30 + hh(i, 1) * 340, len = 120 + hh(i, 2) * 260, y = ((hh(i, 3) + t) % 1) * 1100 - 250;
    p.stroke([[x, y], [x, y + len]], 6 + hh(i, 4) * 8, col);
  }
};
/** "!" pop over a head (200 x 300) */
export const fxBang = (p: Pen, col = "#ffd23a") => {
  p.poly([[70, 20], [130, 20], [115, 190], [85, 190]], col, 10);
  p.ell(100, 245, 26, 26, col, 10);
};
/** "?" pop (200 x 300) */
export const fxWhat = (p: Pen, col = "#8fd3ff") => {
  const pts: P2[] = [];
  for (let i = 0; i <= 20; i++) { const a = rad(200 + (i / 20) * 230); pts.push([100 + 55 * Math.cos(a), 85 + 55 * Math.sin(a)]); }
  pts.push([100, 175]);
  p.line(pts, col, 26);
  p.ell(100, 245, 20, 20, col, 10);
};
/** sweat drop (120 x 180) */
export const fxSweat = (p: Pen) => p.poly([[60, 10], [100, 110], [90, 150], [60, 165], [30, 150], [20, 110]], "#9fd8ff", 8);
/** heat shimmer: wavy lines rising (300 x 400), t = phase */
export const fxHeat = (p: Pen, t: number, col = "#ffcf6a") => {
  for (let k = 0; k < 3; k++) {
    const pts: P2[] = [];
    for (let i = 0; i <= 16; i++) { const y = 380 - i * 22; pts.push([70 + k * 80 + 18 * Math.sin(i * 0.9 + t * 6 + k), y]); }
    p.line(pts, col, 10);
  }
};
/** four-point sparkle (200 x 200) */
export const fxSparkle = (p: Pen, col = "#fffbe0") => {
  const pts: P2[] = [];
  for (let i = 0; i < 8; i++) { const a = rad(i * 45 - 90), r = i % 2 ? 22 : 90; pts.push([100 + r * Math.cos(a), 100 + r * Math.sin(a)]); }
  p.poly(pts, col, 8);
};
/** a big comic "impact star" with jagged rays (500 x 500), t 0..1 grows */
export const fxImpact = (p: Pen, t: number, col = "#fff3b0", col2 = "#ff9a3a") => {
  const n = 12, R = 60 + 190 * Math.min(1, t * 1.4), r = R * 0.55, pts: P2[] = [];
  for (let i = 0; i < n * 2; i++) { const a = rad((i * 180) / n + 7 * hh(i)), rr = i % 2 ? r * (0.8 + 0.3 * hh(i, 2)) : R * (0.85 + 0.2 * hh(i, 3)); pts.push([250 + rr * Math.cos(a), 250 + rr * Math.sin(a)]); }
  p.poly(pts, col2, 10);
  p.poly(pts.map(([x, y]) => [250 + (x - 250) * 0.62, 250 + (y - 250) * 0.62] as P2), col, 8);
};
/** a thought / speech cloud with a tiny pictogram drawn inside by fn (400 x 300) */
export const fxBubble = (p: Pen, fn: (p: Pen) => void, col = "#ffffff") => {
  const pts: P2[] = [];
  for (let i = 0; i < 48; i++) { const a = (i / 48) * Math.PI * 2, w = 1 + 0.07 * Math.sin(a * 7); pts.push([200 + 175 * w * Math.cos(a), 130 + 105 * w * Math.sin(a)]); }
  p.poly(pts, col, 9);
  p.ell(110, 255, 22, 16, col, 7); p.ell(80, 285, 12, 9, col, 6);
  fn(p);
};
export { INK };

// ---------------- 3D glow + particles ----------------
const softDot = () => ctex("fxSoftDot", 128, 128, (g) => {
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.35, "rgba(255,255,255,.75)"); gr.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
});
const hardDot = () => ctex("fxHardDot", 64, 64, (g) => {
  g.fillStyle = "#fff"; g.beginPath(); g.arc(32, 32, 26, 0, Math.PI * 2); g.fill();
});
const flake = () => ctex("fxFlake", 64, 64, (g) => {
  g.strokeStyle = "#fff"; g.lineWidth = 6; g.lineCap = "round";
  for (let i = 0; i < 3; i++) { const a = (i * Math.PI) / 3; g.beginPath(); g.moveTo(32 - 24 * Math.cos(a), 32 - 24 * Math.sin(a)); g.lineTo(32 + 24 * Math.cos(a), 32 + 24 * Math.sin(a)); g.stroke(); }
});

/** additive HDR halo sprite (bloom source): colour x intensity */
export class Glow {
  sprite: THREE.Sprite; mat: THREE.SpriteMaterial;
  constructor(parent: THREE.Object3D, col: string, intensity = 2.5) {
    this.mat = new THREE.SpriteMaterial({ map: softDot(), color: new THREE.Color(col).multiplyScalar(intensity), transparent: true, depthWrite: false,
      blending: THREE.AdditiveBlending, fog: false });
    this.sprite = new THREE.Sprite(this.mat);
    this.sprite.layers.set(NOINK); this.sprite.renderOrder = 4;
    parent.add(this.sprite);
  }
  set(x: number, y: number, z: number, size: number, k = 1, visible = true) {
    this.sprite.visible = visible && k > 0.001; this.sprite.position.set(x, y, z); this.sprite.scale.setScalar(size); this.mat.opacity = Math.min(1, k);
  }
}

export type PartFn = (i: number, out: THREE.Vector3) => boolean; // returns false = hidden
/** N billboard particles; pose(fn) places each one (deterministic); kind = soft (additive glow), dot (solid), flake (snow) */
export class Particles {
  pts: THREE.Points; geo: THREE.BufferGeometry; n: number;
  constructor(parent: THREE.Object3D, n: number, col: string, size: number, kind: "soft" | "dot" | "flake" = "soft", intensity = 1) {
    this.n = n;
    this.geo = new THREE.BufferGeometry();
    this.geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    const additive = kind === "soft";
    const mat = new THREE.PointsMaterial({ size, map: kind === "soft" ? softDot() : kind === "flake" ? flake() : hardDot(), color: new THREE.Color(col).multiplyScalar(intensity),
      transparent: true, depthWrite: !additive, alphaTest: additive ? 0 : 0.4, blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending, sizeAttenuation: true, fog: !additive });
    this.pts = new THREE.Points(this.geo, mat);
    this.pts.frustumCulled = false; this.pts.layers.set(NOINK); this.pts.renderOrder = 3;
    parent.add(this.pts);
  }
  pose(fn: PartFn, visible = true) {
    this.pts.visible = visible;
    if (!visible) return;
    const a = this.geo.attributes.position as THREE.BufferAttribute, v = new THREE.Vector3();
    for (let i = 0; i < this.n; i++) { if (fn(i, v.set(0, 0, 0))) a.setXYZ(i, v.x, v.y, v.z); else a.setXYZ(i, 0, -1e5, 0); }
    a.needsUpdate = true;
  }
}
/** unlit emissive material (HDR colour so it blooms): for lava, glowing cores, screens, stars */
export const glowMat = (col: string, k = 1.6, map?: THREE.Texture) => {
  const m = new THREE.MeshBasicMaterial({ color: new THREE.Color(col).multiplyScalar(k), map, fog: false });
  return m;
};
