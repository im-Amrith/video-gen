// "The Shortest War in History" (History ep. 1) — one place: Zanzibar harbour, 27 Aug 1896. Palace with wooden
// balconies and a clock tower, quay, palms, a small consulate, three warships, the royal yacht, a rowing boat.
import * as THREE from "three";
import { Batch, boxGeo, V, lam, prop } from "../toon/build";
import { ctex, rep, stoneHD, planksHD } from "../toon/paint";
import { Particles, Glow, glowMat } from "../toon/fx";
import { NOINK } from "../toon/ink";
import { dressLand, mountain, tuft, rock } from "../toon/dress";
import { ground, sea, clockCard } from "../toon/kit";
import { Pen } from "../toon/toon";
import { BuildCtx, PoseCtx, SetHandle, hh, smooth, seg } from "../toon/core";
import { PAL, SHIPS, YACHT, CONS, shipIn, yachtSink, fireAt, smokeAt, clockMin } from "./story";

const palaceTex = () => ctex("palaceWall", 1024, 512, (g, r) => {
  g.fillStyle = "#f2ece0"; g.fillRect(0, 0, 1024, 512);
  for (let i = 0; i < 400; i++) { g.fillStyle = `rgba(150,130,100,${0.05 + r() * 0.08})`; g.fillRect(r() * 1024, r() * 512, 6 + r() * 20, 2 + r() * 6); }
  for (let fl = 0; fl < 3; fl++) for (let i = 0; i < 9; i++) {
    const x = 50 + i * 108, y = 70 + fl * 150;
    g.fillStyle = "#3a2a24"; g.beginPath(); g.moveTo(x, y + 90); g.lineTo(x, y + 28); g.arc(x + 25, y + 28, 25, Math.PI, 0); g.lineTo(x + 50, y + 90); g.fill();
    g.fillStyle = "#2f8a7a"; g.fillRect(x - 8, y + 26, 8, 64); g.fillRect(x + 50, y + 26, 8, 64);
  }
});
const flagTri = () => ctex("flagDE1896", 192, 128, (g) => { const c = ["#1a1a1a", "#ffffff", "#d22b2b"]; c.forEach((col, i) => { g.fillStyle = col; g.fillRect(0, (i * 128) / 3, 192, 128 / 3 + 1); }); });
const flagRed = () => ctex("flagRedZ", 192, 128, (g) => { g.fillStyle = "#c0353a"; g.fillRect(0, 0, 192, 128); });
export const watchCard = (p: Pen, minutes: number, hour = 9) => {
  p.ell(300, 70, 40, 34, "#e8c45a", 12); p.ell(300, 70, 16, 14, "#fff7e0", 8);
  p.ell(300, 330, 250, 250, "#e8c45a", 14); p.ell(300, 330, 215, 215, "#fffaf0", 10);
  for (let k = 0; k < 12; k++) { const b = (k / 12) * Math.PI * 2; p.stroke([[300 + 175 * Math.sin(b), 330 - 175 * Math.cos(b)], [300 + 200 * Math.sin(b), 330 - 200 * Math.cos(b)]], k % 3 ? 8 : 14); }
  const a = (minutes / 60) * Math.PI * 2, h = ((hour + minutes / 60) / 12) * Math.PI * 2;
  p.stroke([[300, 330], [300 + 110 * Math.sin(h), 330 - 110 * Math.cos(h)]], 18);
  p.stroke([[300, 330], [300 + 170 * Math.sin(a), 330 - 170 * Math.cos(a)]], 12, "#c0353a");
  p.dot(300, 330, 20);
};

export const buildSet = ({ root }: BuildCtx): SetHandle => {
  const b = new Batch();
  b.add(new THREE.PlaneGeometry(400, 120).rotateX(-Math.PI / 2), lam("zSand", () => ({ color: "#e8d3a2" })), new THREE.Matrix4().makeTranslation(0, 0, -68));
  // quay
  b.add(boxGeo(V(-60, -0.8, -8), V(60, 0.6, -4)), lam("quay", () => ({ map: stoneHD("quayZ", ["#d9c9a8", "#cdbb98", "#e2d3b4", "#c4b28e"], "#a39070") })));
  // palace: main block, three storeys of balconies, crenellation, clock tower
  const wall = lam("palaceWall", () => ({ map: palaceTex() }));
  b.add(boxGeo(V(PAL[0] - 14, 0.6, PAL[2] - 8), V(PAL[0] + 14, 15, PAL[2] + 6)), wall);
  const wood = lam("balcony", () => ({ map: planksHD(), color: "#c99a5a" }));
  for (let fl = 0; fl < 3; fl++) {
    const y = 4.5 + fl * 3.6;
    b.add(boxGeo(V(PAL[0] - 14.5, y, PAL[2] + 6), V(PAL[0] + 14.5, y + 0.25, PAL[2] + 8)), wood);
    for (let i = 0; i <= 29; i++) b.add(boxGeo(V(PAL[0] - 14.5 + i, y + 0.25, PAL[2] + 7.85), V(PAL[0] - 14.4 + i, y + 1.2, PAL[2] + 7.95)), wood);
    b.add(boxGeo(V(PAL[0] - 14.5, y + 1.15, PAL[2] + 7.8), V(PAL[0] + 14.5, y + 1.25, PAL[2] + 8.0)), wood);
    for (let i = 0; i < 8; i++) b.add(boxGeo(V(PAL[0] - 14 + i * 4, y - 3.4, PAL[2] + 7.7), V(PAL[0] - 13.7 + i * 4, y, PAL[2] + 8.0)), lam("pillar", () => ({ color: "#f4efe4" })));
  }
  for (let i = 0; i < 14; i++) b.add(boxGeo(V(PAL[0] - 14 + i * 2.1, 15, PAL[2] + 5.4), V(PAL[0] - 13 + i * 2.1, 15.9, PAL[2] + 6)), lam("crenel", () => ({ color: "#f2ece0" })));
  b.add(boxGeo(V(PAL[0] + 9, 15, PAL[2] - 4), V(PAL[0] + 13, 24, PAL[2])), lam("towerZ", () => ({ color: "#f2ece0" })));
  b.add(new THREE.ConeGeometry(3.0, 3.2, 4).rotateY(Math.PI / 4).translate(PAL[0] + 11, 25.6, PAL[2] - 2), lam("towerRoof", () => ({ color: "#2f8a7a" })));
  b.add(new THREE.PlaneGeometry(2.6, 2.6).translate(PAL[0] + 11, 21.5, PAL[2] + 0.02), lam("towerClock", () => ({ map: ctex("towerClockT", 256, 256, (g) => { const p = new Pen(g); p.g.scale(256 / 300, 256 / 300); clockCard(p, 0); }), transparent: true })));
  // gate
  b.add(boxGeo(V(PAL[0] - 2, 0.6, PAL[2] + 6), V(PAL[0] + 2, 4.2, PAL[2] + 6.2)), lam("gate", () => ({ map: planksHD(), color: "#8a5a3a" })));
  // consulate
  b.add(boxGeo(V(CONS[0] - 4, 0.6, CONS[2] - 3), V(CONS[0] + 4, 6, CONS[2] + 3)), lam("consulate", () => ({ color: "#e6c98c" })));
  b.add(new THREE.ConeGeometry(5.8, 2.2, 4).rotateY(Math.PI / 4).translate(CONS[0], 7.1, CONS[2]), lam("consRoof", () => ({ color: "#b8644f" })));
  b.add(new THREE.CylinderGeometry(0.08, 0.08, 6).translate(CONS[0] + 3, 9, CONS[2] + 2.5), lam("pole", () => ({ color: "#e0e0e0" })));
  b.add(new THREE.PlaneGeometry(2.2, 1.4).translate(CONS[0] + 4.1, 11.2, CONS[2] + 2.5), lam("flagDE", () => ({ map: flagTri(), side: THREE.DoubleSide })));
  b.add(new THREE.CylinderGeometry(0.08, 0.08, 8).translate(PAL[0] - 11, 19, PAL[2]), lam("pole", () => ({ color: "#e0e0e0" })));
  for (let i = 0; i < 16; i++) prop(b, {}, i % 3 ? "tree_cone" : "tree_default", -50 + i * 6.5 + hh(i) * 2, 0, -22 - hh(i, 2) * 14, 7 + hh(i, 3) * 4);
  // owner feedback #2: 3 depth layers behind the harbour (dry grass, rocks, bushes, trees, then green hills), palms on the quay
  const busy = (x: number, z: number) => z > -12 || (Math.abs(x - PAL[0]) < 19 && z > PAL[2] - 12) || (Math.abs(x - CONS[0]) < 9 && Math.abs(z - CONS[2]) < 8);
  dressLand(b, { cx: 0, cz: -40, r0: 14, r1: 90, keep: busy, tufts: "dry", nTufts: 110, rocks: 24, bushes: 26, trees: 22, treeKinds: ["tree_default", "tree_fat", "tree-high-round", "tree_oak"], seed: 5 });
  for (let i = 0; i < 10; i++) mountain(b, -150 + i * 34 + hh(i, 7) * 10, -125 - hh(i, 8) * 30, 26 + hh(i, 9) * 18, 30, i, false, ["#6f8a50", "#5f7a44", "#7f9a5c", "#566e3c"]);
  const bark = lam("palmBark", () => ({ map: rep(planksHD(), 1, 3), color: "#9a7448" }));
  for (const [px, pz] of [[-48, -7], [-38, -9], [-27, -6.5], [20, -7], [24, -10], [40, -6.5], [50, -9], [58, -7], [-58, -10]]) {
    const H = 7 + hh(px, 1) * 3, lean = (hh(px, 2) - 0.5) * 0.5;
    for (let k = 0; k < 6; k++) { const u = k / 6, h = H / 6; b.add(new THREE.CylinderGeometry(0.22 - 0.02 * k, 0.28 - 0.02 * k, h * 1.02, 9).translate(lean * H * u * u, 0.6 + h * (k + 0.5), 0), bark, new THREE.Matrix4().makeTranslation(px, 0, pz)); }
    tuft(b, px + lean * H, 0.6 + H - 0.4, pz, "grass", 5.0, Math.round(px * 7));
    tuft(b, px + lean * H, 0.6 + H - 0.2, pz, "grass", 3.6, Math.round(px * 7) + 1);
    rock(b, px + 1.2, 0.6, pz + 0.8, 0.35, Math.round(px));
  }
  b.build(root);
  // night (the barricade, "and waits"): the palace windows glow and torches burn at the gate
  const winT = ctex("palaceWinGlow", 1024, 512, (g) => {
    g.clearRect(0, 0, 1024, 512);
    for (let fl = 0; fl < 3; fl++) for (let i = 0; i < 9; i++) {
      if ((fl * 9 + i) % 4 === 3) continue;
      const x = 50 + i * 108, y = 70 + fl * 150;
      g.fillStyle = "#ffc860"; g.beginPath(); g.moveTo(x + 4, y + 88); g.lineTo(x + 4, y + 28); g.arc(x + 25, y + 28, 21, Math.PI, 0); g.lineTo(x + 46, y + 88); g.fill();
    }
  });
  const wins = new THREE.Mesh(new THREE.PlaneGeometry(28, 14.4), new THREE.MeshBasicMaterial({ map: winT, color: new THREE.Color(1.8, 1.5, 1.1), transparent: true, depthWrite: false, fog: false }));
  wins.position.set(PAL[0], 7.8, PAL[2] + 6.03); wins.layers.set(NOINK); root.add(wins);
  const torchM = glowMat("#ffb040", 2.4);
  const torches = [-2.6, 2.6].map((dx) => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 8), torchM); m.position.set(PAL[0] + dx, 3.4, PAL[2] + 6.6); m.layers.set(NOINK); root.add(m); return { m, g: new Glow(root, "#ff9a40", 1.8), x: PAL[0] + dx }; });
  const flag = new THREE.Mesh(new THREE.PlaneGeometry(3, 1.9), lam("flagZ", () => ({ map: flagRed(), side: THREE.DoubleSide }))); flag.position.set(PAL[0] - 9.5, 22, PAL[2]); root.add(flag);
  const bay = sea(root, 0, 196, 200, "#1fa3b8"); bay.position.y = -0.6;
  // warships
  const ships = SHIPS.map(() => {
    const g = new THREE.Group();
    const grey = lam("shipGrey", () => ({ color: "#7d8896" })), dark = lam("shipDark", () => ({ color: "#3d434f" }));
    const hull = new THREE.Mesh(new THREE.BoxGeometry(20, 2.6, 4.2), grey); hull.position.y = 0.8; g.add(hull);
    const bow = new THREE.Mesh(new THREE.ConeGeometry(2.1, 4, 4).rotateZ(-Math.PI / 2).rotateX(Math.PI / 4), grey); bow.position.set(12, 0.8, 0); bow.scale.set(1, 0.62, 1); g.add(bow);
    const deck = new THREE.Mesh(new THREE.BoxGeometry(9, 2, 3), lam("shipDeck", () => ({ color: "#d9d4c8" }))); deck.position.set(-1, 3, 0); g.add(deck);
    for (const x of [-3, 1.5]) { const f = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 4.5, 14), lam("funnel", () => ({ color: "#e0a24a" }))); f.position.set(x, 5.6, 0); g.add(f); const c = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 0.6, 14), dark); c.position.set(x, 7.6, 0); g.add(c); }
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 9), dark); mast.position.set(6, 6.5, 0); g.add(mast);
    const gun = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.3, 4).rotateZ(Math.PI / 2), dark); gun.position.set(6.5, 2.6, 0); g.add(gun);
    g.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } });
    root.add(g); return g;
  });
  // royal yacht + rowing boat
  const yacht = new THREE.Group();
  const yHull = new THREE.Mesh(new THREE.BoxGeometry(10, 1.8, 2.8), lam("yachtW", () => ({ color: "#f6f2e8" }))); yHull.position.y = 0.6; yacht.add(yHull);
  const yTrim = new THREE.Mesh(new THREE.BoxGeometry(10.1, 0.25, 2.9), lam("yachtGold", () => ({ color: "#e8c45a" }))); yTrim.position.y = 1.4; yacht.add(yTrim);
  const yCab = new THREE.Mesh(new THREE.BoxGeometry(4, 1.6, 2), lam("yachtCab", () => ({ color: "#c0353a" }))); yCab.position.set(-0.5, 2.3, 0); yacht.add(yCab);
  const yMast = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 6), lam("pole", () => ({ color: "#e0e0e0" }))); yMast.position.set(2, 4, 0); yacht.add(yMast);
  yacht.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh) { m.castShadow = true; } });
  root.add(yacht);
  const row = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.5, 2.6, 14, 1, false, 0, Math.PI).rotateZ(Math.PI / 2).rotateX(Math.PI / 2), lam("rowB", () => ({ color: "#b0703f", side: THREE.DoubleSide })));
  row.scale.set(1, 0.6, 1); root.add(row);
  // smoke + embers
  const smoke = new Particles(root, 220, "#8a8590", 6.0, "dot", 1.0);
  const gunSmoke = new Particles(root, 150, "#e6e2da", 4.0, "dot", 1.0);
  const embers = new Particles(root, 160, "#ffb050", 0.25, "soft", 2.4);

  const pose = ({ t, light }: PoseCtx) => {
    const nt = light === "night";
    wins.visible = nt;
    torches.forEach((o, k) => { o.m.visible = nt; o.g.set(o.x, 3.5, PAL[2] + 6.7, 3.4 + 0.4 * Math.sin(t * 11 + k * 2), 0.9, nt); });
    const u = shipIn(t);
    ships.forEach((g, k) => { const [x, z] = SHIPS[k]; g.position.set(x + (1 - u) * (60 + k * 20), -0.6 + 0.08 * Math.sin(t * 1.2 + k), z); g.rotation.set(0, Math.PI, 0.01 * Math.sin(t + k)); });
    const ys = yachtSink(t);
    yacht.position.set(YACHT[0], -0.6 - ys * 2.6 + 0.06 * Math.sin(t * 1.4), YACHT[2]); yacht.rotation.set(0.2 * ys, 0.3, -0.25 * ys);
    row.position.set(YACHT[0] + 4 + ys * 6, -0.45 + 0.05 * Math.sin(t * 2), YACHT[2] + 4 + ys * 3); row.visible = ys > 0.2;
    flag.rotation.y = 0.15 * Math.sin(t * 2);
    const f = fireAt(t), sm = smokeAt(t);
    smoke.pose((i, o) => { const k = i % 6, uu = (t * 0.12 + hh(i, 1)) % 1; o.set(PAL[0] - 12 + k * 4.5 + uu * 6, 12 + uu * 26, PAL[2] - 2 + (hh(i, 2) - 0.5) * 6); return uu < sm; }, sm > 0);
    embers.pose((i, o) => { const uu = (t * 0.5 + hh(i, 1)) % 1; o.set(PAL[0] - 13 + hh(i, 2) * 26, 6 + uu * 14, PAL[2] + 6 + hh(i, 3) * 2); return true; }, f > 0.2);
    gunSmoke.pose((i, o) => { const k = i % 3, uu = (t * 0.4 + hh(i, 1)) % 1; const [x, z] = SHIPS[k]; o.set(x - 6.5 - uu * 4, 2.6 + uu * 6, z - 1 + (hh(i, 2) - 0.5) * 3); return true; }, t > clockMin.FIRE && t < clockMin.FIRE + 9);
    void smooth; void seg; void rep;
  };
  return { pose };
};
