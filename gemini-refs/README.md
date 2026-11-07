# Reference reels for Gemini remixes (your reel-edit channel)

This channel is **separate** from the What If / History shorts. One folder per series, one sub-folder per reel:

```
gemini-refs/
  pharaohs-modern/
    cleopatra-cars/
      reel.mp4        the reel you like
      prompt.txt      (optional) the prompt you or the creator used
      notes.md        (optional) what you like, what to avoid
  armor/
  space/
```

Make a new folder for any new series (e.g. `gods-in-tokyo/`). A video placed straight in a series folder also works.
Keep files under 100 MB (under 25 MB if you upload through the GitHub website).

After each video at the approval gate, Claude remixes 1-2 waiting reels into `prompts/<series>/<reel>_remix.md`:
Nano Banana image prompts (character sheets + one start frame per shot), one 8 s single-shot Veo prompt per setting
(4-6 per reel; the edit cuts 2-3 short pieces from each), and an edit list. The remix is heavily inspired by the reel,
but every shot changes its action, vehicle/prop or setting (Cleopatra racing a car → Cleopatra flying a jet over the Nile).
