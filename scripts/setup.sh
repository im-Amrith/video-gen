#!/usr/bin/env bash
# One-time setup for a fresh cloud container (safe to re-run; skips what is already there).
# Usage: bash scripts/setup.sh            core: node deps, python deps, ffmpeg check
#        bash scripts/setup.sh voice      + offline TTS (Kokoro) and word timings (faster-whisper)
set -u
cd "$(dirname "$0")/.."
say() { printf '\n== %s\n' "$*"; }
PIP="python3 -m pip install -q --break-system-packages"

say "Node $(node -v 2>/dev/null || echo MISSING)  npm $(npm -v 2>/dev/null || echo MISSING)  python $(python3 -V 2>&1)"

say "Node packages (Remotion 4.0.290 + three.js)"
if [ ! -d node_modules/remotion ]; then npm install --no-audit --no-fund || echo "!! npm install failed"; else echo "already installed"; fi
# A Chrome for rendering. Remotion's own download (storage.googleapis.com) is often blocked in the cloud,
# so prefer a Chrome/Chromium that is already installed, and write its path to .chrome-path.
CH="${CHROME_PATH:-}"
for c in "$CH" /usr/bin/google-chrome /usr/bin/chromium /usr/bin/chromium-browser \
         $(ls -d ${PLAYWRIGHT_BROWSERS_PATH:-$HOME/.cache/ms-playwright}/chromium-*/chrome-linux/chrome 2>/dev/null); do
  if [ -n "$c" ] && [ -x "$c" ]; then CH="$c"; break; fi
done
if [ -n "$CH" ] && [ -x "$CH" ]; then
  echo "$CH" > .chrome-path; echo "render browser: $CH  (saved to .chrome-path)"
elif npx --yes remotion browser ensure >/dev/null 2>&1; then
  rm -f .chrome-path; echo "render browser: Remotion headless shell"
else
  echo "!! no Chrome found and Remotion's browser download failed: renders will not work"
fi
echo 'Render with:  npx remotion render ... --gl=swangle --browser-executable="$(cat .chrome-path)"   (stills script reads it too)'

say "Python packages (audio pipeline, QA, contact sheets)"
$PIP numpy scipy pillow soundfile soxr fonttools || echo "!! pip core failed"

say "ffmpeg"
ffv=$(ffmpeg -version 2>/dev/null | head -1 | sed -E 's/ffmpeg version n?([0-9]+).*/\1/')
echo "system ffmpeg major version: ${ffv:-none}"
if [ -z "$ffv" ] || [ "$ffv" -lt 7 ] 2>/dev/null; then
  mkdir -p "$HOME/.local/bin"
  if curl -fsSL -m 120 -o /tmp/ffmpeg.tar.xz https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz 2>/dev/null; then
    tar -xf /tmp/ffmpeg.tar.xz -C /tmp && cp /tmp/ffmpeg-*-static/ffmpeg /tmp/ffmpeg-*-static/ffprobe "$HOME/.local/bin/" && echo "static ffmpeg 7 installed to ~/.local/bin"
  else
    # fallback: PyPI ships an ffmpeg binary (no ffprobe); keep the system ffprobe
    $PIP imageio-ffmpeg && ln -sf "$(python3 -c 'import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())')" "$HOME/.local/bin/ffmpeg" \
      && echo "ffmpeg from imageio-ffmpeg linked to ~/.local/bin/ffmpeg" || echo "!! could not get ffmpeg 7 (Lemo-Opuscar wants 7+; Remotion works with its own)"
  fi
  echo 'export PATH="$HOME/.local/bin:$PATH"   # run this in your shell'
fi

if [ "${1:-}" = "voice" ]; then
  say "Voice: Kokoro offline TTS + faster-whisper word timings"
  $PIP kokoro-onnx faster-whisper "av<19" || echo "!! voice deps failed"
  mkdir -p models/kokoro
  for f in kokoro-v1.0.onnx voices-v1.0.bin; do
    [ -f models/kokoro/$f ] || curl -fsSL -m 600 -o models/kokoro/$f "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/$f" \
      || echo "!! could not download $f (network allowlist?)"
  done
fi

say "Done. Check the !! lines above; anything missing is listed there."
