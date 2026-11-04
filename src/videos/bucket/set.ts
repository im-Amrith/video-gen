// "The War of the Bucket" (History ep. 5) — VALLEY (two walled cities on hills, a castle, a river ford, Bologna's
// gate with a well) at the origin; HALL (Modena's town hall: the bucket on a cushion under a spotlight) at z = 3000.
import * as THREE from "three";
import { Batch, boxGeo, V, lam, prop } from "../toon/build";
import { ctex, rep, grassHD, stoneHD, planksHD } from "../toon/paint";
import { Glow, Particles } from "../toon/fx";
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
  for (let i = 0; i < 10; i++) b.add(new THREE.SphereGeometry(0.6, 10, 8).scale(1.4, 0.4, 1), lam("fordStone", () => ({ color: "#9a948a" })), new THREE.Matrix4().makeTranslation(-6 + i * 1.3, 0.05, 6 + hh(i) * 1.5));
  // Bologna's gate + the well
  b.add(boxGeo(V(WELL[0] - 6, 0, WELL[2] - 6), V(WELL[0] + 6, 9, WELL[2] - 4)), lam("cityWall#c9a07a", () => ({ map: stoneHD("cw#c9a07a", ["#c9a07a", "#c9a07a", "#c9a07a", "#c9a07a"]) })));
  b.add(boxGeo(V(WELL[0] - 1.8, 0, WELL[2] - 4.05), V(WELL[0] + 1.8, 5, WELL[2] - 3.95)), lam("gateWood", () => ({ map: planksHD(), color: "#7a4a2a" })));
  b.add(new THREE.CylinderGeometry(1.0, 1.1, 1.0, 20, 1, true).translate(0, 0.5, 0), lam("wellS", () => ({ map: stoneHD("wellS2"), side: THREE.DoubleSide })), new THREE.Matrix4().makeTranslation(WELL[0] + 3, 0, WELL[2]));
  for (const s of [-1, 1]) b.add(new THREE.CylinderGeometry(0.08, 0.08, 2.4).translate(0, 1.2, 0), lam("wellPost2", () => ({ color: "#7a5a3a" })), new THREE.Matrix4().makeTranslation(WELL[0] + 3 + s * 0.9, 0, WELL[2]));
  b.add(new THREE.CylinderGeometry(0.06, 0.06, 1.9).rotateZ(Math.PI / 2).translate(0, 2.3, 0), lam("wellPost2", () => ({ color: "#7a5a3a" })), new THREE.Matrix4().makeTranslation(WELL[0] + 3, 0, WELL[2]));
  for (let i = 0; i < 16; i++) prop(b, {}, i % 2 ? "tree_cone" : "tree_default", -100 + i * 13 + hh(i) * 4, 0, 30 + hh(i, 2) * 20, 6 + hh(i, 3) * 3);
  // HALL: floor, back wall, side walls, cushion plinth, velvet rope posts
  b.add(boxGeo(V(HALL[0] - 10, -0.2, HALL[2] - 8), V(HALL[0] + 10, 0, HALL[2] + 8)), lam("hallFloor", () => ({ map: rep(planksHD(), 2, 2), color: "#b07a4a" })));
  b.add(boxGeo(V(HALL[0] - 10, 0, HALL[2] - 8), V(HALL[0] + 10, 8, HALL[2] - 7.6)), lam("hallWall", () => ({ color: "#8a2f34" })));
  for (const s of [-1, 1]) b.add(boxGeo(V(HALL[0] + s * 10 - 0.2, 0, HALL[2] - 8), V(HALL[0] + s * 10 + 0.2, 8, HALL[2] + 8)), lam("hallWall2", () => ({ color: "#7a2a30" })));
  b.add(new THREE.CylinderGeometry(0.7, 0.8, 1.1, 24).translate(0, 0.55, 0), lam("plinth", () => ({ color: "#e8e2d4" })), new THREE.Matrix4().makeTranslation(HALL[0], 0, HALL[2] - 3));
  b.add(new THREE.BoxGeometry(1.1, 0.25, 1.1).translate(0, 1.22, 0), lam("cushion", () => ({ color: "#c0353a" })), new THREE.Matrix4().makeTranslation(HALL[0], 0, HALL[2] - 3));
  for (const s of [-1, 1]) b.add(new THREE.CylinderGeometry(0.06, 0.1, 1.0).translate(0, 0.5, 0), lam("ropePost", () => ({ color: "#e0b040" })), new THREE.Matrix4().makeTranslation(HALL[0] + s * 1.8, 0, HALL[2] - 1.2));
  b.add(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(V(HALL[0] - 1.8, 0.9, HALL[2] - 1.2), V(HALL[0], 0.55, HALL[2] - 1.2), V(HALL[0] + 1.8, 0.9, HALL[2] - 1.2)), 16, 0.05, 8), lam("rope", () => ({ color: "#8a1f2a" })));
  b.build(root);
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

  const pose = ({ id, t }: PoseCtx) => {
    const flip = castleFlip(t);
    cflag.material = flip ? fMod : fBol; cflag.rotation.y = 0.2 * Math.sin(t * 2);
    const bk = bucketAt(id, t); bucket.position.set(...bk.p); bucket.rotation.set(bk.tilt, bk.yaw, 0); bucket.scale.setScalar(bk.s);
    spot.set(HALL[0], 5.5, HALL[2] - 3, 9, 0.5, id === 1 || id === 8 || id === 9);
    motes.pose((i, o) => { const u = (t * 0.04 + hh(i, 1)) % 1; o.set(HALL[0] + (hh(i, 2) - 0.5) * 3, 5.5 - u * 5, HALL[2] - 3 + (hh(i, 3) - 0.5) * 3); return true; }, id === 1 || id === 8 || id === 9);
    dust.pose((i, o) => { const u = (t * 0.5 + hh(i, 1)) % 1; o.set(-30 + hh(i, 2) * 60 + u * 8, 0.5 + u * 3, -6 + hh(i, 3) * 20); return true; }, id === 6 || id === 7);
    void smooth; void seg;
  };
  return { pose };
};
