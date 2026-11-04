---
name: gemini-video-prompts
description: Remix the owner's reference reels (AI edits like armour, space, pharaohs in the modern world) into new Google Gemini / Veo prompt packs - study each reel in gemini-refs/<series>/<reel>/ shot by shot, then write one new prompt per shot that keeps the concept, vibe and edit rhythm but changes the action, vehicle/prop or setting, plus an edit plan. Use at the approval gate in CLAUDE.md, or when asked for Gemini prompts, Veo prompts, reel remixes, or to assemble generated clips from gemini-clips/.
---

# Gemini reel remixes

The owner runs a reel-edit channel: short AI-generated edits (pharaohs in the modern world, armour, space, and similar)
made in Gemini/Veo on a Google AI Pro plan (clips of ~10 s, joined into ~40 s reels). They upload reels they like.
Your job: for each reel, write a **remix pack**, a new set of prompts that **takes heavy inspiration from the reel
but never copies a shot**.

You never call Gemini yourself. You write text the owner pastes in.

## The remix rule (the heart of this skill)

Keep from the reel: the **concept** (e.g. "ancient royalty living a modern luxury life"), the **vibe and grade**, the
**camera energy**, the **shot types and pacing**, the **edit rhythm** and the **hook structure**.

Change in **every** shot: at least one of **action**, **vehicle/prop**, **setting**, or **time of day/weather**, and
usually two. The idea must stay recognisably the same kind of shot.

| Reel shot | Too close (don't) | Good remix (do) |
|---|---|---|
| Cleopatra racing a red sports car on a desert highway | Cleopatra racing a blue sports car on a desert highway | Cleopatra flying a fighter jet low over the Nile at sunset · Cleopatra drifting a vintage rally car through Cairo streets at night |
| Knight in full armour walking through a city | Knight in armour walking through another city | Knight in gold armour riding a motorbike through a neon tunnel · Samurai armour on a surfer catching a wave |
| Astronaut sipping coffee on the Moon | Astronaut sipping tea on the Moon | Astronaut grilling on a balcony overlooking Saturn's rings |

Never remake the whole reel in the same order with tiny swaps. Reorder or replace about a third of the shots with
new ideas in the same concept.

## Folder layout

```
gemini-refs/<series>/<reel-name>/      e.g. gemini-refs/pharaohs-modern/cleopatra-cars/
    reel.mp4                            the reference reel (any name, .mp4/.mov/.webm)
    prompt.txt   (optional)             the prompt(s) used for it, if the owner has them
    notes.md     (optional)             what the owner likes, what to avoid; this outranks your own reading
gemini-refs/<series>/SERIES_NOTES.md    you keep this: the look and rules shared by the series
prompts/<series>/<reel-name>_remix.md   you write this: the remix pack
gemini-clips/<slug>/01.mp4 ...          the owner's generated clips (assemble mode)
```

A loose video directly in `gemini-refs/<series>/` counts as its own reel (use the file name as `<reel-name>`).

## Step 1: Watch the reel, shot by shot

```
R="gemini-refs/<series>/<reel>/reel.mp4"; W="out/refs/<series>/<reel>"; mkdir -p "$W"
ffprobe -v error -show_entries format=duration:stream=width,height,r_frame_rate -of compact "$R"
# cut list: one line per shot change with its time
ffmpeg -v error -i "$R" -vf "select='gt(scene,0.25)',showinfo" -f null - 2>&1 | grep -o "pts_time:[0-9.]*" > "$W/cuts.txt"
# one frame per shot, tiled
ffmpeg -v error -i "$R" -vf "select='eq(n,0)+gt(scene,0.25)',scale=270:-2,tile=5x4" -fps_mode vfr -frames:v 1 "$W/shots.jpg"
# steady 2 fps sheet for motion and pacing
ffmpeg -v error -i "$R" -vf "fps=2,scale=180:-2,tile=8x6" -frames:v 1 "$W/sheet.jpg"
```

`Read` both images. For long or dense reels, `python3 .claude/skills/watch/scripts/watch.py "$R"` adds a
transcript and pacing numbers. Check the audio too (`ffmpeg -i "$R" -af volumedetect -f null -`): is it music-only,
narration, or sound effects?

Write the **shot list** at the top of the pack: `#, start-end s, what we see, camera, transition`.

## Step 2: Series notes

Create or update `gemini-refs/<series>/SERIES_NOTES.md` (≤ 50 lines): the concept in one line, the look (palette,
grade, lighting, realism level, lens), the camera language, the average shot length, the transitions, how the hook
works, the recurring characters and how they look, and 5 do's and 5 don'ts. Add the owner's notes word for word.

## Step 3: Write the remix pack: `prompts/<series>/<reel-name>_remix.md`

~~~markdown
# Remix: <reel-name>  (<series>, ~40 s, 9:16)

**Concept kept:** one line.   **What changes:** one line (the remix angle, e.g. "same pharaoh luxury life, but in the air and at sea instead of on roads").

## Reference shot list
| # | Time | Reel shot | Camera | Transition |

## STYLE LOCK  (paste at the top of every prompt, word for word)
<50-80 words: realism level, palette and grade, lighting, lens/DOF, texture, frame rate feel, "vertical 9:16">

## CAST LOCK  (paste into every prompt with that character, word for word)
<per character: 25-40 words of fixed details such as face, age, outfit colours, jewellery, signature item>

## Clips
### Clip 1: <name>  (remix of reel shot #<n>: <what changed>)
```text
<STYLE LOCK>
<CAST LOCK>
<Shot size, lens, camera move and speed>. <Character> <does what> in <setting>, <time/weather/light>.
0-3 s: <beat>. 3-7 s: <beat>. 7-10 s: <beat>.
Sound: <SFX/ambience>, no music, no dialogue.
Avoid: text, captions, logos, watermarks, extra fingers, warped faces, flicker.
```
(... one clip per remixed shot: usually 4-8 clips; the owner cuts the best 2-5 s of each)

## Edit plan (~40 s)
| Order | Clip | Use seconds | Transition | Beat/hook note |
Music: describe the feel and tempo (BPM) only; the owner picks the track. Don't name copyrighted songs to reuse.
~~~

Prompt-writing rules:
- One clear action per clip, with concrete nouns and verbs. Words like "epic" or "cinematic" add nothing on their own.
- The style lock and cast lock are identical in every clip, so the clips look like one reel.
- Always give camera direction: shot size + lens + move + speed ("low-angle tracking shot, 24 mm, fast push-in").
- Front-load the hook: clip 1 is the most striking remix.
- Historical and mythic figures (Cleopatra, pharaohs, knights, gods) are fine. **Don't** use real living people,
  celebrities, named copyrighted characters, real brand logos or car badges ("a sleek Italian supercar", not the brand),
  gore, or readable text or signs.

## Step 4: Index

Append a row to `prompts/README.md` (date, series, reel, file, status `ready`). Commit and push:
`git add prompts gemini-refs/*/SERIES_NOTES.md && git commit -m "Remix pack: <reel>" && git push`

## Assemble mode (when `gemini-clips/<slug>/` has clips)

1. Check each clip with `ffprobe` and a 2 fps contact sheet you Read.
2. Follow the pack's edit plan: trim each clip (`-ss/-t`), scale or pad to 1080x1920 at 30 fps, and join with hard cuts
   (or the transition the plan names). Cut on the beat if the owner added `gemini-clips/<slug>/music.*`.
3. Add the owner's music if present. Otherwise deliver silent with a note.
4. Deliver to `deliveries/reels/<slug>.mp4` plus `<slug>_sheet.jpg`, commit and push, and tell the owner in chat.
