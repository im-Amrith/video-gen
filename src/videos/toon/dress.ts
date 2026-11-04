// Toon engine set dressing (owner feedback 2026-11-04 #2): real props instead of placeholder cones/cylinders, and a
// landscape filler for 3 depth layers. Everything goes through a Batch (merged per material) so it costs one draw per
// material. Blades/leaves are thin double-sided strips: the world ink pass draws their silhouettes, so tufts read inked.
import * as THREE from "three";
import { Batch, V, lam, prop } from "./build";
import { ctex, rep, stoneHD, beamHD, grassHD } from "./paint";
import { twoTone } from "./shade";
import { hh } from "./core";

const M4 = () => new THREE.Matrix4();
const rotY = (a: number) => new THREE.Matrix4().makeRotationY(a);

// ---------------- materials ----------------
const bladeM = (col: string) => lam("blade" + col, () => ({ color: col, side: THREE.DoubleSide }));
export const rockM = (key = "rockA", cols = ["#9a948a", "#8a847a", "#a8a296", "#7e786e"]) => lam(key, () => ({ map: stoneHD(key, cols, "#5e584f") }));
export const woodM = () => lam("woodPainted", () => ({ map: beamHD() }));
export const brassM = () => twoTone(new THREE.MeshPhongMaterial({ color: "#d9a640", specular: "#fff2c0", shininess: 90 }), 0.12);
const iceT = () => ctex("iceberg", 512, 512, (g, r) => { g.fillStyle = "#e6f3fa"; g.fillRect(0, 0, 512, 512); for (let i = 0; i < 260; i++) { g.strokeStyle = `rgba(${140 + r() * 40},${190 + r() * 30},${225 + r() * 25},${0.25 + r() * 0.3})`; g.lineWidth = 2 + r() * 6; g.beginPath(); const x = r() * 512, y = r() * 512; g.moveTo(x, y); g.lineTo(x + (r() - 0.5) * 80, y + 20 + r() * 60); g.stroke(); } });
export const iceM = () => lam("icebergM", () => ({ map: iceT() }));

// ---------------- props ----------------
/** one curved blade strip (local: base at 0, leaning out along +x), width w, height h */
const blade = (w: number, h: number, lean: number) => {
  const pts: number[] = [], n = 4;
  for (let i = 0; i <= n; i++) {
    const u = i / n, ww = w * (1 - u) * 0.5, x = lean * h * u * u, y = h * u;
    pts.push(x - ww, y, 0, x + ww, y, 0);
  }
  const idx: number[] = [];
  for (let i = 0; i < n; i++) { const a = i * 2; idx.push(a, a + 1, a + 3, a, a + 3, a + 2); }
  const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3)); g.setIndex(idx); g.computeVertexNormals();
  return g;
};
export type TuftKind = "grass" | "dry" | "wheat" | "snow" | "reed";
const TUFT: Record<TuftKind, { cols: string[]; n: number; h: number; w: number; head?: string }> = {
  grass: { cols: ["#5aa83c", "#4c9a37", "#69b545", "#7cc456"], n: 9, h: 0.55, w: 1.0 },
  dry: { cols: ["#c8b06a", "#b69e5c", "#d9c07a", "#a88e50"], n: 9, h: 0.5, w: 0.95 },
  wheat: { cols: ["#e0b040", "#cf9c34", "#ecc050", "#b8862a"], n: 10, h: 0.95, w: 1.3, head: "#f6d070" },
  snow: { cols: ["#f4f9fc", "#e2eef6", "#d0e2ee", "#ffffff"], n: 7, h: 0.35, w: 0.8 },
  reed: { cols: ["#6a8a3a", "#7a9a48", "#5a7a30", "#8aaa52"], n: 8, h: 1.2, w: 1.1, head: "#7a4a2a" },
};
/** painted tuft texture (256 x 256): filled curved blades with a plum ink outline (+ seed heads) */
const tuftTex = (kind: TuftKind, v: number) => ctex(`tuftTex2_${kind}_${v}`, 256, 256, (g, r) => {
  const T = TUFT[kind], INK = "#241726", n = T.n + 3;
  const order = Array.from({ length: n }, (_, i) => i).sort((a, b) => Math.abs(b - (n - 1) / 2) - Math.abs(a - (n - 1) / 2)); // outer blades first
  for (const i of order) {
    const u = n > 1 ? i / (n - 1) - 0.5 : 0, bx = 128 + u * 34 + (r() - 0.5) * 8;
    const tipX = 128 + u * 230 + (r() - 0.5) * 20, H = 236 * (1 - Math.abs(u) * 0.75) * (0.8 + 0.2 * r()), tipY = 254 - H, w = 15 + r() * 7;
    const cx = bx + (tipX - bx) * 0.15, cy = 254 - H * 0.7, col = T.cols[i % T.cols.length];
    const path = () => { g.beginPath(); g.moveTo(bx - w, 254); g.quadraticCurveTo(cx - w * 0.5, cy, tipX, tipY); g.quadraticCurveTo(cx + w * 0.6, cy + 10, bx + w, 254); g.closePath(); };
    path(); g.fillStyle = col; g.fill(); g.lineWidth = 4; g.strokeStyle = INK; g.lineJoin = "round"; g.stroke();
    g.strokeStyle = "rgba(255,255,255,.25)"; g.lineWidth = 3; g.beginPath(); g.moveTo(bx, 250); g.quadraticCurveTo(cx, cy + 6, tipX, tipY + 8); g.stroke();
    if (T.head && i % 2 === 0) { g.save(); g.translate(tipX, tipY + 10); g.rotate(u * 1.2); g.beginPath(); g.ellipse(0, 0, 11, 22, 0, 0, Math.PI * 2); g.fillStyle = T.head; g.fill(); g.lineWidth = 3.5; g.strokeStyle = INK; g.stroke(); g.restore(); }
  }
});
const TUFT_MATS = new Map<string, THREE.MeshBasicMaterial>();
/** painted tufts are unlit cards (their drawing carries the shading); world.ts tints them per light preset */
const tuftMat = (kind: TuftKind, v: number) => {
  const key = `${kind}_${v}`;
  let m = TUFT_MATS.get(key);
  if (!m) { m = new THREE.MeshBasicMaterial({ map: tuftTex(kind, v), alphaTest: 0.5, side: THREE.DoubleSide }); m.userData.noRecv = true; TUFT_MATS.set(key, m); }
  return m;
};
const TINT: Record<string, [number, number, number]> = { day: [0.97, 0.97, 0.95], golden: [1.0, 0.82, 0.66], night: [0.42, 0.48, 0.72], space: [0.8, 0.8, 0.85], magma: [1.0, 0.62, 0.48] };
export const setTuftTint = (light: string) => { const c = TINT[light] ?? TINT.day; for (const m of TUFT_MATS.values()) m.color.setRGB(c[0], c[1], c[2]); };
const TUFT_GEO = (() => [0, 1, 2].map((k) => { const g = new THREE.PlaneGeometry(1, 1).translate(0, 0.5, 0).rotateY((k * Math.PI) / 3); const n = g.attributes.normal as THREE.BufferAttribute; for (let i = 0; i < n.count; i++) n.setXYZ(i, 0, 1, 0); return g; }))(); // normals up: lit like the ground
/** a clustered tuft: three crossed painted cards (inked blades, seed heads for wheat/reed) */
export const tuft = (b: Batch, x: number, y: number, z: number, kind: TuftKind, s = 1, seed = 0) => {
  const T = TUFT[kind], v = Math.floor(hh(seed, 1) * 4), w = T.w * s, h = T.h * s * (0.8 + 0.4 * hh(seed, 2));
  const m = M4().makeTranslation(x, y - 0.02, z).multiply(rotY(hh(seed, 3) * Math.PI)).multiply(M4().makeScale(w, h, w));
  for (const g of TUFT_GEO) b.add(g, tuftMat(kind, v), m);
};
/** a faceted painted rock (perturbed icosahedron) */
const rockGeo = (seed: number) => {
  const g = new THREE.IcosahedronGeometry(1, 1), p = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) { const k = 0.78 + 0.38 * hh(seed * 13 + Math.round(p.getX(i) * 7) * 31 + Math.round(p.getY(i) * 7) * 17 + Math.round(p.getZ(i) * 7), 2); p.setXYZ(i, p.getX(i) * k, p.getY(i) * k * 0.7, p.getZ(i) * k); }
  g.computeVertexNormals(); return g;
};
export const rock = (b: Batch, x: number, y: number, z: number, s: number, seed = 0, mat?: THREE.Material) =>
  b.add(rockGeo(seed), mat ?? rockM(), M4().makeTranslation(x, y + 0.25 * s, z).multiply(rotY(hh(seed, 5) * 6)).multiply(M4().makeScale(s, s, s)));
/** wooden post with a pointed top (painted wood) */
export const post = (b: Batch, x: number, z: number, h = 1.2, y = 0, w = 0.13) => {
  b.add(new THREE.BoxGeometry(w, h, w).translate(0, h / 2, 0), woodM(), M4().makeTranslation(x, y, z));
  b.add(new THREE.ConeGeometry(w * 0.72, w * 0.8, 4).rotateY(Math.PI / 4).translate(0, h + w * 0.4, 0), woodM(), M4().makeTranslation(x, y, z));
};
/** a run of fence: posts every `step` m from (x0,z0) to (x1,z1), two painted rails */
export const fence = (b: Batch, x0: number, z0: number, x1: number, z1: number, step = 2.5, h = 1.1, y = 0) => {
  const L = Math.hypot(x1 - x0, z1 - z0), n = Math.max(1, Math.round(L / step)), a = Math.atan2(z1 - z0, x1 - x0);
  for (let i = 0; i <= n; i++) post(b, x0 + ((x1 - x0) * i) / n, z0 + ((z1 - z0) * i) / n, h, y);
  for (const hy of [0.45, 0.85]) b.add(new THREE.BoxGeometry(L, 0.09, 0.05), woodM(), M4().makeTranslation((x0 + x1) / 2, y + hy * h, (z0 + z1) / 2).multiply(M4().makeRotationY(-a)));
};
/** brass bullet casing (lathe: rim, extractor groove, body, shoulder, neck), height ~0.25 */
export const casingGeo = () => {
  const pr: [number, number][] = [[0, 0], [0.034, 0], [0.034, 0.012], [0.028, 0.016], [0.028, 0.026], [0.032, 0.03], [0.031, 0.17], [0.024, 0.2], [0.019, 0.21], [0.019, 0.25], [0.015, 0.25]];
  return new THREE.LatheGeometry(pr.map(([r, y]) => new THREE.Vector2(r * 2.4, y * 2.4)), 14);
};
/** a corn plant: segmented stalk, 6 arching leaves, a cob with husk */
export const corn = (b: Batch, x: number, z: number, h = 2.0, seed = 0) => {
  const st = lam("cornStalk", () => ({ color: "#7aa83c" }));
  for (let k = 0; k < 4; k++) b.add(new THREE.CylinderGeometry(0.035, 0.045, h / 4, 6).translate(0, h / 8 + (k * h) / 4, 0), st, M4().makeTranslation(x, 0, z));
  for (let i = 0; i < 6; i++) b.add(blade(0.12, 0.8, 0.6), bladeM(i % 2 ? "#6a9a34" : "#82b84a"), M4().makeTranslation(x, h * (0.25 + i * 0.12), z).multiply(rotY(i * 2.3 + hh(seed, i))));
  const cob = new THREE.SphereGeometry(1, 10, 8); cob.scale(0.06, 0.16, 0.06);
  b.add(cob, lam("cob", () => ({ color: "#f2c84a" })), M4().makeTranslation(x + 0.08, h * 0.62, z));
  b.add(blade(0.1, 0.32, 0.2), bladeM("#b8c870"), M4().makeTranslation(x + 0.08, h * 0.5, z).multiply(rotY(hh(seed, 9) * 6)));
};
/** a faceted iceberg / ice ridge */
export const iceberg = (b: Batch, x: number, z: number, h: number, w: number, seed = 0, y = -0.5) =>
  b.add(rockGeo(seed + 99), iceM(), M4().makeTranslation(x, y + h * 0.35, z).multiply(rotY(hh(seed, 4) * 6)).multiply(M4().makeScale(w, h * 1.4, w * 0.8)));
/** a jagged painted mountain (perturbed cone, rock texture, optional snow cap) */
export const mountain = (b: Batch, x: number, z: number, h: number, r: number, seed = 0, snow = false, cols?: string[]) => {
  const g = new THREE.ConeGeometry(r, h, 11, 6), p = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) { const y = p.getY(i), k = 0.82 + 0.3 * hh(seed * 7 + i, 1) * (0.4 + 0.6 * (y / h + 0.5)); if (y < h / 2 - 0.01) p.setXYZ(i, p.getX(i) * k, y, p.getZ(i) * k); }
  g.computeVertexNormals(); g.translate(0, h / 2 - 0.5, 0);
  b.add(g, rockM("mtn" + (cols ? cols[0] : "A"), cols ?? ["#8a7a6a", "#7a6a5a", "#9a8a78", "#6e6052"]), M4().makeTranslation(x, 0, z));
  if (snow) { const c = new THREE.ConeGeometry(r * 0.3, h * 0.3, 11); c.translate(0, h - h * 0.15 - 0.5, 0); b.add(c, lam("snowCap", () => ({ color: "#f4f8fc" })), M4().makeTranslation(x, 0.05, z)); }
};

// ---------------- the landscape filler ----------------
export type Land = {
  cx: number; cz: number;
  /** midground scatter annulus (m) around the centre */
  r0: number; r1: number;
  keep?: (x: number, z: number) => boolean;   // true = leave this spot empty (paths, sets, the action)
  tufts?: TuftKind; nTufts?: number;
  rocks?: number; rockMat?: THREE.Material;
  bushes?: number; trees?: number; treeKinds?: string[];
  /** background: a ring of low painted hills at radius hillR with a tree line on them */
  hillR?: number; hillCol?: string; hillN?: number; hillH?: number; hillMap?: boolean;
  y?: number; seed?: number;
};
export const dressLand = (b: Batch, L: Land) => {
  const s0 = L.seed ?? 1, y = L.y ?? 0, keep = L.keep ?? (() => false);
  const spot = (i: number, k: number): [number, number] => { const a = hh(i, s0 + k) * Math.PI * 2, r = L.r0 + Math.sqrt(hh(i, s0 + k + 1)) * (L.r1 - L.r0); return [L.cx + Math.cos(a) * r, L.cz + Math.sin(a) * r]; };
  for (let i = 0; i < (L.nTufts ?? 0); i++) { const [x, z] = spot(i, 1); if (!keep(x, z)) tuft(b, x, y, z, L.tufts ?? "grass", 0.8 + 0.5 * hh(i, 9), i + s0 * 100); }
  for (let i = 0; i < (L.rocks ?? 0); i++) { const [x, z] = spot(i, 11); if (!keep(x, z)) rock(b, x, y - 0.1, z, 0.25 + 0.7 * hh(i, 12) ** 2, i + s0, L.rockMat); }
  for (let i = 0; i < (L.bushes ?? 0); i++) { const [x, z] = spot(i, 21); if (!keep(x, z)) prop(b, {}, "plant_bushLarge", x, y, z, 0.9 + 0.8 * hh(i, 22)); }
  const kinds = L.treeKinds ?? ["tree_oak", "tree_fat", "tree_default", "tree-high-round", "tree_cone"];
  for (let i = 0; i < (L.trees ?? 0); i++) { const [x, z] = spot(i, 31); if (!keep(x, z)) prop(b, {}, kinds[i % kinds.length], x, y, z, 4.5 + 5 * hh(i, 32)); }
  if (L.hillR) {
    const n = L.hillN ?? 14, H = L.hillH ?? 18, col = L.hillCol ?? "#7aa84a";
    const hm = L.hillMap === false ? lam("hillBGp" + col, () => ({ color: col })) : lam("hillBG" + col, () => ({ map: rep(grassHD(), 8, 8), color: col }));
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + hh(i, s0 + 40) * 0.3, r = L.hillR * (1 + 0.25 * hh(i, s0 + 41)), h = H * (0.6 + 0.8 * hh(i, s0 + 42)), w = L.hillR * (0.28 + 0.2 * hh(i, s0 + 43));
      const g = new THREE.SphereGeometry(1, 28, 12, 0, Math.PI * 2, 0, Math.PI / 2); g.scale(w, h, w * 0.6);
      const hx = L.cx + Math.cos(a) * r, hz = L.cz + Math.sin(a) * r;
      b.add(g, hm, M4().makeTranslation(hx, y - 1, hz).multiply(rotY(-a + Math.PI / 2)));
      for (let k = 0; k < 6; k++) { const u = (k - 2.5) / 3, tx = hx + Math.cos(a + Math.PI / 2) * u * w * 0.8, tz = hz + Math.sin(a + Math.PI / 2) * u * w * 0.8; prop(b, {}, kinds[(i + k) % kinds.length], tx, y - 1 + h * Math.sqrt(Math.max(0, 1 - u * u * 0.64)) * 0.92, tz, 7 + 5 * hh(i * 7 + k, 3)); }
    }
  }
};
export { V };
