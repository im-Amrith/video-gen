// "The Tower That Started Falling Before It Was Finished" (History ep. 2) — PIAZZA (tower, cathedral, baptistery,
// lawn) at the origin; SECTION (a soil cross-section diorama with a half-tower) at x = 3000.
import * as THREE from "three";
import { Batch, boxGeo, V, lam, prop } from "../toon/build";
import { ctex, rep, grassHD, stoneHD, bed } from "../toon/paint";
import { Particles, Glow } from "../toon/fx";
import { ground } from "../toon/kit";
import { dressLand } from "../toon/dress";
import { BuildCtx, PoseCtx, SetHandle, hh, smooth, seg } from "../toon/core";
import { DRILL0, DRILL1, SEC, FH, FR, floorsAt, leanAt, bendAt, bellsAt, leadAt, drillAt, fenceOn, lapseAt } from "./story";

const arcadeTex = () => ctex("pisaArcade", 1024, 256, (g, r) => {
  g.fillStyle = "#f4efe2"; g.fillRect(0, 0, 1024, 256);
  for (let i = 0; i < 300; i++) { g.fillStyle = `rgba(170,150,120,${0.04 + r() * 0.06})`; g.fillRect(r() * 1024, r() * 256, 10 + r() * 30, 2 + r() * 4); }
  for (let i = 0; i < 16; i++) {
    const x = i * 64 + 8;
    g.fillStyle = "#c9c2b0"; g.beginPath(); g.moveTo(x, 230); g.lineTo(x, 90); g.arc(x + 24, 90, 24, Math.PI, 0); g.lineTo(x + 48, 230); g.fill();
    g.fillStyle = "#7d7466"; g.beginPath(); g.moveTo(x + 8, 230); g.lineTo(x + 8, 96); g.arc(x + 24, 96, 16, Math.PI, 0); g.lineTo(x + 40, 230); g.fill();
    g.fillStyle = "#ffffff"; g.fillRect(x - 6, 60, 8, 180);
  }
  g.fillStyle = "#e2d9c4"; g.fillRect(0, 0, 1024, 18); g.fillRect(0, 238, 1024, 18);
});
const strataTex = () => ctex("pisaStrata", 512, 512, (g, r) => {
  const bands: [number, string][] = [[0, "#6aa84f"], [24, "#d9b77c"], [150, "#a67c52"], [270, "#8a6a4a"], [380, "#6f5a48"]];
  bands.forEach(([y, c], i) => { g.fillStyle = c; g.fillRect(0, y, 512, (bands[i + 1]?.[0] ?? 512) - y); });
  for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(40,25,10,${0.08 + r() * 0.12})`; g.fillRect(r() * 512, 24 + r() * 488, 3 + r() * 5, 2 + r() * 3); }
  for (const y of [24, 150, 270, 380]) { g.fillStyle = "rgba(30,20,10,.5)"; g.fillRect(0, y, 512, 3); }
});
const domeStripe = () => ctex("pisaStripe", 256, 256, (g) => { for (let i = 0; i < 16; i++) { g.fillStyle = i % 2 ? "#f4efe2" : "#9aa0a8"; g.fillRect(0, i * 16, 256, 16); } });

/** a tower made of FR-radius floors on jointed groups (lean at the base, banana bend from floor 4) */
const makeTower = (parent: THREE.Object3D, flatten = 1) => {
  const base = new THREE.Group(); parent.add(base);
  const mat = lam("pisaArcade", () => ({ map: rep(arcadeTex(), 2, 1) })), ledge = lam("pisaLedge", () => ({ color: "#e2d9c4" }));
  const floors: THREE.Group[] = [];
  let prev: THREE.Object3D = base;
  // owner #4: a visible base: a two-step marble plinth the tower stands on (not sitting on the lawn)
  for (const [rr, y0, h] of [[1.24, -0.3, 0.55], [1.12, 0.25, 0.45]] as const) {
    const st = new THREE.Mesh(new THREE.CylinderGeometry(FR * rr, FR * rr * 1.02, h, 48), ledge); st.position.y = y0 + h / 2; st.scale.z = flatten; st.castShadow = st.receiveShadow = true; base.add(st);
  }
  const colG = new THREE.CylinderGeometry(0.1, 0.12, FH * 0.66, 8), colM = lam("pisaColumn", () => ({ color: "#fbf8f0" }));
  const m4 = new THREE.Matrix4();
  for (let k = 0; k < 9; k++) {
    const g = new THREE.Group(); g.position.y = k === 0 ? 0.7 : FH; prev.add(g);
    const r = k === 8 ? FR * 0.7 : FR;
    const body = new THREE.Mesh(new THREE.CylinderGeometry(r, r, FH * (k === 8 ? 0.85 : 1), 40), mat); body.position.y = FH / 2; body.scale.z = flatten;
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(r * 1.06, r * 1.06, 0.35, 40), ledge); ring.position.y = FH - 0.1; ring.scale.z = flatten;
    g.add(body, ring);
    if (k >= 1 && k <= 6) { // open arcaded gallery: a ring of white columns standing proud of the wall
      const n = 26, cols = new THREE.InstancedMesh(colG, colM, n);
      for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; cols.setMatrixAt(i, m4.makeTranslation(Math.cos(a) * r * 1.07, FH * 0.42, Math.sin(a) * r * 1.07 * flatten)); }
      cols.castShadow = true; g.add(cols);
    }
    if (k === 8) { const roof = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.9, r * 1.02, 0.6, 32), lam("pisaRoof", () => ({ color: "#b8a68a" }))); roof.position.y = FH * 0.85 + 0.3; roof.scale.z = flatten; g.add(roof); }
    g.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } });
    floors.push(g); prev = g;
  }
  return { base, floors };
};

export const buildSet = ({ root }: BuildCtx): SetHandle => {
  const b = new Batch();
  ground(b, lam("pisaLawn", () => ({ map: grassHD() })), 0, 0, 400, 100);
  // cathedral (striped box + gable) and baptistery (drum + dome), far wall
  const stripe = lam("pisaStripe", () => ({ map: rep(domeStripe(), 4, 2) }));
  b.add(boxGeo(V(-60, 0, -55), V(-24, 16, -38)), stripe);
  b.add(new THREE.CylinderGeometry(0.01, 10.5, 7, 4, 1).rotateY(Math.PI / 4).scale(1.75, 1, 0.82).translate(-42, 19.5, -46.5), lam("pisaGable", () => ({ color: "#f4efe2" })));
  b.add(new THREE.CylinderGeometry(9, 9, 13, 40).translate(-80, 6.5, -24), stripe);
  b.add(new THREE.SphereGeometry(8.6, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2).translate(-80, 13, -24), lam("pisaDome", () => ({ color: "#d9c9a8" })));
  b.add(boxGeo(V(-140, 0, -90), V(140, 7, -86)), lam("pisaWall", () => ({ map: stoneHD("pisaWallS") })));
  for (let i = 0; i < 14; i++) prop(b, {}, i % 2 ? "tree_cone" : "tree_default", -120 + i * 18 + hh(i) * 4, 0, -80 + hh(i, 2) * 4, 8 + hh(i, 3) * 3);
  // owner feedback #2: fill the lawn in 3 depth layers (grass tufts + rocks near, bushes/trees mid, Tuscan hills behind)
  const busy = (x: number, z: number) => Math.hypot(x, z) < 12 || (z > 2 && z < 14 && x > -12 && x < 30) || (x < -20 && x > -95 && z < -15 && z > -60) || (x > 12 && x < 30 && z > -6 && z < 18);
  dressLand(b, { cx: 0, cz: 0, r0: 12, r1: 75, keep: busy, tufts: "grass", nTufts: 300, rocks: 30, bushes: 26, seed: 7 });
  dressLand(b, { cx: 0, cz: -20, r0: 60, r1: 130, keep: (x, z) => z > 0 || busy(x, z), bushes: 30, trees: 26, treeKinds: ["tree_cone", "tree_default", "tree-high-round", "tree_fat"], hillR: 200, hillCol: "#8aa850", hillN: 16, hillH: 26, seed: 8 });
  // the SECTION diorama sits in the same landscape (lawn behind the cut, hills), not in an empty sky
  b.add(new THREE.PlaneGeometry(400, 200).rotateX(-Math.PI / 2), lam("pisaLawn", () => ({ map: grassHD() })), new THREE.Matrix4().makeTranslation(SEC[0], 0, SEC[2] - 106));
  dressLand(b, { cx: SEC[0], cz: SEC[2] - 30, r0: 8, r1: 70, keep: (x, z) => z > SEC[2] - 8, tufts: "grass", nTufts: 60, bushes: 12, trees: 14, treeKinds: ["tree_cone", "tree_default", "tree-high-round"], hillR: 130, hillCol: "#8aa850", hillN: 14, hillH: 22, seed: 9 });
  // SECTION diorama: strata slab with a clean cut face
  b.add(boxGeo(V(SEC[0] - 16, -12, SEC[2] - 6), V(SEC[0] + 16, 0, SEC[2] + 0.5)), lam("pisaStrata", () => ({ map: strataTex() })));
  b.build(root);
  const T = makeTower(root);
  const S = makeTower(root, 0.25); S.base.position.set(SEC[0], 0, SEC[2] - 1);
  const found = new THREE.Mesh(new THREE.BoxGeometry(FR * 2.4, 3, 1.2), lam("pisaFound", () => ({ map: stoneHD("pisaFoundS") }))); root.add(found);
  // lead counterweights + drill rig + fence
  const leadM = lam("pisaLead", () => ({ color: "#6e7480" }));
  const lead = Array.from({ length: 12 }, () => { const m = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.6, 1.0), leadM); m.castShadow = true; root.add(m); return m; });
  const rig = new THREE.Group();
  const rigBox = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.8, 1.6), lam("rigY", () => ({ color: "#f2c230" }))); rigBox.position.y = 0.9; rig.add(rigBox);
  const drill = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 9, 10), lam("drillRod", () => ({ color: "#8d96a6" }))); drill.rotation.z = 1.1; drill.position.set(3.6, -1.2, 0); rig.add(drill);
  // owner #4: the drilled soil comes out of the side and piles up visibly
  const pile = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), lam("soilPile", () => ({ map: bed(), color: "#8a6a4a" })));
  pile.position.set(2.2, 0, 2.0); rig.add(pile);
  root.add(rig);
  const spray = new Particles(root, 90, "#7a5a3a", 0.22, "dot", 1.0);
  const secPile = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), lam("soilPile", () => ({ map: bed(), color: "#8a6a4a" })));
  secPile.position.set(SEC[0] + 8.2, 0, SEC[2] + 1.4); root.add(secPile);
  const fence = new THREE.Group();
  const tape = ctex("pisaTape", 256, 32, (g) => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? "#ffffff" : "#e2453c"; g.fillRect(i * 32, 0, 32, 32); } });
  for (let k = 0; k < 16; k++) {
    const a = (k / 16) * Math.PI * 2, x = Math.cos(a) * (FR + 4), z = Math.sin(a) * (FR + 4), a2 = ((k + 1) / 16) * Math.PI * 2, x2 = Math.cos(a2) * (FR + 4), z2 = Math.sin(a2) * (FR + 4);
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.1).translate(0, 0.55, 0), lam("fencePost", () => ({ color: "#e2453c" }))); post.position.set(x, 0, z); fence.add(post);
    const band = new THREE.Mesh(new THREE.PlaneGeometry(Math.hypot(x2 - x, z2 - z), 0.12), lam("pisaTapeM", () => ({ map: tape, side: THREE.DoubleSide })));
    band.position.set((x + x2) / 2, 0.95, (z + z2) / 2); band.rotation.y = -Math.atan2(z2 - z, x2 - x); fence.add(band);
  }
  root.add(fence);
  const dust = new Particles(root, 140, "#a67c52", 0.25, "dot", 1.0);
  const lapseSun = new Glow(root, "#ffe7a0", 2.6);
  const bells = new Glow(root, "#ffd27a", 1.6);

  const pose = ({ id, t }: PoseCtx) => {
    const sec = id === 3 || id === 9 && false;
    void sec;
    const n = floorsAt(t), lean = leanAt(t), bend = bendAt(t);
    for (const tw of [T, S]) {
      tw.base.rotation.z = lean;
      tw.floors.forEach((g, k) => { g.visible = k < n; g.rotation.z = k >= 4 && k < 8 ? -bend : 0; g.scale.y = 1; });
    }
    S.base.rotation.z = lean * 2.2;
    T.base.position.set(0, -0.15 * (lean / 0.1), 0);
    S.base.position.y = -1.2 * (lean / 0.1);
    found.position.set(SEC[0], -1.5 + S.base.position.y, SEC[2] - 0.4); found.rotation.z = lean * 2.2;
    const ld = leadAt(t);
    lead.forEach((m, k) => { m.visible = k < ld * 12; m.position.set(FR + 0.6 + (k % 3) * 0.2, 0.3 + Math.floor(k / 3) * 0.6, -1.2 + (k % 3) * 1.1); });
    const dr = drillAt(t); rig.visible = dr > 0; rig.position.set(FR + 6, 0, 3);
    const pu = smooth(seg(t, DRILL0, DRILL1)); pile.scale.set(0.3 + 1.5 * pu, 0.15 + 0.95 * pu, 0.3 + 1.3 * pu);
    const inSec = id === 9, sx = inSec ? SEC[0] + 4.6 : FR + 6 - 0.6, sz = inSec ? SEC[2] + 0.9 : 3 + 0.9, sy = inSec ? -0.2 : 0.3;
    spray.pose((i, o) => { const uu = (t * 1.4 + hh(i, 3)) % 1; o.set(sx + uu * 2.8 + (hh(i, 4) - 0.5) * 0.4, sy + Math.sin(uu * Math.PI) * 1.6, sz + uu * 0.5 + (hh(i, 5) - 0.5) * 0.3); return true; }, dr > 0);
    secPile.visible = inSec && dr > 0; secPile.scale.set(0.3 + 1.6 * pu, 0.15 + 1.0 * pu, 0.3 + 0.9 * pu);
    fence.visible = fenceOn(t);
    dust.pose((i, o) => { const u = (t * 0.8 + hh(i, 1)) % 1; o.set(SEC[0] + 6 - u * 4, -2 + u * 2.5, SEC[2] + 0.6); return true; }, id === 9 && dr > 0);
    const lp = lapseAt(t);
    lapseSun.set(-200 + ((t * 0.9) % 1) * 400, 40 + Math.sin(((t * 0.9) % 1) * Math.PI) * 120, -300, 50, lp > 0 ? 1 : 0, lp > 0);
    const bl = bellsAt(t); bells.set(0, FH * 8.4 + 1.0, 0, 6, bl, bl > 0);
    void smooth; void seg;
  };
  return { pose };
};
