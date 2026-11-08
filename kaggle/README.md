# Kaggle: free image-to-video (Wan 2.2)

`wan22_i2v_batch.ipynb` turns **your images + prompts** into video clips on Kaggle's free T4 GPU, using the open
Wan 2.2 14B image-to-video model with the LightX2V 4-step LoRA in ComfyUI.

## Use it
1. kaggle.com → **Create → New Notebook → File → Import Notebook** → upload `wan22_i2v_batch.ipynb`.
2. Right panel: **Accelerator: GPU T4 x2**, **Internet: On** (phone-verified account needed).
3. Inputs: **+ Add Input → Upload → New Dataset** with your shots:
   ```
   shot01.png   shot01.txt   (the .txt is the motion prompt)
   shot02.png   shot02.txt
   ```
   or images plus a `jobs.csv` (`image,prompt,seconds,seed,name`; only the first two are required).
4. **Run All.** Clips land in `/kaggle/working/outputs/` (`<name>.mp4` at 480x832 16 fps, `<name>_1080.mp4`
   upscaled to 1080x1920, a contact sheet and `timings.csv`). Download them from the notebook's Output panel.

With no inputs, the notebook renders one 2 s test clip so you can see how long the GPU takes.

## Settings (first code cell)
| Setting | Default | Notes |
|---|---|---|
| `MODE` | `batch` | `tunnel` prints a public ComfyUI URL for OpenMontage (`COMFYUI_VIDEO_SERVER_URL`) |
| `MODEL` | `gguf_q4` | `gguf_q5` is a bit sharper; `fp8` is what OpenMontage's own workflow expects but needs more RAM |
| `WIDTH, HEIGHT` | 480, 832 | 576, 1024 looks better and is ~1.6x slower |
| `SECONDS` | 5 | 81 frames at 16 fps, the model's sweet spot |

## Images that work
- The image **is the first frame**: frame it exactly like the shot (angle, lens, distance), 9:16. If it isn't, the
  model jumps away from it in the first second (this is what happened in the two fal.ai test clips).
- The prompt describes **motion only**: what moves, in time order, and one simple camera move.

## Status
Written 2026-11-08 and checked in the cloud by queuing the graph into a CPU-only ComfyUI with placeholder model files
(that confirms every node and input exists). Not yet run on a real GPU: the first Kaggle run is the real test. Send
back `timings.csv` and any error text and the notebook gets fixed.
