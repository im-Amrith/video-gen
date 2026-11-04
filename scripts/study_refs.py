#!/usr/bin/env python3
"""Split reference Shorts into frames + contact sheets and measure them (the method from the original video:
30 fps, sheets of 2 s = 60 frames, numbers not adjectives).

usage: python3 -I scripts/study_refs.py [Shorts]          # studies every video not yet in Shorts/STUDIED.json
       python3 -I scripts/study_refs.py Shorts --force     # redo all

For each video  Shorts/<series?>/<name>.mp4  it writes (out/ is git-ignored, the rest is committed):
  out/study/<id>/sheets/sNN.jpg      every frame, 60 per sheet (10x6, 180x320 each): read these for motion
  out/study/<id>/frames/fNNNN.jpg    one 540x960 frame every 2 s: read these for detail
  Shorts/_study/<id>_overview.jpg    one frame per second on one sheet (committed, quick look)
  Shorts/_study/<id>_cuts.jpg        one frame per detected shot (committed)
  Shorts/_study/<id>.json            duration, size, fps, cuts, shot lengths, cuts/min, loudness, voice start
and adds the id to Shorts/STUDIED.json. Nothing is uploaded anywhere.
"""
import json, os, re, subprocess, sys

VIDEO_EXT = (".mp4", ".mov", ".webm", ".mkv", ".m4v")
root = next((a for a in sys.argv[1:] if not a.startswith("--")), "Shorts")
force = "--force" in sys.argv
study_dir = os.path.join(root, "_study")
os.makedirs(study_dir, exist_ok=True)
done_path = os.path.join(root, "STUDIED.json")
done = json.load(open(done_path)) if os.path.exists(done_path) and not force else {}


def run(*a):
    return subprocess.run(a, capture_output=True, text=True)


def ff(*a):
    r = run("ffmpeg", "-v", "error", "-y", *a)
    if r.returncode:
        print("  ffmpeg error:", r.stderr.strip()[:300])


videos = []
for d, _, files in os.walk(root):
    if "_study" in d:
        continue
    for f in sorted(files):
        if f.lower().endswith(VIDEO_EXT):
            videos.append(os.path.join(d, f))

for v in videos:
    rel = os.path.relpath(v, root)
    vid = re.sub(r"[^A-Za-z0-9_-]+", "_", os.path.splitext(rel)[0]).strip("_")
    if vid in done:
        continue
    print(f"== {rel}  ->  {vid}")
    pr = json.loads(run("ffprobe", "-v", "error", "-show_entries",
                        "stream=codec_type,width,height,r_frame_rate:format=duration", "-of", "json", v).stdout or "{}")
    vs = next((s for s in pr.get("streams", []) if s.get("codec_type") == "video"), {})
    dur = float(pr.get("format", {}).get("duration", 0) or 0)
    num, den = (vs.get("r_frame_rate", "30/1").split("/") + ["1"])[:2]
    fps = round(float(num) / float(den or 1), 3)
    has_audio = any(s.get("codec_type") == "audio" for s in pr.get("streams", []))

    work = os.path.join("out", "study", vid)
    os.makedirs(os.path.join(work, "sheets"), exist_ok=True)
    os.makedirs(os.path.join(work, "frames"), exist_ok=True)
    # every frame at 30 fps, 60 per sheet (2 s), portrait cells 180x320
    ff("-i", v, "-vf", "fps=30,scale=180:320:force_original_aspect_ratio=decrease,pad=180:320:(ow-iw)/2:(oh-ih)/2,tile=10x6",
       os.path.join(work, "sheets", "s%02d.jpg"))
    ff("-i", v, "-vf", "fps=0.5,scale=540:960:force_original_aspect_ratio=decrease,pad=540:960:(ow-iw)/2:(oh-ih)/2",
       "-q:v", "3", os.path.join(work, "frames", "f%04d.jpg"))
    # committed quick-look sheets
    cols = 10
    rows = max(1, -(-int(dur + 0.999) // cols))
    ff("-i", v, "-vf", f"fps=1,scale=144:256:force_original_aspect_ratio=decrease,pad=144:256:(ow-iw)/2:(oh-ih)/2,tile={cols}x{rows}",
       "-frames:v", "1", "-q:v", "4", os.path.join(study_dir, f"{vid}_overview.jpg"))
    sc = run("ffmpeg", "-v", "info", "-i", v, "-vf", "select='gt(scene,0.3)',showinfo", "-f", "null", "-").stderr
    cuts = [round(float(t), 2) for t in re.findall(r"pts_time:([0-9.]+)", sc)]
    ff("-i", v, "-vf", "select='eq(n,0)+gt(scene,0.3)',scale=144:256:force_original_aspect_ratio=decrease,pad=144:256:(ow-iw)/2:(oh-ih)/2,tile=10x4",
       "-fps_mode", "vfr", "-frames:v", "1", "-q:v", "4", os.path.join(study_dir, f"{vid}_cuts.jpg"))
    bounds = [0.0] + cuts + [dur]
    shots = [round(b - a, 2) for a, b in zip(bounds, bounds[1:]) if b - a > 0.05]

    loud = voice_start = None
    if has_audio:
        e = run("ffmpeg", "-i", v, "-map", "0:a:0", "-af", "ebur128", "-f", "null", "-").stderr
        m = re.findall(r"I:\s+(-?[0-9.]+) LUFS", e)
        loud = float(m[-1]) if m else None
        e = run("ffmpeg", "-i", v, "-map", "0:a:0", "-af", "silencedetect=n=-40dB:d=0.2", "-f", "null", "-").stderr
        ends = re.findall(r"silence_end: ([0-9.]+)", e)
        starts = re.findall(r"silence_start: ([0-9.]+)", e)
        voice_start = 0.0 if not starts or float(starts[0]) > 0.05 else (float(ends[0]) if ends else None)

    info = {
        "file": rel, "duration_s": round(dur, 2), "size": f'{vs.get("width")}x{vs.get("height")}', "fps": fps,
        "cuts_at_s": cuts, "shots": len(shots),
        "shot_len_s": {"mean": round(sum(shots) / len(shots), 2) if shots else None,
                       "min": min(shots) if shots else None, "max": max(shots) if shots else None},
        "cuts_per_min": round(len(cuts) / dur * 60, 1) if dur else None,
        "loudness_lufs": loud, "sound_starts_s": voice_start,
        "sheets": len(os.listdir(os.path.join(work, "sheets"))),
    }
    json.dump(info, open(os.path.join(study_dir, f"{vid}.json"), "w"), indent=1)
    done[vid] = rel
    print("  ", {k: info[k] for k in ("duration_s", "size", "shots", "cuts_per_min", "loudness_lufs")})

json.dump(done, open(done_path, "w"), indent=1)
print(f"studied {len(done)} video(s); new sheets in out/study/, summaries in {study_dir}/")
