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
