# Decisions: tunnel-through-earth (What If pilot)

- **Topic as pilot**: the most visual of the five briefs for the iso style (its native "tilt through strata" move), and the facts are all published and checkable.
- **Style: Lemo-Opuscar Isometric Infographic**, Canvas 2D only, so it renders in the cloud (no WebGL). 1080x1920, 30 fps.
- **Engine**: copied `engine.js` from the style's demo (technique only); story, world, shots, sound and timeline are our own.
- **Voice**: Kokoro `am_michael` at speed 1.2 to land at ~67 s. American spelling (kilometers, center) so voice and captions match.
- **No Whisper check**: huggingface.co, hf-mirror and GitHub releases are blocked here, so faster-whisper can't download a model. Kokoro reads plain English reliably; word timings in `voice/words.json` are estimated from each line's audio (voiced segments, split by characters). Flagged to the owner.
- **Air twist rewritten after fact-check**: with air, drag caps the fall at ~200 km/h, so you don't oscillate; you sink for more than a day and stop at the centre. The script says exactly that.
- **Speed gauge**: our PREM-like integration peaks at ~36,000 km/h; the narration says "over 28,000" (the uniform-Earth figure in the sources). The gauge counts up and then holds at "28,000+" so the screen never contradicts the voice.
- **Scale**: the planet column is drawn to scale vertically (layer depths are real); the tunnel, the person and the Kola line are drawn at a fixed screen size ("NOT TO SCALE" on the end card).
- **Tunnel on the front edge of the column**: the front faces are section planes through Earth's axis, so the shaft is visible from top to bottom in one vertical frame.
- **Captions**: burned in as map-label cards (style rule), placed above the Shorts UI zone.
- **Skill gates skipped** (storyboard): per CLAUDE.md "Working alone".
