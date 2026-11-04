# Reference Shorts for the Claude-made videos

Download Shorts whose **look and craft** you want our What If / History videos to have and put them here:
- `Shorts/what-if/`: references for the What If series
- `Shorts/history/`: references for the History series
- loose in `Shorts/`: applies to both

Before each series' pilot (and at every approval gate when new ones appear), the session runs
`python3 -I scripts/study_refs.py Shorts`. That splits every video into frames at 30 fps (sheets of 2 s = 60 frames)
and measures cuts, shot lengths and loudness. The session then studies motion, depth, textures, characters, lighting,
outlines, grade and the script/pacing, and writes what works to `briefs/<series>/REFERENCE_STUDY.md`.
Quick-look sheets land in `Shorts/_study/`.

References are for **look and craft only**. Our stories, characters and voice stay our own. Keep each file under 100 MB.
