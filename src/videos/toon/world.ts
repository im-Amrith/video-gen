// Toon engine world: one three.js scene per shot layer. Sky dome (5 stops by elevation), stars (night/space),
// clouds (day/golden), sun disc + halo (golden/space), the two-tone light rig with a camera-relative sun frozen per
// shot, fog = horizon colour, and the episode's own set (ep.build once, setHandle.pose per frame). Characters and
// effect cards come from ep.stage() through the canvas pool. Everything is a pure function of (shot id, frame).
import * as THREE from "three";
import { V } from "./build";
import { ctex, cloudHD } from "./paint";
import { LIGHTS, LOOK, LightName, LightPreset } from "./lights";
import { TONE, CHAR, untone } from "./shade";
import { NOINK } from "./ink";
import { Pool, Actor, Fx, Stage, CamInfo } from "./cast";
import { FPS, Episode, SetHandle, camAt, hh } from "./core";
import { setSight } from "./build";
import { setTuftTint } from "./dress";

const discTex = () => ctex("sunDisc", 128, 128, (g) => {
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, "#fff"); gr.addColorStop(0.7, "#fff"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
});
const haloTex = () => ctex("sunHalo", 256, 256, (g) => {
  const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  gr.addColorStop(0, "rgba(255,255,255,.55)"); gr.addColorStop(0.25, "rgba(255,255,255,.2)"); gr.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
});
const starTex = () => ctex("starDot", 64, 64, (g) => {
  const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.3, "rgba(255,255,255,.6)"); gr.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
});

export class World {
  root = new THREE.Group();
  private ep: Episode;
  private set: SetHandle;
  private pool = new Pool();
  private actors: Actor[] = [];
  private fxs: Fx[] = [];
  private hemi: THREE.HemisphereLight; private sun: THREE.DirectionalLight;
  private sky: THREE.Mesh; private skyMat: THREE.ShaderMaterial;
  private fog = new THREE.Fog("#bccbec", 25, 420);
  private sunDisc: THREE.Sprite; private sunHalo: THREE.Sprite;
  private stars: THREE.Points;
  private sunCache = new Map<number, THREE.Vector3>();
  private cloudMaps: Record<"day" | "golden", THREE.Texture[]>;
  private clouds: THREE.Mesh[] = [];
  private lowClouds: THREE.Mesh[] = [];
  private birds: THREE.Points; private motes: THREE.Points;
  private frustum = new THREE.Frustum();
  private m4 = new THREE.Matrix4(); private v = new THREE.Vector3(); private sph = new THREE.Sphere();

  constructor(ep: Episode) {
    this.ep = ep;
    const R = this.root;
    this.skyMat = new THREE.ShaderMaterial({
      uniforms: { c0: { value: new THREE.Color() }, c1: { value: new THREE.Color() }, c2: { value: new THREE.Color() },
        c3: { value: new THREE.Color() }, c4: { value: new THREE.Color() }, e: { value: new THREE.Vector4() }, e0: { value: 0 } },
      vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
      fragmentShader: `uniform vec3 c0, c1, c2, c3, c4; uniform vec4 e; uniform float e0; varying vec3 vP;
        void main(){ float el = asin(clamp(normalize(vP).y, -1.0, 1.0));
          vec3 c = mix(c0, c1, smoothstep(e0, e.x, el));
          c = mix(c, c2, smoothstep(e.x, e.y, el));
          c = mix(c, c3, smoothstep(e.y, e.z, el));
          c = mix(c, c4, smoothstep(e.z, e.w, el));
          gl_FragColor = vec4(c, 1.0); }`,
      side: THREE.BackSide, depthWrite: false, fog: false,
    });
    this.sky = new THREE.Mesh(new THREE.SphereGeometry(1100, 48, 24), this.skyMat);
    this.sky.renderOrder = -1; this.sky.frustumCulled = false; this.sky.layers.set(NOINK);
    R.add(this.sky);
    // stars: a shell of points (night / space), twinkle-free, a few bright ones bloom
    const n = 2600, pos = new Float32Array(n * 3), col = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const u = hh(i, 1) * 2 - 1, a = hh(i, 2) * Math.PI * 2, r = Math.sqrt(1 - u * u), d = 1000;
      pos.set([d * r * Math.cos(a), d * u, d * r * Math.sin(a)], i * 3);
      const b = 0.35 + 0.65 * hh(i, 3) ** 3 * (hh(i, 5) > 0.97 ? 3.0 : 1.2), warm = hh(i, 4);
      col.set([b * (0.85 + 0.25 * warm), b * 0.92, b * (1.15 - 0.3 * warm)], i * 3);
    }
    const sg = new THREE.BufferGeometry();
    sg.setAttribute("position", new THREE.BufferAttribute(pos, 3)); sg.setAttribute("color", new THREE.BufferAttribute(col, 3));
    this.stars = new THREE.Points(sg, new THREE.PointsMaterial({ size: 3.2, map: starTex(), vertexColors: true, transparent: true, depthWrite: false,
      blending: THREE.AdditiveBlending, sizeAttenuation: false, fog: false }));
    this.stars.frustumCulled = false; this.stars.layers.set(NOINK); this.stars.renderOrder = -0.8;
    R.add(this.stars);
    this.sunDisc = new THREE.Sprite(new THREE.SpriteMaterial({ map: discTex(), color: new THREE.Color(6.0, 4.4, 2.4), fog: false, depthWrite: false }));
    this.sunHalo = new THREE.Sprite(new THREE.SpriteMaterial({ map: haloTex(), color: new THREE.Color(1, 1, 1), fog: false, depthWrite: false, depthTest: true,
      transparent: true, blending: THREE.AdditiveBlending }));
    this.sunDisc.renderOrder = -0.5; this.sunHalo.renderOrder = 5;
    for (const m of [this.sunDisc, this.sunHalo]) { m.frustumCulled = false; m.layers.set(NOINK); R.add(m); }
    this.hemi = new THREE.HemisphereLight("#cfe6ff", "#6c5c8c", 1.1);
    this.sun = new THREE.DirectionalLight("#fff0d6", 2.6);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(4096, 4096);
    R.add(this.hemi, this.sun, this.sun.target);
    this.cloudMaps = { day: [0, 1, 2, 3].map((k) => cloudHD(k, LOOK.day.cloud)), golden: [0, 1, 2, 3].map((k) => cloudHD(k, LOOK.golden.cloud)) };
    if (ep.clouds !== false) for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2 + 0.3, d = 620 + (i % 3) * 60;
      const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: this.cloudMaps.day[i % 4], color: new THREE.Color(1.1, 1.1, 1.1), transparent: true, depthWrite: false, fog: false }));
      const w = 130 + (i % 4) * 30;
      m.position.set(Math.cos(a) * d, 120 + (i % 4) * 38, Math.sin(a) * d); m.scale.set(w, w / 2, 1);
      m.layers.set(NOINK);
      this.clouds.push(m); R.add(m);
    }
    // small life (owner feedback #2): low drifting clouds, a bird flock, dust motes — day/golden only, camera-relative
    if (ep.clouds !== false) for (let i = 0; i < 7; i++) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: this.cloudMaps.day[(i + 1) % 4], color: new THREE.Color(1.05, 1.05, 1.05), transparent: true, depthWrite: false, fog: false, opacity: 0.92 }));
      m.layers.set(NOINK); m.renderOrder = -0.6; this.lowClouds.push(m); R.add(m);
    }
    const birdT = ctex("birdV", 64, 64, (g) => { g.strokeStyle = "#2a2430"; g.lineWidth = 7; g.lineCap = "round"; g.beginPath(); g.moveTo(6, 26); g.quadraticCurveTo(20, 18, 32, 34); g.quadraticCurveTo(44, 18, 58, 26); g.stroke(); });
    const bg = new THREE.BufferGeometry(); bg.setAttribute("position", new THREE.BufferAttribute(new Float32Array(9 * 3), 3));
    this.birds = new THREE.Points(bg, new THREE.PointsMaterial({ size: 2.6, map: birdT, transparent: true, alphaTest: 0.3, depthWrite: false, sizeAttenuation: true, fog: false }));
    this.birds.frustumCulled = false; this.birds.layers.set(NOINK); R.add(this.birds);
    const mg = new THREE.BufferGeometry(); mg.setAttribute("position", new THREE.BufferAttribute(new Float32Array(70 * 3), 3));
    this.motes = new THREE.Points(mg, new THREE.PointsMaterial({ size: 0.035, map: starTex(), color: new THREE.Color(1.6, 1.45, 1.2), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true, fog: false }));
    this.motes.frustumCulled = false; this.motes.layers.set(NOINK); R.add(this.motes);
    setSight(ep.sight ? ep.sight() : []);
    this.set = ep.build({ root: R });
  }

  /** camera-relative sun, frozen per shot: the shot's mean view direction turned by az toward screen right, lifted by el */
  private shotSun(id: number, L: LightPreset) {
    let v = this.sunCache.get(id);
    if (v) return v;
    const s = this.ep.shots[id - 1];
    let fx = 0, fz = 0;
    for (let f = s.a; f < s.b; f += 3) {
      const c = camAt(this.ep, id, f), x = c.look[0] - c.pos[0], z = c.look[2] - c.pos[2], n = Math.hypot(x, z) || 1;
      fx += x / n; fz += z / n;
    }
    const n = Math.hypot(fx, fz) || 1; fx /= n; fz /= n;
    const az = THREE.MathUtils.degToRad(s.sunAz ?? L.az), el = THREE.MathUtils.degToRad(s.sunEl ?? L.el);
    const hx = fx * Math.cos(az) - fz * Math.sin(az), hz = fz * Math.cos(az) + fx * Math.sin(az);
    v = new THREE.Vector3(hx * Math.cos(el), Math.sin(el), hz * Math.cos(el)).normalize();
    this.sunCache.set(id, v);
    return v;
  }
  private actor(i: number) { while (this.actors.length <= i) this.actors.push(new Actor(this.root)); return this.actors[i]; }
  private fx(i: number) { while (this.fxs.length <= i) this.fxs.push(new Fx(this.root)); return this.fxs[i]; }

  update(id: number, f: number, cam: THREE.PerspectiveCamera, scene: THREE.Scene) {
    const t = f / FPS, s = this.ep.shots[id - 1], light: LightName = s.light, L = LIGHTS[light], K = LOOK[light];
    const c = camAt(this.ep, id, f);
    cam.position.set(...c.pos); cam.up.set(0, 1, 0); cam.lookAt(...c.look); cam.rotateZ(c.roll);
    cam.fov = c.fov; cam.near = 0.1; cam.far = 3000; cam.updateProjectionMatrix(); cam.updateMatrixWorld();
    const focus = V(...c.look), dist = cam.position.distanceTo(focus);
    cam.layers.enable(NOINK);
    // ---- light rig ----
    const sunDir = this.shotSun(id, L);
    this.hemi.color.set(L.sky); this.hemi.groundColor.set(L.ground); this.hemi.intensity = L.hemiI;
    this.sun.color.set(L.sunCol); this.sun.intensity = L.sunI;
    const Rr = THREE.MathUtils.clamp(dist * 1.15 + 7, 12, 95);
    this.sun.position.copy(focus).addScaledVector(sunDir, 220); this.sun.target.position.copy(focus);
    const sc = this.sun.shadow.camera;
    sc.left = -Rr; sc.right = Rr; sc.top = Rr; sc.bottom = -Rr; sc.near = 20; sc.far = 480; sc.updateProjectionMatrix();
    this.sun.shadow.bias = L.bias; this.sun.shadow.normalBias = L.normalBias * (Rr / 12);
    TONE.uLitCol.value.set(...L.lit); TONE.uShadeCol.value.set(...L.shade); TONE.uShadeLift.value.set(...L.lift);
    TONE.uLambert.value = L.lambert; TONE.uSideK.value = L.sideK; TONE.uTerm.value = L.term; TONE.uBounce.value.set(...K.bounce); TONE.uSat.value = K.sat;
    CHAR.uCharTint.value.set(...L.charTint); CHAR.uCharShade.value = L.charShade; CHAR.uGrad.value = L.charGrad;
    CHAR.uBodyGrad.value = L.bodyGrad; CHAR.uSideTint.value.set(...L.sideTint);
    // ---- sky, stars, fog, sun disc, clouds ----
    const su = this.skyMat.uniforms;
    K.sky.c.forEach((h, i) => untone(h, su["c" + i].value));
    const e = K.sky.e.map((deg) => THREE.MathUtils.degToRad(deg));
    su.e0.value = e[0]; su.e.value.set(e[1], e[2], e[3], e[4]);
    this.sky.position.copy(cam.position);
    this.stars.visible = light === "night" || light === "space";
    this.stars.position.copy(cam.position);
    untone(L.fog, this.fog.color); this.fog.near = L.fogNear; this.fog.far = L.fogFar;
    scene.fog = this.fog; scene.background = null;
    const showSun = light === "golden" || light === "space";
    this.sunDisc.visible = this.sunHalo.visible = showSun;
    if (showSun) {
      this.sunDisc.position.copy(cam.position).addScaledVector(sunDir, 900);
      this.sunDisc.scale.setScalar(2 * 900 * Math.tan(THREE.MathUtils.degToRad(1.7)));
      this.sunHalo.position.copy(this.sunDisc.position); this.sunHalo.scale.setScalar(2 * 900 * Math.tan(THREE.MathUtils.degToRad(24)));
      (this.sunHalo.material as THREE.SpriteMaterial).color.set(L.sunDisc).multiplyScalar(1.3);
    }
    const cl = light === "day" || light === "golden";
    for (let i = 0; i < this.clouds.length; i++) {
      const m = this.clouds[i], mat = m.material as THREE.MeshBasicMaterial;
      m.visible = cl;
      if (!cl) continue;
      m.lookAt(cam.position.x, m.position.y, cam.position.z);
      mat.map = this.cloudMaps[light as "day" | "golden"][i % 4];
    }
    setTuftTint(light);
    // ---- small life ----
    const fwd = V(0, 0, -1).applyQuaternion(cam.quaternion); fwd.y = 0; fwd.normalize();
    const rgt = V(-fwd.z, 0, fwd.x);
    this.lowClouds.forEach((m, i) => {
      const a = (i / this.lowClouds.length - 0.5) * 2.2, d = 260 + (i % 3) * 70, drift = ((t * 3 + i * 47) % 160) - 80;
      m.visible = cl && this.ep.clouds !== false;
      m.position.copy(cam.position).addScaledVector(fwd, d * Math.cos(a)).addScaledVector(rgt, d * Math.sin(a) + drift); m.position.y = cam.position.y * 0.3 + 55 + (i % 4) * 14;
      m.lookAt(cam.position.x, m.position.y, cam.position.z); const w = 90 + (i % 3) * 35; m.scale.set(w, w / 2, 1);
      if (cl) (m.material as THREE.MeshBasicMaterial).map = this.cloudMaps[light as "day" | "golden"][(i + 1) % 4];
    });
    const lifeOn = cl && this.ep.clouds !== false;
    this.birds.visible = lifeOn;
    if (lifeOn) {
      const p = this.birds.geometry.attributes.position as THREE.BufferAttribute, sweep = ((t * 6) % 160) - 80;
      for (let i = 0; i < 9; i++) {
        const row = Math.floor((i + 1) / 2), side = i % 2 ? 1 : -1;
        const c = V(0, 0, 0).copy(cam.position).addScaledVector(fwd, 95 - row * 3).addScaledVector(rgt, sweep - row * 2.4 + side * row * 0.0).addScaledVector(fwd, 0);
        c.addScaledVector(fwd, side * row * 2.5 * 0).addScaledVector(V(-rgt.z, 0, rgt.x), side * row * 2.5);
        p.setXYZ(i, c.x, cam.position.y + 26 + 0.6 * Math.sin(t * 6 + i), c.z);
      }
      p.needsUpdate = true;
    }
    this.motes.visible = lifeOn;
    if (lifeOn) {
      const p = this.motes.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < 70; i++) {
        const d = 2.5 + 9 * hh(i, 41), sx = (hh(i, 42) - 0.5) * d * 0.9, sy = (hh(i, 43) - 0.3) * d * 0.9 + Math.sin(t * 0.4 + i) * 0.3;
        const c = V(0, 0, 0).copy(cam.position).addScaledVector(V(0, 0, -1).applyQuaternion(cam.quaternion), d).addScaledVector(V(1, 0, 0).applyQuaternion(cam.quaternion), sx + Math.sin(t * 0.3 + i * 1.7) * 0.4).addScaledVector(V(0, 1, 0).applyQuaternion(cam.quaternion), sy);
        p.setXYZ(i, c.x, c.y, c.z);
      }
      p.needsUpdate = true;
    }
    // ---- the episode's set ----
    this.set.pose?.({ id, f, t, cam, light });
    // ---- cast + effects ----
    const right = V(0, 0, 0).setFromMatrixColumn(cam.matrixWorld, 0), up = V(0, 0, 0).setFromMatrixColumn(cam.matrixWorld, 1);
    const info: CamInfo = { pos: cam.position, right, up, sun: sunDir, light };
    const st: Stage = { places: [], fx: [] };
    this.ep.stage(id, t, info, st, f);
    this.frustum.setFromProjectionMatrix(this.m4.multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse));
    let ai = 0;
    const used: Actor[] = [];
    for (const p of st.places) {
      const sc2 = p.scale ?? 1;
      if (!this.frustum.intersectsSphere(this.sph.set(this.v.set(p.x, p.y + 1.1 * sc2, p.z), 3.5 * sc2))) continue;
      const a = this.actor(ai++);
      const [w, h, k] = p.size ?? [300, 500, 0.5];
      a.r = this.pool.req(p.key, w, h, k, p.draw);
      a.mesh.visible = true;
      a.mesh.position.set(p.x, p.y, p.z);
      if (p.face) { a.mesh.quaternion.copy(cam.quaternion); a.mesh.rotateZ(p.roll ?? 0); }
      else a.mesh.rotation.set(0, p.yaw ?? Math.atan2(cam.position.x - p.x, cam.position.z - p.z), p.roll ?? 0);
      a.mesh.scale.set(p.mirror ? -sc2 : sc2, sc2, sc2);
      a.mesh.castShadow = L.actorShadow;
      used.push(a);
    }
    for (let i = ai; i < this.actors.length; i++) this.actors[i].mesh.visible = false;
    let fi = 0;
    const fused: Fx[] = [];
    for (const p of st.fx) {
      if (!this.frustum.intersectsSphere(this.sph.set(this.v.set(p.x, p.y, p.z), Math.max(p.w, p.h)))) continue;
      const e2 = this.fx(fi++);
      e2.r = this.pool.req(p.key, p.cw, p.ch, p.k ?? 1, p.draw);
      e2.use(!!p.soft);
      e2.mesh.visible = true;
      e2.mesh.position.set(p.x, p.y, p.z);
      if (p.flat) e2.mesh.rotation.set(-Math.PI / 2, 0, p.rot ?? 0);
      else { e2.mesh.quaternion.copy(cam.quaternion); e2.mesh.rotateZ(p.rot ?? 0); }
      e2.mesh.scale.set(p.w, p.h, 1);
      fused.push(e2);
    }
    for (let i = fi; i < this.fxs.length; i++) this.fxs[i].mesh.visible = false;
    this.pool.flush();
    for (const a of used) a.bind();
    for (const e2 of fused) e2.bind();
    return focus;
  }
}
