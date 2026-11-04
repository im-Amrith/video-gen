// "What If the Sun Vanished?" — PARK (deck chair, umbrella) at the origin; SPACE (Sun, light front, Earth's orbit) at
// x = 3000; SNOW town at z = -3000; CUT (ocean cutaway under an ice lid) at x = -3000; VENT (deep-sea vents) at z = 3000.
import * as THREE from "three";
import { Batch, boxGeo, V, lam, house, prop } from "../toon/build";
import { ctex, rep, grassHD, cobbleHD } from "../toon/paint";
import { NOINK } from "../toon/ink";
import { Particles, Glow, glowMat } from "../toon/fx";
import { ground, globe, bumps } from "../toon/kit";
import { BuildCtx, PoseCtx, SetHandle, hh, smooth, seg, lerp } from "../toon/core";
import { SPACE, SNOW, CUT, VENT, ORB, earthAt, sunGone, frontR, snowAt } from "./story";

const snowTex = () => ctex("snowSun", 512, 512, (g, r) => { g.fillStyle = "#eef3fa"; g.fillRect(0, 0, 512, 512); for (let i = 0; i < 1500; i++) { g.fillStyle = `rgba(${180 + r() * 60},${200 + r() * 40},${230 + r() * 25},.4)`; g.fillRect(r() * 512, r() * 512, 3, 3); } });

export const buildSet = ({ root }: BuildCtx): SetHandle => {
  const b = new Batch();
  // PARK
  ground(b, lam("grassSun", () => ({ map: grassHD() })), 0, 0, 400, 100);
  for (let i = 0; i < 16; i++) prop(b, {}, ["tree_oak", "tree_fat", "plant_bushLarge"][i % 3], -40 + i * 5.5 + hh(i) * 2, 0, -14 - hh(i, 2) * 10, i % 3 === 2 ? 1.5 : 6 + hh(i, 3) * 3);
  // deck chair: frame + striped canvas
  const stripeT = ctex("chairStripe", 64, 256, (g) => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? "#ffffff" : "#e2453c"; g.fillRect(0, i * 32, 64, 32); } });
  b.add(new THREE.BoxGeometry(0.9, 0.05, 1.5).rotateX(-0.6).translate(0, 0.65, 0), lam("chairCanvas", () => ({ map: stripeT, side: THREE.DoubleSide })), new THREE.Matrix4().makeTranslation(0, 0, 0.2));
  for (const sx of [-0.45, 0.45]) b.add(boxGeo(V(sx - 0.03, 0, -0.6), V(sx + 0.03, 1.2, -0.5)), lam("chairWood", () => ({ color: "#b0703f" })));
  // umbrella
  b.add(new THREE.CylinderGeometry(0.04, 0.04, 2.6).translate(0, 1.3, 0), lam("umbPole", () => ({ color: "#f3efe6" })), new THREE.Matrix4().makeTranslation(1.3, 0, -0.6));
  const umbT = ctex("umbT", 256, 64, (g) => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? "#f2c230" : "#3f6fb5"; g.fillRect(i * 32, 0, 32, 64); } });
  b.add(new THREE.ConeGeometry(1.8, 0.7, 16, 1, true).translate(0, 2.7, 0), lam("umb", () => ({ map: umbT, side: THREE.DoubleSide })), new THREE.Matrix4().makeTranslation(1.3, 0, -0.6));
  // SNOW town
  ground(b, lam("snowSun", () => ({ map: snowTex() })), SNOW[0], SNOW[2], 300, 60);
  for (let i = 0; i < 8; i++) house(b, SNOW[0] - 30 + i * 9, SNOW[2] - 9, 0, 7.5, 6.5, 6 + (i % 3), i + 2, 0);
  for (let i = 0; i < 30; i++) { const g = new THREE.SphereGeometry(1, 14, 8); g.scale(1.6 + hh(i) * 2, 0.6, 1.2); b.add(g, lam("drift", () => ({ color: "#f4f8fc" })), new THREE.Matrix4().makeTranslation(SNOW[0] - 30 + hh(i, 1) * 60, 0, SNOW[2] - 4 + hh(i, 2) * 10)); }
  for (let i = 0; i < 20; i++) b.add(new THREE.ConeGeometry(0.12, 0.8 + hh(i) * 0.6, 6).rotateX(Math.PI).translate(0, -0.4, 0), lam("icicle", () => ({ color: "#cfe9ff" })), new THREE.Matrix4().makeTranslation(SNOW[0] - 30 + (i % 8) * 9 + hh(i, 3) * 6 - 3, 5.8 + (i % 3), SNOW[2] - 5.7));
  // CUT: aquarium-style section of the sea: ice lid, water body, sand floor
  b.add(boxGeo(V(CUT[0] - 10, -0.2, CUT[2] - 3), V(CUT[0] + 10, 0.6, CUT[2] + 3)), lam("iceLid", () => ({ color: "#e7f4ff" })));
  b.add(boxGeo(V(CUT[0] - 10, -12.2, CUT[2] - 3), V(CUT[0] + 10, -11.6, CUT[2] + 3)), lam("seaSand", () => ({ color: "#c9b48a" })));
  bumps(b, 16, CUT[0], CUT[2], 8, "#7a7066", 6, 0.3, 0.8);
  // VENT: dark seabed, black smokers, tube worms
  ground(b, lam("ventFloor", () => ({ map: rep(cobbleHD(), 1, 1), color: "#5a5262" })), VENT[0], VENT[2], 200, 40);
  const chim = lam("smoker", () => ({ color: "#3a3440" }));
  for (let k = 0; k < 5; k++) { const h = 3 + hh(k) * 4; b.add(new THREE.CylinderGeometry(0.4, 1.1, h, 10).translate(0, h / 2, 0), chim, new THREE.Matrix4().makeTranslation(VENT[0] - 6 + k * 3.2, 0, VENT[2] - 4 - hh(k, 2) * 4)); }
  for (let k = 0; k < 40; k++) {
    const x = VENT[0] - 5 + hh(k, 1) * 10, z = VENT[2] - 2 + hh(k, 2) * 4, h = 0.6 + hh(k, 3) * 0.8;
    b.add(new THREE.CylinderGeometry(0.06, 0.06, h).translate(0, h / 2, 0), lam("tube", () => ({ color: "#f0ece4" })), new THREE.Matrix4().makeTranslation(x, 0, z));
    b.add(new THREE.SphereGeometry(0.11, 8, 6), lam("plume", () => ({ color: "#e2453c" })), new THREE.Matrix4().makeTranslation(x, h, z));
  }
  b.build(root);

  // dynamic: the Sun, light front, orbit ring, the Earth, the Moon
  const sunBall = new THREE.Mesh(new THREE.SphereGeometry(8, 48, 32), glowMat("#ffd27a", 2.2)); sunBall.position.set(...SPACE); sunBall.layers.set(NOINK); root.add(sunBall);
  const sunHalo = new Glow(root, "#ffbf5a", 2.0);
  const front = new THREE.Mesh(new THREE.TorusGeometry(1, 0.35, 8, 96).rotateX(Math.PI / 2), glowMat("#fff1c0", 1.6)); front.layers.set(NOINK); root.add(front);
  const orbit = new THREE.Mesh(new THREE.TorusGeometry(ORB, 0.12, 6, 160).rotateX(Math.PI / 2), glowMat("#8fb8ff", 0.9)); orbit.position.set(...SPACE); orbit.layers.set(NOINK); root.add(orbit);
  const E = globe(root, 4);
  const moon = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32, 24), lam("moonSun", () => ({ color: "#c9c4b8" }))); root.add(moon);
  const streak = new Particles(root, 160, "#bcd8ff", 0.3, "soft", 1.4);
  const snow = new Particles(root, 600, "#ffffff", 0.08, "flake", 1.0);
  // CUT water body (see-through) + bubbles; VENT glow + smoke + drifting snow-of-the-sea
  const waterBox = new THREE.Mesh(new THREE.BoxGeometry(20, 11.8, 6), new THREE.MeshBasicMaterial({ color: new THREE.Color("#1d5fa6"), transparent: true, opacity: 0.45, depthWrite: false }));
  waterBox.position.set(CUT[0], -5.9, CUT[2]); waterBox.layers.set(NOINK); root.add(waterBox);
  const bubbles = new Particles(root, 80, "#cfe9ff", 0.18, "soft", 1.0);
  const ventGlow = [0, 1, 2, 3, 4].map(() => new Glow(root, "#ff8a3a", 2.4));
  const smoke = new Particles(root, 240, "#2a2430", 1.2, "dot", 1.0);
  const marine = new Particles(root, 300, "#a8c8e8", 0.06, "soft", 0.8);

  const pose = ({ id, t }: PoseCtx) => {
    const sp = [2, 3, 5, 6].includes(id);
    const gone = sunGone(t);
    sunBall.visible = sp && gone < 1; sunBall.scale.setScalar(Math.max(0.01, 1 - gone));
    sunHalo.set(SPACE[0], SPACE[1], SPACE[2], 60 * (1 - gone), 1 - gone, sp);
    const fr = frontR(t); front.visible = sp && fr > 0 && fr < ORB * 1.6; front.position.set(...SPACE); front.scale.setScalar(Math.max(0.1, fr));
    orbit.visible = sp; E.mesh.visible = sp;
    const ep = earthAt(t); E.mesh.position.set(...ep); E.U.uSpin.value = t * 0.4;
    // lit while the light is still arriving, then only starlight
    const lit = fr < Math.hypot(ep[0] - SPACE[0], ep[2] - SPACE[2]) ? 1 : 0;
    E.U.uSun.value.set(SPACE[0] - ep[0], 0.2, SPACE[2] - ep[2]).normalize(); E.U.uNight.value = lit ? 0.18 : 0.1;
    if (!lit) E.U.uSun.value.set(0, -1, 0);
    const ma = t * 0.9; moon.visible = sp; moon.position.set(ep[0] + Math.cos(ma) * 9, ep[1] + 1, ep[2] + Math.sin(ma) * 9);
    (moon.material as THREE.MeshLambertMaterial).color.set(lit ? "#c9c4b8" : "#3a3a48");
    streak.pose((i, o) => { const u = (t * 1.5 + hh(i, 1)) % 1; o.set(ep[0] - 30 * u + (hh(i, 2) - 0.5) * 12, ep[1] + (hh(i, 3) - 0.5) * 10, ep[2] + (hh(i, 4) - 0.5) * 12 - 10 * u); return true; }, id === 5);
    snow.pose((i, o) => { const u = (t * 0.15 + hh(i, 1)) % 1; o.set(SNOW[0] - 25 + hh(i, 2) * 50, 10 - u * 10 * snowAt(t) * 1.0 + (1 - snowAt(t)) * 50, SNOW[2] - 4 + hh(i, 3) * 14); return true; }, id === 7 || id === 8);
    waterBox.visible = id === 9;
    bubbles.pose((i, o) => { const u = (t * 0.3 + hh(i, 1)) % 1; o.set(CUT[0] - 9 + hh(i, 2) * 18, -11.5 + u * 11, CUT[2] - 2 + hh(i, 3) * 4); return true; }, id === 9);
    const v = id === 10 || id === 11;
    ventGlow.forEach((g, k) => g.set(VENT[0] - 6 + k * 3.2, 3 + hh(k) * 4 + 0.3, VENT[2] - 4 - hh(k, 2) * 4, 2.2 + 0.4 * Math.sin(t * 3 + k), 0.9, v));
    smoke.pose((i, o) => { const k = i % 5, u = (t * 0.25 + hh(i, 1)) % 1; o.set(VENT[0] - 6 + k * 3.2 + u * 1.5 + (hh(i, 2) - 0.5) * u * 2, 3 + hh(k) * 4 + u * 9, VENT[2] - 4 - hh(k, 2) * 4); return true; }, v);
    marine.pose((i, o) => { const u = (t * 0.05 + hh(i, 1)) % 1; o.set(VENT[0] - 15 + hh(i, 2) * 30, 12 - u * 12, VENT[2] - 10 + hh(i, 3) * 20); return true; }, v);
    void smooth; void seg; void lerp;
  };
  return { pose };
};
