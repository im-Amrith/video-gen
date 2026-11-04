// "What If You Jumped Into a Hole Through the Earth?" — the places, built once, posed per frame.
// NP north-pole ice + the hole (hook, pump, jump, plane ending) at the origin; KOLA drill site at z = -2000;
// TUN the shaft interior at x = 2000 (a 400 m treadmill: the hero stays at y = 0, the walls, lamps and dust scroll by
// the simulated depth); SP south-pole ice, hut and ceremonial pole at z = 2000; PG playground swing at x = -2000.
import * as THREE from "three";
import { Batch, boxGeo, V, lam, prop } from "../toon/build";
import { ctex, rep, grassHD, stoneHD, bed } from "../toon/paint";
import { twoTone } from "../toon/shade";
import { NOINK } from "../toon/ink";
import { Glow, Particles, glowMat } from "../toon/fx";
import { BuildCtx, PoseCtx, SetHandle, V3, hh, clamp01, smooth, lerp } from "../toon/core";
import { TUN, KOLA, SP, PG, scrollAt, depthAt, airOn, PUMP, DRILL_HOT, PLANE, F } from "./story";

// ---------------- painted textures ----------------
const iceTex = () => ctex("iceNP", 1024, 1024, (g, r) => {
  g.fillStyle = "#eef4f7"; g.fillRect(0, 0, 1024, 1024);
  for (let i = 0; i < 260; i++) { // wind-carved sastrugi: soft blue-grey strokes
    const x = r() * 1024, y = r() * 1024, l = 40 + r() * 140;
    g.strokeStyle = `rgba(${150 + r() * 40},${180 + r() * 30},${215 + r() * 25},${0.18 + r() * 0.2})`; g.lineWidth = 3 + r() * 8; g.lineCap = "round";
    g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + l * 0.5, y - 8 - r() * 10, x + l, y + r() * 6); g.stroke();
  }
  for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(255,255,255,${0.4 + r() * 0.6})`; g.fillRect(r() * 1024, r() * 1024, 2, 2); }
});
const hazard = () => ctex("hazard", 512, 64, (g) => {
  g.fillStyle = "#f2c230"; g.fillRect(0, 0, 512, 64);
  g.fillStyle = "#2b2430"; for (let x = -64; x < 576; x += 64) { g.beginPath(); g.moveTo(x, 64); g.lineTo(x + 32, 64); g.lineTo(x + 64, 0); g.lineTo(x + 32, 0); g.fill(); }
});
/** shaft wall: R = rock tone variation, G = glowing crack mask, B = strata band (tinted in the shader) */
const shaftTex = () => {
  const t = ctex("shaftWall", 1024, 1024, (g, r) => {
    g.fillStyle = "rgb(150,0,128)"; g.fillRect(0, 0, 1024, 1024);
    for (let i = 0; i < 520; i++) { // rock lumps
      const x = r() * 1024, y = r() * 1024, rad = 12 + r() * 60, v = 90 + r() * 140;
      g.fillStyle = `rgba(${v},0,${100 + r() * 80},${0.35 + r() * 0.4})`;
      g.beginPath(); g.ellipse(x, y, rad, rad * (0.4 + r() * 0.5), r() * 3, 0, Math.PI * 2); g.fill();
    }
    g.globalCompositeOperation = "lighter";
    for (let i = 0; i < 46; i++) { // glowing cracks (G)
      let x = r() * 1024, y = r() * 1024;
      g.strokeStyle = `rgba(0,${150 + r() * 105},0,1)`; g.lineWidth = 2 + r() * 5; g.lineCap = "round";
      g.beginPath(); g.moveTo(x, y);
      for (let k = 0; k < 6; k++) { x += (r() - 0.5) * 90; y += 20 + r() * 50; g.lineTo(x, y); }
      g.stroke();
    }
    g.globalCompositeOperation = "source-over";
    // dark ink seams along the strata (painted-in lines)
    for (let i = 0; i < 9; i++) { const y = (i / 9) * 1024 + r() * 30; g.fillStyle = "rgba(40,0,40,.55)"; g.fillRect(0, y, 1024, 3 + r() * 3); }
  });
  t.colorSpace = THREE.NoColorSpace;
  return rep(t, 3, 1);
};
const stripes = (a: string, b: string, n = 8) => ctex("stripes" + a + b, 64, 512, (g) => {
  for (let i = 0; i < n; i++) { g.fillStyle = i % 2 ? b : a; g.fillRect(0, (i * 512) / n, 64, 512 / n); }
});
const hutTex = () => ctex("spHut", 512, 256, (g) => {
  g.fillStyle = "#c9493a"; g.fillRect(0, 0, 512, 256);
  g.fillStyle = "rgba(0,0,0,.18)"; for (let x = 0; x < 512; x += 32) g.fillRect(x, 0, 3, 256);
  g.fillStyle = "#ffe7a6"; for (const x of [70, 200, 330]) { g.fillRect(x, 80, 70, 56); g.fillStyle = "#3a2a2a"; g.fillRect(x - 4, 76, 78, 4); g.fillRect(x - 4, 136, 78, 4); g.fillStyle = "#ffe7a6"; }
  g.fillStyle = "#5a3b2a"; g.fillRect(440, 110, 50, 146);
});

// ---------------- helpers ----------------
const beamBetween = (a: THREE.Vector3, b: THREE.Vector3, th: number) => {
  const d = b.clone().sub(a), g = new THREE.BoxGeometry(th, d.length(), th);
  g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(V(0, 1, 0), d.clone().normalize()));
  g.translate((a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2);
  return g;
};
const ground = (b: Batch, mat: THREE.Material, cx: number, cz: number, half: number, rep_: number, y = 0) => {
  const g = new THREE.PlaneGeometry(half * 2, half * 2, 1, 1); g.rotateX(-Math.PI / 2);
  const uv = g.attributes.uv as THREE.BufferAttribute; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * rep_, uv.getY(i) * rep_);
  b.add(g, mat, new THREE.Matrix4().makeTranslation(cx, y, cz));
};
const HOLE_R = 2.2;
/** the hole: a recessed steel collar with hazard stripes + a dark shaft going down */
const hole = (b: Batch, root: THREE.Object3D, cx: number, cz: number) => {
  const steel = twoTone(new THREE.MeshPhongMaterial({ color: "#8d96a6", specular: "#9aa2b0", shininess: 50 }), 0.15);
  const ring = new THREE.TorusGeometry(HOLE_R + 0.25, 0.28, 12, 48); ring.rotateX(Math.PI / 2);
  b.add(ring, steel, new THREE.Matrix4().makeTranslation(cx, 0.18, cz));
  const band = new THREE.CylinderGeometry(HOLE_R + 0.55, HOLE_R + 0.55, 0.32, 48, 1, true);
  b.add(band, lam("hazardBand", () => ({ map: rep(hazard(), 6, 1) })), new THREE.Matrix4().makeTranslation(cx, 0.16, cz));
  const top = new THREE.RingGeometry(HOLE_R + 0.5, HOLE_R + 0.55, 48); top.rotateX(-Math.PI / 2);
  // shaft: inner wall fading to black (unlit, gradient down)
  const shaftT = ctex("shaftFade", 64, 256, (g) => { const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, "#5c5f70"); gr.addColorStop(0.25, "#2b2a36"); gr.addColorStop(1, "#000000"); g.fillStyle = gr; g.fillRect(0, 0, 64, 256); });
  const sh = new THREE.Mesh(new THREE.CylinderGeometry(HOLE_R, HOLE_R, 40, 40, 1, true), new THREE.MeshBasicMaterial({ map: shaftT, side: THREE.BackSide, fog: false }));
  sh.position.set(cx, -20, cz); root.add(sh);
  const cap = new THREE.Mesh(new THREE.CircleGeometry(HOLE_R, 40), new THREE.MeshBasicMaterial({ color: "#000000" }));
  cap.rotation.x = -Math.PI / 2; cap.position.set(cx, -39.9, cz); root.add(cap);
};
/** low ice ridges / bergs on the horizon */
const ridges = (b: Batch, cx: number, cz: number, seed: number) => {
  const iceM = lam("iceRidge", () => ({ color: "#e3eef5" }));
  for (let i = 0; i < 26; i++) {
    const a = hh(i, seed) * Math.PI * 2, d = 70 + hh(i, seed + 1) * 160, h = 3 + hh(i, seed + 2) * 12, w = 6 + hh(i, seed + 3) * 18;
    const g = new THREE.ConeGeometry(w, h, 5 + Math.floor(hh(i, 4) * 3)); g.translate(0, h / 2 - 0.5, 0);
    b.add(g, iceM, new THREE.Matrix4().makeRotationY(hh(i, 7) * 3).setPosition(cx + Math.cos(a) * d, 0, cz + Math.sin(a) * d));
  }
  for (let i = 0; i < 40; i++) { // snow drifts near the hole
    const a = hh(i, seed + 9) * Math.PI * 2, d = 7 + hh(i, seed + 8) * 40, s = 0.6 + hh(i, 3) * 1.6;
    const g = new THREE.SphereGeometry(1, 16, 10); g.scale(s * 1.8, s * 0.45, s);
    b.add(g, lam("drift", () => ({ color: "#f2f7fa" })), new THREE.Matrix4().makeRotationY(a).setPosition(cx + Math.cos(a) * d, 0, cz + Math.sin(a) * d));
  }
};

// ---------------- build ----------------
export const buildSet = ({ root }: BuildCtx): SetHandle => {
  const b = new Batch();
  const ice = lam("iceNP", () => ({ map: iceTex() }));
  // NP
  ground(b, ice, 0, 0, 600, 60);
  hole(b, root, 0, 0);
  ridges(b, 0, 0, 1);
  const poleM = lam("poleStripe", () => ({ map: stripes("#d93a3a", "#f7f3ea", 10) }));
  b.add(new THREE.CylinderGeometry(0.09, 0.09, 2.6, 14).translate(0, 1.3, 0), poleM, new THREE.Matrix4().makeTranslation(-4.6, 0, -2.4));
  b.add(new THREE.SphereGeometry(0.2, 16, 10), lam("poleKnob", () => ({ color: "#f2c230" })), new THREE.Matrix4().makeTranslation(-4.6, 2.7, -2.4));
  // vacuum pump: a chunky machine with a hose into the hole
  const pumpM = lam("pumpBody", () => ({ color: "#3f78c2" })), darkM = lam("pumpDark", () => ({ color: "#2f3542" }));
  b.add(boxGeo(V(PUMP[0] - 1.1, 0, PUMP[2] - 0.8), V(PUMP[0] + 1.1, 1.5, PUMP[2] + 0.8), 1), pumpM);
  b.add(new THREE.CylinderGeometry(0.55, 0.55, 1.7, 20).rotateZ(Math.PI / 2).translate(PUMP[0], 1.9, PUMP[2]), lam("pumpTank", () => ({ color: "#d6dde6" })));
  for (const s of [-0.7, 0.7]) b.add(new THREE.CylinderGeometry(0.32, 0.32, 0.25, 16).rotateX(Math.PI / 2).translate(PUMP[0] + s, 0.32, PUMP[2] + 0.85), darkM);
  const hosePts = [V(PUMP[0] + 0.9, 1.1, PUMP[2] - 0.6), V(PUMP[0] + 2.5, 0.35, PUMP[2] - 1.6), V(1.6, 0.7, -0.6), V(0.6, 0.4, -0.2), V(0.2, -1.2, 0)];
  b.add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(hosePts), 40, 0.17, 10), lam("hose", () => ({ color: "#2b2b33" })));
  // KOLA: dirt yard, a lattice derrick, a red-hot drill pipe in a hole
  ground(b, lam("kolaDirt", () => ({ map: bed() })), KOLA[0], KOLA[2], 400, 80);
  const steelR = lam("derrick", () => ({ color: "#c94a3a" }));
  const [kx, , kz] = KOLA, H = 16, base = 3.2, top = 0.7;
  const corners = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
  for (const [sx, sz] of corners) b.add(beamBetween(V(kx + sx * base, 0, kz + sz * base), V(kx + sx * top, H, kz + sz * top), 0.22), steelR);
  for (let k = 1; k < 6; k++) {
    const y = (k / 6) * H, w = base + (top - base) * (k / 6);
    for (let c = 0; c < 4; c++) { const [ax, az] = corners[c], [bx, bz] = corners[(c + 1) % 4]; b.add(beamBetween(V(kx + ax * w, y, kz + az * w), V(kx + bx * w, y, kz + bz * w), 0.14), steelR); }
  }
  b.add(boxGeo(V(kx - 4, 0, kz - 4), V(kx + 4, 0.4, kz + 4), 2), lam("kolaDeck", () => ({ map: stoneHD("kolaDeck") })));
  b.add(boxGeo(V(kx + 6, 0, kz - 3), V(kx + 12, 3.2, kz + 2), 2), lam("kolaShed", () => ({ color: "#7c8b6a" })));
  for (let i = 0; i < 14; i++) prop(b, {}, i % 3 ? "tree_cone" : "tree_default", kx - 40 + hh(i, 3) * 80, 0, kz - 30 - hh(i, 4) * 60, 6 + hh(i, 5) * 6);
  const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 2.2, 20), glowMat("#ff5a1a", 1.0));
  pipe.position.set(kx, 1.5, kz); root.add(pipe);
  const pipeGlow = new Glow(root, "#ff7a2a", 2.2);
  // SP: ice, the hole, a red hut, the ceremonial striped pole with a mirror ball and a ring of pennants
  ground(b, ice, SP[0], SP[2], 300, 30);
  hole(b, root, SP[0], SP[2]);
  ridges(b, SP[0], SP[2], 5);
  const hut = lam("spHutWall", () => ({ map: hutTex() }));
  b.add(boxGeo(V(SP[0] - 14, 0, SP[2] - 15), V(SP[0] - 4, 3.6, SP[2] - 10)), hut);
  b.add(boxGeo(V(SP[0] - 14.3, 3.6, SP[2] - 15.3), V(SP[0] - 3.7, 4.1, SP[2] - 9.7)), lam("hutRoof", () => ({ color: "#e9edf2" })));
  b.add(new THREE.CylinderGeometry(0.1, 0.1, 1.6, 14).translate(0, 0.8, 0), poleM, new THREE.Matrix4().makeTranslation(SP[0] + 5, 0, SP[2] - 4));
  const mirror = twoTone(new THREE.MeshPhongMaterial({ color: "#c9d3df", specular: "#ffffff", shininess: 120 }), 0.1);
  b.add(new THREE.SphereGeometry(0.32, 24, 16), mirror, new THREE.Matrix4().makeTranslation(SP[0] + 5, 1.92, SP[2] - 4));
  const pen = ["#3f6fb5", "#f2c230", "#2f8a4f", "#d23b3b", "#7b5ac9", "#f08a2c"];
  for (let k = 0; k < 9; k++) {
    const a = (k / 9) * Math.PI * 2, x = SP[0] + 5 + Math.cos(a) * 5, z = SP[2] - 4 + Math.sin(a) * 5;
    b.add(new THREE.CylinderGeometry(0.05, 0.05, 3, 8).translate(0, 1.5, 0), lam("flagPole", () => ({ color: "#d9dde3" })), new THREE.Matrix4().makeTranslation(x, 0, z));
    b.add(new THREE.PlaneGeometry(0.9, 0.55).translate(0.45, 2.6, 0), lam("pen" + pen[k % 6], () => ({ color: pen[k % 6], side: THREE.DoubleSide })), new THREE.Matrix4().makeRotationY(a + 1.2).setPosition(x, 0, z));
  }
  // PG: lawn, A-frame swing, trees
  ground(b, lam("grassPG", () => ({ map: grassHD() })), PG[0], PG[2], 400, 100);
  const wood = lam("swingWood", () => ({ color: "#b0703f" }));
  for (const zz of [-1.6, 1.6]) for (const s of [-1, 1]) b.add(beamBetween(V(PG[0], 3.0, PG[2] + zz), V(PG[0] + s * 2.4, 0, PG[2] + zz), 0.16), wood);
  b.add(beamBetween(V(PG[0], 3.0, PG[2] - 1.8), V(PG[0], 3.0, PG[2] + 1.8), 0.18), wood);
  for (let i = 0; i < 18; i++) prop(b, {}, ["tree_oak", "tree_fat", "plant_bushLarge"][i % 3], PG[0] - 30 + hh(i, 7) * 60, 0, PG[2] - 18 - hh(i, 8) * 40, i % 3 === 2 ? 1.6 : 6 + hh(i, 9) * 4);
  b.build(root);

  // plane (ending): fuselage, wings, tail, spinning prop
  const plane = new THREE.Group();
  const red = lam("planeRed", () => ({ color: "#d9443a" })), white = lam("planeWhite", () => ({ color: "#f3efe6" }));
  const fus = new THREE.Mesh(new THREE.CapsuleGeometry(0.9, 6, 8, 20).rotateZ(Math.PI / 2), white); plane.add(fus);
  const stripe = new THREE.Mesh(new THREE.CylinderGeometry(0.92, 0.92, 6, 20, 1, true).rotateZ(Math.PI / 2), red); stripe.scale.set(1, 1, 1); stripe.position.y = -0.05; plane.add(stripe);
  const wing = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.16, 11), red); wing.position.set(0.4, 0.55, 0); plane.add(wing);
  const tail = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.6, 0.14), red); tail.position.set(-3.4, 1.0, 0); plane.add(tail);
  const tailW = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.12, 3.2), red); tailW.position.set(-3.4, 0.4, 0); plane.add(tailW);
  for (const s of [-1, 1]) { const ski = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.12, 0.35), white); ski.position.set(0.6, -1.55, s * 1.3); plane.add(ski);
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.8, 0.12), red); leg.position.set(0.6, -1.15, s * 1.0); plane.add(leg); }
  const win = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.5, 1.86), glowMat("#9fd4ff", 0.9)); win.position.set(1.0, 0.45, 0); plane.add(win);
  const prop_ = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.6, 0.25), lam("propBlade", () => ({ color: "#2b2b33" }))); prop_.position.set(4.0, 0, 0); plane.add(prop_);
  plane.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } });
  root.add(plane);

  // ---------------- TUN: the shaft treadmill ----------------
  const tex = shaftTex();
  const U = { uTex: { value: tex }, uScroll: { value: 0 }, uBase: { value: new THREE.Color() }, uBand: { value: new THREE.Color() },
    uGlow: { value: new THREE.Color() }, uGlowK: { value: 0 }, uFog: { value: new THREE.Color() }, uFogD: { value: 120 }, uAir: { value: 0 } };
  const wallMat = new THREE.ShaderMaterial({
    uniforms: U, side: THREE.BackSide,
    vertexShader: `varying vec2 vUv; varying vec3 vW; varying vec3 vN; uniform float uScroll;
      void main(){ vUv = vec2(uv.x * 3.0, (position.y - uScroll) / 22.0); vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * viewMatrix * w; }`,
    fragmentShader: `uniform sampler2D uTex; uniform vec3 uBase, uBand, uGlow, uFog; uniform float uGlowK, uFogD, uAir; varying vec2 vUv; varying vec3 vW; varying vec3 vN;
      void main(){ vec4 t = texture2D(uTex, vUv);
        vec3 c = mix(uBase * (0.55 + 0.75 * t.r), uBand, 0.35 * t.b);
        float facing = abs(dot(normalize(cameraPosition - vW), -vN));
        c *= 0.62 + 0.5 * facing;
        c += uGlow * uGlowK * t.g * 2.2;
        float d = length(cameraPosition - vW);
        c = mix(c, uFog, clamp(d / uFogD, 0.0, 1.0) * (0.85 + 0.15 * uAir));
        gl_FragColor = vec4(c, 1.0); }`,
  });
  const wall = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.2, 400, 48, 40, true), wallMat);
  wall.position.set(TUN[0], 0, TUN[2]); wall.frustumCulled = false; root.add(wall);
  // lamp rings every 25 m (HDR, bloom) + ribs between (ink lines give the shaft its rhythm)
  const lampG = new THREE.TorusGeometry(3.05, 0.09, 8, 48); lampG.rotateX(Math.PI / 2);
  const lampM = glowMat("#ffe9b8", 1.8);
  const lamps = new THREE.InstancedMesh(lampG, lampM, 16); lamps.frustumCulled = false; root.add(lamps);
  const ribG = new THREE.TorusGeometry(3.15, 0.16, 8, 48); ribG.rotateX(Math.PI / 2);
  const ribs = new THREE.InstancedMesh(ribG, lam("rib", () => ({ color: "#5d5560" })), 32); ribs.frustumCulled = false; root.add(ribs);
  const dust = new Particles(root, 260, "#fff1d6", 0.09, "soft", 1.4);
  const bubbles = new Particles(root, 140, "#ffd27a", 0.5, "soft", 2.2);
  const coreGlow = new Glow(root, "#ffcf7a", 3.0);
  const kolaBit = new THREE.Mesh(new THREE.ConeGeometry(0.35, 1.4, 12).rotateZ(-Math.PI / 2), twoTone(new THREE.MeshPhongMaterial({ color: "#8d96a6", specular: "#ffffff", shininess: 60 }), 0.15));
  root.add(kolaBit);
  // NP / KOLA atmosphere
  const snow = new Particles(root, 500, "#ffffff", 0.07, "flake", 1.0);
  const steam = new Particles(root, 90, "#ffffff", 1.4, "soft", 0.35);
  const sucked = new Particles(root, 160, "#ffffff", 0.08, "flake", 1.0);
  const m4 = new THREE.Matrix4(), q4 = new THREE.Quaternion(), s1 = V(1, 1, 1), p4 = V(0, 0, 0);

  const pose = ({ id, f, t }: PoseCtx) => {
    // plane
    plane.visible = id === 13;
    if (plane.visible) {
      const u = smooth((t - PLANE.t0) / 3.2);
      plane.position.set(PLANE.x + lerp(0, 26, u * u), 1.6 + 7 * Math.max(0, u - 0.35) ** 1.6, PLANE.z);
      plane.rotation.set(0, Math.PI, 0.18 * Math.max(0, u - 0.3));
      prop_.rotation.x = t * 40;
    }
    // kola pipe
    pipe.visible = id === 2;
    const hot = clamp01((t - DRILL_HOT) / 1.0);
    (pipe.material as THREE.MeshBasicMaterial).color.set("#7a3a2a").lerp(new THREE.Color("#ff5a1a"), hot).multiplyScalar(1 + 1.4 * hot);
    pipeGlow.set(KOLA[0], 1.4, KOLA[2], 3.2 + 2 * hot, hot, id === 2);
    steam.pose((i, o) => { const u = (t * 0.25 + hh(i, 2)) % 1; o.set(KOLA[0] + (hh(i, 3) - 0.5) * 1.5 + u * 2, 0.5 + u * 7, KOLA[2] + (hh(i, 4) - 0.5) * 1.5); return hot > 0.05; }, id === 2);
    // snow drifting across NP / SP
    const onIce = id === 1 || id === 3 || id === 4 || id === 10 || id === 13;
    const cx = id === 10 ? SP[0] : 0, cz = id === 10 ? SP[2] : 0;
    snow.pose((i, o) => {
      const u = (t * 0.12 + hh(i, 1)) % 1;
      o.set(cx - 30 + ((hh(i, 2) * 60 + u * 25) % 60), 0.2 + ((hh(i, 3) * 9 - u * 3 + 9) % 9), cz - 30 + hh(i, 4) * 50 + Math.sin(t + i) * 0.5);
      return true;
    }, onIce);
    // air sucked into the hose / hole while the pump runs
    const pumpOn = id === 3;
    sucked.pose((i, o) => {
      const u = (t * 0.9 + hh(i, 5)) % 1, a = hh(i, 6) * Math.PI * 2, r = (1 - u) * 4;
      o.set(Math.cos(a + u * 3) * r, 0.3 + (1 - u) * 2.5 * hh(i, 7) - u * 0.8, Math.sin(a + u * 3) * r);
      return true;
    }, pumpOn);
    // tunnel
    const inT = id >= 5 && id <= 9 || id === 12;
    wall.visible = lamps.visible = ribs.visible = inT;
    dust.pts.visible = bubbles.pts.visible = false; coreGlow.sprite.visible = false; kolaBit.visible = false;
    if (!inT) return;
    const sc = scrollAt(t), D = depthAt(t), air = airOn(id);
    U.uScroll.value = sc;
    // colour by depth (km): crust brown -> mantle red-orange (cracks glow) -> outer core liquid iron -> inner core white-gold
    const r = Math.abs(D - 6371);
    const Dd = 6371 - r; // depth below the nearest surface
    const k1 = smooth((Dd - 20) / 300), k2 = smooth((Dd - 2700) / 300), k3 = smooth((Dd - 5000) / 300);
    const base = new THREE.Color("#7a5a44").lerp(new THREE.Color("#a8442a"), k1).lerp(new THREE.Color("#ff9a2a"), k2).lerp(new THREE.Color("#fff0b0"), k3);
    const band = new THREE.Color("#5a4234").lerp(new THREE.Color("#6a2014"), k1).lerp(new THREE.Color("#ffd060"), k2);
    const glow = new THREE.Color("#ff6a1a").lerp(new THREE.Color("#ffe08a"), k2);
    U.uBase.value.copy(base).multiplyScalar(1 + 0.6 * k2 + 0.4 * k3); U.uBand.value.copy(band);
    U.uGlow.value.copy(glow); U.uGlowK.value = 0.15 + 1.4 * k1 + 1.2 * k2;
    U.uFog.value.copy(new THREE.Color("#1a1420").lerp(new THREE.Color("#5a1a0c"), k1).lerp(new THREE.Color("#ff9a3a"), k2).lerp(new THREE.Color("#fff2c0"), k3));
    U.uFogD.value = lerp(140, 70, k2); U.uAir.value = air;
    void r;
    const per = 25;
    for (let k = 0; k < 16; k++) { const y = ((((k * per + sc) % 400) + 400) % 400) - 200; lamps.setMatrixAt(k, m4.compose(p4.set(TUN[0], y, TUN[2]), q4, s1)); }
    for (let k = 0; k < 32; k++) { const y = ((((k * per + 12.5 + sc) % 400) + 400) % 400) - 200; ribs.setMatrixAt(k, m4.compose(p4.set(TUN[0], y, TUN[2]), q4, s1)); }
    lamps.instanceMatrix.needsUpdate = true; ribs.instanceMatrix.needsUpdate = true;
    lampM.color.set("#ffe9b8").multiplyScalar(1.8 * (1 - 0.5 * k2));
    // dust streaks up past the faller (air run: slow drifting dust)
    dust.pose((i, o) => { const y = (((hh(i, 1) * 120 + sc * (air ? 1 : 0.5)) % 120) + 120) % 120 - 60, a = hh(i, 2) * Math.PI * 2, rr = 0.6 + hh(i, 3) * 2.4; o.set(TUN[0] + Math.cos(a) * rr, y, TUN[2] + Math.sin(a) * rr); return true; });
    bubbles.pose((i, o) => { const y = (((hh(i, 1) * 80 + sc * 0.7 + t * 2) % 80) + 80) % 80 - 40, a = hh(i, 2) * Math.PI * 2, rr = 2.6 + hh(i, 3) * 0.5; o.set(TUN[0] + Math.cos(a) * rr, y, TUN[2] + Math.sin(a) * rr); return true; }, k2 > 0.05);
    coreGlow.set(TUN[0], -60, TUN[2], 30, k2 * 0.8 + k3, true);
    // the Kola drill bit stuck in the wall, passing at 12 km
    const yb = (12.26 - D) * 1000 * F.SCROLL_PER_M;
    kolaBit.visible = Math.abs(yb) < 120;
    kolaBit.position.set(TUN[0] - 2.75, -yb, TUN[2] - 1.2); kolaBit.rotation.y = 0.4;
  };
  return { pose };
};
export const HOLE = HOLE_R;
export type { V3 };
