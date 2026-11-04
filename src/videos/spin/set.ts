// "What If the Earth Stopped Spinning?" — places: SPACE (little planet + Moon) at x = 3000, TOWN street at the origin,
// FLOOD (drowned rooftops) at z = -3000, PRE (prehistoric shore) at x = -3000.
import * as THREE from "three";
import { Batch, boxGeo, V, lam, house, prop } from "../toon/build";
import { ctex, rep, cobbleHD, grassHD, stoneHD } from "../toon/paint";
import { twoTone } from "../toon/shade";
import { Particles, Glow, glowMat } from "../toon/fx";
import { ground, globe, sea, bumps } from "../toon/kit";
import { BuildCtx, PoseCtx, SetHandle, smooth, clamp01, hh, lerp } from "../toon/core";
import { SPACE, FLOOD, PRE, GR, spinAt, oceanAt, bulgeAt, brakeAt, houseSlide, MOON } from "./story";

const moonTex = () => ctex("moonTex", 512, 256, (g, r) => {
  g.fillStyle = "#c9c4b8"; g.fillRect(0, 0, 512, 256);
  for (let i = 0; i < 70; i++) { const x = r() * 512, y = r() * 256, rad = 4 + r() * 22; g.fillStyle = `rgba(90,85,80,${0.25 + r() * 0.3})`; g.beginPath(); g.arc(x, y, rad, 0, Math.PI * 2); g.fill(); g.fillStyle = "rgba(255,255,255,.18)"; g.beginPath(); g.arc(x - rad * 0.2, y - rad * 0.2, rad * 0.7, 0, Math.PI * 2); g.fill(); }
});
const tapeTex = () => ctex("tapeTex", 1024, 32, (g) => { g.fillStyle = "#f2c230"; g.fillRect(0, 0, 1024, 32); g.fillStyle = "#2b2430"; for (let x = 0; x < 1024; x += 16) g.fillRect(x, 0, 2, x % 64 ? 10 : 20); });

export const buildSet = ({ root }: BuildCtx): SetHandle => {
  const b = new Batch();
  // ---------------- TOWN: a cobbled street along x, houses both sides, trees ----------------
  ground(b, lam("grassSpin", () => ({ map: grassHD() })), 0, 0, 500, 120);
  ground(b, lam("cobbleSpin", () => ({ map: cobbleHD() })), 0, 0, 1, 1, 0.01); // (tiny; the street is below)
  const street = new THREE.PlaneGeometry(220, 9).rotateX(-Math.PI / 2);
  const suv = street.attributes.uv as THREE.BufferAttribute; for (let i = 0; i < suv.count; i++) suv.setXY(i, suv.getX(i) * 50, suv.getY(i) * 2);
  b.add(street, lam("cobbleSpin", () => ({ map: cobbleHD() })), new THREE.Matrix4().makeTranslation(0, 0.012, 0));
  for (let i = 0; i < 18; i++) {
    const x = -90 + i * 10.5, side = i % 2 ? 1 : -1;
    if (Math.abs(x - 6) < 6 && side < 0) continue; // the sliding house's plot
    house(b, x, side * 10.5, side > 0 ? Math.PI : 0, 8 + (i % 3), 7, 7 + (i % 3) * 1.4, i, 0);
  }
  for (let i = 0; i < 24; i++) prop(b, {}, i % 2 ? "tree_oak" : "tree_fat", -100 + i * 9 + hh(i) * 3, 0, (i % 2 ? 1 : -1) * (17 + hh(i, 2) * 5), 6 + hh(i, 3) * 4);
  // ---------------- FLOOD: drowned town, only roofs and a spire above the sea ----------------
  for (let i = 0; i < 14; i++) {
    const x = FLOOD[0] - 40 + (i % 7) * 12 + hh(i) * 3, z = FLOOD[2] - 6 - Math.floor(i / 7) * 16 - hh(i, 2) * 4;
    house(b, x, z, hh(i, 3) * 0.6 - 0.3, 8, 7, 8, i + 3, -7.2 + hh(i, 4) * 1.2);
  }
  const spireM = lam("spire", () => ({ map: stoneHD("spireHD") }));
  b.add(boxGeo(V(FLOOD[0] + 9, -8, FLOOD[2] - 22), V(FLOOD[0] + 13, 3, FLOOD[2] - 18), 2), spireM);
  b.add(new THREE.ConeGeometry(2.9, 7, 4).rotateY(Math.PI / 4).translate(FLOOD[0] + 11, 6.5, FLOOD[2] - 20), lam("spireRoof", () => ({ color: "#5d6b86" })));
  // ---------------- PRE: sandy shore, stromatolites, volcanoes ----------------
  ground(b, lam("preSand", () => ({ color: "#d9b77c" })), PRE[0], PRE[2] + 30, 200, 1);
  bumps(b, 40, PRE[0] - 2, PRE[2] - 8, 16, "#8a7a5a", 3, 0.5, 1.4);
  for (let i = 0; i < 4; i++) {
    const h = 30 + i * 12, g = new THREE.ConeGeometry(h * 0.9, h, 9, 1, true); g.translate(0, h / 2 - 1, 0);
    b.add(g, lam("volcano", () => ({ color: "#6b4a3a" })), new THREE.Matrix4().makeTranslation(PRE[0] - 60 + i * 45, 0, PRE[2] - 160 - i * 30));
  }
  b.build(root);
  const preSea = sea(root, PRE[0], PRE[2] - 80, 160, "#3aa0b8"); preSea.position.y = 0.05;
  const floodSea = sea(root, FLOOD[0], FLOOD[2] - 30, 200, "#2f8fc4");
  // the sliding house (its own group)
  const hb = new Batch(), slider = new THREE.Group();
  house(hb, 0, 0, 0, 9, 7, 8, 5, 0);
  hb.build(slider, false);
  slider.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; m.matrixAutoUpdate = true; } });
  slider.position.set(6, 0, -10.5); root.add(slider);
  // rowing boat
  const boat = new THREE.Group();
  const hull = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.6, 3.2, 16, 1, false, 0, Math.PI).rotateZ(Math.PI / 2).rotateX(Math.PI / 2), lam("boatHull", () => ({ color: "#c0603a", side: THREE.DoubleSide })));
  hull.scale.set(1, 0.6, 1); boat.add(hull);
  const oar = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 3.4), lam("oar", () => ({ color: "#e0b070" }))); oar.position.set(0, 0.4, 0); oar.rotation.y = 1.2; boat.add(oar);
  boat.position.set(FLOOD[0], 0.15, FLOOD[2]); root.add(boat);
  // ---------------- SPACE: the planet, a tape round the waist, a brake block, the Moon ----------------
  const G = globe(root, GR);
  G.mesh.position.set(...SPACE);
  const tape = new THREE.Mesh(new THREE.TorusGeometry(GR * 1.02, 0.12, 8, 96), lam("tape", () => ({ map: rep(tapeTex(), 1, 1) })));
  tape.rotation.x = Math.PI / 2; tape.position.set(...SPACE); root.add(tape);
  const brake = new THREE.Group();
  const pad = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.4, 1.2), lam("brakePad", () => ({ color: "#8a5a3a" })));
  const arm = new THREE.Mesh(new THREE.BoxGeometry(5, 0.4, 0.4), lam("brakeArm", () => ({ color: "#c94a3a" }))); arm.position.set(3, 0, 0);
  brake.add(pad, arm); root.add(brake);
  const sparks = new Particles(root, 120, "#ffcf6a", 0.18, "soft", 3.0);
  const moon = new THREE.Mesh(new THREE.SphereGeometry(GR * 0.27, 48, 32), lam("moonM", () => ({ map: moonTex() })));
  root.add(moon);
  const tide = new THREE.Mesh(new THREE.SphereGeometry(GR * 1.03, 64, 32), new THREE.MeshBasicMaterial({ color: new THREE.Color("#5fb8ff"), transparent: true, opacity: 0.14, depthWrite: false }));
  tide.scale.set(1.12, 0.98, 0.98); root.add(tide);
  const fastSun = new Glow(root, "#ffe7a0", 3.0);
  const smoke = new Particles(root, 80, "#9a8a80", 6, "dot", 1.0);
  const motes = new Particles(root, 200, "#ffffff", 0.06, "soft", 1.5);
  for (const m of [pad, arm, moon]) { m.castShadow = true; m.receiveShadow = true; }
  void glowMat; void twoTone; void clamp01;

  const pose = ({ id, t }: PoseCtx) => {
    const inSpace = [1, 3, 4, 5, 7, 11].includes(id);
    G.mesh.visible = inSpace; tape.visible = id === 4; brake.visible = id === 3; moon.visible = tide.visible = id === 11;
    G.U.uSpin.value = spinAt(t); G.U.uOcean.value = oceanAt(t);
    const bl = bulgeAt(t); G.mesh.scale.set(1 + bl, 1 - bl, 1 + bl); tape.scale.setScalar(1 + bl);
    G.U.uSun.value.set(0.7, 0.35, 0.6).normalize();
    // brake: slides in from the right and presses the globe's flank
    const br = brakeAt(t);
    brake.position.set(SPACE[0] + GR + 0.7 + (1 - br) * 6, SPACE[1] + 0.5, SPACE[2]);
    sparks.pose((i, o) => { const u = (t * 2 + hh(i, 1)) % 1; o.set(SPACE[0] + GR + 0.2 + u * 3 * hh(i, 2), SPACE[1] + 0.5 + (hh(i, 3) - 0.3) * 3 * u, SPACE[2] + (hh(i, 4) - 0.5) * 2 + u * 2); return br > 0.9; }, id === 3);
    // moon orbit + tidal bulge toward it
    const ma = 0.4 + t * 0.12; moon.position.set(SPACE[0] + Math.cos(ma) * MOON, SPACE[1] + 1.5, SPACE[2] + Math.sin(ma) * MOON);
    tide.position.set(...SPACE); tide.rotation.set(0, -ma, 0);
    // house slides east, sea rises, boat bobs
    const hs = houseSlide(t); slider.position.set(6 + hs * hs * 60, 0.2 * Math.sin(hs * 30) * (hs > 0 && hs < 1 ? 1 : 0), -10.5); slider.rotation.z = -0.1 * Math.min(1, hs * 3) * (1 - hs);
    boat.position.y = 0.15 + 0.12 * Math.sin(t * 2.2); boat.rotation.z = 0.06 * Math.sin(t * 1.7);
    // prehistoric: a sun racing across the sky, volcano smoke
    const su = ((t * 0.45) % 1);
    fastSun.set(PRE[0] - 120 + su * 240, 20 + Math.sin(su * Math.PI) * 90, PRE[2] - 260, 60, id === 12 ? 1 : 0, id === 12);
    smoke.pose((i, o) => { const u = (t * 0.08 + hh(i, 1)) % 1, v = i % 4; o.set(PRE[0] - 60 + v * 45 + u * 10, 30 + v * 12 + u * 40, PRE[2] - 160 - v * 30); return true; }, id === 12);
    motes.pose((i, o) => { const u = (t * 0.05 + hh(i, 1)) % 1; o.set(SPACE[0] + (hh(i, 2) - 0.5) * 30, SPACE[1] + (hh(i, 3) - 0.5) * 30, SPACE[2] + (hh(i, 4) - 0.5) * 30 + u); return true; }, inSpace);
    preSea.visible = id === 12; floodSea.visible = id === 6;
    void smooth; void lerp;
  };
  return { pose };
};
