// usage: node scripts/bridge-stills.mjs <outPrefix> <frame,frame,...> [scale] [compositionId]  (bundles once, jpeg)
// Works on Windows (local Chrome + GPU via ANGLE) and in a Linux cloud container (Remotion's own headless shell + software GL).
// BRIDGE_ENTRY=src/sandboxes/<name>/index.tsx renders a sandbox copy instead of the main project entry.
import fs from "node:fs";
// each bundle copies public/ (~1.3 GB) into the temp dir; C: is full, so keep bundles on D:
// Remotion bundles fill the temp folder (~1.3 GB each): set REMOTION_TMP to a folder on a big drive
if (process.env.REMOTION_TMP) { fs.mkdirSync(process.env.REMOTION_TMP, { recursive: true }); process.env.TEMP = process.env.TMP = process.env.REMOTION_TMP; }
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
const [prefix, frames, scale = "0.5", compId = process.env.COMP || "BridgeShort"] = process.argv.slice(2);
const winChrome = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const savedChrome = fs.existsSync(".chrome-path") ? fs.readFileSync(".chrome-path", "utf8").trim() : null; // written by scripts/setup.sh
const browserExecutable = process.env.CHROME_PATH || savedChrome || (process.platform === "win32" && fs.existsSync(winChrome) ? winChrome : null);
const chromiumOptions = { gl: process.env.REMOTION_GL || (process.platform === "win32" ? "angle" : "swangle") };
const serveUrl = await bundle({ entryPoint: path.resolve(process.env.BRIDGE_ENTRY || "src/index.ts"), publicDir: path.resolve("public") });
const composition = await selectComposition({ serveUrl, id: compId, browserExecutable, chromiumOptions });
const onBrowserLog = (l) => { if (l.type === "error" || l.type === "warning") console.log(`[${l.type}]`, l.text.slice(0, 300)); };
for (const f of frames.split(",").map(Number)) {
  const t0 = Date.now();
  await renderStill({ composition, serveUrl, frame: f, output: `${prefix}${f}.jpg`, imageFormat: "jpeg", jpegQuality: 88, scale: Number(scale),
    browserExecutable, chromiumOptions, timeoutInMilliseconds: 180000, onBrowserLog });
  console.log("still", f, ((Date.now() - t0) / 1000).toFixed(1) + "s");
}
