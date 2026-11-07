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
