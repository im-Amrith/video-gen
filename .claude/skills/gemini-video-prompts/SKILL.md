---
name: gemini-video-prompts
description: Remix the owner's reference reels (AI edits like armour, space, pharaohs in the modern world) into new Google Gemini / Veo prompt packs - study each reel in gemini-refs/<series>/<reel>/ shot by shot, then write Nano Banana start-frame prompts and one 8 s single-shot Veo prompt per setting (4-6 for a reel) that keeps the concept, vibe and edit rhythm but changes the action, vehicle/prop or setting, plus an edit list that cuts the clips into the finished reel. Use at the approval gate in CLAUDE.md, or when asked for Gemini prompts, Veo prompts, reel remixes, or to assemble generated clips from gemini-clips/.
---

# Gemini reel remixes

The owner runs a reel-edit channel: short AI-generated edits (pharaohs in the modern world, armour, space, and similar)
made in Gemini/Veo on a Google AI Pro plan (Veo clips of up to 8 s, cut into 15-40 s reels). They upload reels they like.
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

## How Veo really works (read first: the old 10 s / multi-cut packs failed because of this)

- **Veo makes 4, 6 or 8 s clips**, not 10 s. In Flow (Google AI Pro: ~1,000 credits a month) an 8 s
  **Veo 3.1 Fast** clip costs ~20 credits (about 50 clips a month) and **Quality** costs ~100. Draft everything on Fast;
  spend Quality only on the hook shot, if at all. The Gemini app's own Veo has a small daily cap: use it for tests.
- **One generation = one continuous shot** (one place, one camera move). Packing 5-7 "cut to" beats into one prompt is
  what made the old clips mushy: Veo blends the beats, morphs faces and drops half the actions. At most **one** cut per
  prompt, and only between two angles of the same place and moment.
- **Fast-cut reels are cut from long shots.** A reel with 1.5-2 s shots does not need one generation per shot:
  write each 8 s shot so the action **changes over time** (start, middle, end look different), then the edit takes
  2-3 pieces of 1-2 s from it. A 20 s reel of ~10 cuts = **4-6 generations**.
- **Consistency comes from images, not text.** Text-only cast locks drift between clips. Each pack starts with
  **Nano Banana image prompts** (Gemini app, image generation, 9:16): one character sheet per character and one
  **start frame** per shot. The owner then uses Flow **Frames to Video** (start frame + motion prompt) or
  **Ingredients to Video** (character sheet + setting image). The video prompt then only has to describe motion.
- **Write positively.** Flow has no negative-prompt box; a long "Avoid: extra fingers, warped faces, text..." list in
  the prompt often adds those things. Describe what is there; end with one short line: "No on-screen text."
- **Order Veo reads best** (80-140 words): shot size + lens + camera move → subject (cast lock) → the one main action,
  with timing ("in the first 2 seconds... then...") → setting → light → style/grade → sound. Physical detail sells
  realism: weight, dust, cloth, water, speed ("slowly", "in one heavy second").
- **Sound:** Veo 3 makes audio. Ask for SFX and ambience, "no music" (the owner adds the track). Dialogue goes in quotes,
  one short line, with who says it.

## The pack structure

1. **Shot list** of the reference reel (as before) with the cuts measured.
2. **Plan:** group the reel's cuts into **generations** (one per setting/moment). For each, say which 1-2 s pieces the
   edit takes. Each generation remixes 1-3 reel shots.
3. **Image prompts** (Nano Banana): character sheets, then one start frame per generation, 9:16, same style lock.
4. **Video prompts:** one per generation, 8 s, written for Frames to Video (motion only, since the image holds the look)
   plus a text-only fallback line set (style lock + cast lock) for when no start frame is used.
5. **Edit list:** exact in/out seconds inside each generated clip, in reel order, with the transition and the beat.

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

Write the **shot list** at the top of the pack: `#, start-end s, what we see, camera, transition`, then group the
shots into generations (one per setting/moment). Make one 2 fps sheet per group to check it:
`ffmpeg -v error -ss <start> -t 10 -i "$R" -vf "fps=2,scale=180:-2,tile=5x4" -frames:v 1 "$W/win<k>.jpg"`

**Optional, if MeiGen tools are available:** run 1-3 `search_gallery` queries for the reel's concept
(e.g. "pharaoh sports car neon city") and `get_inspiration` on the best hits. Borrow *prompt structure and wording
patterns* (lighting terms, camera language), not whole prompts. These calls are free; never call MeiGen's generate
or upload tools (CLAUDE.md, "MeiGen").

## Step 2: Series notes

Create or update `gemini-refs/<series>/SERIES_NOTES.md` (≤ 50 lines): the concept in one line, the look (palette,
grade, lighting, realism level, lens), the camera language, the average shot length, the transitions, how the hook
works, the recurring characters and how they look, and 5 do's and 5 don'ts. Add the owner's notes word for word.

## Step 3: Write the remix pack: `prompts/<series>/<reel-name>_remix.md`

~~~markdown
# Remix: <reel-name>  (<series>, ~N s, 9:16)

**Concept kept:** one line.   **What changes:** one line.

## Reference shot list
| # | Time | Reel shot | Camera | Transition |

## Plan: <k> generations of 8 s → <m> cuts
| Gen | Remixes reel shots | Setting / moment | Pieces the edit takes |

## STYLE LOCK  (word for word in every image and text-only prompt)
<40-70 words: realism, palette/grade, light, lens, texture, "vertical 9:16">

## CAST LOCK  (word for word wherever the character appears)
<per character: 25-40 words of fixed details>

## Images (Gemini app → Nano Banana, 9:16)
### Character sheet: <name>
```text
<STYLE LOCK> Character reference sheet on a plain grey background: <CAST LOCK>, full body front view and a
close-up of the face, neutral pose, even light. Vertical 9:16.
```
### Start frame G1
```text
<STYLE LOCK> <one frozen moment: framing, lens, who is where, the prop, the setting, the light>. Vertical 9:16.
```
(one per generation; for Frames to Video also attach the character sheet when the tool allows it)

## G1 · 8 s  (remixes reel shots #1-#2: <what changed>)
```text
<shot size, lens, camera move and speed>. <The one main action, in time order: what happens in 0-3 s, 3-6 s, 6-8 s>.
<Physical detail>. Sound: <SFX/ambience>, no music. No on-screen text.
```
Text-only fallback: put STYLE LOCK + CAST LOCK in front of the same text.

## EDIT LIST
| # | Clip | In-out (s) | Role | Transition / beat |
Music: feel + BPM only; the owner picks the track.
~~~

Prompt-writing rules:
- One continuous shot per generation; at most one cut, inside the same place and moment.
- The action must evolve across the 8 s so the edit can harvest several different-looking pieces.
- Always give camera direction: shot size + lens + move + speed ("low-angle tracking shot, 24 mm, fast push-in").
- Front-load the hook: G1 is the most striking remix; consider Quality for it only.
- Concrete nouns and verbs; "epic" or "cinematic" alone add nothing.
- Historical and mythic figures (Cleopatra, pharaohs, knights, gods) are fine. **Don't** use real living people,
  celebrities, named copyrighted characters, real brand logos or car badges ("a sleek Italian supercar", not the brand),
  gore, or readable text or signs.

## Step 4: Index

Append a row to `prompts/README.md` (date, series, reel, file, status `ready`). Commit and push:
`git add prompts gemini-refs/*/SERIES_NOTES.md && git commit -m "Remix pack: <reel>" && git push`

## Assemble mode (when `gemini-clips/<slug>/` has clips)

1. Check each clip with `ffprobe` and a 2 fps contact sheet you Read.
2. Follow the pack's EDIT LIST: trim each clip (`-ss/-t`), scale or pad to 1080x1920 at 30 fps, and join with hard cuts
   (or the transition the plan names). Cut on the beat if the owner added `gemini-clips/<slug>/music.*`.
3. Add the owner's music if present. Otherwise deliver silent with a note.
4. Deliver to `deliveries/reels/<slug>.mp4` plus `<slug>_sheet.jpg`, commit and push, and tell the owner in chat.
