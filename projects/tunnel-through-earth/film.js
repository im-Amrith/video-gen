// What If You Jumped Into a Hole Through the Earth? — iso-infographic, 1080x1920.
// World units: km. The planet is a column (section through Earth's axis), centre at z = 0, north pole on top.
// The tunnel runs down the column's front corner edge (x = y = CW). Tunnel, person and Kola line are drawn at a
// fixed screen size (not to scale); the layer depths are to scale.
import { Iso, tri, mix, hex, clamp, lerp, seg, ss, eo, eio, back, hash, pin, ring, cutLine, haloText, person, inset, TAU, C30, PAL } from './engine.js';

const W = 1080, H = 1920, R = 6371, CW = 3200;
const INK = '#2E2522', BG = '#F2E6D0', PAPER = '#FBF4E6';
const COL = { ice: '#EEF4F3', crust: '#9C6E4A', mantle: '#CF5F3B', outer: '#E8963A', inner: '#F1CB5E', sub: '#2F7DB8', air: '#A9D3EE' };
const T3 = Object.fromEntries(Object.entries(COL).map(([k, v]) => [k, tri(v)]));
const BANDS = [[R, R - 35, 'crust'], [R - 35, 3480, 'mantle'], [3480, 1221, 'outer'], [1221, -1221, 'inner'], [-1221, -3480, 'outer'], [-3480, -(R - 35), 'mantle'], [-(R - 35), -R, 'crust']];
const GW_PX = 84, GW_MIN = 0.0028, PH_PX = 128;
let TL, L, DUR, EVS = [];

// ---------------- physics: fall through a PREM-like Earth (vacuum) ----------------
const gacc = r => { r = Math.abs(r); if (r >= 3480) return 9.82 + (10.68 - 9.82) * (R - r) / (R - 3480); const x = r / 3480; return 10.68 * x * (1.25 - .25 * x); };
const SZ = [], SV = []; let TC = 0, T1 = 0, S_CMB = 0, S_ICB = 0, S_CR = 0;
(function sim() {
  let r = R * 1e3, v = 0, n = 0; const dt = .05; SZ.push(R); SV.push(0);
  while (r > 0) { v += gacc(r / 1e3) * dt; r -= v * dt; n++; if (n % 20 === 0) { SZ.push(r / 1e3); SV.push(v / 1e3); } }
  TC = n * dt; T1 = 2 * TC;
  const first = lim => SZ.findIndex(z => z < lim);
  S_CR = first(R - 35); S_CMB = first(3480); S_ICB = first(1221);
})();
const half = (A, s) => { s = clamp(s, 0, A.length - 1); const i = Math.floor(s), f = s - i; return lerp(A[i], A[Math.min(i + 1, A.length - 1)], f); };
const zf = s => s <= TC ? half(SZ, s) : -half(SZ, 2 * TC - s);      // 0..T1: north → south
const vf = s => half(SV, s <= TC ? s : 2 * TC - s);
const zOsc = s => { const m = ((s % (2 * T1)) + 2 * T1) % (2 * T1); return m <= T1 ? zf(m) : zf(2 * T1 - m); };
const vOsc = s => { const m = ((s % (2 * T1)) + 2 * T1) % (2 * T1); return vf(m <= T1 ? m : 2 * T1 - m); };

// ---------------- timing ----------------
let K = [], FS = 17.05, TSTOP, TMISS, TOSC, TAIR0, TAIR1;
const st = id => L[id].t0, en = id => L[id].t1;
function simT(t) { // film time → sim seconds (piecewise linear)
  if (t <= K[0][0]) return 0;
  for (let i = 1; i < K.length; i++) if (t <= K[i][0]) { const [a, sa] = K[i - 1], [b, sb] = K[i]; return lerp(sa, sb, (t - a) / (b - a)); }
  return K[K.length - 1][1];
}
export function init(tl) {
  TL = tl; L = tl.L; DUR = tl.DUR;
  TSTOP = st('L11') + 2.25; TMISS = st('L12') + 1.05; TOSC = en('L12') + .25; TAIR0 = st('L13') + .55; TAIR1 = en('L14') - 1.2;
  K = [[FS, 0], [st('L07') + 1.15, S_CMB], [en('L08') + .45, TC - 9], [en('L09') + .1, TC + 9], [TSTOP, T1], [TMISS, T1], [TOSC, 6 * T1]];
  buildEvents();
}

// ---------------- camera ----------------
function camPut(A, sx, sy, k) { const u = (sx - W / 2) / (2 * C30 * k); return { x: A[0] - u, y: A[1] + u, z: A[2] + (sy - H / 2) / k, k }; }
function scr(cam, p) { const X = p[0] - cam.x, Y = p[1] - cam.y; return [W / 2 + (X - Y) * C30 * cam.k, H / 2 + ((X + Y) * .5 - (p[2] - cam.z)) * cam.k]; }
const lk = (a, b, u) => Math.exp(lerp(Math.log(a), Math.log(b), u));
function blend(S0, S1, u, anchor) { // zoom about the anchor's point: screen pos linear, zoom logarithmic
  const k = lk(S0.k, S1.k, u);
  if (anchor === 'start') { const e = scr(camPut(S1.A, S1.sx, S1.sy, S1.k), S0.A); return camPut(S0.A, lerp(S0.sx, e[0], u), lerp(S0.sy, e[1], u), k); }
  const s = scr(camPut(S0.A, S0.sx, S0.sy, S0.k), S1.A); return camPut(S1.A, lerp(s[0], S1.sx, u), lerp(s[1], S1.sy, u), k);
}
const corner = z => [CW, CW, z];
const ST = {
  hole: k => ({ A: corner(R), sx: 560, sy: 1060, k }),
  kola: k => ({ A: [CW, CW, R - 6.2], sx: 470, sy: 820, k }),
  wide: k => ({ A: [CW / 2, CW / 2, 0], sx: 540, sy: 850, k }),
  topp: k => ({ A: corner(R), sx: 560, sy: 1000, k }),
  follow: (t, k) => ({ A: corner(personZ(t)), sx: 540, sy: 820, k }),
  center: k => ({ A: corner(0), sx: 540, sy: 880, k }),
  south: k => ({ A: corner(-R), sx: 540, sy: 720, k }),
};
function camera(t) {
  const segs = [
    [0, 5.4, () => ST.hole(lk(110000, 150000, eio(seg(t, 0, 5.4))))],
    [5.4, 7.2, u => blend(ST.hole(150000), ST.kola(60), u, 'start')],
    [7.2, 9.8, () => ST.kola(lk(60, 52, seg(t, 7.2, 9.8)))],
    [9.8, 12.3, u => blend(ST.kola(52), ST.wide(.064), u, 'start')],
    [12.3, 16.1, () => ST.wide(lerp(.064, .068, seg(t, 12.3, 16.1)))],
    [16.1, 16.75, u => blend(ST.wide(.068), ST.topp(900), u, 'end')],
    [16.75, FS, () => ST.topp(900)],
    [FS, 18.8, u => blend(ST.topp(900), ST.follow(t, .3), u, 'end')],
    [18.8, 27.5, () => ST.follow(t, .3)],
    [27.5, 33.6, () => ST.follow(t, lerp(.3, .42, ss(seg(t, 27.5, 33.6))))],
    [33.6, 35.3, u => blend(ST.follow(t, .42), ST.center(1), u, 'end')],
    [35.3, 41.0, () => ST.center(lerp(1, 1.12, seg(t, 35.3, 41)))],
    [41.0, 42.7, u => blend(ST.center(1.12), ST.follow(t, .3), u, 'end')],
    [42.7, TSTOP - .7, () => ST.follow(t, .3)],
    [TSTOP - .7, TSTOP + .5, u => blend(ST.follow(t, .3), ST.south(.6), u, 'end')],
    [TSTOP + .5, TMISS, () => ST.south(lerp(.6, .66, seg(t, TSTOP + .5, TMISS)))],
    [TMISS, TMISS + 1.1, u => blend(ST.south(.66), ST.wide(.064), u, 'end')],
    [TMISS + 1.1, 60.6, () => ST.wide(.064)],
    [60.6, 62.9, u => blend(ST.wide(.064), ST.center(.8), u, 'end')],
    [62.9, 63.75, () => ST.center(.8)],
    [63.75, 65.2, u => blend(ST.center(.8), { ...ST.wide(.058), sy: 1000 }, u, 'end')],
    [65.2, 1e9, () => ({ ...ST.wide(.058), sy: 1000 })],
  ];
  for (const [a, b, f] of segs) if (t < b) { const c = f(eio(seg(t, a, b))); return c.A ? camPut(c.A, c.sx, c.sy, c.k) : c; }
}

// ---------------- the person ----------------
function personZ(t) {
  if (t < FS) return R;
  if (t < TOSC + .4) return zOsc(simT(t));
  if (t < TAIR0) return R;
  const u = seg(t, TAIR0, TAIR1); return R * (1 - (1 - Math.pow(1 - u, 1.7)));
}
function personV(t) { // km/s
  if (t < FS) return 0; if (t < TOSC + .4) return vOsc(simT(t));
  if (t < TAIR0) return 0; if (t < TAIR1) return 200 / 3600; return 0;
}

// ---------------- events (for the mix) ----------------
function buildEvents() {
  const E = [];
  const e = (t, type, o = {}) => E.push({ t: +t.toFixed(3), type, ...o });
  e(4.35, 'pin'); e(7.3, 'drill'); e(8.95, 'pin'); e(10.9, 'pin');
  e(12.9, 'cut'); e(13.95, 'slide'); e(14.45, 'pin'); e(14.75, 'pin'); e(15.25, 'pin');
  e(16.1, 'whoosh'); e(16.55, 'crouch'); e(16.85, 'jump');
  // layer crossings during the vacuum run
  let prev = R; for (let t = FS; t < TOSC; t += 1 / 60) { const z = personZ(t); for (const b of [R - 35, 3480, 1221, 0, -1221, -3480, -(R - 35)]) if ((prev - b) * (z - b) < 0 && t < TSTOP) e(t, b === 0 ? 'centre' : 'layer', { depth: Math.abs(b) }); prev = z; }
  e(TSTOP, 'stop'); e(st('L12') + .1, 'grab'); e(TMISS, 'slip');
  for (let n = 2; n <= 6; n++) { // each arrival during the fast ping-pong
    for (let t = TMISS; t < TOSC + .4; t += 1 / 120) if (simT(t) >= n * T1) { e(t, 'trip', { n }); break; }
  }
  e(st('L13') + .1, 'air'); e(TAIR0, 'pop'); e(st('L13') + 1.6, 'pin'); e(TAIR1, 'stuck');
  e(63.95, 'plane'); e(64.5, 'title');
  E.sort((a, b) => a.t - b.t); EVS = E;
}
export const events = () => EVS;
export const texts = () => [];

// ---------------- drawing helpers ----------------
function background(g) {
  g.fillStyle = BG; g.fillRect(0, 0, W, H);
  g.fillStyle = 'rgba(46,37,34,.07)';
  for (let y = 0, r = 0; y < H + 40; y += 30, r++) for (let x = (r % 2) * 26; x < W + 52; x += 52) { g.beginPath(); g.arc(x, y, 1.6, 0, TAU); g.fill(); }
}
function visZ(cam, x0, y0, x1, y1) { // z range of the column that can be on screen
  const m = 80, Smin = (x0 - cam.x) + (y0 - cam.y), Smax = (x1 - cam.x) + (y1 - cam.y);
  return [cam.z + Smin / 2 - (H / 2 + m) / cam.k, cam.z + Smax / 2 + (H / 2 + m) / cam.k];
}
const fmt = n => Math.round(n).toLocaleString('en-US');

function drawColumn(g, iso, cam, t, o) {
  const k = cam.k, gw = Math.max(GW_MIN, GW_PX / k), span = Math.min(CW, 3 * H / k), x0 = CW - span, y0 = CW - span;
  const [zlo, zhi] = visZ(cam, x0, y0, CW, CW);
  // soft shadow under the column (wide shots)
  if (k < .2) {
    const a = scr(cam, [x0, CW, -R]), b = scr(cam, [CW, CW, -R]), c = scr(cam, [CW, y0, -R]);
    g.save(); g.fillStyle = 'rgba(46,37,34,.16)'; g.filter = 'blur(18px)'; g.beginPath(); g.ellipse(b[0], b[1] + 70, (c[0] - a[0]) * .55, 34, 0, 0, TAU); g.fill(); g.restore();
  }
  for (const [zt, zb, name] of BANDS) {
    const a = Math.max(zb, zlo), b = Math.min(zt, zhi); if (b <= a) continue;
    const top = zt === R && b === zt ? { faceColor: [COL.ice] } : {};
    iso.box(x0, y0, a, CW - gw - x0, CW - y0, b - a, T3[name], { cull: false, ...top });
    iso.box(CW - gw, y0, a, gw, CW - gw - y0, b - a, T3[name], { cull: false, ...top });
  }
  iso.flush();
  // liquid shimmer on the outer core faces
  for (const [zt, zb, name] of BANDS) if (name === 'outer') {
    const a = Math.max(zb, zlo), b = Math.min(zt, zhi); if (b <= a) continue;
    for (let i = 1; i < 6; i++) {
      const zc = lerp(zb, zt, i / 6); if (zc < a || zc > b) continue;
      const amp = (zt - zb) * .025, ptsR = [], ptsL = [];
      for (let j = 0; j <= 24; j++) { const f = j / 24; const w = Math.sin(f * 9 + t * 1.6 + i * 2) * amp; ptsR.push([CW, lerp(y0, CW - gw, f), zc + w]); ptsL.push([lerp(x0, CW - gw, f), CW, zc + w]); }
      iso.line3(ptsR, mix(COL.outer, '#FFE6A8', .45), 3, { now: true, a: .8 }); iso.line3(ptsL, mix(COL.outer, '#FFE6A8', .55), 3, { now: true, a: .8 });
    }
  }
  // the shaft: two inner walls of the notch, darkened (tinted blue when it holds air)
  const air = o.air || 0, sv = o.skinGone ?? 1;
  if (sv > 0) for (const [zt, zb, name] of BANDS) {
    const a = Math.max(zb, zlo), b = Math.min(zt, zhi); if (b <= a) continue;
    let c1 = mix(COL[name], INK, .55), c2 = mix(COL[name], INK, .68);
    if (air) { c1 = mix(c1, COL.air, .55 * air); c2 = mix(c2, COL.air, .5 * air); }
    const q = (pts, c) => { g.beginPath(); pts.forEach((p, i) => { const s = scr(cam, p); i ? g.lineTo(s[0], s[1]) : g.moveTo(s[0], s[1]); }); g.closePath(); g.fillStyle = hex(c); g.fill(); };
    q([[CW - gw, CW - gw, a], [CW - gw, CW, a], [CW - gw, CW, b], [CW - gw, CW - gw, b]], c1);
    q([[CW - gw, CW - gw, a], [CW, CW - gw, a], [CW, CW - gw, b], [CW - gw, CW - gw, b]], c2);
  }
  // the skin over the shaft (before the cutaway): slides out along +x
  if (sv < 1) {
    const sl = eio(sv) * CW * 4.5, d0 = gw * .75;
    for (const [zt, zb, name] of BANDS) {
      const a = Math.max(zb, zlo), b = Math.min(zt === R ? R - d0 : zt, zhi); if (b <= a) continue;
      iso.box(CW - gw + sl, CW - gw, a, gw, gw, b - a, T3[name], { cull: false, faceColor: [zt === R && b === R - d0 ? mix(COL.crust, INK, .7) : undefined].map(c => c && hex(c)) });
    }
    iso.flush();
  }
  return gw;
}

function caption(g, t) {
  let cur = null;
  const ids = Object.keys(L);
  ids.forEach((id, i) => { const a = L[id].t0 - .05, nx = ids[i + 1] ? L[ids[i + 1]].t0 - .08 : DUR, b = Math.min(nx, L[id].t1 + 1.0); if (t >= a && t < b) cur = { ...L[id], a, b }; });
  if (!cur) return;
  const txt = cur.text.replace(/thirty-eight minutes/g, '38 minutes').replace(/twelve kilometers/, '12 kilometers').replace(/a tenth of one percent/, '0.1%')
    .replace(/three thousand kilometers/, '3,000 km').replace(/Thirteen minutes/, '13 minutes').replace(/six thousand degrees/, '6,000 °C')
    .replace(/twenty-eight thousand kilometers an hour/, '28,000 km/h').replace(/two hundred kilometers an hour/, '200 km/h').replace(/Thirty-eight minutes/, '38 minutes');
  g.save(); g.font = `500 46px Jost`;
  const words = txt.split(' '), rows = []; let line = '';
  for (const w of words) { const tst = line ? line + ' ' + w : w; if (g.measureText(tst).width > 880 && line) { rows.push(line); line = w; } else line = tst; }
  rows.push(line);
  const lh = 58, bw = Math.min(960, Math.max(...rows.map(r => g.measureText(r).width)) + 110), bh = rows.length * lh + 34, cx = W / 2, cy = 1515, x = cx - bw / 2, y = cy - bh / 2;
  const u = seg(t, cur.a, cur.a + .22), out = seg(t, cur.b - .14, cur.b);
  const yy = y + 14 * (1 - eo(u)) + 10 * out;
  g.globalAlpha = 1 - out;
  g.fillStyle = 'rgba(46,37,34,.14)'; rr(g, x + 5, yy + 7, bw, bh, 14); g.fill();
  g.fillStyle = PAPER; rr(g, x, yy, bw, bh, 14); g.fill();
  g.strokeStyle = INK; g.lineWidth = 2.5; rr(g, x, yy, bw, bh, 14); g.stroke();
  // legend chip
  chip(g, x + 34, yy + 34, 13, T3.sub);
  g.save(); g.beginPath(); g.rect(x, yy, 80 + (bw - 80) * eo(seg(t, cur.a + .05, cur.a + .4)), bh); g.clip();
  g.fillStyle = INK; g.textBaseline = 'middle'; g.textAlign = 'left';
  rows.forEach((r, i) => g.fillText(r, x + 66, yy + 17 + lh * (i + .5)));
  g.restore(); g.restore();
}
function rr(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
function chip(g, x, y, s, t3) { // tiny iso cube
  const c = C30 * s, h = s * .5;
  g.fillStyle = t3[1]; g.beginPath(); g.moveTo(x - c, y - h); g.lineTo(x, y); g.lineTo(x, y + s); g.lineTo(x - c, y + s - h); g.fill();
  g.fillStyle = t3[2]; g.beginPath(); g.moveTo(x + c, y - h); g.lineTo(x, y); g.lineTo(x, y + s); g.lineTo(x + c, y + s - h); g.fill();
  g.fillStyle = t3[0]; g.beginPath(); g.moveTo(x, y - s); g.lineTo(x + c, y - h); g.lineTo(x, y); g.lineTo(x - c, y - h); g.fill();
}

function gauges(g, t) {
  const vac = t >= FS - .3 && t < TOSC + .6, airRun = t >= TAIR0 - .6 && t < TAIR1 + 1.6;
  if (!vac && !airRun) return;
  const a0 = vac ? FS - .3 : TAIR0 - .6, a1 = vac ? TOSC + .6 : TAIR1 + 1.6;
  const inn = eo(seg(t, a0, a0 + .45)), out = ss(seg(t, a1 - .4, a1));
  const z = personZ(t), v = personV(t) * 3600, gg = gacc(z) / 9.82 * (Math.abs(z) < 1 ? 0 : 1);
  let time, speed, grav = (Math.abs(z) / R < .002 ? 0 : gacc(z) / 9.82).toFixed(2), gHi = false, sHi = false;
  if (vac) {
    const s = t < FS ? 0 : simT(t), mm = Math.floor(s / 60), ss_ = Math.floor(s % 60);
    time = `${mm}:${String(ss_).padStart(2, '0')}`; speed = v > 28000 ? '28,000+' : fmt(v); sHi = v > 28000 && t > st('L09') - .3 && t < en('L09');
    gHi = t > st('L06') && t < en('L06') + .4;
    if (t > TMISS) { time = `${Math.floor(simT(t) / T1)} × 38 min`; }
  } else {
    const u = seg(t, TAIR0, TAIR1); time = t < TAIR0 ? '0 h' : `${Math.floor(u * 32)} h`; speed = t < TAIR1 ? '200' : '0'; sHi = t > st('L13') + 1.5 && t < en('L13');
  }
  const cards = [['TIME', time, ''], ['SPEED', speed, 'KM/H'], ['GRAVITY', grav, 'g']];
  const cw = 316, gap = 16, x0 = (W - (3 * cw + 2 * gap)) / 2, y = 150 - 240 * (1 - inn) - 240 * out;
  cards.forEach(([ti, num, unit], i) => {
    const x = x0 + i * (cw + gap), hi = (i === 1 && sHi) || (i === 2 && gHi);
    g.save(); g.fillStyle = 'rgba(46,37,34,.14)'; rr(g, x + 4, y + 6, cw, 128, 14); g.fill();
    g.fillStyle = hi ? '#FFF1C9' : PAPER; rr(g, x, y, cw, 128, 14); g.fill(); g.strokeStyle = INK; g.lineWidth = 2.5; rr(g, x, y, cw, 128, 14); g.stroke();
    chip(g, x + 30, y + 30, 11, i === 0 ? T3.sub : i === 1 ? T3.mantle : T3.inner);
    g.fillStyle = INK; g.font = '600 24px Jost'; g.letterSpacing = '3px'; g.textBaseline = 'alphabetic'; g.fillText(ti, x + 54, y + 41);
    g.letterSpacing = '0px'; g.font = '500 48px Jost'; const nw = g.measureText(num).width; g.fillText(num, x + 24, y + 106);
    if (unit) { g.font = '500 24px Jost'; g.letterSpacing = '2px'; g.fillText(unit, x + 32 + nw, y + 106); }
    g.restore();
  });
}

// a person drawn at a fixed screen size
function drawPerson(g, sx, sy, px, o = {}) {
  g.save(); g.translate(sx, sy); if (o.rot) g.rotate(o.rot); g.scale(px / 3 * (o.sqx || 1), px / 3 * (o.sqy || 1));
  person(g, { h: 3, body: COL.sub, skin: '#D79B70', hair: '#3A2A26', arm: o.arm ?? .25, legs: '#2F3A4A' });
  if (o.arm2 !== undefined) { // second arm (reach / flail)
    const B = T3.sub; g.strokeStyle = B[1]; g.lineCap = 'round'; g.lineWidth = .27; const ax = -.36, ay = -1.8, al = 1.02, ex = ax + Math.sin(o.arm2) * al, ey = ay + Math.cos(o.arm2) * al;
    g.beginPath(); g.moveTo(ax, ay); g.lineTo(ex, ey); g.stroke(); g.beginPath(); g.arc(ex, ey, .15, 0, TAU); g.fillStyle = '#D79B70'; g.fill();
  }
  g.restore();
}
function streaks(g, sx, sy, v, dir, t) { // speed lines behind a falling person
  const n = Math.min(7, Math.floor(v / 1.2) + 2), len = clamp(v / 10, .15, 1) * 190;
  g.save(); g.strokeStyle = INK; g.lineWidth = 3; g.lineCap = 'round'; g.globalAlpha = .55;
  for (let i = 0; i < n; i++) { const ox = (hash(i * 7.1) - .5) * 120, ph = (t * 6 + hash(i * 3.3)) % 1, y0 = sy - dir * (90 + ph * 60); g.beginPath(); g.moveTo(sx + ox, y0); g.lineTo(sx + ox, y0 - dir * len * (.6 + hash(i) * .4)); g.stroke(); }
  g.restore();
}
function topDetails(iso, cam, gw, t) { // north-pole ice details, only at close range
  const k = cam.k; if (k < 2000) return;
  const a = clamp((Math.log(k) - Math.log(2000)) / (Math.log(20000) - Math.log(2000)));
  const g = iso.g;
  // ice ridges (flat decals) and a striped pole marker
  for (let i = 0; i < 9; i++) {
    const x = CW - gw - .002 - hash(i) * .02, y = CW - gw * .5 - .01 + hash(i + 9) * .02, w = .002 + hash(i + 3) * .004;
    iso.flat([[x, y, 0], [x + w, y - w * .3, 0], [x + w * .8, y + w * .5, 0]], R, mix(COL.ice, '#C9DCE0', .8 * a));
  }
  const px = CW - gw - .0045, py = CW - gw - .0035;
  for (let i = 0; i < 6; i++) iso.cyl(px, py, R + i * .00025, .00011, .00025, tri(i % 2 ? '#F6F1E8' : '#CF5140'), { n: 12 });
  iso.cone(px, py, R + .0015, .00016, .0002, tri('#E9BE5C'), { n: 10 });
  iso.flush();
  const s = scr(cam, [px, py, R + .00175]);
  if (a > .3) haloText(g, 'N', s[0], s[1] - 18, { font: '700 30px Jost', align: 'center' });
}

// ---------------- render ----------------
export function render(g, t) {
  background(g);
  const cam = camera(t), iso = new Iso(g, W, H); iso.cam = cam;
  const skin = seg(t, 13.95, 14.65), air = t > st('L13') ? ss(seg(t, st('L13') + .1, st('L13') + .9)) : 0;
  const gw = drawColumn(g, iso, cam, t, { skinGone: t < 12 ? 0 : skin, air });
  topDetails(iso, cam, gw, t);
  const k = cam.k, sc = p => scr(cam, p);

  // Kola borehole: a hair line down the right face, at a fixed screen offset from the corner
  if (t > 6.6 && t < 13.6) {
    const d = 95 / k, y = CW - gw - d, draw = eio(seg(t, 7.3, 8.9)), fade = 1 - seg(t, 12.9, 13.5);
    const p0 = sc([CW, y, R]), p1 = sc([CW, y, R - 12.262 * draw]);
    g.save(); g.globalAlpha = fade; g.strokeStyle = INK; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); g.moveTo(p0[0], p0[1]); g.lineTo(p1[0], p1[1]); g.stroke();
    // derrick
    g.fillStyle = INK; g.beginPath(); g.moveTo(p0[0] - 16, p0[1]); g.lineTo(p0[0], p0[1] - 52); g.lineTo(p0[0] + 16, p0[1]); g.closePath(); g.lineWidth = 3; g.stroke();
    g.beginPath(); g.moveTo(p0[0] - 10, p0[1] - 17); g.lineTo(p0[0] + 10, p0[1] - 17); g.moveTo(p0[0] - 6, p0[1] - 33); g.lineTo(p0[0] + 6, p0[1] - 33); g.stroke();
    g.restore();
    const bot = [CW, y, R - 12.262];
    pin(iso, ...bot, { title: 'DEEPEST HOLE EVER DUG', num: '12.3', unit: 'KM', dir: 1, up: -130, len: 46, a: seg(t, 8.95, 10.3) * fade, ns: 56, ts: 26 });
    const pp = sc(bot);
    if (t > 10.9) { const a = seg(t, 10.9, 12.0) * fade; ring(g, pp[0], pp[1] - 4, 40, a, t); pin(iso, ...bot, { title: 'OF THE WAY THROUGH', num: '0.1%', dir: -1, up: 150, len: 40, a, ns: 64, ts: 26 }); }
  }
  // the cutaway: cut line down the corner edge
  if (t > 12.7 && t < 14.4) {
    const a = eio(seg(t, 12.9, 13.95)), pts = [sc([CW - gw * .5, CW - gw * .5 + gw * .5, R]), sc([CW, CW, R]), sc([CW, CW, -R])];
    cutLine(g, pts, a, { lw: 3 });
  }
  // pole labels + vacuum tag
  if (t > 14.3 && t < 16.3) {
    const fo = 1 - seg(t, 15.9, 16.25);
    pin(iso, CW, CW, R, { title: 'NORTH POLE', dir: 1, up: 60, len: 60, a: seg(t, 14.45, 15.4), fade: fo });
    pin(iso, CW, CW, -R, { title: 'SOUTH POLE', dir: 1, up: -40, len: 60, a: seg(t, 14.75, 15.7), fade: fo });
    pin(iso, CW - gw * .5, CW - gw * .5, 2400, { title: 'NO AIR INSIDE', num: 'VACUUM', dir: -1, up: 0, len: 160, a: seg(t, 15.25, 16), fade: fo, ns: 46 });
  }

  // ----- layer pins during the fall -----
  const pz = personZ(t);
  const layerPin = (t0, t1, title, num, unit, zA, zB) => {
    if (t < t0 || t > t1 + .3) return;
    const z = clamp(pz + 600, zB, zA), a = seg(t, t0, t0 + 1), fo = 1 - seg(t, t1, t1 + .3);
    const gw = Math.max(GW_MIN, GW_PX / k); pin(iso, CW - gw - 70 / k, CW, z, { title, num, unit, dir: -1, up: 70, len: 30, a, fade: fo, ns: 46 });
  };
  layerPin(st('L05') + .2, en('L06'), 'MANTLE', '2,900', 'KM HOT ROCK', 3480 + 2600, 3480 + 200);
  layerPin(st('L07') + 1.2, en('L07') + .6, 'OUTER CORE', 'LIQUID', 'IRON', 3400, 1300);
  layerPin(st('L08'), en('L08') + .4, 'INNER CORE', 'SOLID', 'IRON', 1200, 200);

  // ----- the person -----
  const pxH = Math.max(PH_PX, .0018 * k);
  let ps = null;
  if (t < FS + .05) { // standing on the lip, then the jump
    const stand = sc([CW - gw, CW - gw * .5, R]); stand[0] -= pxH * .42;
    const shaftTop = sc([CW - gw * .5, CW - gw * .5, R]);
    const crouch = seg(t, 16.55, 16.82), leap = seg(t, 16.82, FS + .05);
    let x = stand[0], y = stand[1], sqy = 1 - .2 * Math.sin(Math.PI * crouch) * (leap > 0 ? 0 : 1), sqx = 1 + .12 * Math.sin(Math.PI * crouch) * (leap > 0 ? 0 : 1);
    if (leap > 0) { x = lerp(stand[0], shaftTop[0], leap); y = lerp(stand[1], shaftTop[1] + pxH * .5, leap) - Math.sin(Math.PI * leap) * pxH * .55; }
    const look = t > 1.2 && t < 4.5 ? .25 + .2 * Math.sin(t * 2) : .25;
    drawPerson(g, x, y, pxH, { sqx, sqy, arm: leap > 0 ? 2.6 : look, arm2: leap > 0 ? -2.6 : undefined });
    ps = [x, y - pxH * .5];
    if (t < 5.8) ring(g, ps[0], ps[1], pxH * .75, seg(t, .6, 1.6) * (1 - seg(t, 5.2, 5.8)), t, 'YOU', { ang: -2.4 });
    if (t > 4.2 && t < 6) pin(iso, CW - gw * .5, CW - gw * .5, R, { title: 'OTHER SIDE IN', num: '38', unit: 'MIN', dir: 1, up: -260, len: 50, a: seg(t, 4.35, 5.3), fade: 1 - seg(t, 5.5, 6), ns: 72 });
  } else if (t < TOSC + .4 || t >= TAIR0) {
    const pop = t >= TAIR0 ? back(seg(t, TAIR0, TAIR0 + .35), 2) : 1;
    const p = sc([CW - gw * .5, CW - gw * .5, pz]), v = personV(t), down = (t < TOSC + .4 ? (Math.floor(simT(t) / T1) % 2 === 0 ? 1 : -1) : 1);
    let rot = 0, arm = 2.7, arm2 = -2.7;
    const centre = t > en('L08') && t < en('L09') + .3;
    if (centre) { rot = (t - en('L08')) * .9; arm = 2 + Math.sin(t * 2) * .5; arm2 = -2 - Math.sin(t * 2.3) * .5; }
    if (t > TSTOP - .05 && t < TMISS) { rot = Math.PI; const reach = seg(t, st('L12'), st('L12') + .35); arm = lerp(2.7, 3.05, reach); arm2 = lerp(-2.7, -1.6, reach); }
    if (t >= TAIR0) { arm = 2.2 + Math.sin(t * 3) * .2; arm2 = -2.2; rot = t > TAIR1 ? Math.sin(t * .8) * .3 : 0; }
    if (down < 0 && t < TOSC) rot = Math.PI;
    const yy = p[1] + pxH * .5 * Math.cos(rot);
    if (v > .3 && !centre && t < TOSC) streaks(g, p[0], p[1], v, down, t);
    if (pop > 0.01) drawPerson(g, p[0], yy, pxH * pop, { rot, arm, arm2 });
    ps = p;
  }
  // centre: ring + tags
  if (t > en('L08') && t < en('L09') + .5 && ps) {
    const a = seg(t, en('L08') + .1, en('L08') + .8) * (1 - seg(t, en('L09'), en('L09') + .5));
    ring(g, ps[0], ps[1], pxH * .9, a, t, 'CENTER · 6,371 KM DOWN', { ang: -.6, ts: 28 });
    pin(iso, CW, CW, 0, { title: 'YOU WEIGH', num: 'NOTHING', dir: -1, up: -330, len: 50, a: seg(t, st('L09') + 3.6, st('L09') + 4.6) * (1 - seg(t, en('L09'), en('L09') + .4)), ns: 60 });
  }
  // heat inset
  if (t > st('L08') - .2 && t < en('L08') + .6 && ps) {
    const a = seg(t, st('L08'), st('L08') + .8) * (1 - seg(t, en('L08') + .2, en('L08') + .6));
    inset(iso, ps[0] + 40, ps[1], 800, 1080, 170, a, (g2, cx, cy, r) => {
      g2.fillStyle = '#FFE7B0'; g2.fillRect(cx - r, cy - r, 2 * r, 2 * r);
      const heat = Math.round(6000 * eo(seg(t, st('L08') + .3, st('L08') + 2.2)) / 100) * 100;
      haloText(g2, `${fmt(heat)} °C`, cx, cy - 18, { font: '500 58px Jost', align: 'center' });
      haloText(g2, 'NEAR THE CENTER', cx, cy + 20, { font: '600 21px Jost', align: 'center', track: 2 });
      if (t > st('L08') + 2.4) { const b = seg(t, st('L08') + 2.4, st('L08') + 3); g2.save(); g2.globalAlpha = b; PAL && 0; drawSun(g2, cx - 62, cy + 78, 46); haloText(g2, '≈ SUN\'S SURFACE', cx + 24, cy + 88, { font: '600 21px Jost', align: 'center', track: 1 }); g2.restore(); }
    }, { bg: '#FFE7B0' });
  }
  // far side
  if (t > TSTOP - .3 && t < TMISS + .4) {
    const a = seg(t, TSTOP - .1, TSTOP + .8) * (1 - seg(t, TMISS, TMISS + .4));
    pin(iso, CW, CW, -R, { title: 'SOUTH POLE · YOU STOP', num: '38', unit: 'MIN', dir: 1, up: 330, len: 60, a, ns: 64 });
  }
  // ping-pong route
  if (t > TMISS + .2 && t < TOSC + 1) {
    const a = seg(t, TMISS + .2, TMISS + .9) * (1 - seg(t, TOSC + .4, TOSC + 1));
    const top = sc([CW + 260 / k * 0 + 0, CW, R]), bot = sc([CW, CW, -R]);
    g.save(); g.globalAlpha = a; g.strokeStyle = INK; g.lineWidth = 3; g.setLineDash([12, 9]); g.lineDashOffset = -t * 60;
    const ox = 74; g.beginPath(); g.moveTo(top[0] + ox, top[1]); g.lineTo(bot[0] + ox, bot[1]); g.stroke(); g.lineDashOffset = t * 60; g.beginPath(); g.moveTo(bot[0] + ox + 22, bot[1]); g.lineTo(top[0] + ox + 22, top[1]); g.stroke(); g.setLineDash([]);
    haloText(g, 'FOREVER', top[0] + ox + 44, (top[1] + bot[1]) / 2, { font: '600 34px Jost', track: 4 });
    g.restore();
  }
  // air: top-speed bars card
  if (t > st('L13') + 1.3 && t < en('L13') + .9) {
    const a = eo(seg(t, st('L13') + 1.4, st('L13') + 2)), fo = 1 - seg(t, en('L13') + .5, en('L13') + .9);
    const x = 90, y = 1060, w = 900;
    g.save(); g.globalAlpha = fo; g.fillStyle = PAPER; rr(g, x, y + 30 * (1 - a), w, 210, 16); g.fill(); g.strokeStyle = INK; g.lineWidth = 2.5; g.stroke();
    const yy = y + 30 * (1 - a);
    g.fillStyle = INK; g.font = '600 24px Jost'; g.letterSpacing = '3px'; g.fillText('TOP SPEED', x + 30, yy + 44); g.letterSpacing = '0px';
    const bar = (row, label, frac, col, val) => { const by = yy + 74 + row * 64; g.fillStyle = INK; g.font = '500 26px Jost'; g.fillText(label, x + 30, by + 30); g.fillStyle = col; g.fillRect(x + 190, by + 6, Math.max(4, 470 * frac * eo(seg(t, st('L13') + 1.8 + row * .4, st('L13') + 2.6 + row * .4))), 34); g.fillStyle = INK; g.font = '500 30px Jost'; g.fillText(val, x + 190 + Math.max(4, 470 * frac) + 14, by + 34); };
    bar(0, 'VACUUM', 1, COL.mantle, '28,000+'); bar(1, 'WITH AIR', 200 / 28000, COL.air, '200 km/h');
    g.restore();
  }
  // stuck at the centre
  if (t > TAIR1 - .2 && t < DUR && ps) {
    const a = seg(t, TAIR1, TAIR1 + .7);
    ring(g, ps[0], ps[1], Math.max(36, pxH * .8), a * (t > 63.8 ? 1 - seg(t, 63.8, 64.3) * .0 : 1), t, t < 63.7 ? 'STUCK · 0 g' : 'YOU', { ang: -.7, ts: 30 });
  }
  // plane route + end card
  if (t > 63.7) {
    const a = seg(t, 63.8, 65.4), top = sc([CW * .5, CW * .5, R + 300]), bot = sc([CW, CW, -R - 300]);
    const P = u => { const cx = 990, x = lerp(top[0], bot[0], u) + Math.sin(Math.PI * u) * (cx - (top[0] + bot[0]) / 2) * 1.0, y = lerp(top[1] - 30, bot[1] + 40, u); return [x, y]; };
    g.save(); g.strokeStyle = INK; g.lineWidth = 3; g.setLineDash([10, 9]); g.beginPath(); for (let i = 0; i <= 40 * a; i++) { const q = P(i / 40); i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]); } g.stroke(); g.setLineDash([]);
    if (a > 0 && a < 1) { const q = P(a), q2 = P(Math.min(1, a + .01)); drawPlane(g, q[0], q[1], Math.atan2(q2[1] - q[1], q2[0] - q[0])); }
    if (a >= 1) { const q = P(1); drawPlane(g, q[0], q[1], Math.PI); }
    g.restore();
    const e = eo(seg(t, 64.4, 65.0));
    g.save(); g.globalAlpha = e; g.translate(0, 20 * (1 - e));
    g.fillStyle = INK; g.textAlign = 'center'; g.font = '600 34px Jost'; g.letterSpacing = '8px'; g.fillText('WHAT IF', W / 2, 150);
    g.letterSpacing = '3px'; g.font = '600 62px Jost'; g.fillText('YOU FELL THROUGH', W / 2, 228); g.fillText('THE EARTH?', W / 2, 298);
    g.font = '500 24px Jost'; g.letterSpacing = '3px'; g.fillText('NOT TO SCALE · FALL TIME: KLOTZ 2015, AM. J. PHYS.', W / 2, 1800);
    g.restore();
  }
  gauges(g, t);
  caption(g, t);
}
function drawSun(g, x, y, s) { g.save(); g.translate(x, y); g.strokeStyle = '#D9A53A'; g.lineWidth = s * .09; g.lineCap = 'round'; for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; g.beginPath(); g.moveTo(Math.cos(a) * s * .38, Math.sin(a) * s * .38); g.lineTo(Math.cos(a) * s * .52, Math.sin(a) * s * .52); g.stroke(); } g.beginPath(); g.arc(0, 0, s * .28, 0, TAU); g.fillStyle = '#E9BE5C'; g.fill(); g.restore(); }
function drawPlane(g, x, y, ang) {
  g.save(); g.translate(x, y); g.rotate(ang); const t3 = tri('#5A9BCB');
  g.fillStyle = t3[1]; g.beginPath(); g.ellipse(0, 0, 42, 10, 0, 0, TAU); g.fill();
  g.fillStyle = t3[2]; g.beginPath(); g.moveTo(-4, 0); g.lineTo(-18, 34); g.lineTo(-6, 34); g.lineTo(12, 0); g.fill();
  g.fillStyle = t3[0]; g.beginPath(); g.moveTo(-4, 0); g.lineTo(-18, -30); g.lineTo(-8, -30); g.lineTo(12, 0); g.fill();
  g.fillStyle = t3[2]; g.beginPath(); g.moveTo(-38, 0); g.lineTo(-48, -16); g.lineTo(-40, -16); g.lineTo(-30, 0); g.fill();
  g.restore();
}
