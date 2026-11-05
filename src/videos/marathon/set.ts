// "The Worst Olympic Marathon Ever Run" (History ep. 4) — ROAD (dusty dirt road, fences, cornfields, an orchard,
// one water well, a finish line with stands) along the x axis; a 1904 open car.
import * as THREE from "three";
import { Batch, boxGeo, V, lam, house, prop } from "../toon/build";
import { ctex, rep, planksHD, stoneHD, grassHD } from "../toon/paint";
import { Particles, Glow } from "../toon/fx";
import { ground } from "../toon/kit";
import { corn, post, tuft, dressLand, rock } from "../toon/dress";
import { beamHD } from "../toon/paint";
import { BuildCtx, PoseCtx, SetHandle, hh } from "../toon/core";
import { WELL, ORCH, FIN, carAt, dustAt } from "./story";

const dirtTex = () => ctex("dirtRoad", 512, 512, (g, r) => { g.fillStyle = "#c9a26a"; g.fillRect(0, 0, 512, 512); for (let i = 0; i < 2200; i++) { g.fillStyle = `rgba(${120 + r() * 70},${90 + r() * 50},${50 + r() * 30},.35)`; g.fillRect(r() * 512, r() * 512, 3, 2); } for (let i = 0; i < 6; i++) { g.strokeStyle = "rgba(90,60,30,.25)"; g.lineWidth = 6; g.beginPath(); g.moveTo(0, 160 + i * 40); g.lineTo(512, 170 + i * 40 + (r() - 0.5) * 20); g.stroke(); } });
const bunting = () => ctex("finishBunting", 512, 64, (g) => { const c = ["#d23b3b", "#ffffff", "#3f6fb5"]; for (let i = 0; i < 16; i++) { g.fillStyle = c[i % 3]; g.beginPath(); g.moveTo(i * 32, 0); g.lineTo(i * 32 + 32, 0); g.lineTo(i * 32 + 16, 56); g.fill(); } });

export const buildSet = ({ root }: BuildCtx): SetHandle => {
  const b = new Batch();
  ground(b, lam("fieldsM", () => ({ map: grassHD(), color: "#d9cf8a" })), 0, 0, 600, 140);
  const road = new THREE.PlaneGeometry(900, 7).rotateX(-Math.PI / 2); const ruv = road.attributes.uv as THREE.BufferAttribute; for (let i = 0; i < ruv.count; i++) ruv.setXY(i, ruv.getX(i) * 130, ruv.getY(i));
  b.add(road, lam("dirtRoad", () => ({ map: dirtTex() })), new THREE.Matrix4().makeTranslation(0, 0.02, 0));
  // fences + cornfields both sides
  for (let i = 0; i < 90; i++) for (const s of [-1, 1]) post(b, -300 + i * 7, s * 4.6, 1.1);
  for (const s of [-1, 1]) for (const hy of [0.5, 0.9]) b.add(boxGeo(V(-300, hy - 0.05, s * 4.6 - 0.04), V(330, hy + 0.05, s * 4.6 + 0.04)), lam("woodPainted", () => ({ map: beamHD() })));
  for (let i = 0; i < 700; i++) { const x = -260 + hh(i, 11) * 520, z = (hh(i, 12) > 0.5 ? 1 : -1) * (3.7 + hh(i, 13) * 1.6); tuft(b, x, 0, z, hh(i, 14) > 0.6 ? "dry" : "grass", 0.7 + 0.5 * hh(i, 15), i); }
  for (let i = 0; i < 60; i++) rock(b, -250 + hh(i, 16) * 500, 0, (hh(i, 17) > 0.5 ? 1 : -1) * (5.2 + hh(i, 18) * 2), 0.15 + 0.3 * hh(i, 19), i);
  for (let i = 0; i < 520; i++) { const x = -260 + hh(i, 1) * 520, z = (hh(i, 2) > 0.5 ? 1 : -1) * (7 + hh(i, 3) * 18); if (Math.abs(x - ORCH[0]) < 14 && z < 0) continue; corn(b, x, z, 1.7 + hh(i, 4) * 0.7, i); }
  // orchard: round trees with red apples
  const apple = lam("apple", () => ({ color: "#d23b3b" }));
  for (let k = 0; k < 8; k++) {
    const x = ORCH[0] - 10 + (k % 4) * 6, z = ORCH[2] - (k >> 2) * 6;
    prop(b, {}, "tree_oak", x, 0, z, 5.2);
    for (let a = 0; a < 7; a++) b.add(new THREE.SphereGeometry(0.16, 8, 6), apple, new THREE.Matrix4().makeTranslation(x + Math.cos(a) * 1.4, 3.2 + (a % 3) * 0.4, z + Math.sin(a) * 1.4 + 0.6));
  }
  // the one water well
  b.add(new THREE.CylinderGeometry(1.0, 1.0, 1.0, 20, 1, true).translate(0, 0.5, 0), lam("wellStone", () => ({ map: stoneHD("wellS"), side: THREE.DoubleSide })), new THREE.Matrix4().makeTranslation(WELL[0], 0, WELL[2]));
  for (const s of [-1, 1]) b.add(new THREE.CylinderGeometry(0.08, 0.08, 2.4).translate(0, 1.2, 0), lam("wellPost", () => ({ color: "#7a5a3a" })), new THREE.Matrix4().makeTranslation(WELL[0] + s * 0.9, 0, WELL[2]));
  b.add(new THREE.ConeGeometry(1.6, 0.9, 4).rotateY(Math.PI / 4).translate(WELL[0], 2.8, WELL[2]), lam("wellRoof", () => ({ map: planksHD(), color: "#b8644f" })));
  b.add(new THREE.CircleGeometry(0.95, 20).rotateX(-Math.PI / 2).translate(WELL[0], 0.6, WELL[2]), lam("wellWater", () => ({ color: "#3a6aa0" })));
  // finish: posts + bunting, wooden stands
  for (const s of [-1, 1]) b.add(new THREE.CylinderGeometry(0.15, 0.15, 5).translate(0, 2.5, 0), lam("finPost", () => ({ color: "#f4f1e6" })), new THREE.Matrix4().makeTranslation(FIN[0], 0, s * 3.8));
  b.add(new THREE.PlaneGeometry(7.6, 0.8).translate(0, 4.6, 0).rotateY(Math.PI / 2), lam("finBunt", () => ({ map: rep(bunting(), 2, 1), side: THREE.DoubleSide, transparent: true })), new THREE.Matrix4().makeTranslation(FIN[0], 0, 0));
  for (let r = 0; r < 4; r++) for (const s of [-1, 1]) b.add(boxGeo(V(FIN[0] - 16, r * 0.5, s * (6 + r * 0.9)), V(FIN[0] + 16, r * 0.5 + 0.5, s * (6 + r * 0.9) + s * 0.9)), lam("stands", () => ({ map: planksHD() })));
  for (let i = 0; i < 6; i++) house(b, -200 + i * 70, -34, 0, 8, 6, 5, i, 0);
  dressLand(b, { cx: 0, cz: 0, r0: 30, r1: 160, keep: (x, z) => Math.abs(z) < 28, bushes: 40, trees: 60, rocks: 30, hillR: 230, hillN: 18, hillH: 24, seed: 7 });
  b.build(root);
  // the car
  const car = new THREE.Group();
  // owner #4: a real early-1900s open car: tall spoked wheels with mudguards, an open tub body (Lorz sits INSIDE it,
  // waist above the side), tufted leather bench seats, short bonnet with a brass radiator, steering column + wheel, brass lamps + horn
  const green = lam("carBody", () => ({ color: "#2f5a3a" })), leather = lam("carSeat", () => ({ color: "#7a3a2a" })), brass = lam("brass", () => ({ color: "#e0b040" })), blk = lam("carBlack", () => ({ color: "#22242a" }));
  const floor = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.12, 1.5), blk); floor.position.set(-0.2, 0.85, 0); car.add(floor);
  for (const sz of [-0.72, 0.72]) { const side = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.55, 0.08), green); side.position.set(-0.2, 1.17, sz); car.add(side);
    const trim = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.05, 0.12), brass); trim.position.set(-0.2, 1.45, sz); car.add(trim); }
  const rear = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.55, 20, 1, false, Math.PI, Math.PI), green); rear.scale.set(0.5, 1, 1); rear.position.set(-1.65, 1.17, 0); car.add(rear);
  const dash = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.7, 1.5), lam("carDash", () => ({ color: "#6a4a2a" }))); dash.position.set(1.2, 1.25, 0); car.add(dash);
  for (const [sx, h] of [[-0.7, 1.0], [0.55, 0.85]] as const) {
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.2, 1.36), leather); seat.position.set(sx, 1.38, 0); car.add(seat);
    const back = new THREE.Mesh(new THREE.BoxGeometry(0.18, h * 0.75, 1.36), leather); back.position.set(sx - 0.42, 1.38 + h * 0.4, 0); back.rotation.z = 0.12; car.add(back);
  }
  const hood = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.62, 1.0), green); hood.position.set(1.7, 1.12, 0); car.add(hood);
  const rad = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.8, 1.06), brass); rad.position.set(2.2, 1.2, 0); car.add(rad);
  const col = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.9), blk); col.position.set(0.95, 1.65, -0.35); col.rotation.z = 0.7; car.add(col);
  const sw = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.03, 6, 18), blk); sw.position.set(0.66, 1.98, -0.35); sw.rotation.set(0, Math.PI / 2, 0.7); car.add(sw);
  const spokeT = ctex("carSpokes", 128, 128, (c) => { c.clearRect(0, 0, 128, 128); c.strokeStyle = "#e8d8a8"; c.lineWidth = 5; for (let k = 0; k < 12; k++) { const an = (k / 12) * Math.PI * 2; c.beginPath(); c.moveTo(64, 64); c.lineTo(64 + 58 * Math.cos(an), 64 + 58 * Math.sin(an)); c.stroke(); } c.fillStyle = "#e0b040"; c.beginPath(); c.arc(64, 64, 12, 0, Math.PI * 2); c.fill(); });
  const spokeM = new THREE.MeshLambertMaterial({ map: spokeT, transparent: true, alphaTest: 0.4, side: THREE.DoubleSide });
  const wheels = [[1.45, 0.8], [1.45, -0.8], [-1.3, 0.8], [-1.3, -0.8]].map(([x, z]) => {
    const w = new THREE.Group();
    w.add(new THREE.Mesh(new THREE.TorusGeometry(0.52, 0.07, 8, 28), lam("wheel", () => ({ color: "#2b2b33" }))));
    const sp = new THREE.Mesh(new THREE.CircleGeometry(0.5, 24), spokeM); w.add(sp);
    w.position.set(x, 0.59, z); car.add(w);
    const guard = new THREE.Mesh(new THREE.CylinderGeometry(0.66, 0.66, 0.32, 16, 1, true, -Math.PI / 2 - 0.3, Math.PI * 0.75).rotateX(Math.PI / 2), lam("carGuard", () => ({ color: "#22242a", side: THREE.DoubleSide })));
    guard.position.set(x, 0.62, z); car.add(guard);
    return w;
  });
  const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.12, 0.26, 12).rotateZ(Math.PI / 2), brass); lamp.position.set(2.3, 1.45, 0.42); car.add(lamp);
  const lamp2 = lamp.clone(); lamp2.position.z = -0.42; car.add(lamp2);
  const horn = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.35, 10).rotateZ(-Math.PI / 2), brass); horn.position.set(1.4, 1.7, 0.7); car.add(horn);
  car.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh) { m.castShadow = true; } });
  root.add(car);
  const dust = new Particles(root, 320, "#d9b98a", 3.0, "dot", 1.0);
  const heat = new Glow(root, "#fff2c0", 0.6);
  const smoke = new Particles(root, 60, "#555058", 1.2, "dot", 1.0);

  const pose = ({ id, t }: PoseCtx) => {
    const c = carAt(id, t);
    car.visible = c.on; car.position.set(c.x, c.bump, -1.6); car.rotation.set(0, 0, c.tilt);
    wheels.forEach((w, k) => { w.rotation.z = -c.x * 1.9; if (k === 0 && c.broken) { w.position.y = 0.3; w.rotation.x = 1.2; } else { w.position.y = 0.59; w.rotation.x = 0; } });
    const d = dustAt(id, t);
    dust.pose((i, o) => { const u = (t * 0.5 + hh(i, 1)) % 1; o.set(d.x - u * 22 + (hh(i, 2) - 0.5) * 3, 0.4 + u * 2.6 * hh(i, 3), -1.6 + (hh(i, 4) - 0.5) * 6); return true; }, d.on);
    smoke.pose((i, o) => { const u = (t * 0.6 + hh(i, 1)) % 1; o.set(c.x + 1.7 + (hh(i, 2) - 0.5) * u, 1.4 + u * 3, -1.6); return true; }, c.broken);
    heat.set(0, 30, -60, 120, 0.25, id === 2);
  };
  return { pose };
};
