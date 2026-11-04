// "The Army That Lost to Birds" (History ep. 3) — FIELD (wheat, fences, farmhouse, dam, hill) at the origin;
// a 1930s army truck, a Lewis gun on a tripod, ammo crates and a mountain of spent shell casings.
import * as THREE from "three";
import { Batch, boxGeo, V, lam, house, prop } from "../toon/build";
import { ctex, rep, planksHD, beamHD, grassHD } from "../toon/paint";
import { Particles } from "../toon/fx";
import { ground, sea } from "../toon/kit";
import { tuft, post, rock, casingGeo, brassM, dressLand, mountain } from "../toon/dress";
import { BuildCtx, PoseCtx, SetHandle, hh } from "../toon/core";
import { DAM, FARM, truckAt, gunPos, CASINGS, casingAt, fenceFall, JAM } from "./story";

const wheatTex = () => ctex("wheatGround", 512, 512, (g, r) => { g.fillStyle = "#e3b94e"; g.fillRect(0, 0, 512, 512); for (let i = 0; i < 1600; i++) { g.strokeStyle = `rgba(${150 + r() * 80},${100 + r() * 60},${30 + r() * 30},.45)`; g.lineWidth = 2; const x = r() * 512, y = r() * 512; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (r() - 0.5) * 6, y - 10 - r() * 14); g.stroke(); } });

export const buildSet = ({ root }: BuildCtx): SetHandle => {
  const b = new Batch();
  ground(b, lam("wheatG", () => ({ map: wheatTex() })), 0, 0, 500, 120);
  // wheat: clustered inked tufts with seed heads (dense near the action, sparser out to the hills)
  for (let i = 0; i < 1100; i++) {
    const x = -70 + hh(i, 1) * 140, z = -60 + hh(i, 2) * 80;
    if (Math.hypot(x - DAM[0], z - DAM[2]) < 9.5 || Math.abs(z - 6) < 3.6 || Math.hypot(x - CASINGS[0], z - CASINGS[2]) < 5 || (Math.abs(x - FARM[0]) < 12 && Math.abs(z - FARM[2]) < 9)) continue;
    tuft(b, x, 0, z, "wheat", 0.9 + 0.5 * hh(i, 3), i);
  }
  for (let i = 0; i < 90; i++) { const x = -40 + hh(i, 5) * 80, z = 9 + hh(i, 6) * 16; tuft(b, x, 0, z, "wheat", 1.0 + 0.4 * hh(i, 7), i + 900); } // foreground layer, near the cameras
  dressLand(b, { cx: 0, cz: -10, r0: 45, r1: 110, rocks: 40, bushes: 26, trees: 30, treeKinds: ["tree_default", "tree_fat", "tree-high-round"], hillR: 170, hillCol: "#d2ad62", hillN: 16, hillH: 22, hillMap: false, seed: 3 });
  for (let k = 0; k < 6; k++) mountain(b, -220 + k * 90, -260 - (k % 2) * 40, 40 + (k % 3) * 18, 70, k, false, ["#b08a5a", "#9a7a4e", "#c49a66", "#8a6a44"]);
  for (let i = 0; i < 24; i++) rock(b, -30 + hh(i, 8) * 70, 0, -4 + hh(i, 9) * 4, 0.2 + 0.35 * hh(i, 10), i + 50);
  // dirt track along z = 6
  b.add(new THREE.PlaneGeometry(300, 6).rotateX(-Math.PI / 2), lam("track", () => ({ color: "#c49a64" })), new THREE.Matrix4().makeTranslation(0, 0.02, 6));
  // farmhouse + fence posts (rails are dynamic: they fall)
  house(b, FARM[0], FARM[2], 0.3, 9, 7, 5.5, 4, 0);
  for (let i = 0; i < 18; i++) post(b, -24 + i * 3, 2.5, 1.3);
  // dam pond rim + hill
  b.add(new THREE.TorusGeometry(8.5, 0.5, 8, 40).rotateX(Math.PI / 2), lam("damRim", () => ({ color: "#a8804c" })), new THREE.Matrix4().makeTranslation(DAM[0], 0, DAM[2]));
  const hill = new THREE.SphereGeometry(1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2); hill.scale(40, 12, 22);
  b.add(hill, lam("hillDry", () => ({ color: "#d8b66a" })), new THREE.Matrix4().makeTranslation(-10, 0, -70));
  // ammo crates by the farm
  for (let k = 0; k < 6; k++) b.add(boxGeo(V(FARM[0] + 6 + (k % 3) * 1.05, Math.floor(k / 3) * 0.6, FARM[2] + 4), V(FARM[0] + 7 + (k % 3) * 1.05, 0.6 + Math.floor(k / 3) * 0.6, FARM[2] + 4.7)), lam("ammoCrate", () => ({ map: planksHD(), color: "#7d8a5a" })));
  b.build(root);
  const dam = sea(root, DAM[0], DAM[2], 8, "#4a9ac0"); dam.position.y = 0.08;
  // falling fence rails
  const rails = Array.from({ length: 17 }, (_, i) => { const m = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.12, 0.06), lam("woodPainted", () => ({ map: beamHD() }))); m.position.set(-22.5 + i * 3, 1.0, 2.5); root.add(m); return m; });
  // truck
  const truck = new THREE.Group();
  const olive = lam("truckOlive", () => ({ color: "#6a7a4a" })), dark = lam("truckDark", () => ({ color: "#2b2b33" }));
  const cab = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.8, 2.0), olive); cab.position.set(1.8, 1.6, 0); truck.add(cab);
  const hood = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.0, 1.7), olive); hood.position.set(3.4, 1.2, 0); truck.add(hood);
  const bed = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.5, 2.2), lam("truckBed", () => ({ map: planksHD() }))); bed.position.set(-1.0, 1.0, 0); truck.add(bed);
  for (const [x, z] of [[3.2, 1.0], [3.2, -1.0], [-1.6, 1.0], [-1.6, -1.0]]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.35, 16).rotateX(Math.PI / 2), dark); w.position.set(x, 0.5, z); truck.add(w); }
  const win = new THREE.Mesh(new THREE.BoxGeometry(2.02, 0.6, 1.6), lam("truckWin", () => ({ color: "#9fc4d8" }))); win.position.set(1.8, 2.0, 0); truck.add(win);
  truck.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } });
  root.add(truck);
  // the Lewis gun on a tripod (moves between the dam and the truck)
  const gun = new THREE.Group();
  const shroud = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 1.6, 14).rotateZ(Math.PI / 2), dark); shroud.position.set(0.5, 1.1, 0); gun.add(shroud);
  const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.12, 20), dark); drum.position.set(0.2, 1.32, 0); gun.add(drum);
  for (const a of [0, 2.1, 4.2]) { const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.3), dark); leg.position.set(Math.cos(a) * 0.35, 0.55, Math.sin(a) * 0.35); leg.rotation.set(Math.sin(a) * 0.4, 0, -Math.cos(a) * 0.4); gun.add(leg); }
  root.add(gun);
  // casings mountain (instanced brass cylinders)
  const cas = new THREE.InstancedMesh(casingGeo(), brassM(), 900);
  cas.castShadow = true; root.add(cas);
  const m4 = new THREE.Matrix4(), q4 = new THREE.Quaternion(), e = new THREE.Euler();
  const dust = new Particles(root, 260, "#d9b47a", 2.4, "dot", 1.0);
  const feathers = new Particles(root, 60, "#8a7a6c", 0.12, "dot", 1.0);

  const pose = ({ id, t }: PoseCtx) => {
    const tr = truckAt(id, t);
    truck.visible = tr.on; truck.position.set(tr.x, tr.bump, tr.z); truck.rotation.set(tr.roll, tr.yaw, tr.pitch);
    const gp = gunPos(id, t, tr);
    gun.visible = gp.on; gun.position.set(gp.x, gp.y, gp.z); gun.rotation.set(0, gp.yaw, 0);
    rails.forEach((m, i) => { const u = fenceFall(t, i); m.position.y = 1.0 - u * 0.95; m.rotation.set(u * 1.2, 0, (i % 2 ? 1 : -1) * u * 0.4); });
    const nc = casingAt(t);
    for (let i = 0; i < 900; i++) {
      const on = i < nc, a = hh(i, 1) * Math.PI * 2, r = Math.sqrt(hh(i, 2)) * 3.2, hgt = Math.max(0, 1.8 * (1 - r / 3.2)) * hh(i, 3);
      e.set(hh(i, 4) * 3, hh(i, 5) * 3, hh(i, 6) * 3); q4.setFromEuler(e);
      m4.compose(V(CASINGS[0] + Math.cos(a) * r, on ? 0.1 + hgt : -50, CASINGS[2] + Math.sin(a) * r), q4, V(1, 1, 1)); cas.setMatrixAt(i, m4);
    }
    cas.instanceMatrix.needsUpdate = true;
    dust.pose((i, o) => { const u = (t * 0.7 + hh(i, 1)) % 1; o.set(tr.x - 3 - u * 10 + (hh(i, 2) - 0.5) * 3, 0.5 + u * 2.5, tr.z + (hh(i, 3) - 0.5) * 4); return true; }, id === 5);
    feathers.pose((i, o) => { const u = (t * 0.3 + hh(i, 1)) % 1; o.set(DAM[0] + (hh(i, 2) - 0.5) * 14, 0.5 + Math.sin(u * Math.PI) * 3, DAM[2] + (hh(i, 3) - 0.5) * 14); return true; }, id === 4 && t > JAM + 0.3);
    dam.visible = true;
  };
  return { pose };
};
