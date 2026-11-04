# VIDEO GEN: Tool and Skill Guide

> In this repo, every skill below that is marked "use" is already in `.claude/skills/`. ClaudeAnimationBase (not a skill; clone it if you want the painted mascot look), onetake, VOX-COLLAGE-BROLL and agent-reach are deliberately **not** included (starter kit, licence, paid service, login copying).

What each repo, plugin and skill does, when to use it, and when **not** to.
Written for a Claude Code cloud session that makes YouTube Shorts in batches (for example "what if" shorts and history shorts).

Checked on 2026-11-04 by reading each repo's README, SKILL.md, licence and install files.

---

## 0. Quick decision table

| I want to... | Use | Engine |
|---|---|---|
| Make a **history story short** with cartoon characters in a 3D world | **cartoon-3d-short** (this folder's `SKILL.md`) + **Remotion skills** | Remotion + three.js |
| Make a **"what if" explainer** (maps, scale, numbers, diagrams) | **Lemo-Opuscar** (styles such as `iso-infographic`, `dataviz`, `lowpoly-island`, `transit-map`, `blueprint`) | HTML canvas/WebGL, frame by frame |
| Make a **history short in a documentary look** (old film, engravings, archive) | **Lemo-Opuscar** (styles such as `newsreel`, `engraving`, `archive-lighttable`, `halftone-dossier`, `kino-montage`) | HTML canvas/WebGL |
| Copy the *feel* of a reference video into a reusable style | **HyperFrames `reverse-any-video`** or **`style-sampling`**, or Lemo-Opuscar "make a style your own" | HyperFrames (HTML to MP4) |
| Add captions, titles, overlays, charts or a voiceover to a video | **HyperFrames** (`hyperframes`, `media-use`) or **Remotion** (`remotion-captions`) | either |
| Make a hand-painted 2D **character animation** with a mascot | **ClaudeAnimationBase** | p5.js + p5.brush |
| Make a 5-second **paper-collage B-roll** clip for one line of a script | **VOX-COLLAGE-BROLL** (needs a paid MaxFusion account) | generative AI via MaxFusion |
| Make a **product launch or app promo** film | **onetake** (non-commercial licence only) | HTML, frame by frame |
| **Watch and analyse** a reference video (hook, pacing, frames) | **claude-watch** (`/watch`) | yt-dlp + ffmpeg + Whisper |
| Read YouTube subtitles, Reddit, X or Chinese platforms for research | **agent-reach** | Python CLI |

**Rule of thumb:** use **one rendering engine per series**. Remotion, HyperFrames, Lemo-Opuscar, onetake and ClaudeAnimationBase are five separate ways to turn code into video. Mixing them inside one video wastes tokens and gives inconsistent output. Pick one engine per channel series and keep it.

---

## 1. cartoon-3d-short (`.claude/skills/cartoon-3d-short`)

**Source:** `mromidev/claude-animated-shorts` · MIT (the reference frames are someone else's video, kept here for study only)

**What it is:** a complete, tested pipeline for 55-70 s vertical cartoon story shorts. 2D "bean-head" characters with ink outlines sit in a painted 3D world, with lens blur, gliding cameras, synthesised march music and SFX, rendered with three.js inside Remotion. It includes the full source of one finished film ("The Bridge That Fell for a Song"), audio scripts, QA scripts, a style bible and 7 measured style reports.

**Use it for:**
- **History shorts**: one surprising true story with a physical cause and effect (a bridge collapses from marching soldiers, a molasses flood, the shortest war).
- **"What if" shorts that have characters and a story** (what if everyone jumped at once, what if the Moon disappeared), told as a story rather than as a diagram.
- Any series where you want one consistent, recognisable channel look.

**Don't use it for:** data-heavy explainers (charts, maps, numbers). Use Lemo-Opuscar for those.

**Needs:** Node, Remotion + `@remotion/three`, Python 3 (numpy, scipy, pillow), ffmpeg, and a TTS voice.
**Cost:** heavy. The workflow runs many agents (research per topic, 5 sandbox agents, verifier rounds). All agents are capped at **high effort, never max** (already edited in `SKILL.md`).
**Cloud note (measured):** with no GPU, one frame takes ~40-77 s at half size. The cloud session prepares the short (script, voice, shot plan, sound, check stills), and the **final render runs on your PC** (`RENDER_LOCALLY.md`).
**In this repo:** the placeholder paths are already fixed (repo root = Remotion project).

---

## 2. Remotion agent skills (`npx skills add remotion-dev/skills`)

**Source:** `remotion-dev/skills` (official, from the Remotion team)

**What it is:** best-practice skills for writing Remotion (React to video) code: `/remotion-create`, `/remotion-markup`, `/remotion-render`, `/remotion-studio`, `/remotion-captions`, `/remotion-maps` (animated routes, Mapbox, GeoJSON, 3D globe flyovers with CesiumJS), `/remotion-docs`, `/remotion-upgrade`, `/remotion-multimedia`, and more.

**Use it for:**
- **Always alongside cartoon-3d-short**, since that skill is built on Remotion. These skills stop the agent from writing outdated or wrong Remotion code.
- **`/remotion-maps`** for history and "what if" shorts that need a map: invasion routes, trade routes, "what if this country...".
- **`/remotion-captions`** if you decide to add word-by-word captions. Note that the cartoon skill currently says "no captions"; change that rule if you want them.

**Licence:** Remotion is free for individuals and companies of up to 3 people. Bigger companies need a paid company licence (`/remotion-license` explains this).

---

## 3. HyperFrames (`heygen-com/hyperframes`)

```
claude plugin marketplace add heygen-com/hyperframes
claude plugin install hyperframes@hyperframes
```

**Source:** HeyGen · Apache 2.0 · a large, actively maintained project (CLI, desktop studio, docs)

**What it is:** an open-source framework that turns HTML, CSS, media and seekable animations into deterministic MP4s. It's an alternative to Remotion that uses plain HTML instead of React. It comes with skills:
- `hyperframes`, `hyperframes-cli`, `hyperframes-registry`: the core skills for making, editing and rendering videos (launch films, explainers, charts, maps, vertical clips, captions, overlays).
- `media-use`: gets or makes music, SFX, images, icons, voiceover, transcripts, cutouts and colour grades, using HeyGen (paid) **or free local tools**.
- `reverse-any-video`: rebuilds any video as an editable project and checks the result frame by frame against the original.
- `style-sampling`: makes a new episode in a proven style (Collage Explainer, Finance Explainer, Animated Science Explainer, 3D Brand Explainer, 3D True Crime).
- `slideshow`, `figma`, `remotion-to-hyperframes`.

**Use it for:**
- **Building your own style from your own reference videos**: `reverse-any-video` on a short you like, then reuse the result as a template. This fits your plan to grow the reference library.
- **"What if" explainers** through `style-sampling` ("Animated Science Explainer", "Collage Explainer"). This is a **free** route to the collage look, with no MaxFusion.
- **Finishing passes**: captions, title cards and overlays on top of a rendered video.

**Don't use it for:** the cartoon-3d-short pipeline, which is Remotion-based. Don't convert it.
**Needs:** Node 22+, ffmpeg, Chrome/Chromium.

---

## 4. Lemo-Opuscar (`lemomo-ai/lemo-opuscar`)

```
claude plugin marketplace add lemomo-ai/lemo-opuscar
claude plugin install lemo-opuscar@lemolab
```

**Source:** LemoLab · MIT (code) + CC BY 4.0 (styles) · tuned for Claude Opus 5.5

**What it is:** a library of **66 film styles made entirely in code**, each with a demo film and a `STYLE.md`, plus two director guides (`DIRECTOR.md` for story, rhythm, camera and sound, and `TECHNIQUE.md` for frame-by-frame rendering, voice, music and mixing). It writes original music from free sample libraries, does offline TTS narration (Kokoro, plus edge-tts online) and checks the speech with Whisper. It also lets you **make a style your own** (brand colours, recurring character, channel tone) and save it to `~/lemo-my-styles/`.

**Useful styles for your genres:**
- **"What if" / science:** `iso-infographic`, `dataviz`, `data-physical`, `lowpoly-island`, `transit-map`, `blueprint`, `microscope`, `circuit-board`, `lidar-survey`, `hologram-hud`
- **History / documentary:** `newsreel` (1920s), `engraving`, `archive-lighttable`, `halftone-dossier`, `kino-montage`, `caption-news`, `briefing-board`, `ink-wash`, `papercut-red`, `art-deco`
- **Kids / light topics:** `crayon-book`, `chalkboard`, `paper-popup`, `isometric-picture-book`, `brick-toy`

**Use it for:**
- **The quickest route to a polished short in a new genre.** It's the best general-purpose tool on this list.
- **One saved "my style" per series**, for example "VIDEO GEN – What If" and "VIDEO GEN – History", so every episode in a series looks the same.
- Its "Evidence Films" and "Edit & Documentary" styles source every number, which suits history facts.

**Watch out:**
- Default output is **1920x1080 landscape at 24 fps**. Always ask for **1080x1920 vertical** for Shorts.
- Each film takes about **30-60 minutes** of agent time and "a fair amount of tokens".
- Needs Node 20+, **ffmpeg 7+** and Python 3.11+. The cloud container's ffmpeg may be older; the README links a static build.
- Kokoro voice models are downloaded on first use, which may be blocked by the cloud network allowlist (see section 10).

---

## 5. ClaudeAnimationBase (`JohnHeibel/ClaudeAnimationBase`)

```
npm install
node render.mjs --clip --out=out/video.mp4
```

**Source:** John Heibel · MIT

**What it is:** a small starter kit for **hand-painted 2D character animation** in p5.js + p5.brush (watercolour fills, boiling linework). It ships with a fully rigged character (views, emotions, eyes, mouths, hats, dances), a timeline with brush-wipe transitions, a headless renderer that makes contact sheets for self-checking, and `ANIMATION_GUIDE.md` (no text, always transitions, something happens in every scene).

**Use it for:**
- Short, charming **character-driven skits**, such as a mascot reacting to a "what if".
- Building **your own channel mascot**: ask Claude to replace the character with an original one.

**Watch out:**
- The bundled character is **Clawd, Anthropic's mascot**. Don't use it as your channel's character; make your own.
- **Very slow without a GPU** (seconds per frame because of the watercolour fills). In the cloud, add `--soft-gl` and tell Claude to avoid watercolour fills.
- It has no voice or music pipeline. You'd add those with Lemo-Opuscar's audio tools or `media-use`.
- Its default length is 15 s clips, so it's best for B-roll or segments rather than full 60 s shorts.

---

## 6. VOX-COLLAGE-BROLL (`MegaTroll222/VOX-COLLAGE-BROLL`)

```
mkdir -p ~/.claude/skills/collage-broll-explainers
curl -o ~/.claude/skills/collage-broll-explainers/SKILL.md https://raw.githubusercontent.com/MegaTroll222/VOX-COLLAGE-BROLL/main/SKILL.md
claude mcp add --transport http maxfusion https://mcp.maxfusion.ai/mcp
```

**Source:** MegaTroll222 (an English adaptation of pyang5166's gbro-collage-broll) · MIT

**What it is:** one skill that turns **one spoken sentence into a 5-second 9:16 paper-collage clip** (halftone cut-outs assembling on a bold colour field), with optional voiceover. It has a strict three-gate flow: approve the metaphor, then approve the still, then render the video.

**Use it for:** short B-roll inserts for a single line ("the economy is a snowball"). It **doesn't make a full short** on its own.

**Watch out:**
- **It isn't free to run.** All image, video and voice generation goes through the **MaxFusion MCP**, a paid account with sign-in. Without it, you'd need your own Google AI Studio (Gemini) and ElevenLabs API keys.
- It's **AI-generated video**, unlike every other tool here, which renders from code. The look is less predictable.
- The approval gates stop and wait for you. In an unattended cloud run they stall the work.
- **A cheaper alternative:** HyperFrames `style-sampling` → "Collage Explainer" gives a similar look, rendered from code.

**Verdict:** skip it for now unless you buy MaxFusion credits.

---

## 7. onetake (`feitangyuan/onetake`)

```
git clone https://github.com/feitangyuan/onetake.git ~/.claude/skills/onetake
```

**Source:** Patrick (feitangyuan) · **PolyForm Noncommercial 1.0.0**. It's free for non-commercial use only and has a paid "Pro" version.

**What it is:** a skill for **product launch films, teasers and feature demos** (10-30 s, up to about 60 s narrated) shot as **one continuous take**, where every beat grows out of the previous one with no cuts. It includes a library of about 38 measured motion moves, real 180° shutter motion blur, synthesised sound in one shared room, and an "oracle" (`probe.py`) that rejects slideshow-like cuts.

**Use it for:** a launch video for an app, a website or a skill, and **studying its continuity ideas**. Its "every beat carries into the next" rule is a good lesson for any short.

**Don't use it for:**
- **Monetised channel content.** A monetised YouTube channel is commercial use, which the licence forbids.
- History or "what if" stories. It's built for product UI.

**Verdict:** not a fit for this project. Keep it only for personal or portfolio work.

---

## 8. claude-watch (`taoufik123-collab/claude-watch`)

```
/plugin marketplace add taoufik123-collab/claude-watch
/plugin install watch@claude-watch
```
(Your notes had `/gsap-plugins install ...`. The correct second command is `/plugin install watch@claude-watch`.)

**Source:** an MIT fork of the "claude-video" project

**What it is:** gives Claude the ability to **watch a video** from a URL or a local file. It downloads with yt-dlp, extracts **one frame per scene change** with ffmpeg, measures pacing (cuts per minute, shot length), runs a **0-10 s "hook microscope"** (2 fps plus a word-level transcript) and writes a structured `report.md`. It can optionally save reports to an Obsidian vault. It also installs a small SessionStart hook that only checks that yt-dlp and ffmpeg are set up.

**Use it for:**
- **Studying your reference videos before you build a style**: hooks, pacing, shot lengths. This is the input step for growing the `references/` library.
- **Checking your own finished shorts**: run `/watch` on your rendered MP4 and compare its pacing against the references.
- This is the tool to use when you want something analysed frame by frame.

**Watch out:**
- Captions are free. For videos without captions it needs a **Groq or OpenAI Whisper API key**.
- **Downloading from YouTube is likely blocked in a cloud session** (network allowlist), and YouTube often blocks data-centre IPs anyway. Run `/watch` on your own PC and commit the `report.md` and frames to the repo, or point it at local MP4 files that are already in the repo.

---

## 9. agent-reach (`Panniantong/agent-reach`)

**Source:** MIT · Python CLI · sponsored by proxy and scraping companies

**What it is:** a CLI that gives an agent access to sites it can't normally reach: **YouTube** (search, info, subtitles, speech-to-text), Bilibili, GitHub, Reddit, X/Twitter, LinkedIn, Instagram, Facebook, XiaoHongShu, V2EX and Xueqiu. Logged-in channels **copy that site's login cookies from your Chrome** into its own background browser.

**Use it for:**
- **Topic research**: what "what if" questions trend on Reddit, YouTube subtitles of documentaries for fact-checking history.
- Pulling YouTube transcripts when you only need the words, not the frames.

**Don't use it for:** watching videos frame by frame. It only gets text (subtitles and transcripts). Use claude-watch for that.

**Watch out:**
- **Logged-in channels reuse your real Chrome logins.** Only enable channels you're comfortable with, ideally with secondary accounts. Platforms such as X and Instagram fight automation and may flag the account.
- Install it **only from the GitHub `install.md`**. The PyPI package called `agent-reach` is a different project.
- It **won't have your Chrome logins in a cloud session**. Only the no-login channels (YouTube, GitHub, web) work there, and only if the network allows them.

**Verdict:** optional. Use it on your PC for research, and skip it in the cloud.

---

## 10. Running all this in a Claude Code cloud session

This repo is already set up for it:
1. **Skills are in the repo** (`.claude/skills/`), so a fresh container has them without installing plugins.
   Lemo-Opuscar downloads its style library from GitHub on first use (to `~/lemo-opuscar`).
2. **`bash scripts/setup.sh voice`** installs Node and Python deps, checks ffmpeg (fetches a static ffmpeg 7 if it can) and downloads the Kokoro TTS model.
3. **Network:** cloud sessions use an allowlist (package registries and GitHub by default). YouTube downloads, Hugging Face, edge-tts, kenney.nl and MaxFusion may be blocked. Work around it: Kokoro comes from GitHub releases, and reference clips are committed into the repo.
4. **No GPU:** Remotion uses software GL (`swangle`). **Measured: the 3D cartoon short renders at ~40-77 s per frame at half size in the cloud**, so a 60 s short would take more than a day. 3D shorts are prepared in the cloud and **rendered on your PC** (`RENDER_LOCALLY.md`). The cloud renders only light 2D styles itself, after timing 10 frames first.
5. **Approval gates:** `CLAUDE.md` tells the session to decide, log its reasons in `DECISIONS.md` and continue.
6. **Effort cap:** high, never max, for every agent (in `CLAUDE.md` and in the cartoon skill).
7. **Gemini prompt packs** between videos: the `gemini-video-prompts` skill reads `gemini-refs/<genre>/` and writes to `prompts/<genre>/`.

## 11. Batching genres: 5 + 5, or interleaved?

**Make them in batches by genre (5 "what if", then 5 history). Interleave when you post, not when you produce.**

Why batching is better:
- **Setup is paid once per series.** Style references, character designs, voice settings, music and the render config all load into the session once and are reused for all 5. Switching genre each time reloads all of it and burns credits.
- **Consistency.** Five episodes made back to back with the same style look like a series. Alternating drifts the look.
- **Fixes carry forward.** A bug fixed in episode 1 (a lighting value, a mix level) improves episodes 2-5 automatically.
- **Separate engines.** Each series can use its best tool (history → cartoon-3d-short; "what if" → Lemo-Opuscar) without the two fighting in one context.

How to do it:
1. Episode 1 of each series is the **pilot**. Review it carefully and lock the style.
2. Episodes 2-5 reuse the pilot's project folder and only change the story, script and voice.
3. Post alternately on your channel (what-if, history, what-if...) if you want variety for viewers.

Better still, **one cloud session per series**. Each session holds one style in context, they can run in parallel, and one going wrong doesn't affect the other.

---

## 12. Gemini video prompts (`.claude/skills/gemini-video-prompts`), written for this repo

**What it is:** reads the clips and notes you put in `gemini-refs/<genre>/`, writes `STYLE_NOTES.md`, and produces prompt packs:
a ~40 s short as 4 × 10 s Gemini/Veo clips with a word-for-word **style lock** and **cast lock** (so the clips match),
"ends on / continues from" hand-offs between clips, a voice-over script, and sources. It also has an **assemble mode**:
put your generated clips in `gemini-clips/<slug>/` and the session joins them and adds voice, music and captions.

**When:** between every finished code-rendered video (CLAUDE.md), or any time you ask for "Gemini prompts".
