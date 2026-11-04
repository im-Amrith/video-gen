// "What If All the Ice on Earth Melted?" — places: TOWN (beach, boardwalk, houses, a 20-storey tower, a hill) at the
// origin with a rising sea; ICE plain with the three ice piles at z = -3000; FLOE (North Pole sea ice) at x = 3000;
// GLASS (picnic table) at x = -3000; GREEN (Greenland ice sheet) at z = 3000.
import * as THREE from "three";
import { Batch, boxGeo, V, lam, house, prop } from "../toon/build";
import { ctex, rep, grassHD, planksHD, facadeHD } from "../toon/paint";
import { Particles } from "../toon/fx";
import { NOINK } from "../toon/ink";
import { tuft, rock, post, fence, iceberg, mountain, dressLand, iceM as iceBergM } from "../toon/dress";
import { ground, sea } from "../toon/kit";
import { BuildCtx, PoseCtx, SetHandle, hh, smooth, seg } from "../toon/core";
import { TOWER, HILL, ICE, FLOE, GLASS, GREEN, seaAt, cubeAt, FLOORH, FLOORS } from "./story";

const iceTex = () => ctex("iceIce", 512, 512, (g, r) => { g.fillStyle = "#e6f2f8"; g.fillRect(0, 0, 512, 512); for (let i = 0; i < 300; i++) { g.strokeStyle = `rgba(160,200,230,${0.2 + r() * 0.3})`; g.lineWidth = 2 + r() * 5; g.beginPath(); const x = r() * 512, y = r() * 512; g.moveTo(x, y); g.lineTo(x + 30 + r() * 60, y + (r() - 0.5) * 12); g.stroke(); } });
const sandTex = () => ctex("sandIce", 512, 512, (g, r) => { g.fillStyle = "#e9cf94"; g.fillRect(0, 0, 512, 512); for (let i = 0; i < 2500; i++) { g.fillStyle = `rgba(${150 + r() * 80},${120 + r() * 60},${70 + r() * 40},.35)`; g.fillRect(r() * 512, r() * 512, 2, 2); } });

export const buildSet = ({ root }: BuildCtx): SetHandle => {
  const b = new Batch();
  // ---------------- TOWN ----------------
  ground(b, lam("sandIce", () => ({ map: sandTex() })), 0, 40, 300, 60, -0.02);
  ground(b, lam("grassIce", () => ({ map: grassHD() })), 0, -160, 200, 50, 0.4);
  // boardwalk along the beach
  const bw = new THREE.BoxGeometry(80, 0.3, 4); const uv = bw.attributes.uv as THREE.BufferAttribute; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * 20, uv.getY(i));
  b.add(bw, lam("boardwalk", () => ({ map: planksHD() })), new THREE.Matrix4().makeTranslation(0, 0.8, 4));
  for (let i = 0; i < 20; i++) post(b, -38 + i * 4, 5.8, 0.75, -0.3, 0.3); // boardwalk piles: painted wood
  // dune grass, driftwood rocks, a beach fence (3 depth layers: dunes / town / mountains)
  for (let i = 0; i < 70; i++) { const x = -44 + hh(i, 61) * 88, z = 6.8 + hh(i, 62) * 5; if (Math.abs(x - 2) < 4 && z < 9) continue; tuft(b, x, 0, z, hh(i, 63) > 0.4 ? "dry" : "grass", 0.8 + 0.5 * hh(i, 64), i + 400); }
  for (let i = 0; i < 14; i++) rock(b, -40 + hh(i, 65) * 80, 0, 8 + hh(i, 66) * 6, 0.2 + 0.3 * hh(i, 67), i + 300);
  fence(b, -40, 2.4, -6, 2.4, 2.5, 0.9, 0.1); fence(b, 8, 2.4, 40, 2.4, 2.5, 0.9, 0.1);
  for (let i = 0; i < 40; i++) { const x = -44 + hh(i, 71) * 88, z = -1.5 - hh(i, 72) * 2.5; tuft(b, x, 0.4, z, "grass", 0.7 + 0.4 * hh(i, 73), i + 500); }
  for (let k = 0; k < 8; k++) mountain(b, -200 + k * 58, -230 - (k % 2) * 45, 50 + (k % 3) * 20, 60, k + 20, k % 2 === 0, ["#7e8a6a", "#6e7a5c", "#8e9a76", "#5e6a4e"]);
  for (let i = 0; i < 9; i++) house(b, -36 + i * 9, -6, 0, 7.5, 6.5, 6 + (i % 3) * 1.4, i, 0.4);
  for (let i = 0; i < 14; i++) prop(b, {}, i % 2 ? "tree_fat" : "tree_oak", -45 + i * 7 + hh(i) * 2, 0.4, -15 - hh(i, 2) * 4, 5 + hh(i, 3) * 3);
  // the tower: 20 floors with windows on every face
  const tw = 12, td = 12, th = FLOORS * FLOORH;
  const tm = lam("towerFace", () => ({ map: facadeHD("towerFace", tw, th, { wall: "#d9c9a8", shutter: "#2f5f6a" }) }));
  b.add(boxGeo(V(TOWER[0] - tw / 2, 0.4, TOWER[2] - td / 2), V(TOWER[0] + tw / 2, 0.4 + th, TOWER[2] + td / 2)), tm);
  b.add(boxGeo(V(TOWER[0] - tw / 2 - 0.3, th + 0.4, TOWER[2] - td / 2 - 0.3), V(TOWER[0] + tw / 2 + 0.3, th + 1.0, TOWER[2] + td / 2 + 0.3)), lam("towerCap", () => ({ color: "#9aa0aa" })));
  for (let k = 0; k < 24; k++) { const a = (k / 24) * Math.PI * 2, rx = TOWER[0] + Math.max(-1, Math.min(1, 1.25 * Math.cos(a))) * (tw / 2), rz = TOWER[2] + Math.max(-1, Math.min(1, 1.25 * Math.sin(a))) * (td / 2); b.add(new THREE.CylinderGeometry(0.05, 0.05, 1.1).translate(0, 0.55, 0), lam("rail", () => ({ color: "#e2453c" })), new THREE.Matrix4().makeTranslation(rx, th + 1.0, rz)); }
  b.add(new THREE.CylinderGeometry(1.2, 1.2, 2.4, 20).translate(0, 1.2, 0), lam("waterTank", () => ({ color: "#5d8fb8" })), new THREE.Matrix4().makeTranslation(TOWER[0] - 3.5, th + 1.0, TOWER[2] - 3.5));
  // the hill with its house (safe)
  const hg = new THREE.SphereGeometry(1, 40, 24, 0, Math.PI * 2, 0, Math.PI / 2); hg.scale(42, 22, 34);
  b.add(hg, lam("hillGrass", () => ({ map: rep(grassHD(), 6, 6) })), new THREE.Matrix4().makeTranslation(HILL[0], 0, HILL[2]));
  house(b, HILL[0], HILL[2], 0.4, 8, 7, 6.5, 2, 21.6);
  for (let i = 0; i < 8; i++) prop(b, {}, ["tree_cone", "tree_oak", "tree_fat"][i % 3], HILL[0] - 18 + i * 5, 14 - Math.abs(i - 3.5) * 1.5, HILL[2] + 12 - hh(i) * 6, 5);
  const hillY = (x: number, z: number) => 22 * Math.sqrt(Math.max(0, 1 - ((x - HILL[0]) / 42) ** 2 - ((z - HILL[2]) / 34) ** 2));
  for (let i = 0; i < 160; i++) { const a = hh(i, 81) * Math.PI * 2, r = 0.25 + 0.65 * Math.sqrt(hh(i, 82)), x = HILL[0] + Math.cos(a) * 42 * r, z = HILL[2] + Math.sin(a) * 34 * r; if (Math.hypot(x - HILL[0] - 8, z - HILL[2] - 20) < 5) continue; tuft(b, x, hillY(x, z), z, hh(i, 83) > 0.7 ? "dry" : "grass", 1.0 + 0.5 * hh(i, 84), i + 600); }
  for (let i = 0; i < 12; i++) { const a = 0.2 + hh(i, 85) * 2.6, x = HILL[0] + Math.cos(a) * 30, z = HILL[2] + Math.sin(a) * 24; prop(b, {}, "plant_bushLarge", x, hillY(x, z) - 0.2, z, 1.2 + hh(i, 86)); rock(b, x + 2, hillY(x + 2, z), z + 1, 0.4 + 0.3 * hh(i, 87), i + 700); }
  for (let i = 0; i < 6; i++) { const x0 = HILL[0] - 6 + i * 2.2, z0 = HILL[2] + 7; post(b, x0, z0, 1.0, hillY(x0, z0) - 0.1); }
  // ---------------- ICE plain: three piles (91 / 8 / 1 cubes) ----------------
  const iceM = lam("iceIce", () => ({ map: iceTex() }));
  ground(b, iceM, ICE[0], ICE[2], 300, 40);
  const cubeM = lam("iceCube", () => ({ color: "#cfeaff" }));
  const cube = (x: number, y: number, z: number, s: number) => b.add(boxGeo(V(x - s / 2, y, z - s / 2), V(x + s / 2, y + s, z + s / 2)), cubeM);
  const S = 0.7;
  let n = 0;
  for (let layer = 0; n < 91; layer++) { const w = 6 - layer; for (let i = 0; i < w && n < 91; i++) for (let j = 0; j < w && n < 91; j++) { cube(ICE[0] - 6 + (i - w / 2) * S + layer * 0.05, layer * S, ICE[2] - 2 + (j - w / 2) * S, S * 0.96); n++; } }
  for (let k = 0; k < 8; k++) cube(ICE[0] + 1.5 + (k % 3) * S, Math.floor(k / 3) * S, ICE[2] + 1.0 + (k % 2) * S, S * 0.96);
  cube(ICE[0] + 4.6, 0, ICE[2] + 2.6, S * 0.96);
  // Antarctica: icebergs, snowy blue mountains, snow tufts (never a bare white plane)
  for (let k = 0; k < 16; k++) { const x = ICE[0] - 50 + hh(k, 91) * 100, z = ICE[2] - 16 - hh(k, 92) * 40; if (Math.abs(x - ICE[0]) < 9 && z > ICE[2] - 22) continue; iceberg(b, x, z, 2 + hh(k, 93) * 5, 2.5 + hh(k, 94) * 4, k + 10, -0.3); }
  for (let k = 0; k < 9; k++) mountain(b, ICE[0] - 220 + k * 55, ICE[2] - 150 - (k % 3) * 30, 45 + (k % 3) * 22, 55, k + 40, true, ["#8fa6c4", "#7d94b4", "#a0b6d2", "#6e86a8"]);
  for (let i = 0; i < 120; i++) { const x = ICE[0] - 30 + hh(i, 95) * 60, z = ICE[2] - 14 + hh(i, 96) * 26; if (x > ICE[0] - 11 && x < ICE[0] + 8 && z < ICE[2] + 7) continue; tuft(b, x, 0, z, "snow", 1.0 + 0.6 * hh(i, 97), i + 800); }
  for (let i = 0; i < 18; i++) { const x = ICE[0] - 26 + hh(i, 98) * 52, z = ICE[2] - 12 + hh(i, 99) * 22; if (x > ICE[0] - 11 && x < ICE[0] + 8 && z < ICE[2] + 7) continue; iceberg(b, x, z, 0.5 + hh(i, 100) * 0.8, 0.7 + hh(i, 101) * 0.8, i + 60, -0.2); }
  // ---------------- FLOE ----------------
  for (let k = 0; k < 9; k++) {
    // a floe: jagged slab (perturbed rim), painted ice, snow tufts and small bergs on top
    const R = 3 + hh(k) * 5, n = 9 + (k % 4), g = new THREE.CylinderGeometry(R, R * 1.08, 0.9, n, 1); const pp = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pp.count; i++) { const a = Math.atan2(pp.getZ(i), pp.getX(i)), j = 0.78 + 0.34 * hh(k * 31 + Math.round(((a + Math.PI) / (2 * Math.PI)) * n) % n, 7); pp.setXYZ(i, pp.getX(i) * j, pp.getY(i), pp.getZ(i) * j); }
    g.computeVertexNormals(); g.translate(0, 0.15, 0);
    const fx = FLOE[0] + (k % 3) * 11 - 11 + hh(k, 2) * 3, fz = FLOE[2] - Math.floor(k / 3) * 12 + hh(k, 3) * 3;
    b.add(g, iceBergM(), new THREE.Matrix4().makeTranslation(fx, 0, fz));
    for (let i = 0; i < 6; i++) { const a = hh(k * 9 + i, 4) * 6.28, r = R * (0.45 + 0.3 * hh(k * 9 + i, 5)), x = fx + Math.cos(a) * r, z = fz + Math.sin(a) * r; if (Math.hypot(x - FLOE[0] + 2.5, z - FLOE[2] - 0.5) < 2 || Math.hypot(x - FLOE[0] - 1.8, z - FLOE[2] - 2) < 1.6 || Math.hypot(x - FLOE[0] - 4.5, z - FLOE[2] - 4) < 1.2) continue; tuft(b, x, 0.6, z, "snow", 1.0 + 0.4 * hh(i, k), k * 20 + i + 900); }
    if (k > 2) iceberg(b, fx + R * 0.3, fz - R * 0.3, 1.2 + hh(k, 8) * 1.6, 1.3 + hh(k, 9), k + 120, 0.4);
  }
  for (let k = 0; k < 10; k++) iceberg(b, FLOE[0] - 60 + k * 13 + hh(k, 11) * 5, FLOE[2] - 50 - hh(k, 12) * 30, 4 + hh(k, 13) * 7, 4 + hh(k, 14) * 5, k + 140, -0.5);
  b.add(new THREE.CylinderGeometry(0.12, 0.12, 4, 10).translate(0, 1.6, 0), lam("gauge", () => ({ map: rep(ctex("gaugeTex", 32, 256, (g) => { for (let i = 0; i < 16; i++) { g.fillStyle = i % 2 ? "#e2453c" : "#ffffff"; g.fillRect(0, i * 16, 32, 16); } }), 1, 1) })),
    new THREE.Matrix4().makeTranslation(FLOE[0] + 4.5, 0, FLOE[2] + 4));
  // ---------------- GLASS on a picnic table ----------------
  ground(b, lam("grassIce", () => ({ map: grassHD() })), GLASS[0], GLASS[2], 120, 30);
  b.add(boxGeo(V(GLASS[0] - 2.2, 0.85, GLASS[2] - 1), V(GLASS[0] + 2.2, 1.0, GLASS[2] + 1)), lam("tableTop", () => ({ map: planksHD() })));
  for (const sx of [-1.8, 1.8]) for (const sz of [-0.7, 0.7]) b.add(boxGeo(V(GLASS[0] + sx - 0.07, 0, GLASS[2] + sz - 0.07), V(GLASS[0] + sx + 0.07, 0.85, GLASS[2] + sz + 0.07)), lam("tableLeg", () => ({ color: "#8a5a3a" })));
  for (let i = 0; i < 8; i++) prop(b, {}, ["tree_oak", "tree_fat", "tree-high-round"][i % 3], GLASS[0] - 20 + i * 6, 0, GLASS[2] - 14 - hh(i) * 8, 5 + hh(i, 2) * 3);
  dressLand(b, { cx: GLASS[0], cz: GLASS[2], r0: 5, r1: 40, keep: (x, z) => z > GLASS[2] + 1.5 && Math.abs(x - GLASS[0]) < 6, tufts: "grass", nTufts: 90, rocks: 12, bushes: 14, trees: 10, hillR: 90, hillN: 14, hillH: 16, seed: 5 });
  // ---------------- GREEN: ice sheet over rock ----------------
  for (let k = 0; k < 5; k++) {
    const ic = new THREE.SphereGeometry(1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2); ic.scale(56 + k * 10, 28 + k * 6, 36);
    b.add(ic, iceBergM(), new THREE.Matrix4().makeTranslation(GREEN[0] - 80 + k * 40, -2, GREEN[2] - 92 - k * 10));
  }
  // dark rock peaks poking through the ice sheet + a rocky coast, and bergs calving into the sea
  for (let k = 0; k < 9; k++) mountain(b, GREEN[0] - 120 + k * 30 + hh(k, 21) * 10, GREEN[2] - 70 - hh(k, 22) * 40, 26 + hh(k, 23) * 22, 14 + hh(k, 24) * 8, k + 60, true, ["#5e5a66", "#4e4a56", "#6e6a76", "#423e4a"]);
  for (let i = 0; i < 30; i++) rock(b, GREEN[0] - 110 + hh(i, 25) * 220, -0.4, GREEN[2] - 52 + hh(i, 26) * 6, 1.2 + 2 * hh(i, 27), i + 160, undefined);
  for (let k = 0; k < 14; k++) iceberg(b, GREEN[0] - 70 + hh(k, 28) * 140, GREEN[2] - 40 + hh(k, 29) * 70, 2 + hh(k, 30) * 5, 2.5 + hh(k, 31) * 4, k + 180, -0.6);
  b.build(root);

  // dynamic: seas, the melting cube in the glass, water in the glass, falls
  const townSea = sea(root, 0, 120, 260, "#2a8fc4");
  const floeSea = sea(root, FLOE[0], FLOE[2], 200, "#2a7fb8");
  const greenSea = sea(root, GREEN[0], GREEN[2] + 40, 200, "#2a7fb8");
  const glassWater = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.38, 1, 32), new THREE.MeshBasicMaterial({ color: new THREE.Color("#7fc8f0"), transparent: true, opacity: 0.55, depthWrite: false }));
  glassWater.layers.set(NOINK); root.add(glassWater);
  const glassShell = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.42, 1.25, 32, 1, true), new THREE.MeshBasicMaterial({ color: new THREE.Color("#e8f6ff"), transparent: true, opacity: 0.25, depthWrite: false, side: THREE.DoubleSide }));
  glassShell.position.set(GLASS[0], 1.0 + 0.625, GLASS[2]); root.add(glassShell);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.015, 6, 48).rotateX(Math.PI / 2), lam("rimG", () => ({ color: "#ffffff" }))); rim.position.set(GLASS[0], 2.25, GLASS[2]); root.add(rim);
  const mark = new THREE.Mesh(new THREE.TorusGeometry(0.47, 0.012, 6, 48).rotateX(Math.PI / 2), new THREE.MeshBasicMaterial({ color: "#e2453c" })); mark.position.set(GLASS[0], 1.0 + 0.8, GLASS[2]); root.add(mark);
  const iceCube = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), lam("iceCubeG", () => ({ color: "#dff2ff" }))); root.add(iceCube);
  const falls = new Particles(root, 260, "#d8f0ff", 0.9, "soft", 0.9);
  const drops = new Particles(root, 120, "#ffffff", 0.12, "flake", 1.0);
  const fishB = new Particles(root, 1, "#ffffff", 0.01);

  const pose = ({ id, t }: PoseCtx) => {
    const town = [1, 4, 5, 6, 10, 11].includes(id);
    townSea.visible = town; floeSea.visible = id === 7; greenSea.visible = id === 9;
    townSea.position.y = seaAt(id, t);
    const tm = townSea.material as THREE.MeshLambertMaterial; tm.transparent = id === 1; tm.opacity = id === 1 ? 0.62 : 1; tm.depthWrite = id !== 1;
    floeSea.position.y = 0.02 + 0.03 * Math.sin(t * 1.3);
    greenSea.position.y = smooth(seg(t, 41.5, 44)) * 3;
    const u = cubeAt(t);
    glassWater.visible = glassShell.visible = rim.visible = mark.visible = iceCube.visible = id === 8;
    glassWater.scale.set(1, 0.8, 1); glassWater.position.set(GLASS[0], 1.0 + 0.4, GLASS[2]);
    const cs = 0.4 * (1 - 0.85 * u);
    iceCube.scale.setScalar(Math.max(0.05, 1 - 0.85 * u)); iceCube.position.set(GLASS[0] + 0.05, 1.8 - cs * 0.3, GLASS[2]); iceCube.rotation.set(0.2, t * 0.3, 0.15);
    falls.pose((i, o) => { const k = i % 5, uu = (t * 0.6 + hh(i, 1)) % 1; o.set(GREEN[0] - 80 + k * 40 + (hh(i, 2) - 0.5) * 6, 20 - uu * 22, GREEN[2] - 55 - k * 10 + uu * 6); return true; }, id === 9);
    drops.pose((i, o) => { const uu = (t * 1.2 + hh(i, 1)) % 1; o.set((hh(i, 2) - 0.5) * 30, seaAt(id, t) + Math.sin(uu * Math.PI) * 1.5, 6 + hh(i, 3) * 6); return true; }, id === 4);
    void fishB; void FLOE;
  };
  return { pose };
};
