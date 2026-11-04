// "The War of the Bucket" (History ep. 5) — VALLEY (two walled cities on hills, a castle, a river ford, Bologna's
// gate with a well) at the origin; HALL (Modena's town hall: the bucket on a cushion under a spotlight) at z = 3000.
import * as THREE from "three";
import { Batch, boxGeo, V, lam, prop } from "../toon/build";
import { ctex, rep, grassHD, stoneHD, planksHD, beamHD } from "../toon/paint";
import { Glow, Particles, glowMat } from "../toon/fx";
import { tuft, rock, post, fence, dressLand } from "../toon/dress";
import { ground, sea } from "../toon/kit";
import { BuildCtx, PoseCtx, SetHandle, hh, smooth, seg } from "../toon/core";
import { MOD, BOL, CASTLE, WELL, HALL, castleFlip, bucketAt } from "./story";

const flagTex = (a: string, b: string, key: string) => ctex(key, 192, 128, (g) => { g.fillStyle = a; g.fillRect(0, 0, 96, 128); g.fillStyle = b; g.fillRect(96, 0, 96, 128); });
const city = (b: Batch, c: [number, number, number], wallCol: string, roofCol: string, seed: number) => {
  const hill = new THREE.SphereGeometry(1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2); hill.scale(36, 8, 30);
  b.add(hill, lam("hillCity", () => ({ map: rep(grassHD(), 6, 6) })), new THREE.Matrix4().makeTranslation(c[0], -1, c[2]));
  const wall = lam("cityWall" + wallCol, () => ({ map: stoneHD("cw" + wallCol, [wallCol, wallCol, wallCol, wallCol]) }));
  for (let k = 0; k < 16; k++) {
    const a = (k / 16) * Math.PI * 2, a2 = ((k + 1) / 16) * Math.PI * 2, r = 18;
    const x1 = c[0] + Math.cos(a) * r, z1 = c[2] + Math.sin(a) * r * 0.8, x2 = c[0] + Math.cos(a2) * r, z2 = c[2] + Math.sin(a2) * r * 0.8;
    const len = Math.hypot(x2 - x1, z2 - z1), g = new THREE.BoxGeometry(len, 4, 1.2); g.rotateY(-Math.atan2(z2 - z1, x2 - x1));
    b.add(g, wall, new THREE.Matrix4().makeTranslation((x1 + x2) / 2, 6.5, (z1 + z2) / 2));
    if (k % 2 === 0) b.add(new THREE.CylinderGeometry(1.4, 1.6, 7, 10).translate(0, 3.5, 0), wall, new THREE.Matrix4().makeTranslation(x1, 4.5, z1));
  }
  for (let i = 0; i < 14; i++) {
    const x = c[0] - 12 + hh(i, seed) * 24, z = c[2] - 10 + hh(i, seed + 1) * 16, h = 4 + hh(i, seed + 2) * 5;
    b.add(boxGeo(V(x - 2, 6, z - 2), V(x + 2, 6 + h, z + 2)), lam("cityHouse" + (i % 3), () => ({ color: ["#e8c58e", "#d9a066", "#f0dcb4"][i % 3] })));
    b.add(new THREE.ConeGeometry(3.0, 2, 4).rotateY(Math.PI / 4).translate(x, 7 + h, z), lam("cityRoof" + roofCol, () => ({ color: roofCol })));
  }
  b.add(boxGeo(V(c[0] - 1.5, 6, c[2] - 3), V(c[0] + 1.5, 26, c[2])), lam("cityTower", () => ({ color: "#c49a64" })));
};

export const buildSet = ({ root }: BuildCtx): SetHandle => {
  const b = new Batch();
  ground(b, lam("valleyG", () => ({ map: grassHD() })), 0, 0, 500, 120);
  city(b, MOD, "#d9c9a8", "#b8644f", 1);
  city(b, BOL, "#c9a07a", "#a8442a", 7);
  // castle on a knoll
  const knoll = new THREE.SphereGeometry(1, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2); knoll.scale(14, 6, 12);
  b.add(knoll, lam("hillCity", () => ({ map: rep(grassHD(), 6, 6) })), new THREE.Matrix4().makeTranslation(CASTLE[0], -0.5, CASTLE[2]));
  b.add(boxGeo(V(CASTLE[0] - 4, 5, CASTLE[2] - 4), V(CASTLE[0] + 4, 11, CASTLE[2] + 4)), lam("castleW", () => ({ map: stoneHD("castleS") })));
  for (const [dx, dz] of [[-4, -4], [4, -4], [-4, 4], [4, 4]]) b.add(new THREE.CylinderGeometry(1.2, 1.2, 9, 10).translate(0, 4.5, 0), lam("castleW", () => ({ map: stoneHD("castleS") })), new THREE.Matrix4().makeTranslation(CASTLE[0] + dx, 5, CASTLE[2] + dz));
  b.add(new THREE.CylinderGeometry(0.1, 0.1, 6).translate(0, 3, 0), lam("pole", () => ({ color: "#e0e0e0" })), new THREE.Matrix4().makeTranslation(CASTLE[0], 11, CASTLE[2]));
  // river (a strip of water) + ford stones
  for (let i = 0; i < 10; i++) rock(b, -6 + i * 1.3, -0.32, 6 + hh(i) * 1.5, 0.55, i + 7);
  // feedback #2 dressing: painted inked tufts (3 depth layers), bank rocks, fences, bushes/trees + a hill ring
  const nearCity = (x: number, z: number) => Math.hypot(x - MOD[0], (z - MOD[2]) * 1.2) < 38 || Math.hypot(x - BOL[0], (z - BOL[2]) * 1.2) < 38 || Math.hypot(x - CASTLE[0], z - CASTLE[2]) < 16;
  const inRiver = (z: number) => Math.abs(z - 6.5) < 4.3;
  const wellYard = (x: number, z: number) => Math.abs(x - WELL[0] - 1) < 7 && z > WELL[2] - 5 && z < WELL[2] + 6;
  for (let i = 0; i < 1500; i++) {
    const x = -95 + hh(i, 1) * 190, z = -62 + hh(i, 2) * 110;
    if (nearCity(x, z) || inRiver(z) || wellYard(x, z)) continue;
    tuft(b, x, 0, z, hh(i, 4) > 0.75 ? "dry" : "grass", 0.8 + 0.6 * hh(i, 3), i);
  }
  for (let i = 0; i < 160; i++) { const x = -30 + hh(i, 5) * 60, z = 10.8 + hh(i, 6) * 12; tuft(b, x, 0, z, i % 5 ? "grass" : "reed", 1.0 + 0.4 * hh(i, 7), i + 2000); } // foreground bank by the cameras
  for (let i = 0; i < 36; i++) { const x = -40 + hh(i, 8) * 80, s = hh(i, 9) > 0.5 ? 1 : -1; rock(b, x, 0, 6.5 + s * (3.8 + hh(i, 10) * 0.9), 0.2 + 0.35 * hh(i, 11), i + 60); }
  for (let i = 0; i < 18; i++) rock(b, -60 + hh(i, 12) * 120, 0, -50 + hh(i, 13) * 40, 0.3 + 0.6 * hh(i, 14) ** 2, i + 90);
  fence(b, -46, 14, -18, 14); fence(b, 18, 14, 50, 14); fence(b, -40, -36, -40, -10); fence(b, 52, -46, 52, -40);
  dressLand(b, { cx: 0, cz: -30, r0: 42, r1: 130, keep: (x, z) => nearCity(x, z) || inRiver(z) || wellYard(x, z) || (Math.abs(x) < 36 && z > -32 && z < 24) || z > 24, bushes: 30, trees: 26, rocks: 24, hillR: 210, hillN: 16, hillH: 26, seed: 5 });
  // Bologna's gate + the well
  b.add(boxGeo(V(WELL[0] - 6, 0, WELL[2] - 6), V(WELL[0] + 6, 9, WELL[2] - 4)), lam("cityWall#c9a07a", () => ({ map: stoneHD("cw#c9a07a", ["#c9a07a", "#c9a07a", "#c9a07a", "#c9a07a"]) })));
  b.add(boxGeo(V(WELL[0] - 1.8, 0, WELL[2] - 4.05), V(WELL[0] + 1.8, 5, WELL[2] - 3.95)), lam("gateWood", () => ({ map: planksHD(), color: "#7a4a2a" })));
  b.add(new THREE.CylinderGeometry(1.0, 1.1, 1.0, 20, 1, true).translate(0, 0.5, 0), lam("wellS", () => ({ map: stoneHD("wellS2"), side: THREE.DoubleSide })), new THREE.Matrix4().makeTranslation(WELL[0] + 3, 0, WELL[2]));
  for (const s of [-1, 1]) post(b, WELL[0] + 3 + s * 0.9, WELL[2], 2.4);
  b.add(new THREE.BoxGeometry(1.9, 0.1, 0.1).translate(0, 2.3, 0), lam("woodPainted", () => ({ map: beamHD() })), new THREE.Matrix4().makeTranslation(WELL[0] + 3, 0, WELL[2]));
  for (let i = 0; i < 8; i++) rock(b, WELL[0] - 5 + hh(i, 21) * 12, 0, WELL[2] - 3.4 + hh(i, 22) * 1.2, 0.18 + 0.2 * hh(i, 23), i + 120); // rubble along the city wall
  for (let i = 0; i < 40; i++) { const x = WELL[0] - 8 + hh(i, 24) * 16, z = WELL[2] - 3.6 + hh(i, 25) * 1.4; tuft(b, x, 0, z, "grass", 0.7 + 0.4 * hh(i, 26), i + 3000); }
  for (let i = 0; i < 16; i++) prop(b, {}, i % 2 ? "tree_cone" : "tree_default", -100 + i * 13 + hh(i) * 4, 0, 30 + hh(i, 2) * 20, 6 + hh(i, 3) * 3);
  // HALL: floor, back wall, side walls, cushion plinth, velvet rope posts
  b.add(boxGeo(V(HALL[0] - 10, -0.2, HALL[2] - 8), V(HALL[0] + 10, 0, HALL[2] + 8)), lam("hallFloor", () => ({ map: rep(planksHD(), 2, 2), color: "#b07a4a" })));
  const brick = lam("hallBrick", () => ({ map: rep(stoneHD("hallBrickT", ["#c8724a", "#b8643f", "#d4805a", "#a85a38"], "#e8d2b0"), 4, 2) }));
  b.add(boxGeo(V(HALL[0] - 10, 0, HALL[2] - 8), V(HALL[0] + 10, 9, HALL[2] - 7.6)), brick);
  for (const s of [-1, 1]) b.add(boxGeo(V(HALL[0] + s * 10 - 0.2, 0, HALL[2] - 8), V(HALL[0] + s * 10 + 0.2, 9, HALL[2] + 8)), brick);
  const marble = lam("hallMarble", () => ({ map: stoneHD("hallMarbleT", ["#f2ead8", "#e8dcc4", "#f6f0e2", "#e2d4ba"], "#cbb894") }));
  for (const x of [-7.6, -2.9, 2.9, 7.6]) b.add(boxGeo(V(HALL[0] + x - 0.45, 0, HALL[2] - 7.6), V(HALL[0] + x + 0.45, 9, HALL[2] - 7.2)), marble); // pilasters
  for (const s of [-1, 1]) for (const z of [-4, 2]) b.add(boxGeo(V(HALL[0] + s * 9.8 - 0.3, 0, HALL[2] + z - 0.45), V(HALL[0] + s * 9.8 + 0.3, 9, HALL[2] + z + 0.45)), marble);
  b.add(boxGeo(V(HALL[0] - 10, 8.4, HALL[2] - 7.6), V(HALL[0] + 10, 9, HALL[2] - 7.1)), marble); // cornice
  b.add(new THREE.PlaneGeometry(2.6, 11).rotateX(-Math.PI / 2), lam("carpet", () => ({ color: "#b0242e" })), new THREE.Matrix4().makeTranslation(HALL[0], 0.01, HALL[2] + 2.5)); // red carpet to the bucket
  b.add(new THREE.CylinderGeometry(0.7, 0.8, 1.1, 24).translate(0, 0.55, 0), lam("plinth", () => ({ color: "#e8e2d4" })), new THREE.Matrix4().makeTranslation(HALL[0], 0, HALL[2] - 3));
  b.add(new THREE.BoxGeometry(1.1, 0.25, 1.1).translate(0, 1.22, 0), lam("cushion", () => ({ color: "#c0353a" })), new THREE.Matrix4().makeTranslation(HALL[0], 0, HALL[2] - 3));
  for (const s of [-1, 1]) b.add(new THREE.CylinderGeometry(0.06, 0.1, 1.0).translate(0, 0.5, 0), lam("ropePost", () => ({ color: "#e0b040" })), new THREE.Matrix4().makeTranslation(HALL[0] + s * 1.8, 0, HALL[2] - 1.2));
  b.add(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(V(HALL[0] - 1.8, 0.9, HALL[2] - 1.2), V(HALL[0], 0.55, HALL[2] - 1.2), V(HALL[0] + 1.8, 0.9, HALL[2] - 1.2)), 16, 0.05, 8), lam("rope", () => ({ color: "#8a1f2a" })));
  b.build(root);
  // tall arched windows, lit warm from outside (the hall glows instead of reading as an empty dim room)
  const winM = glowMat("#ffd99a", 1.25);
  const winGlows: Glow[] = [];
  for (const x of [-5.25, 5.25]) {
    const w = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 4.2), winM); w.position.set(HALL[0] + x, 4.1, HALL[2] - 7.55); root.add(w);
    const arch = new THREE.Mesh(new THREE.CircleGeometry(1.2, 20, 0, Math.PI), winM); arch.position.set(HALL[0] + x, 6.2, HALL[2] - 7.55); root.add(arch);
    for (const dy of [2.6, 4.1, 5.6]) { const bar = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.08, 0.06), lam("winBar", () => ({ color: "#5a3424" }))); bar.position.set(HALL[0] + x, dy, HALL[2] - 7.5); root.add(bar); }
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.08, 5.4, 0.06), lam("winBar", () => ({ color: "#5a3424" }))); bar.position.set(HALL[0] + x, 4.6, HALL[2] - 7.5); root.add(bar);
    winGlows.push(new Glow(root, "#ffcf8a", 0.9));
  }
  const river = sea(root, 0, 6.5, 1, "#4a9ac0"); river.scale.set(140, 1, 3.5); river.position.y = 0.02;
  // flags: castle (flips), cities
  const fBol = lam("flagBol", () => ({ map: flagTex("#ffffff", "#c0353a", "flagBolT"), side: THREE.DoubleSide })), fMod = lam("flagMod", () => ({ map: flagTex("#f2c230", "#3f6fb5", "flagModT"), side: THREE.DoubleSide }));
  const cflag = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.4).translate(1.1, 0, 0), fBol); cflag.position.set(CASTLE[0], 16.4, CASTLE[2]); root.add(cflag);
  for (const [c, m] of [[MOD, fMod], [BOL, fBol]] as const) { const f = new THREE.Mesh(new THREE.PlaneGeometry(3, 2).translate(1.5, 0, 0), m); f.position.set(c[0], 27.2, c[2] - 1.5); root.add(f); }
  // the bucket (one mesh, moves: well → soldier's shoulder → museum cushion)
  const bucket = new THREE.Group();
  const tub = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.34, 0.7, 20, 1, true), lam("bucketWood", () => ({ map: planksHD(), color: "#d89048", side: THREE.DoubleSide }))); bucket.add(tub);
  for (const y of [-0.22, 0.22]) { const band = new THREE.Mesh(new THREE.TorusGeometry(y > 0 ? 0.41 : 0.36, 0.03, 6, 24).rotateX(Math.PI / 2), lam("bucketBand", () => ({ color: "#3a3440" }))); band.position.y = y; bucket.add(band); }
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.025, 6, 24, Math.PI), lam("bucketBand", () => ({ color: "#3a3440" }))); handle.position.y = 0.33; bucket.add(handle);
  const bottom = new THREE.Mesh(new THREE.CircleGeometry(0.34, 20).rotateX(-Math.PI / 2), lam("bucketWood2", () => ({ color: "#7a4a2a" }))); bottom.position.y = -0.34; bucket.add(bottom);
  bucket.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh) m.castShadow = true; });
  root.add(bucket);
  const spot = new Glow(root, "#fff2c8", 1.4);
  const motes = new Particles(root, 120, "#fff2c8", 0.05, "soft", 1.2);
  const dust = new Particles(root, 260, "#c8b48a", 2.2, "dot", 1.0);

  const pose = ({ id, t, f }: PoseCtx) => {
    const flip = castleFlip(t);
    cflag.material = flip ? fMod : fBol; cflag.rotation.y = 0.2 * Math.sin(t * 2);
    const bk = bucketAt(id, t); bucket.position.set(...bk.p); bucket.rotation.set(bk.tilt, bk.yaw, 0); bucket.scale.setScalar(bk.s);
    const inHall = id === 1 || id === 8 || (id === 9 && f < 1615);
    spot.set(HALL[0], 7.4, HALL[2] - 3.6, 3.2, 0.45, inHall); // the spotlight lamp sits above the bucket, not over it
    winGlows.forEach((g, k) => g.set(HALL[0] + (k ? 5.25 : -5.25), 4.6, HALL[2] - 7.3, 5.5, 0.4, inHall));
    motes.pose((i, o) => { const u = (t * 0.04 + hh(i, 1)) % 1; o.set(HALL[0] + (hh(i, 2) - 0.5) * 3, 5.5 - u * 5, HALL[2] - 3 + (hh(i, 3) - 0.5) * 3); return true; }, id === 1 || id === 8 || id === 9);
    dust.pose((i, o) => { const u = (t * 0.5 + hh(i, 1)) % 1; o.set(-30 + hh(i, 2) * 60 + u * 8, 0.5 + u * 3, -6 + hh(i, 3) * 20); return true; }, id === 6 || id === 7);
    void smooth; void seg;
  };
  return { pose };
};
