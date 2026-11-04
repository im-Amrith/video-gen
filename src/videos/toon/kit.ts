// Toon engine episode kit: the recurring cast, placement helpers, pictogram cards and common set pieces, shared by
// every episode after the pilot (both series).
import * as THREE from "three";
import { Batch, V, lam } from "./build";
import { ctex, rep, water as waterTex } from "./paint";
import { Pen, INK, Outfit, Expr } from "./toon";
import { Stage, CamInfo, person, blob, lidAt, spinAbout, Who } from "./cast";
import { FPS, V3, hh } from "./core";

// ---------------- cast ----------------
/** What If host: yellow parka, red cap, kid build drawn at 1.25 */
export const PIP: Outfit = { jacket: "#f2b531", pants: "#3b5b9a", boots: "#e2453c", hat: "cap", cap: "#e2453c", build: "kid" };
export const PIP_S = 1.25;
export const FOLK: Outfit[] = [
  { jacket: "#3f6fb5", pants: "#3b3f52", boots: "#4a3426", hat: "hair", hair: "#5a3b2a", skin: "#f5c9a0" },
  { jacket: "#8c3b4a", pants: "#2f3542", boots: "#2b2b33", hat: "hair", hair: "#2a201a", skin: "#c99067", moustache: "#2a201a" },
  { jacket: "#5d7a3a", pants: "#3d4440", boots: "#5a3b2a", hat: "tophat", skin: "#ecd0b6" },
  { jacket: "#b5653f", pants: "#3b3f52", boots: "#4a3426", hat: "bonnet", dress: "#d9a441", skin: "#ffe2c2" },
  { jacket: "#2f5f6a", pants: "#2f3542", boots: "#2b2b33", hat: "cap", cap: "#f2c230", skin: "#f5c9a0", build: "stout" },
  { jacket: "#7b5ac9", pants: "#3b3f52", boots: "#5a3b2a", hat: "hair", hair: "#8a4a2a", skin: "#ffe2c2" },
];
export type PersonOpts = {
  mode?: "stand" | "fall" | "sit" | "stroll" | "march"; face?: boolean; roll?: number; wave?: number; prop?: "icecream" | "shako" | ["hammer", number] | null;
  look?: number; swaps?: number[]; scale?: number; phase?: number; tilt?: number; headTilt?: number; mirror?: boolean; noBlob?: boolean; facing?: -1 | 0 | 1;
};
/** place anyone (front view); rolled + face cards spin about the body centre */
export const put = (cam: CamInfo, out: Stage, who: Who, t: number, x: number, y: number, z: number, expr: Expr, o: PersonOpts = {}) => {
  const sc = o.scale ?? 1;
  let p: V3 = [x, y, z];
  if (o.face && o.roll) p = spinAbout(cam, [x, y + 1.05 * sc, z], 1.05 * sc, o.roll);
  out.places.push(person(cam, who, p[0], p[1], p[2], { side: false, mirror: false },
    { mode: o.mode ?? "stand", expr, blink: lidAt(t, who.i, o.swaps), wave: o.wave, prop: o.prop ?? null, look: o.look ?? 0, phase: o.phase, tilt: o.tilt, headTilt: o.headTilt, facing: o.facing },
    {}, sc, { face: o.face, roll: o.roll, mirror: o.mirror }));
  if (!o.noBlob && (o.mode ?? "stand") !== "fall") blob(cam, out, x, y, z, sc);
};
export const W_PIP: Who = { i: 1, o: PIP, okey: "pip" };
export const pip = (cam: CamInfo, out: Stage, t: number, x: number, y: number, z: number, expr: Expr, o: PersonOpts = {}) =>
  put(cam, out, W_PIP, t, x, y, z, expr, { scale: PIP_S, ...o });
/** expression timeline: [[time s, expr], ...] (switch lands 2 f early) */
export const exprAt = (t: number, tab: [number, Expr][]) => { let e = tab[0][1]; for (const [a, x] of tab) if (t >= a - 2 / FPS) e = x; return e; };

// ---------------- pictogram cards (plum ink, no text) ----------------
/** clock (300 x 300), a = minute-hand angle (rad) */
export const clockCard = (p: Pen, a: number, face = "#fff7e0") => {
  p.ell(150, 150, 120, 120, face, 12);
  for (let k = 0; k < 12; k++) { const b = (k / 12) * Math.PI * 2; p.stroke([[150 + 95 * Math.sin(b), 150 - 95 * Math.cos(b)], [150 + 108 * Math.sin(b), 150 - 108 * Math.cos(b)]], 6); }
  p.stroke([[150, 150], [150 + 60 * Math.sin(a / 12), 150 - 60 * Math.cos(a / 12)]], 12);
  p.stroke([[150, 150], [150 + 88 * Math.sin(a), 150 - 88 * Math.cos(a)]], 8);
  p.dot(150, 150, 12);
};
/** alarm clock with bells (300 x 340), ring = 0..1 shake */
export const alarmCard = (p: Pen, ring: number) => {
  const s = ring > 0 ? Math.sin(ring * 40) * 8 : 0;
  p.ell(80 + s, 70, 40, 34, "#f2c230", 10); p.ell(220 + s, 70, 40, 34, "#f2c230", 10);
  p.stroke([[110, 290], [80, 330]], 14); p.stroke([[190, 290], [220, 330]], 14);
  p.g.save(); p.g.translate(s, 0); clockCard(p, 2.2, "#fff7e0"); p.g.restore();
  if (ring > 0) for (const sx of [-1, 1]) for (let k = 0; k < 3; k++) p.stroke([[150 + sx * (140 + k * 14), 60 + k * 30], [150 + sx * (170 + k * 14), 50 + k * 30]], 8);
};
/** desk calendar (300 x 300) with n days crossed off of 12 */
export const calendarCard = (p: Pen, n: number, top = "#e2453c") => {
  p.poly([[30, 40], [270, 40], [270, 280], [30, 280]], "#fffdf6", 12);
  p.poly([[30, 40], [270, 40], [270, 100], [30, 100]], top, 12);
  for (const x of [90, 210]) p.ell(x, 40, 12, 20, "#d9dce6", 8);
  for (let k = 0; k < 12; k++) {
    const cx = 70 + (k % 4) * 54, cy = 135 + Math.floor(k / 4) * 50;
    p.ell(cx, cy, 16, 14, "#ffffff", 6);
    if (k < n) { p.stroke([[cx - 14, cy - 12], [cx + 14, cy + 12]], 7, "#e2453c"); p.stroke([[cx + 14, cy - 12], [cx - 14, cy + 12]], 7, "#e2453c"); }
  }
};
/** thermometer (300 x 600), u = level 0..1 */
export const thermoCard = (p: Pen, u: number, col = "#e2453c") => {
  p.poly([[120, 60], [180, 60], [180, 430], [120, 430]], "#ffffff", 12);
  p.ell(150, 480, 62, 62, col, 12);
  p.poly([[134, 430 - 360 * u], [166, 430 - 360 * u], [166, 450], [134, 450]], col, 0);
  for (let k = 0; k < 6; k++) p.stroke([[180, 100 + k * 60], [200, 100 + k * 60]], 6);
};
/** sun / moon pictograms (300 x 300) */
export const sunCard = (p: Pen, t = 0) => {
  for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2 + t; p.line([[150 + 95 * Math.cos(a), 150 + 95 * Math.sin(a)], [150 + 135 * Math.cos(a), 150 + 135 * Math.sin(a)]], "#ffcf3a", 14); }
  p.ell(150, 150, 78, 78, "#ffd54a", 12);
};
export const moonCard = (p: Pen) => {
  const pts: [number, number][] = [];
  for (let i = 0; i <= 30; i++) { const a = -Math.PI / 2 + (i / 30) * Math.PI * 2 * 0.5 + 0; pts.push([150 + 110 * Math.cos(a), 150 + 110 * Math.sin(a)]); }
  for (let i = 30; i >= 0; i--) { const a = -Math.PI / 2 + (i / 30) * Math.PI; pts.push([150 + 55 * Math.cos(a), 150 + 110 * Math.sin(a)]); }
  p.poly(pts, "#f3ecc8", 12);
};
/** an arrow pictogram (300 x 120) pointing right */
export const arrowCard = (p: Pen, col = "#ffffff") => p.poly([[20, 40], [190, 40], [190, 10], [280, 60], [190, 110], [190, 80], [20, 80]], col, 10);
export { INK };

// ---------------- set pieces ----------------
export const beamBetween = (a: THREE.Vector3, b: THREE.Vector3, th: number) => {
  const d = b.clone().sub(a), g = new THREE.BoxGeometry(th, d.length(), th);
  g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(V(0, 1, 0), d.clone().normalize()));
  g.translate((a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2);
  return g;
};
export const ground = (b: Batch, mat: THREE.Material, cx: number, cz: number, half: number, reps: number, y = 0) => {
  const g = new THREE.PlaneGeometry(half * 2, half * 2, 1, 1); g.rotateX(-Math.PI / 2);
  const uv = g.attributes.uv as THREE.BufferAttribute; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * reps, uv.getY(i) * reps);
  b.add(g, mat, new THREE.Matrix4().makeTranslation(cx, y, cz));
};
/** a flat, gently shining sea (lit two-tone, painted ripples) as its own mesh, so it can rise */
export const sea = (root: THREE.Object3D, cx: number, cz: number, half: number, col = "#2f8fc4") => {
  const t = rep(waterTex(), half / 6, half / 6);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(half * 2, half * 2).rotateX(-Math.PI / 2), lam("sea" + col, () => ({ map: t, color: col })));
  m.position.set(cx, 0, cz); m.receiveShadow = true; root.add(m);
  return m;
};
/** stylised cartoon globe: unlit painted land/sea by a lat-long noise mask; uOcean moves the water to the poles
 *  (0 = today's oceans, 1 = two polar oceans + an equatorial supercontinent); uBulge squashes the poles */
export const globe = (root: THREE.Object3D, r: number) => {
  const U = { uOcean: { value: 0 }, uSun: { value: new THREE.Vector3(1, 0.3, 0.5).normalize() }, uSpin: { value: 0 }, uNight: { value: 0.18 } };
  const mat = new THREE.ShaderMaterial({
    uniforms: U,
    vertexShader: `varying vec3 vN; varying vec3 vP; varying vec3 vW; void main(){ vP = position; vN = normalize(mat3(modelMatrix) * normal); vW = (modelMatrix * vec4(position, 1.0)).xyz; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `uniform float uOcean, uSpin, uNight; uniform vec3 uSun; varying vec3 vN; varying vec3 vP; varying vec3 vW;
      float h(vec3 p){ return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453); }
      float n3(vec3 p){ vec3 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
        return mix(mix(mix(h(i), h(i+vec3(1,0,0)), f.x), mix(h(i+vec3(0,1,0)), h(i+vec3(1,1,0)), f.x), f.y),
                   mix(mix(h(i+vec3(0,0,1)), h(i+vec3(1,0,1)), f.x), mix(h(i+vec3(0,1,1)), h(i+vec3(1,1,1)), f.x), f.y), f.z); }
      void main(){ vec3 q = normalize(vP); float c = cos(uSpin), s = sin(uSpin); vec3 p = vec3(c*q.x + s*q.z, q.y, -s*q.x + c*q.z);
        float n = 0.55*n3(p*2.2) + 0.3*n3(p*4.7) + 0.15*n3(p*9.0);
        float lat = abs(q.y);
        float sea0 = step(n, 0.56);                                    // today: ~70 % ocean
        float sea1 = step(0.62 - 0.08*n3(p*3.0), lat);                 // polar oceans above ~38 deg
        float isSea = mix(sea0, sea1, smoothstep(0.0, 1.0, uOcean));
        vec3 land = mix(vec3(0.22, 0.52, 0.16), vec3(0.72, 0.52, 0.24), smoothstep(0.45, 0.75, n)); // green -> desert
        land = mix(land, vec3(0.95, 0.97, 1.0), smoothstep(0.82, 0.9, lat));                       // ice caps
        vec3 sea = mix(vec3(0.03, 0.22, 0.62), vec3(0.06, 0.38, 0.74), n);
        vec3 col = mix(land, sea, isSea);
        float d = dot(normalize(vN), normalize(uSun));
        col *= mix(uNight, 0.95, smoothstep(-0.15, 0.35, d));
        float rim = pow(1.0 - abs(dot(normalize(vN), normalize(cameraPosition - vW))), 3.0);
        col += vec3(0.3, 0.55, 1.0) * rim * 0.35;
        gl_FragColor = vec4(col, 1.0); }`,
  });
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, 96, 64), mat);
  root.add(m);
  return { mesh: m, U };
};
/** cheap scattered rocks / bumps (stromatolites, boulders) */
export const bumps = (b: Batch, n: number, cx: number, cz: number, rad: number, col: string, seed = 1, s0 = 0.4, s1 = 1.2) => {
  const m = lam("bump" + col, () => ({ color: col }));
  for (let i = 0; i < n; i++) {
    const a = hh(i, seed) * Math.PI * 2, d = Math.sqrt(hh(i, seed + 1)) * rad, s = s0 + (s1 - s0) * hh(i, seed + 2);
    const g = new THREE.SphereGeometry(1, 14, 10); g.scale(s, s * 0.6, s);
    b.add(g, m, new THREE.Matrix4().makeTranslation(cx + Math.cos(a) * d, 0, cz + Math.sin(a) * d));
  }
};
export const paintSky = (key: string, top: string, bot: string) => ctex(key, 16, 256, (g) => { const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, top); gr.addColorStop(1, bot); g.fillStyle = gr; g.fillRect(0, 0, 16, 256); });
