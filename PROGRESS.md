# Progress

_Updated by every session. Newest first._

## Status
- Repo set up (skills, Remotion project, setup script, Gemini prompt skill). No videos made yet.

## Next
1. `bash scripts/setup.sh voice`
2. Write 5 What If briefs → pilot episode → episodes 2-5 (approval after each; Gemini remix packs while waiting).
3. Write 5 History briefs → pilot episode → episodes 2-5 (approval after each; Gemini remix packs while waiting).

## Problems / notes
- Measured 2026-11-04: the 3D bridge short renders at ~40-77 s per frame (half size) in the cloud. The final renders for 3D shorts go to RENDER_LOCALLY.md.
- Kenney GLB props are not in the repo (optional; kenney.nl may be blocked).

## 2026-11-07: Gemini prompt packs reworked
- Owner said the remix packs (branch `claude/quirky-cori-xzitpn`, `prompts/`) weren't the quality they wanted.
  Causes: 10 s windows (Veo makes 8 s max), 5-7 "cut to" beats crammed into one generation, text-only character
  consistency, long "Avoid:" lists. The `gemini-video-prompts` skill now uses Nano Banana start frames, one
  continuous 8 s shot per generation and an edit list. Sample: `prompts/armor/igexport-Dc4sSw1jF-D_remix_v2.md`.
  The old packs still need rewriting to v2 once the owner confirms the sample works in Flow.

## 2026-11-08: Kaggle image-to-video notebook
- `kaggle/wan22_i2v_batch.ipynb` (+ `kaggle/README.md`): ComfyUI + Wan 2.2 14B I2V + LightX2V 4-step on a free T4.
  Batch mode (images + .txt prompts or jobs.csv → MP4s, 1080x1920 copies, contact sheets, timings.csv) and tunnel mode
  (public ComfyUI URL for OpenMontage's `COMFYUI_VIDEO_SERVER_URL`). Default model GGUF Q4 to fit Kaggle's ~30 GB RAM.
- Checked here: all cells parse; the graph (GGUF and fp8 variants) was accepted by a CPU ComfyUI with placeholder
  model files. NOT yet run on a GPU (Hugging Face is blocked from this container); the owner's first Kaggle run is the test.
