// "What If the Moon Disappeared?" — BEACH (night/day, tide, rock pools) at the origin; SPACE (Earth, Moon, tidal bulge,
// spin axis) at x = 3000; REEF (night coral reef) at x = -3000.
import * as THREE from "three";
import { Batch, lam, prop } from "../toon/build";
import { ctex } from "../toon/paint";
import { rock, tuft, post, mountain, rockM, woodM } from "../toon/dress";
import { NOINK } from "../toon/ink";
import { Particles, Glow, glowMat } from "../toon/fx";
import { ground, globe, sea } from "../toon/kit";
import { BuildCtx, PoseCtx, SetHandle, hh, smooth, seg } from "../toon/core";
import { SPACE, REEF, GR, tideAt, moonOn, tiltAt, poolAt, moonPos, POP3, CAL, BONK } from "./story";

const sandTex = () => ctex("sandMoon", 512, 512, (g, r) => { g.fillStyle = "#e6c98c"; g.fillRect(0, 0, 512, 512); for (let i = 0; i < 2500; i++) { g.fillStyle = `rgba(${150 + r() * 80},${120 + r() * 60},${70 + r() * 40},.35)`; g.fillRect(r() * 512, r() * 512, 2, 2); } });

export const buildSet = ({ root }: BuildCtx): SetHandle => {
  const b = new Batch();
  // BEACH: dry sand ends at the shore (z = 12), then wet sand slopes down under the sea, so the tide visibly runs out
  const sandM = lam("sandMoon", () => ({ map: sandTex() }));
  const flat = new THREE.PlaneGeometry(400, 272).rotateX(-Math.PI / 2);
  { const uv = flat.attributes.uv as THREE.BufferAttribute; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * 50, uv.getY(i) * 34); }
  b.add(flat, sandM, new THREE.Matrix4().makeTranslation(0, 0, -124));
  const slope = new THREE.PlaneGeometry(400, 61).rotateX(-Math.PI / 2 + 0.06);
  { const uv = slope.attributes.uv as THREE.BufferAttribute; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * 50, uv.getY(i) * 8); }
  b.add(slope, lam("wetSand", () => ({ map: sandTex(), color: "#b8986a" })), new THREE.Matrix4().makeTranslation(0, -1.8, 42));
  // painted rocks (no placeholder bumps), dune grass, a tree line and hills behind (3 depth layers)
  const clear = (x: number, z: number) => Math.hypot(x - 0.5, z - 9.5) < 2.2 || (z > 5 && z < 8.5 && x > -4.5 && x < 6.5);
  for (let i = 0; i < 26; i++) { const x = -10 + hh(i, 1) * 22, z = -2 + hh(i, 2) * 13; if (!clear(x, z)) rock(b, x, 0, z, 0.35 + 0.8 * hh(i, 3) ** 2, i); }
  for (let i = 0; i < 70; i++) { const x = -24 + hh(i, 4) * 48, z = -14 + hh(i, 5) * 17; if (!clear(x, z)) tuft(b, x, 0, z, "dry", 0.9 + 0.6 * hh(i, 6), i + 300); }
  for (let i = 0; i < 14; i++) prop(b, {}, i % 2 ? "tree_fat" : "tree_oak", -40 + i * 6 + hh(i) * 2, 0, -18 - hh(i, 2) * 8, 6 + hh(i, 3) * 3);
  for (let i = 0; i < 9; i++) mountain(b, -110 + i * 28 + hh(i, 7) * 8, -95 - hh(i, 8) * 30, 22 + hh(i, 9) * 16, 26, i, false, ["#6f8a58", "#5f7a4a", "#7f9a66", "#566e42"]);
  // the jetty: plank deck on posts running out to sea, lanterns along it (lit things for the night shots)
  const JX = -4.5;
  b.add(new THREE.BoxGeometry(2.0, 0.18, 34).translate(JX, 0.85, 27), woodM());
  for (let k = 0; k <= 8; k++) for (const sx of [-0.9, 0.9]) post(b, JX + sx, 11 + k * 4, 5.0, -4.0, 0.2);
  const LANT: [number, number, number][] = [];
  for (let k = 0; k < 5; k++) { const lz = 13 + k * 7; post(b, JX + 0.95, lz, 1.4, 0.9, 0.1); LANT.push([JX + 0.95, 2.45, lz]); }
  // a little rock island with a lighthouse out at sea
  const LH: [number, number, number] = [7, 0, 72];
  mountain(b, LH[0], LH[2], 5, 8, 4, false, ["#7a746a", "#6a645a", "#8a847a", "#5e584f"]);
  for (let i = 0; i < 6; i++) rock(b, LH[0] - 7 + hh(i, 11) * 14, -0.6, LH[2] - 6 + hh(i, 12) * 12, 1.2 + hh(i, 13) * 1.5, i + 50);
  const stripeT = ctex("lhStripe", 64, 256, (g) => { for (let i = 0; i < 6; i++) { g.fillStyle = i % 2 ? "#f4f1e6" : "#d23a32"; g.fillRect(0, i * 256 / 6, 64, 256 / 6 + 1); } });
  b.add(new THREE.CylinderGeometry(0.85, 1.25, 9, 20).translate(LH[0], 8.5, LH[2]), lam("lhTower", () => ({ map: stripeT })));
  b.add(new THREE.ConeGeometry(1.25, 1.4, 20).translate(LH[0], 14.9, LH[2]), lam("lhCap", () => ({ color: "#2a3a5a" })));
    // REEF: blue-tinted sand floor, painted coral heads, branch coral, sea grass, a ring of coral rock behind
  ground(b, lam("reefSand", () => ({ map: sandTex(), color: "#9fb4cc" })), REEF[0], REEF[2], 150, 30);
  const cols = ["#ff7a8a", "#ffb04a", "#b06af0", "#5ad0c8", "#f2e25a", "#ff5ab4"];
  const shade = (c: string, k: number) => "#" + new THREE.Color(c).multiplyScalar(k).getHexString();
  for (let i = 0; i < 46; i++) {
    const x = REEF[0] - 9 + hh(i, 1) * 18, z = REEF[2] - 6 + hh(i, 2) * 9, c = cols[i % 6], m = lam("coral" + c, () => ({ color: c }));
    if (i % 3 === 0) rock(b, x, 0, z, 0.5 + hh(i, 3) * 0.6, i + 70, rockM("coralR" + c, [c, shade(c, 0.88), shade(c, 1.08), shade(c, 0.8)]));
    else if (i % 3 === 1) for (let k = 0; k < 5; k++) { const h = 0.6 + hh(i, k) * 0.9; b.add(new THREE.CylinderGeometry(0.06, 0.09, h).translate(0, h / 2, 0).rotateZ((k - 2) * 0.3).rotateY(k * 1.3), m, new THREE.Matrix4().makeTranslation(x, 0, z)); }
    else tuft(b, x, 0, z, "reed", 1.3 + hh(i, 4) * 0.8, i + 500);
  }
  for (let i = 0; i < 40; i++) { const a = hh(i, 21) * Math.PI * 2, r = 12 + hh(i, 22) * 14; tuft(b, REEF[0] + Math.cos(a) * r, 0, REEF[2] + Math.sin(a) * r, "reed", 1.5 + hh(i, 23), i + 600); }
  for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2, r = 42 + hh(i, 24) * 10; mountain(b, REEF[0] + Math.cos(a) * r, REEF[2] + Math.sin(a) * r, 10 + hh(i, 25) * 10, 12, i + 20, false, i % 2 ? ["#5a4a8a", "#4a3a7a", "#6a5a9a", "#3e3270"] : ["#2f6a8a", "#255a7a", "#3a7a9a", "#204e6a"]); }
  b.build(root);
  const bsea = sea(root, 0, 210, 200, "#2a7fb8");
  const pools = [0, 1, 2, 3].map((k) => { const m = new THREE.Mesh(new THREE.CircleGeometry(1, 24).rotateX(-Math.PI / 2), lam("poolW", () => ({ color: "#4aa8d8" }))); m.position.set(-3 + k * 2.6, 0.03, 6 + (k % 2) * 1.8); root.add(m); return m; });
  // the Moon in the beach sky
  const skyMoon = new THREE.Mesh(new THREE.SphereGeometry(16, 40, 24), glowMat("#f6f0d6", 1.4)); skyMoon.position.set(40, 140, 420); skyMoon.layers.set(NOINK); root.add(skyMoon);
  const skyHalo = new Glow(root, "#dfe8ff", 1.0);
  // SPACE
  const G = globe(root, GR); G.mesh.position.set(...SPACE);
  const tide = new THREE.Mesh(new THREE.SphereGeometry(GR * 1.02, 64, 32), new THREE.MeshBasicMaterial({ color: new THREE.Color("#8fd8ff"), transparent: true, opacity: 0.42, depthWrite: false }));
  tide.layers.set(NOINK); root.add(tide);
  const moon = new THREE.Mesh(new THREE.SphereGeometry(GR * 0.27, 40, 24), lam("moonM5", () => ({ color: "#cdc8bc" }))); root.add(moon);
  const axis = new THREE.Group();
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, GR * 2.8, 12), lam("axisRod", () => ({ color: "#e2453c" })));
  const knobT = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 12), lam("axisKnob", () => ({ color: "#f2c230" }))); knobT.position.y = GR * 1.4;
  const knobB = knobT.clone(); knobB.position.y = -GR * 1.4;
  axis.add(rod, knobT, knobB); root.add(axis);
  // night-beach lights: jetty lanterns, the lighthouse lamp, a fishing boat with a lantern, moon glitter on the sea
  const lantM = glowMat("#ffd27a", 2.2);
  const lantG = LANT.map(([x, y, z]) => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 8), lantM); m.position.set(x, y, z); m.layers.set(NOINK); root.add(m); return new Glow(root, "#ffb85a", 1.6); });
  const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 1.2, 16), glowMat("#fff0b0", 2.4)); lamp.position.set(LH[0], 13.6, LH[2]); lamp.layers.set(NOINK); root.add(lamp);
  const lampG = new Glow(root, "#ffe6a0", 2.2), lampG2 = new Glow(root, "#ffb85a", 1.2);
  const boat = new THREE.Group();
  const bh = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.8, 1.3), lam("boatHull", () => ({ color: "#c0533a" }))); bh.position.y = 0.3; boat.add(bh);
  const bc = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.9, 1.0), lam("boatCab", () => ({ color: "#f4f1e6" }))); bc.position.set(-0.4, 1.1, 0); boat.add(bc);
  const bl_ = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8), lantM); bl_.position.set(0.9, 1.3, 0); bl_.layers.set(NOINK); boat.add(bl_);
  root.add(boat); const boatG = new Glow(root, "#ffc070", 1.6);
  const glitter = new Particles(root, 180, "#e8f0ff", 0.5, "soft", 1.4);
  const lhGlit = new Particles(root, 70, "#ffd890", 0.45, "soft", 1.3);
  // space: soft nebula glows around the Earth (colour per section, so the two space sections look different)
  const neb = [0, 1, 2, 3, 4, 5].map(() => new Glow(root, "#ffffff", 1.0));
  const spawn = new Particles(root, 260, "#ffd0e0", 0.09, "soft", 1.6);
  const plank = new Particles(root, 160, "#bfe0ff", 0.05, "soft", 1.0);
  const snow = new Particles(root, 300, "#ffffff", 0.07, "flake", 1.0);

  const pose = ({ id, t }: PoseCtx) => {
    const beach = [1, 4, 8, 9].includes(id), sp = [2, 3, 6, 7].includes(id), nb = id === 1 || id === 9;
    const ty = tideAt(id, t), pulse = 0.85 + 0.15 * Math.sin(t * 5);
    lantG.forEach((g, k) => g.set(LANT[k][0], LANT[k][1], LANT[k][2], 2.0, nb ? 0.6 * pulse : 0, nb));
    lantM.color.setScalar(nb ? 2.2 : 1.0).multiply(new THREE.Color("#ffd27a"));
    lampG.set(LH[0], 13.6, LH[2], 16, nb ? 0.95 : 0, nb); lampG2.set(LH[0], 13.6, LH[2], 26 + 6 * Math.sin(t * 2), nb ? 0.25 : 0, nb);
    boat.position.set(-2, ty + 0.05 + 0.08 * Math.sin(t * 1.6), 46); boat.rotation.set(0.05 * Math.sin(t * 1.3), 0.5, 0.04 * Math.sin(t * 1.7)); boat.visible = beach;
    boatG.set(-2 + 0.9 * Math.cos(0.5), ty + 1.4, 46 - 0.9 * Math.sin(0.5), 3, nb ? 0.9 * pulse : 0, nb);
    glitter.pose((i, o) => { const z = 20 + hh(i, 1) ** 1.6 * 300, w = 0.6 + z * 0.06; o.set(z * 0.095 + (hh(i, 2) - 0.5) * w * (0.6 + 0.4 * Math.sin(t * 3 + i)), ty + 0.05, z); return hh(i, 3) < 0.75 + 0.25 * Math.sin(t * 4 + i * 1.7); }, nb && moonOn(t) > 0.5);
    lhGlit.pose((i, o) => { const z = 22 + hh(i, 4) * (LH[2] - 30), u = (z - 22) / (LH[2] - 22); o.set(LH[0] * u + (hh(i, 5) - 0.5) * (0.5 + u * 3), ty + 0.05, z); return hh(i, 6) < 0.7 + 0.3 * Math.sin(t * 4 + i); }, nb);
    const nc = id === 6 || id === 7 ? ["#ff6a9a", "#ffa04a", "#c05aff"] : ["#4a7aff", "#5ad0c8", "#9a6aff"];
    neb.forEach((g, k) => { const a = k * 1.05 + 0.4, e = (k % 3 - 1) * 0.35; g.mat.color.set(nc[k % 3]).multiplyScalar(0.55); g.set(SPACE[0] + Math.cos(a) * 420 * Math.cos(e), SPACE[1] + 420 * Math.sin(e), SPACE[2] + Math.sin(a) * 420 * Math.cos(e), 520, 0.6, sp); });
    bsea.visible = beach; bsea.position.y = tideAt(id, t);
    pools.forEach((m, k) => { const s = poolAt(id, t) * (0.7 + 0.2 * k); m.visible = beach && s > 0.02; m.scale.setScalar(Math.max(0.02, s)); });
    const mo = moonOn(t);
    skyMoon.visible = (id === 1 || id === 9) && mo > 0.01; skyMoon.scale.setScalar(Math.max(0.01, mo));
    skyHalo.set(40, 140, 420, 120 * mo, 0.5 * mo, id === 1 || id === 9);
    G.mesh.visible = tide.visible = axis.visible = sp; axis.visible = id === 6 || id === 7;
    G.U.uSpin.value = t * 0.8; G.U.uSun.value.set(0.8, 0.3, 0.5).normalize();
    moon.visible = sp && mo > 0.01; moon.scale.setScalar(Math.max(0.01, mo));
    const mp = moonPos(t); moon.position.set(...mp);
    // tidal bulge (cartoon-exaggerated so it reads): elongated toward the Moon → a small Sun-only bulge
    const bl = id === 3 ? 1.3 - 0.2 * smooth(seg(t, POP3 + 0.2, POP3 + 2.0)) : id === 2 ? 1.3 : 1.08;
    tide.position.set(...SPACE); tide.scale.set(bl, 2 - bl, 2 - bl);
    tide.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), new THREE.Vector3(mp[0] - SPACE[0], mp[1] - SPACE[1], mp[2] - SPACE[2]).normalize());
    const tilt = tiltAt(t); axis.position.set(...SPACE); axis.rotation.set(0, 0, tilt); G.mesh.rotation.set(0, 0, tilt);
    spawn.pose((i, o) => { const u = (t * 0.2 + hh(i, 1)) % 1; o.set(REEF[0] - 9 + hh(i, 2) * 18, 0.5 + u * 8 * (t < CAL ? 1 : 0.15), REEF[2] - 6 + hh(i, 3) * 9); return true; }, id === 5);
    plank.pose((i, o) => { const u = (t * 0.05 + hh(i, 1)) % 1; o.set(REEF[0] - 12 + hh(i, 2) * 24, 9 - u * 9, REEF[2] - 9 + hh(i, 3) * 14); return true; }, id === 5);
    const flip = Math.floor(t / 0.4) % 2 === 0;
    snow.pose((i, o) => { const u = (t * 0.2 + hh(i, 1)) % 1; o.set(-8 + hh(i, 2) * 16, 7 - u * 7, -2 + hh(i, 3) * 10); return true; }, id === 8 && t > BONK && flip);
  };
  return { pose };
};
