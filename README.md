# VIDEO GEN

Animated YouTube Shorts made by Claude in a cloud session: **What If** and **History** series, rendered from code,
plus **Gemini video prompt packs** written from your own reference clips.

## Layout

| Path | What |
|---|---|
| `CLAUDE.md` | The rules every session follows (effort cap, batches, tools, Gemini step) |
| `TOOLS_GUIDE.md` | What every skill/repo is for and when to use it |
| `PROGRESS.md` | Where the last session stopped |
| `RENDER_LOCALLY.md` | 3D shorts waiting for a render on your PC (the cloud has no GPU) |
| `.claude/skills/` | All skills: cartoon-3d-short, remotion-*, lemo-opuscar, hyperframes*, media-use, reverse-any-video, style-sampling, watch, gemini-video-prompts |
| `src/`, `public/`, `scripts/`, `audio/` | The Remotion project (the bridge short as the starting template) |
| `briefs/<series>/` | One brief per episode (the queue) |
| `shorts/<slug>/` | Working files per short (script, voice, decisions) |
| `deliveries/<series>/` | **Finished videos + titles/descriptions** |
| `gemini-refs/<genre>/` | **You add** example clips + notes.md here |
| `prompts/<genre>/` | Gemini prompt packs Claude writes for you |
| `gemini-clips/<slug>/` | **You add** the clips you generated in Gemini; Claude joins them |

## Start a cloud session

Open a cloud session on this repo and send:

> Read CLAUDE.md and PROGRESS.md, run the setup, then make the What If batch (5 shorts) and then the History batch
> (5 shorts). Write Gemini prompt packs from gemini-refs between videos. Work without waiting for my approval;
> log your decisions. High effort, never max.

Talk to it in the session chat at any time ("make the next one funnier", "skip to History"). It reads your message
at its next step.

## Local setup (Windows, optional)

Node 20+, Python 3.11+ and ffmpeg 7+, then `npm install` and `npm run studio` to preview.
