---
name: gemini-video-prompts
description: Study the reference clips in gemini-refs/<genre>/ and write copy-paste prompt packs for Google Gemini / Veo video generation - a ~40 s short as four chained ~10 s clips with locked style and characters, plus a voice-over script - in the same genre and look as the references but with new, original ideas. Use when CLAUDE.md says to write Gemini prompts between videos, or when asked for "Gemini prompts", "Veo prompts", "prompts like my references", or to assemble generated Gemini clips from gemini-clips/.
---

# Gemini video prompt packs

The user has a Google AI Pro plan. In the Gemini app (or Google Flow) they generate short clips (about 10 s each)
and join them into ~40 s shorts. Your job: look at what they like (`gemini-refs/<genre>/`) and hand them prompt
packs that produce **more videos like those, on new topics**, that cut together into one continuous short.

You never call Gemini yourself. You write text the user pastes in.

## Settings (change here if the user says otherwise)

- `CLIP_SECONDS = 10` (Gemini/Veo clip length on the user's plan; if the user reports 8 s clips, use 8 and 5 clips)
- `CLIPS_PER_SHORT = 4`  → ~40 s
- Aspect **9:16 vertical**, for YouTube Shorts
- Packs per run: **2** (one run = one "between videos" break). Don't write more unless asked.

## Step 1: Inventory the references

```
ls -R gemini-refs/<genre>/
```

The folder can hold videos (`.mp4 .mov .webm`), images, and `notes.md` / `.txt` where the user says what they like.
**Read the user's notes first: they outrank your own reading of the clips.**
If a genre folder has no videos, images or notes, skip that genre and say so in `prompts/README.md`.

For each video, see it (don't guess from the filename):

```
mkdir -p out/refs/<genre>/<name>
ffprobe -v error -show_entries format=duration:stream=width,height,r_frame_rate -of compact "<video>"
# one frame per shot change, plus a steady 1 fps sheet
ffmpeg -v error -i "<video>" -vf "select='gt(scene,0.3)',scale=360:-2,tile=4x3" -fps_mode vfr -frames:v 1 out/refs/<genre>/<name>/cuts.jpg
ffmpeg -v error -i "<video>" -vf "fps=1,scale=240:-2,tile=6x5" -frames:v 1 out/refs/<genre>/<name>/sheet.jpg
```

Then `Read` both images. The `watch` skill (`python3 .claude/skills/watch/scripts/watch.py "<video>"`) is a deeper
option for long clips: pacing, hook microscope and transcript.

## Step 2: Write or update `gemini-refs/<genre>/STYLE_NOTES.md`

Measure, don't use adjectives alone. Keep it under ~60 lines:

- **Format:** aspect, length, clips per video, cuts per 10 s
- **Look:** medium (live-action, 3D render, claymation, anime, paper, documentary archive...), palette (3-5 colours by name), lighting, lens and depth of field, texture and grain
- **Camera:** typical shot sizes, moves (dolly, orbit, FPV, crane, static), speed
- **Subjects:** what is on screen, scale (macro / human / city / planet), how characters look
- **Story shape:** hook in the first 2 s, escalation, payoff; what makes it *this genre*
- **Sound:** narration or none, music feel, SFX, ambience
- **Text on screen:** yes or no. Gemini renders text badly, so captions are added later (see Step 6).
- **Do / don't list:** 5 rules each that a prompt must follow to match this look

Add new references to the notes; don't rewrite what still holds.

## Step 3: New ideas, not copies

Write 5 candidate topics in the genre, pick the best 2, and log all 5 in `prompts/IDEAS.md` so future runs don't repeat them.

- **Never** remake a reference clip's specific story, characters or shots. Match the *look and format*; the topic is new.
- **What if:** one clear, visual premise ("What if the Moon was as close as the ISS?"). Escalate in scale every clip. Every claim must be physically plausible; note the real science in one line.
- **History:** one true, surprising event. Verify the key facts with web search and put the sources in the pack. Period-correct costumes, buildings, flags and tech.
- Avoid what Gemini refuses or garbles: real living people, named copyrighted characters, brand logos, gore, minors in danger, readable text or signs.

## Step 4: Write the pack

One file per short: `prompts/<genre>/<YYYY-MM-DD>_<slug>.md`, in this exact shape:

~~~markdown
# <Title>  (<genre>, ~40 s, 4 × 10 s, 9:16)

**Premise:** one line.  **Why it works:** one line (hook + payoff).
**Sources:** (history: links; what-if: the real-science line)

## STYLE LOCK  (paste at the top of every clip prompt, word for word)
<60-90 words: medium, palette, lighting, lens, texture, camera language, mood, "vertical 9:16">

## CAST LOCK  (paste into every clip that shows them, word for word)
<each recurring character or object: 25-40 words, fixed details such as age, build, clothing colours, one signature item>

## Voice-over (record it yourself or have Gemini speak it; ~2.5 words/s, ≤ 25 words per clip)
Clip 1: "..."  Clip 2: "..."  Clip 3: "..."  Clip 4: "..."

## Clip 1 — Hook (0-10 s)
```text
<STYLE LOCK>
<CAST LOCK if needed>
Shot: <shot size, lens>, <camera move>. <Subject> <does what>, in <setting>, <time of day / lighting>.
0-3 s: <beat>. 3-7 s: <beat>. 7-10 s: <beat>.
Sound: <ambience>, <SFX on which beat>, <"spoken line" or "no dialogue">, no music.
Ends on: <the exact final frame: what is where, camera position>.
Avoid: text, subtitles, captions, logos, watermarks, extra limbs, warped faces, flicker, sudden cuts.
```

## Clip 2 — <beat name> (10-20 s)
```text
<STYLE LOCK>
<CAST LOCK>
Continues directly from the previous shot: <the previous "Ends on" sentence>.
...same structure...
```
(Clips 3 and 4 the same way. Clip 4 ends on the payoff image, held still for the last second.)

## How to make it
1. Generate Clip 1. If a character drifts, regenerate before moving on.
2. For Clips 2-4, start from the **last frame of the previous clip** (save it and upload it as the starting image,
   or use Flow's extend option if your plan has it), then paste the prompt.
3. Generate 2 takes per clip and keep the better one.
4. Put the chosen clips in `gemini-clips/<slug>/` as `01.mp4 … 04.mp4` and push. The session can join them,
   add the voice, music and captions (see "Assemble mode").
~~~

Prompt-writing rules (these matter more than length):
- One clear action per beat. Concrete nouns and verbs, not "epic", "amazing" or "cinematic" alone.
- The style lock and cast lock must be **identical** in every clip. That is what keeps the four clips looking like one film.
- Camera direction always: shot size + lens + move + speed ("slow push-in, 35 mm, eye level").
- Every clip's first moment matches the previous clip's "Ends on". Keep the camera moving the same way across the join so the cut is invisible.
- Don't put words on screen. If the reference uses captions, add them later.
- Sound: Gemini/Veo can generate audio. Write it explicitly. Prefer "no music" (music is added in assembly so it runs smoothly across clips).

## Step 5: Index

Append each pack to `prompts/README.md`: date, genre, title, link, status `ready`. Commit and push:
`git add prompts gemini-refs/*/STYLE_NOTES.md && git commit -m "Gemini prompt packs: <titles>" && git push`

## Step 6: Assemble mode (when `gemini-clips/<slug>/` has clips)

1. Check each clip: `ffprobe` (size, fps, length). Make a 1 fps contact sheet and Read it to check that the joins match.
2. Normalise and join: scale or pad to 1080x1920 at 30 fps and crossfade 4-6 frames at each join only if the motion doesn't match. Otherwise use hard joins.
3. Voice-over: use the user's recording if present (`gemini-clips/<slug>/voice.*`). Otherwise use offline TTS (Kokoro, after `bash scripts/setup.sh voice`) or the `media-use` skill's free local TTS.
4. Music bed and SFX: reuse `audio/` (synthesised score, `mix.py` ducking) so there is no copyrighted music.
5. Captions, if the genre uses them: the `remotion-captions` or `hyperframes` skill, timed from faster-whisper word times.
6. Run QA with `python scripts/short_qa.py`, then deliver to `deliveries/<genre>/<slug>.mp4`, commit and push.
