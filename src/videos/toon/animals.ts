// Toon engine animals: front-view cards in the plum-ink style (600 x 1000 design, soles at 975 unless noted).
import { Pen, INK } from "./toon";

const eyes = (p: Pen, cx: number, ey: number, dx: number, shock: boolean, lid: number, r = 11) => {
  for (const s of [-1, 1]) {
    if (lid > 0.6) p.stroke([[cx + s * dx - 16, ey], [cx + s * dx + 16, ey]], 8);
    else { if (shock) p.ell(cx + s * dx, ey, r * 2.1, r * 2.1, "#ffffff", 7); p.dot(cx + s * dx, ey, shock ? r * 0.8 : r); }
  }
};
/** polar bear */
export const bear = (p: Pen, shock: boolean, lid = 0) => {
  const W = "#f7f3ea", Sh = "#d9dce6";
  p.ell(300, 700, 210, 250, W, 12); p.ell(300, 760, 120, 150, Sh, 0);
  for (const s of [-1, 1]) { p.ell(300 + s * 120, 940, 70, 40, W, 12); p.ell(300 + s * 190, 640, 50, 120, W, 12); }
  p.ell(300, 380, 150, 135, W, 12);
  for (const s of [-1, 1]) { p.ell(300 + s * 105, 270, 38, 34, W, 12); p.ell(300 + s * 105, 272, 18, 16, Sh, 0); }
  p.ell(300, 430, 70, 52, "#efe8dc", 10); p.ell(300, 408, 26, 18, INK, 0);
  eyes(p, 300, 352, 70, shock, lid);
  if (shock) p.ell(300, 465, 22, 28, "#5a1e28", 8); else p.arc(300, 448, 26, 14, 20, 160, 7);
};
/** penguin */
export const penguin = (p: Pen, shock: boolean, lid = 0, flap = 0) => {
  p.ell(300, 640, 170, 300, "#2b2f3c", 12);
  p.ell(300, 690, 120, 230, "#fbf8f1", 0);
  for (const s of [-1, 1]) {
    const a = s * (0.25 + 0.6 * flap);
    p.poly([[300 + s * 150, 520], [300 + s * (175 + 140 * Math.sin(Math.abs(a))), 520 + 260 * Math.cos(a)], [300 + s * 175, 520]], "#2b2f3c", 10);
    p.ell(300 + s * 70, 950, 60, 24, "#f2a03a", 10);
  }
  eyes(p, 300, 470, 55, shock, lid, 12);
  p.poly([[270, 520], [330, 520], [300, 575]], "#f2a03a", 9);
};
/** fish (400 x 240), facing right */
export const fish = (p: Pen, col = "#f08a2c", tail = 0) => {
  p.poly([[110, 120], [20, 50 + tail * 20], [40, 120], [20, 190 - tail * 20]], col, 10);
  p.ell(220, 120, 130, 80, col, 10);
  p.ell(300, 100, 18, 18, "#ffffff", 6); p.dot(304, 100, 9);
  p.arc(330, 140, 20, 10, 20, 150, 6);
};
/** hourglass (300 x 400), u = sand fallen 0..1 */
export const hourglass = (p: Pen, u: number) => {
  p.poly([[60, 30], [240, 30], [240, 60], [60, 60]], "#b0703f", 10);
  p.poly([[60, 340], [240, 340], [240, 370], [60, 370]], "#b0703f", 10);
  p.poly([[80, 60], [220, 60], [160, 200], [220, 340], [80, 340], [140, 200]], "#e8f4ff", 10);
  const top = 60 + 120 * u, bot = 340 - 120 * u;
  p.poly([[80 + (top - 60) * 0.43, top], [220 - (top - 60) * 0.43, top], [160, 195], [140, 195]], "#f2c230", 0);
  p.poly([[80, 340], [220, 340], [220 - (340 - bot) * 0.0, bot], [80, bot]], "#f2c230", 0);
};
/** shrimp (400 x 300), facing right; shades = party sunglasses; k = wiggle phase */
export const shrimp = (p: Pen, shades = false, k = 0) => {
  const segs = 6;
  for (let i = segs - 1; i >= 0; i--) {
    const a = Math.PI * 0.95 - (i / segs) * Math.PI * 0.85, r = 110, x = 200 + r * Math.cos(a) * 0.9, y = 170 - r * Math.sin(a) * 0.7 + Math.sin(k + i) * 4;
    p.ell(x, y, 34 - i * 2.5, 30 - i * 2, "#f28a7a", 8);
  }
  p.poly([[60, 175], [20, 140 + Math.sin(k) * 10], [30, 205]], "#f28a7a", 8);
  for (let i = 0; i < 4; i++) p.stroke([[150 + i * 25, 215], [140 + i * 25, 255]], 6);
  p.stroke([[300, 110], [370, 40 + Math.sin(k) * 10]], 5); p.stroke([[300, 115], [380, 70 + Math.sin(k + 1) * 10]], 5);
  if (shades) { // owner #4: real glasses: two framed round lenses over the eye, a bridge, an arm back to the head, lens shine
    p.stroke([[230, 112], [262, 104]], 6);
    p.ell(280, 106, 22, 19, "#2b2f4a", 7); p.ell(322, 102, 19, 17, "#2b2f4a", 7); p.stroke([[300, 104], [304, 103]], 6);
    p.ell(273, 99, 7, 5, "#cfe6ff", 0); p.ell(316, 96, 6, 4, "#cfe6ff", 0);
  }
  else { p.ell(290, 108, 13, 13, "#ffffff", 6); p.dot(292, 108, 7); }
};
/** crab (400 x 300), front view; sad = drooping eyes and mouth */
export const crab = (p: Pen, sad = false, k = 0) => {
  for (const s of [-1, 1]) {
    for (let i = 0; i < 3; i++) p.stroke([[200 + s * 80, 200 + i * 15], [200 + s * (150 + i * 12), 250 + i * 12]], 9, "#c8452e");
    const cx = 200 + s * (150 + 10 * Math.sin(k)), cy = 110;
    p.stroke([[200 + s * 90, 170], [cx, cy + 40]], 12, "#c8452e");
    p.ell(cx, cy, 42, 34, "#e2553a", 9); p.poly([[cx - s * 10, cy - 30], [cx + s * 40, cy - 46], [cx + s * 20, cy - 4]], "#ffffff", 0);
  }
  p.ell(200, 200, 110, 70, "#e2553a", 10);
  for (const s of [-1, 1]) { p.stroke([[200 + s * 30, 140], [200 + s * 36, 95]], 7); p.ell(200 + s * 36, 88, 16, 16, "#ffffff", 6); p.dot(200 + s * 36, sad ? 94 : 88, 7); }
  if (sad) p.arc(200, 235, 30, 14, 200, 340, 7); else p.arc(200, 215, 30, 16, 20, 160, 7);
};
/** sleeping cat curled up (400 x 260) */
export const cat = (p: Pen, col = "#e8964a", zz = 0) => {
  // owner #4: a detailed, cute sleeping cat (400 x 260): curled body, tail wrapped round, tabby stripes, tucked paws,
  // pink inner ears + nose, closed smiling eyes with lashes, whiskers, a slow breathing swell
  const br = 1 + 0.03 * Math.sin(zz * Math.PI * 2), dark = "#b8682a", pink = "#f2a0a8", cream = "#fbe3c4";
  p.poly([[70, 205], [40, 190], [36, 160], [60, 150], [70, 175], [110, 200]], col, 9);                       // tail tip curling round
  p.ell(190, 175, 140 * br, 70 * br, col, 10);                                                             // body
  p.ell(200, 200, 95, 30, cream, 0);                                                                         // pale belly fur
  for (let i = 0; i < 4; i++) p.stroke([[110 + i * 36, 112], [122 + i * 36, 140], [116 + i * 36, 160]], 7, dark); // tabby stripes
  p.ell(110, 228, 40, 18, col, 8); p.ell(70, 222, 30, 14, col, 8);                                          // tail along the front
  p.ell(255, 228, 26, 16, cream, 7); p.ell(300, 228, 26, 16, cream, 7);                                      // tucked paws
  p.ell(300, 160, 64, 54, col, 10);                                                                          // head resting on the paws
  p.poly([[255, 125], [262, 70], [292, 112]], col, 8); p.poly([[315, 112], [342, 70], [350, 124]], col, 8);   // ears
  p.poly([[264, 115], [266, 88], [283, 110]], pink, 0); p.poly([[322, 110], [338, 88], [342, 118]], pink, 0);
  p.stroke([[290, 112], [296, 128]], 5, dark); p.stroke([[306, 110], [304, 128]], 5, dark);                  // forehead stripes
  p.ell(300, 180, 30, 20, cream, 0);                                                                         // muzzle
  p.arc(278, 158, 13, 8, 20, 160, 5); p.arc(322, 158, 13, 8, 20, 160, 5);                                    // closed, smiling eyes
  for (const [x, s2] of [[266, -1], [334, 1]] as const) p.stroke([[x, 160], [x + s2 * 8, 152]], 3);          // lashes
  p.poly([[294, 174], [306, 174], [300, 182]], pink, 4);                                                     // nose
  p.arc(294, 186, 6, 5, 10, 170, 3); p.arc(306, 186, 6, 5, 10, 170, 3);                                      // little w mouth
  for (const s2 of [-1, 1]) for (const dy of [-4, 6]) p.stroke([[300 + s2 * 22, 182 + dy * 0.4], [300 + s2 * 62, 176 + dy]], 2.5);
  if (zz > 0) { p.g.fillStyle = "#3a2a4a"; p.g.font = `bold ${26 + 10 * zz}px sans-serif`; p.g.fillText("z", 350, 70 - zz * 30); p.g.font = "bold 22px sans-serif"; p.g.fillText("z", 372, 40 - zz * 20); }
};
/** seagull (400 x 260), side view; slip = 0..1 tilting */
export const gull = (p: Pen, slip = 0) => {
  p.g.save(); p.g.translate(200, 200); p.g.rotate(-slip * 0.6); p.g.translate(-200, -200);
  p.ell(200, 160, 110, 60, "#ffffff", 10);
  p.poly([[180, 140], [60, 60 + slip * 60], [230, 130]], "#d9dde6", 9);
  p.ell(300, 120, 40, 36, "#ffffff", 9);
  p.poly([[335, 118], [385, 128], [335, 135]], "#f2c230", 7);
  p.dot(310, 112, 7);
  p.stroke([[190, 215], [185, 250]], 6, "#f2a03a"); p.stroke([[225, 215], [230, 250]], 6, "#f2a03a");
  p.g.restore();
};
/** spirit level (400 x 120) with the bubble at u (0 = centre, ±1 = ends) */
export const levelCard = (p: Pen, u: number) => {
  p.poly([[10, 20], [390, 20], [390, 100], [10, 100]], "#f2c230", 10);
  p.poly([[140, 40], [260, 40], [260, 80], [140, 80]], "#bff0a8", 8);
  p.stroke([[185, 40], [185, 80]], 4); p.stroke([[215, 40], [215, 80]], 4);
  p.ell(200 + 50 * Math.max(-1.6, Math.min(1.6, u)), 60, 16, 12, "#ffffff", 5);
};
/** emu (400 x 600, feet at y 590): phase = running leg cycle (-1 = standing), shock, hat = the major's cap, look = head turn -1..1 */
export const emu = (p: Pen, phase = -1, shock = false, hat = false, look = 0) => {
  const run = phase >= 0, a = phase * Math.PI * 2;
  const legs: [number, number][] = run ? [[Math.sin(a) * 60, Math.max(0, Math.cos(a)) * 40], [Math.sin(a + Math.PI) * 60, Math.max(0, Math.cos(a + Math.PI)) * 40]] : [[-25, 0], [25, 0]];
  for (const [dx, lift] of legs) { p.stroke([[200, 380], [200 + dx * 0.5, 470], [200 + dx, 585 - lift]], 12, "#6e5a4a"); p.stroke([[200 + dx - 20, 585 - lift], [200 + dx + 25, 585 - lift]], 10, "#6e5a4a"); }
  p.ell(200, 330, 130, 95, "#7a6a5c", 12);
  for (let i = 0; i < 9; i++) p.stroke([[100 + i * 22, 300 + (i % 2) * 10], [95 + i * 22, 350 + (i % 3) * 10]], 7, "#5d4f43");
  const hx = 250 + look * 40, hy = 90;
  p.line([[230, 270], [240, 180], [hx, hy + 30]], "#8a7a6c", 34);
  p.ell(hx, hy, 42, 38, "#8a7a6c", 10);
  p.poly([[hx + 30 * Math.sign(look || 1), hy + 5], [hx + 80 * Math.sign(look || 1), hy + 14], [hx + 30 * Math.sign(look || 1), hy + 24]], "#3a2f28", 7);
  p.ell(hx + 10, hy - 6, shock ? 16 : 11, shock ? 16 : 11, "#ffffff", 6); p.dot(hx + 12, hy - 6, shock ? 7 : 8, "#c0353a");
  if (hat) { p.ell(hx, hy - 34, 56, 12, "#7a6a3a", 8); p.poly([[hx - 34, hy - 36], [hx - 26, hy - 70], [hx + 26, hy - 70], [hx + 34, hy - 36]], "#8a7a4a", 8); p.stroke([[hx - 30, hy - 44], [hx + 30, hy - 44]], 6, "#3a2f28"); }
};
