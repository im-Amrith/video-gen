// "What If the Moon Disappeared?" — BEACH (night/day, tide, rock pools) at the origin; SPACE (Earth, Moon, tidal bulge,
// spin axis) at x = 3000; REEF (night coral reef) at x = -3000.
import * as THREE from "three";
import { Batch, lam, prop } from "../toon/build";
import { ctex } from "../toon/paint";
import { NOINK } from "../toon/ink";
import { Particles, Glow, glowMat } from "../toon/fx";
import { ground, globe, sea, bumps } from "../toon/kit";
import { BuildCtx, PoseCtx, SetHandle, hh, smooth, seg } from "../toon/core";
import { SPACE, REEF, GR, tideAt, moonOn, tiltAt, poolAt, POP3, CAL, BONK } from "./story";

const sandTex = () => ctex("sandMoon", 512, 512, (g, r) => { g.fillStyle = "#e6c98c"; g.fillRect(0, 0, 512, 512); for (let i = 0; i < 2500; i++) { g.fillStyle = `rgba(${150 + r() * 80},${120 + r() * 60},${70 + r() * 40},.35)`; g.fillRect(r() * 512, r() * 512, 2, 2); } });

export const buildSet = ({ root }: BuildCtx): SetHandle => {
  const b = new Batch();
  // BEACH: sand sloping into the sea (sea is its own mesh, height = tide)
  ground(b, lam("sandMoon", () => ({ map: sandTex() })), 0, -60, 200, 50, 0);
  const slope = new THREE.PlaneGeometry(400, 80).rotateX(-Math.PI / 2 - 0.06);
  b.add(slope, lam("sandMoon", () => ({ map: sandTex() })), new THREE.Matrix4().makeTranslation(0, -1.2, 40));
  bumps(b, 30, 3, 8, 9, "#6e6a70", 2, 0.4, 1.3);
  for (let i = 0; i < 14; i++) prop(b, {}, i % 2 ? "tree_fat" : "tree_oak", -40 + i * 6 + hh(i) * 2, 0, -18 - hh(i, 2) * 8, 6 + hh(i, 3) * 3);
  // REEF: sandy floor, coral heads and branches in many colours
  ground(b, lam("reefSand", () => ({ color: "#b8a888" })), REEF[0], REEF[2], 150, 1);
  const cols = ["#ff7a8a", "#ffb04a", "#b06af0", "#5ad0c8", "#f2e25a", "#ff5ab4"];
  for (let i = 0; i < 46; i++) {
    const x = REEF[0] - 9 + hh(i, 1) * 18, z = REEF[2] - 6 + hh(i, 2) * 9, c = cols[i % 6], m = lam("coral" + c, () => ({ color: c }));
    if (i % 3 === 0) { const g = new THREE.SphereGeometry(0.5 + hh(i, 3) * 0.6, 16, 12); g.scale(1, 0.7, 1); b.add(g, m, new THREE.Matrix4().makeTranslation(x, 0.2, z)); }
    else if (i % 3 === 1) for (let k = 0; k < 4; k++) { const h = 0.6 + hh(i, k) * 0.9; b.add(new THREE.CylinderGeometry(0.06, 0.09, h).translate(0, h / 2, 0).rotateZ((k - 1.5) * 0.3), m, new THREE.Matrix4().makeTranslation(x, 0, z)); }
    else { const g = new THREE.ConeGeometry(0.35, 1.2 + hh(i, 4), 7, 1, true); g.translate(0, 0.6, 0); b.add(g, m, new THREE.Matrix4().makeTranslation(x, 0, z)); }
  }
  b.build(root);
  const bsea = sea(root, 0, 214, 200, "#2a7fb8");
  const pools = [0, 1, 2, 3].map((k) => { const m = new THREE.Mesh(new THREE.CircleGeometry(1, 24).rotateX(-Math.PI / 2), lam("poolW", () => ({ color: "#4aa8d8" }))); m.position.set(-3 + k * 2.6, 0.03, 6 + (k % 2) * 1.8); root.add(m); return m; });
  // the Moon in the beach sky
  const skyMoon = new THREE.Mesh(new THREE.SphereGeometry(16, 40, 24), glowMat("#f6f0d6", 1.4)); skyMoon.position.set(40, 140, 420); skyMoon.layers.set(NOINK); root.add(skyMoon);
  const skyHalo = new Glow(root, "#dfe8ff", 1.0);
  // SPACE
  const G = globe(root, GR); G.mesh.position.set(...SPACE);
  const tide = new THREE.Mesh(new THREE.SphereGeometry(GR * 1.02, 64, 32), new THREE.MeshBasicMaterial({ color: new THREE.Color("#5fb8ff"), transparent: true, opacity: 0.25, depthWrite: false }));
  tide.layers.set(NOINK); root.add(tide);
  const moon = new THREE.Mesh(new THREE.SphereGeometry(GR * 0.27, 40, 24), lam("moonM5", () => ({ color: "#cdc8bc" }))); root.add(moon);
  const axis = new THREE.Group();
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, GR * 2.8, 12), lam("axisRod", () => ({ color: "#e2453c" })));
  const knobT = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 12), lam("axisKnob", () => ({ color: "#f2c230" }))); knobT.position.y = GR * 1.4;
  const knobB = knobT.clone(); knobB.position.y = -GR * 1.4;
  axis.add(rod, knobT, knobB); root.add(axis);
  const spawn = new Particles(root, 260, "#ffd0e0", 0.09, "soft", 1.6);
  const plank = new Particles(root, 160, "#bfe0ff", 0.05, "soft", 1.0);
  const snow = new Particles(root, 300, "#ffffff", 0.07, "flake", 1.0);

  const pose = ({ id, t }: PoseCtx) => {
    const beach = [1, 4, 8, 9].includes(id), sp = [2, 3, 6, 7].includes(id);
    bsea.visible = beach; bsea.position.y = tideAt(id, t);
    pools.forEach((m, k) => { const s = poolAt(id, t) * (0.7 + 0.2 * k); m.visible = beach && s > 0.02; m.scale.setScalar(Math.max(0.02, s)); });
    const mo = moonOn(t);
    skyMoon.visible = (id === 1 || id === 9) && mo > 0.01; skyMoon.scale.setScalar(Math.max(0.01, mo));
    skyHalo.set(40, 140, 420, 120 * mo, 0.5 * mo, id === 1 || id === 9);
    G.mesh.visible = tide.visible = axis.visible = sp; axis.visible = id === 6 || id === 7;
    G.U.uSpin.value = t * 0.8; G.U.uSun.value.set(0.8, 0.3, 0.5).normalize();
    const ma = 0.3 + t * 0.15; moon.visible = sp && mo > 0.01; moon.scale.setScalar(Math.max(0.01, mo));
    moon.position.set(SPACE[0] + Math.cos(ma) * 22, SPACE[1] + 1, SPACE[2] + Math.sin(ma) * 22);
    // tidal bulge: elongated toward the Moon (1.14) → a small Sun-only bulge (1.05)
    const bl = id === 3 ? 1.14 - 0.09 * smooth(seg(t, POP3 + 0.2, POP3 + 2.0)) : id === 2 ? 1.14 : 1.05;
    tide.position.set(...SPACE); tide.scale.set(bl, 2 - bl, 2 - bl); tide.rotation.set(0, -ma, 0);
    const tilt = tiltAt(t); axis.position.set(...SPACE); axis.rotation.set(0, 0, tilt); G.mesh.rotation.set(0, 0, tilt);
    spawn.pose((i, o) => { const u = (t * 0.2 + hh(i, 1)) % 1; o.set(REEF[0] - 9 + hh(i, 2) * 18, 0.5 + u * 8 * (t < CAL ? 1 : 0.15), REEF[2] - 6 + hh(i, 3) * 9); return true; }, id === 5);
    plank.pose((i, o) => { const u = (t * 0.05 + hh(i, 1)) % 1; o.set(REEF[0] - 12 + hh(i, 2) * 24, 9 - u * 9, REEF[2] - 9 + hh(i, 3) * 14); return true; }, id === 5);
    const flip = Math.floor(t / 0.4) % 2 === 0;
    snow.pose((i, o) => { const u = (t * 0.2 + hh(i, 1)) % 1; o.set(-8 + hh(i, 2) * 16, 7 - u * 7, -2 + hh(i, 3) * 10); return true; }, id === 8 && t > BONK && flip);
  };
  return { pose };
};
