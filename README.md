# VIDEO GEN

Animated YouTube Shorts made by Claude in a cloud session: **What If** and **History** series, rendered from code,
plus **Gemini remix prompt packs** for a separate reel-edit channel, written from reels you upload.
Every video waits for your approval before the next one starts.

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
| `gemini-refs/<series>/<reel>/` | **You add** reels you like (+ optional prompt.txt, notes.md) for the Gemini remix channel |
| `prompts/<series>/` | Remix prompt packs Claude writes for you |
| `gemini-clips/<slug>/` | **You add** the clips you generated in Gemini; Claude joins them |

## Start a cloud session

Open a cloud session on this repo and send:

> Read CLAUDE.md and PROGRESS.md, run the setup, then start the What If batch (5 shorts), then the History batch
> (5 shorts). After each video, show it to me and wait for my approval; while waiting, write Gemini remix packs
> from gemini-refs. High effort, never max.

Talk to it in the session chat at any time ("make the next one funnier", "skip to History"). It reads your message
at its next step.

## Local setup (Windows, optional)

Node 20+, Python 3.11+ and ffmpeg 7+, then `npm install` and `npm run studio` to preview.
