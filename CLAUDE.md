# VIDEO GEN: instructions for every Claude session in this repo

You make **vertical YouTube Shorts (1080x1920)** for the owner's channel, rendered from code (no AI video generator),
in two series: **What If** and **History**. Between videos you also write **Gemini remix prompt packs** for the
owner's separate reel-edit channel (see "Gemini remix prompts").
Within one video, work without waiting (see "Working alone"). **Between videos, stop and wait for the owner's approval**
(see "Approval gate").

## Hard rules

1. **Effort cap: high. Never max.** This applies to you and every agent you start (verifiers, sandboxes, audits).
   Wherever a skill says "Opus max", use high effort.
2. **Budget:** cloud credits are limited and expire. Prefer fewer, finished videos over many half-done ones.
   - At most **3 sub-agents at a time** and **one verifier round per video** (a second only if the first scored any area below 5/10).
   - Look checks at `--scale 0.5`, a handful of frames. Final renders at **1080x1920 (`--scale 1`)**, not 2K.
3. **Original content only.** Stories, characters, scripts and voices are our own. The files in
   `.claude/skills/cartoon-3d-short/references/` and `gemini-refs/` are for studying the look only: never copy their
   shots or characters, never upload them anywhere, and never name their channels in a video, title or description.
4. **Facts:** every History fact and every What If science claim is checked with web search. Put the sources at the
   top of the short's `SCRIPT.md`.
5. **Save often:** commit and push after every finished step (script, voice, shot plan, stills, render, delivery).
   Small commits with clear messages. Never commit `node_modules/`, `out/` or files over 95 MB.

## First thing in every new session

```bash
bash scripts/setup.sh voice        # node deps, python deps, ffmpeg, offline TTS (safe to re-run)
export PATH="$HOME/.local/bin:$PATH"
```
Read `PROGRESS.md` to see where the last session stopped, then continue from there.
If setup reports `!!` problems, work around them (see TOOLS_GUIDE.md section 10), note them in `PROGRESS.md`, and carry on.

## The queue: what to make

- Briefs live in `briefs/what-if/` and `briefs/history/` (format: `briefs/_TEMPLATE.md`). Status is in the front matter: `todo`, `doing` or `done`.
- If a series has fewer than 5 `todo` briefs, **write the missing briefs yourself** (strong, visual, fact-checked topics) and commit them before starting.
- **Work in batches by series:** finish the What If batch, then the History batch. Don't alternate. One video at a time: each waits for approval (Approval gate).
- Episode 1 of each series is the **pilot**. It sets the look. Record the locked look in `briefs/<series>/SERIES_LOOK.md`. Episodes 2-5 reuse the pilot's project and change only the story, voice and shot plan.

## Rendering speed: measured, read this before choosing a style

The cloud container has **no GPU**. Measured on 2026-11-04 (2-core cloud container, software GL): the 3D bridge
short renders at **~40-77 s per frame at half size**. A 60 s short (1,800 frames) would take more than a day, so:

- **Before any full render, time 10 frames** (`--frames=0-9`) and project: frames × seconds per frame ÷ concurrency.
  Use `--concurrency` = number of cores (`nproc`) if memory allows.
- **If the projected render is over 45 minutes, don't render it in the cloud.** Finish everything else (script,
  voice, words.json, shot plan, sound mix, 3-6 check stills), commit, and add the short to `RENDER_LOCALLY.md`
  with its exact command. The owner renders it on their PC with a GPU.
- So in the cloud, **prefer light 2D looks** (Canvas2D, SVG, HTML/CSS: most Lemo-Opuscar 2D styles and HyperFrames)
  that render in about 1 s per frame or less. Avoid WebGL-heavy styles, MSAA, lens blur, motion-blur
  sub-frames and watercolour fills in cloud renders.
- Always pass `--gl=swangle --timeout=300000 --browser-executable="$(cat .chrome-path)"` to Remotion in the cloud.

## Which tool for which job (details in TOOLS_GUIDE.md)

| Job | Skill / tool | Notes |
|---|---|---|
| **History** shorts | `cartoon-3d-short` + `remotion-*` skills | 2D characters in a 3D world. Repo root is the Remotion project. **The final render runs on the owner's PC** (see RENDER_LOCALLY.md); the cloud does everything up to it. |
| **What If** shorts | `lemo-opuscar` | A vertical 1080x1920 style such as iso-infographic, lowpoly-island, dataviz, blueprint. Save the series style with "make a style your own". |
| History, documentary look (optional) | `lemo-opuscar` newsreel / engraving / archive-lighttable | Only if the owner asks or the cartoon style doesn't fit the topic. |
| Maps (routes, borders, globe) | `remotion-maps` | Inside Remotion shorts. |
| Captions, title cards, overlays | `remotion-captions` or `hyperframes` | Only if the series look uses captions. |
| Studying a reference video | `watch`, `reverse-any-video` | Local files in the repo (YouTube downloads are usually blocked here). |
| **Gemini remix prompts** (owner's reel-edit channel) | `gemini-video-prompts` | Only at the approval gate. See below. |

One engine per series: don't mix Remotion, Lemo-Opuscar and HyperFrames inside one video.

### Path mapping for `cartoon-3d-short`

The skill was written on someone else's PC. In this repo:
- "your Remotion project" means the **repo root** (`src/`, `public/`, `scripts/`, `src/Root.tsx`)
- `~/bridge-short/` means `shorts/<slug>/` (SCRIPT.md, voice/, audio outputs, notes)
- The audio scripts are in `audio/`, and the stills and QA scripts are in `scripts/`
- Stills: `node scripts/bridge-stills.mjs out/<slug>/x_ 100,400 0.5 <CompositionId>`. Software GL is used automatically on Linux.
- Voice: Kokoro offline TTS (`models/kokoro/`), one steady voice per series. Word timings come from faster-whisper (`word_timestamps=True`), written to `shorts/<slug>/voice/words.json`.
- Kenney 3D props in `public/bridge/kenney/` are optional. If they're missing, the world still renders.

## Approval gate (after every video)

The owner watches and approves **every** video before the next one starts.

1. When a video is delivered (or, for a 3D short, when it's ready for the owner's local render), commit and push, then
   post a chat message with:
   - the file path in the repo (`deliveries/<series>/<NN>_<slug>.mp4`), which the owner downloads from GitHub or pulls to their PC;
   - a contact sheet (`deliveries/<series>/<NN>_<slug>_sheet.jpg`, 12 frames, made with ffmpeg) so they can judge it at a glance;
   - the title, a one-line summary, and anything you weren't sure about;
   - the question: **"Approve, or what should change?"**
2. While waiting, do only the **Gemini remix prompts** step below. It doesn't start a new video.
3. Then **stop and wait** for the owner's reply. Don't start the next brief on your own.
4. Feedback: apply it to this video (re-render if asked) **and** write it into `briefs/<series>/SERIES_LOOK.md`
   so every later episode follows it. Only after "approved" (or "next", "go on", "ok") start the next brief.

## Gemini remix prompts (separate genre)

The owner runs a **different channel** with AI reel edits (armour, space, pharaohs in the modern world, and so on) made in
Gemini/Veo. It has nothing to do with the What If / History shorts. Their reference reels are in `gemini-refs/<series>/`.

While waiting at the approval gate, use the **`gemini-video-prompts`** skill:
1. Find reels in `gemini-refs/` without a finished remix pack (`prompts/<series>/<reel>_remix.md`). Do **1-2 reels** per gate.
2. For each, write the remix pack. It takes **heavy inspiration** from the reel (same concept, vibe, camera energy and
   edit rhythm) but **never repeats a shot exactly**: every shot changes its action, vehicle/prop or setting
   (Cleopatra racing a car → Cleopatra flying a jet, or racing a different car through Cairo at night).
3. If `gemini-clips/<slug>/` holds clips the owner generated, run the skill's **assemble mode**.
4. Commit and push. If no reels are waiting, skip this step.

## Working alone

- Don't stop for the approval gates *inside skills* (storyboards, style frames, metaphor gates). The only stop is the Approval gate between videos. Decide, write the decision
  and the reason in `shorts/<slug>/DECISIONS.md`, and continue.
- If you're truly blocked (missing tool, network blocked, render keeps failing), write it in `PROGRESS.md`, ask the owner in chat, and do Gemini remix prompts while you wait.
- Keep `PROGRESS.md` current: done, in progress, next, problems. It's how the owner and the next session catch up.

## Delivering

- Final video: `deliveries/<series>/<NN>_<slug>.mp4` (H.264, CRF 20, AAC 192k, under 95 MB) plus
  `deliveries/<series>/<NN>_<slug>.md` with a title, a description of 2-3 sentences, 5 hashtags and the sources.
- Commit, push, and update `PROGRESS.md`. Set the brief's status to `review`, then to `done` after the owner approves.
- Then follow the **Approval gate**.
