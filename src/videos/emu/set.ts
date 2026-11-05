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
  // owner #4: a believable 1930s army truck in the drawn style: long bonnet with a radiator grille, round headlamps,
  // curved mudguards over spoked wheels, running boards, a cab with a roof and windscreen, slatted bed with a canvas tilt
  const grilleT = ctex("truckGrille", 128, 128, (c) => { c.fillStyle = "#3a3a30"; c.fillRect(0, 0, 128, 128); c.fillStyle = "#8a8a7a"; for (let x = 8; x < 128; x += 14) c.fillRect(x, 6, 6, 116); c.strokeStyle = "#c9c4b0"; c.lineWidth = 8; c.strokeRect(4, 4, 120, 120); });
  const wheelT = ctex("truckWheel", 128, 128, (c) => { c.fillStyle = "#2b2b33"; c.beginPath(); c.arc(64, 64, 62, 0, Math.PI * 2); c.fill(); c.fillStyle = "#7a6a4a"; c.beginPath(); c.arc(64, 64, 40, 0, Math.PI * 2); c.fill();
    c.strokeStyle = "#3a3020"; c.lineWidth = 6; for (let k = 0; k < 10; k++) { const an = (k / 10) * Math.PI * 2; c.beginPath(); c.moveTo(64, 64); c.lineTo(64 + 40 * Math.cos(an), 64 + 40 * Math.sin(an)); c.stroke(); } c.fillStyle = "#2b2b33"; c.beginPath(); c.arc(64, 64, 10, 0, Math.PI * 2); c.fill(); });
  const cab = new THREE.Mesh(new THREE.BoxGeometry(1.7, 1.5, 2.0), olive); cab.position.set(1.7, 1.75, 0); truck.add(cab);
  const roof = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.12, 2.15), olive); roof.position.set(1.7, 2.55, 0); truck.add(roof);
  const winM = lam("truckWin", () => ({ color: "#9fc4d8" }));
  const wscreen = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.6, 1.7), winM); wscreen.position.set(2.56, 2.1, 0); truck.add(wscreen);
  for (const sz of [-1, 1]) { const sw = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.55, 0.04), winM); sw.position.set(1.75, 2.1, sz * 1.01); truck.add(sw); }
  const hood = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 1.9, 16, 1, false, 0, Math.PI).rotateZ(-Math.PI / 2).rotateX(Math.PI / 2), olive); hood.scale.set(1, 1, 1.25); hood.position.set(3.5, 1.35, 0); truck.add(hood);
  const hoodSide = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.5, 1.5), olive); hoodSide.position.set(3.5, 1.1, 0); truck.add(hoodSide);
  const grille = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.0, 1.3), lam("truckGrilleM", () => ({ map: grilleT }))); grille.position.set(4.5, 1.25, 0); truck.add(grille);
  for (const sz of [-0.6, 0.6]) { const lampH = new THREE.Mesh(new THREE.SphereGeometry(0.17, 12, 8), lam("truckLamp", () => ({ color: "#e8e2c8" }))); lampH.position.set(4.55, 1.55, sz); truck.add(lampH); }
  const bumper = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, 2.3), dark); bumper.position.set(4.7, 0.65, 0); truck.add(bumper);
  const wheelSide = lam("truckWheelM", () => ({ map: wheelT })), tyre = dark;
  for (const [x, z] of [[3.5, 1.05], [3.5, -1.05], [-1.6, 1.05], [-1.6, -1.05]]) {
    const w = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.3, 20).rotateX(Math.PI / 2), [tyre, wheelSide, wheelSide]); w.position.set(x, 0.55, z); truck.add(w);
    const fender = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.68, 0.42, 16, 1, true, -Math.PI / 2, Math.PI).rotateX(Math.PI / 2), lam("truckFender", () => ({ color: "#5a6a3a", side: THREE.DoubleSide }))); fender.position.set(x, 0.62, z); truck.add(fender);
  }
  for (const sz of [-1.12, 1.12]) { const rb = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.08, 0.32), dark); rb.position.set(1.25, 0.72, sz); truck.add(rb); }
  const bed = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.3, 2.2), lam("truckBed", () => ({ map: planksHD() }))); bed.position.set(-1.0, 1.05, 0); truck.add(bed);
  for (const sz of [-1.08, 1.08]) { const side = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.55, 0.08), lam("truckSlat", () => ({ map: planksHD(), color: "#a0905a" }))); side.position.set(-1.0, 1.45, sz); truck.add(side); }
  const tilt = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 2.6, 18, 1, true, -Math.PI / 2, Math.PI).rotateZ(Math.PI / 2), lam("truckCanvas", () => ({ color: "#8a8a5a", side: THREE.DoubleSide }))); tilt.position.set(-1.5, 1.7, 0); truck.add(tilt);
  truck.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } });
  root.add(truck);
  // the Lewis gun on a tripod (moves between the dam and the truck)
  const gun = new THREE.Group();
  // owner #4: a detailed machine gun: finned cooling jacket, thin muzzle, pan magazine, butt stock + grip, braced tripod,
  // an ammo box with a brass cartridge belt
  const gunM = lam("gunMetal", () => ({ color: "#3a3d44" })), woodG = lam("gunWood", () => ({ color: "#8a5a32" }));
  const shroud = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 1.3, 16).rotateZ(Math.PI / 2), gunM); shroud.position.set(0.6, 1.1, 0); gun.add(shroud);
  for (let k = 0; k < 7; k++) { const fin = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.025, 6, 16).rotateY(Math.PI / 2), dark); fin.position.set(0.05 + k * 0.18, 1.1, 0); gun.add(fin); }
  const muzzle = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.5, 10).rotateZ(Math.PI / 2), dark); muzzle.position.set(1.48, 1.1, 0); gun.add(muzzle);
  const recv = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.22, 0.2), gunM); recv.position.set(-0.3, 1.1, 0); gun.add(recv);
  const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.1, 22), dark); drum.position.set(-0.2, 1.28, 0); gun.add(drum);
  const drumHub = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.14, 10), gunM); drumHub.position.set(-0.2, 1.3, 0); gun.add(drumHub);
  const stock = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.18, 0.12), woodG); stock.position.set(-0.85, 1.02, 0); stock.rotation.z = 0.12; gun.add(stock);
  const grip = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.28, 0.1), woodG); grip.position.set(-0.45, 0.9, 0); grip.rotation.z = -0.3; gun.add(grip);
  for (const a of [0, 2.1, 4.2]) { const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 1.25), dark); leg.position.set(Math.cos(a) * 0.38, 0.52, Math.sin(a) * 0.38); leg.rotation.set(Math.sin(a) * 0.5, 0, -Math.cos(a) * 0.5); gun.add(leg);
    const foot = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.04, 0.1), dark); foot.position.set(Math.cos(a) * 0.68, 0.02, Math.sin(a) * 0.68); gun.add(foot); }
  const head = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.14, 10), gunM); head.position.set(0, 0.98, 0); gun.add(head);
  const ammo = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.35, 0.3), lam("ammoBox", () => ({ color: "#5a6a3a" }))); ammo.position.set(-0.2, 0.18, 0.75); gun.add(ammo);
  const brassB = brassM();
  for (let k = 0; k < 12; k++) { const u = k / 11, bx = -0.2 + 0.1 * Math.sin(u * 3), by = 0.4 + 0.65 * Math.sin(u * Math.PI * 0.5), bz = 0.7 - 0.6 * u;
    const c = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.14, 8), brassB); c.position.set(bx, by, bz); c.rotation.x = Math.PI / 2; gun.add(c); }
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
