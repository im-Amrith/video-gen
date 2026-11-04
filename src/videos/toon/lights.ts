// Light presets per time of day. The sun is CAMERA-RELATIVE and frozen per shot (world.ts update()):
// az = degrees from the shot camera's forward axis (0 = sun straight ahead = backlight, +90 = screen right,
// 180 = behind camera), el = elevation. lit/shade/lift are LINEAR RGB multipliers for shade.ts (may exceed 1).
// Field names follow lighting.md 9.1 exactly (the CHAR and POST agents read them); values are tuned on renders.
type C3 = [number, number, number];
export type LightPreset = {
  az: number; el: number;
  lit: C3; shade: C3; lift: C3; lambert: number; sideK: number; term: number;      // world two-tone (shade.ts)
  charTint: C3; charShade: number; charGrad: number; bodyGrad: number; sideTint: C3; // character cards (cast.ts)
  blob: C3; actorShadow: boolean;                                                    // contact blobs / card shadows
  top: string; hor: string; skyCurve: C3; fog: string; fogNear: number; fogFar: number; sunDisc: string; // depth.md 6.5
  sunCol: string; sunI: number; sky: string; ground: string; hemiI: number;         // three lights (unpatched mats only)
  bias: number; normalBias: number;
};
export type LightName = "day" | "golden" | "night" | "space" | "magma";
export const LIGHTS: Record<LightName, LightPreset> = {
  day: {
    az: 75, el: 48,
    lit: [1.58, 1.5, 1.33], shade: [0.3, 0.29, 0.36], lift: [0.05, 0.06, 0.11], lambert: 0.35, sideK: 0.84, term: 0.2,
    charTint: [1.0, 0.94, 0.92], charShade: 0.86, charGrad: 0.07, bodyGrad: 0.2, sideTint: [0.92, 0.90, 0.96],
    blob: [0.62, 0.58, 0.58], actorShadow: false,
    top: "#3e7fd2", hor: "#b8d0ec", skyCurve: [0.0, 0.5, 0.6], fog: "#b8d0ec", fogNear: 25, fogFar: 300, sunDisc: "#000000",
    sunCol: "#fff3e0", sunI: 2.8, sky: "#dcecff", ground: "#b49a78", hemiI: 0.55,
    bias: -0.00025, normalBias: 0.015,
  },
  golden: {
    az: 6, el: 7,
    lit: [1.5, 0.68, 0.24], shade: [0.15, 0.15, 0.3], lift: [0.04, 0.06, 0.17], lambert: 0.35, sideK: 0.82, term: 0.07,
    charTint: [1.0, 0.78, 0.56], charShade: 0.88, charGrad: 0.1, bodyGrad: 0.25, sideTint: [0.85, 0.80, 0.95],
    blob: [0.75, 0.74, 0.9], actorShadow: true,
    top: "#6a4f8c", hor: "#ffd08a", skyCurve: [0.05, 0.6, 1.0], fog: "#efb489", fogNear: 50, fogFar: 380, sunDisc: "#ffcf9e",
    sunCol: "#ffab5e", sunI: 5.5, sky: "#d8b0b8", ground: "#8a6a60", hemiI: 0.5,
    bias: -0.0006, normalBias: 0.03,
  },
  // engine presets (toon engine, 2026-11-04): moonlit night, open space, glowing underground
  night: {
    az: 60, el: 35,
    lit: [0.62, 0.78, 1.25], shade: [0.1, 0.11, 0.24], lift: [0.03, 0.04, 0.1], lambert: 0.35, sideK: 0.84, term: 0.2,
    charTint: [0.66, 0.74, 0.98], charShade: 0.8, charGrad: 0.1, bodyGrad: 0.25, sideTint: [0.8, 0.84, 1.0],
    blob: [0.5, 0.5, 0.62], actorShadow: false,
    top: "#0b1433", hor: "#2b3f74", skyCurve: [0.0, 0.5, 0.6], fog: "#22335f", fogNear: 30, fogFar: 340, sunDisc: "#000000",
    sunCol: "#bcd0ff", sunI: 1.4, sky: "#3a4a80", ground: "#202436", hemiI: 0.35,
    bias: -0.00025, normalBias: 0.015,
  },
  space: {
    az: 80, el: 25,
    lit: [1.75, 1.66, 1.5], shade: [0.09, 0.1, 0.2], lift: [0.02, 0.03, 0.08], lambert: 0.45, sideK: 0.84, term: 0.12,
    charTint: [1.0, 0.97, 0.94], charShade: 0.82, charGrad: 0.12, bodyGrad: 0.28, sideTint: [0.85, 0.85, 1.0],
    blob: [0.4, 0.4, 0.5], actorShadow: false,
    top: "#05060f", hor: "#0d1230", skyCurve: [0.0, 0.5, 0.6], fog: "#0d1230", fogNear: 4000, fogFar: 9000, sunDisc: "#fff2d8",
    sunCol: "#fff6e8", sunI: 3.0, sky: "#2a3060", ground: "#0a0a14", hemiI: 0.25,
    bias: -0.00025, normalBias: 0.015,
  },
  magma: {
    az: 30, el: -20,
    lit: [1.75, 0.95, 0.45], shade: [0.26, 0.11, 0.14], lift: [0.08, 0.03, 0.06], lambert: 0.4, sideK: 0.84, term: 0.25,
    charTint: [1.0, 0.82, 0.66], charShade: 0.84, charGrad: 0.12, bodyGrad: 0.28, sideTint: [1.0, 0.8, 0.75],
    blob: [0.6, 0.45, 0.45], actorShadow: false,
    top: "#2a0d0a", hor: "#b4471d", skyCurve: [0.0, 0.5, 0.6], fog: "#7a2a14", fogNear: 10, fogFar: 140, sunDisc: "#000000",
    sunCol: "#ffb070", sunI: 3.0, sky: "#ff9a5a", ground: "#3a1008", hemiI: 0.5,
    bias: -0.00025, normalBias: 0.015,
  },
};

/** world-only look per light (sky stops by elevation in degrees, river colours, cloud palette). All colours are
 *  ON-SCREEN targets under the current PBR-Neutral tone map; world.ts pre-inverts the tone map (shade.ts untone). */
export type WorldLook = {
  sky: { c: string[]; e: number[] };                         // 5 stops: c[i] at elevation e[i] (deg), smoothstep between
  water: { near: string; mid: string; far: string; crest: string; trough: string; glint: string; shade: C3 };
  bounce: C3;                                                 // shade.ts uBounce: albedo x bounce on shaded faces turned to the lens
  sat: number;                                                // shade.ts uSat: world albedo saturation (1 = as painted)
  cloud: { lit: string; mid: string; shade: string };
};
export const LOOK: Record<LightName, WorldLook> = {
  day: {
    // depth.md 2.2: horizon #9fb6e6 just above the skyline, upper sky #5e93d9 at ~20 deg (grade: frame top #5997e2)
    sky: { c: ["#b8d0ec", "#9cbfea", "#6a9fe0", "#4f8cdb", "#3373cc"], e: [0, 3, 8, 16, 40] },
    water: { near: "#22a7b6", mid: "#167fb2", far: "#1a5596", crest: "#7ddfe8", trough: "#0e4a80", glint: "#ffffff", shade: [0.5, 0.56, 0.72] },
    cloud: { lit: "#fbf8f1", mid: "#e1e5f3", shade: "#c3cbe9" },
    bounce: [0, 0, 0],
    sat: 1.08,
  },
  golden: {
    // sunset, not dusk: #ffd08a horizon, peach/orange through ~10 deg, warm rose at 20, muted warm mauve only near the top
    // (the golden grade adds ~+11/255 blue to shadows/mids, so these lean warm)
    sky: { c: ["#ffc47c", "#f7ae78", "#e8967c", "#c4848e", "#8a6f8a"], e: [0, 4, 10, 20, 40] },
    water: { near: "#1e3a6e", mid: "#355f96", far: "#d4a48e", crest: "#d9a088", trough: "#16294f", glint: "#ffe2b0", shade: [0.42, 0.46, 0.72] },
    cloud: { lit: "#ffd2a8", mid: "#f2a08f", shade: "#a98fc4" },
    bounce: [0.04, 0.02, 0.0],
    sat: 1.1,
  },
  night: {
    sky: { c: ["#2b3f74", "#22356a", "#18295a", "#101d46", "#08112e"], e: [0, 4, 10, 22, 50] },
    water: { near: "#123a63", mid: "#0f2f55", far: "#2a4478", crest: "#7aa7d8", trough: "#081a33", glint: "#dfe9ff", shade: [0.5, 0.56, 0.8] },
    cloud: { lit: "#8fa3cf", mid: "#5d6f9e", shade: "#3a4675" },
    bounce: [0, 0, 0.02],
    sat: 1.0,
  },
  space: {
    sky: { c: ["#0d1230", "#0a0f28", "#080b1f", "#060816", "#04050d"], e: [-90, -30, 0, 30, 90] },
    water: { near: "#1d5fa6", mid: "#1a4e8f", far: "#2c6fb8", crest: "#bfe3ff", trough: "#0c2f5c", glint: "#ffffff", shade: [0.3, 0.35, 0.6] },
    cloud: { lit: "#ffffff", mid: "#e6ecf7", shade: "#a8b4d6" },
    bounce: [0, 0, 0],
    sat: 1.12,
  },
  magma: {
    sky: { c: ["#b4471d", "#8a3418", "#5e2212", "#3a150c", "#1f0a06"], e: [-60, -10, 10, 30, 70] },
    water: { near: "#ff7a1a", mid: "#ff5a12", far: "#ffb040", crest: "#fff0a0", trough: "#b02a08", glint: "#ffffff", shade: [0.8, 0.5, 0.4] },
    cloud: { lit: "#ffb070", mid: "#d06030", shade: "#7a2a14" },
    bounce: [0.06, 0.02, 0.0],
    sat: 1.1,
  },
};
