# Bench: the CPU of a frame, port against original

Measured on 2026-11-22 by `tools/bench.py`, in the container of the session:
4 vCPUs (Intel Xeon @ 2.10GHz), Chromium of Playwright (chromium-1243), node
22.23.4, the compiler `ia-atmos/lang` at 3ffac71, raylib 6.2 with
`env/raylib.patch`, built `-O2`. Numbers of one machine, at one time.

## What is measured

For each game, its longest run (`tst/<game>/*.run`): the same frames with
the same input in the port and in the original. Each number is the median of
3 runs.

- **Frame**: the whole frame: the logic, the drawing calls, the raster of the
  pixels and their copy out of the frame.
  - Port: CPU time of the process (user + system) for the run, minus that
    of the same run cut to one frame (the loading), divided by the frames.
    raylib draws in software (rlsw) into memory; the frame is copied out at
    the end (`SwapScreenBuffer`).
  - Original (`run.js` with `BENCH=1`): CPU time of all the processes of
    Chromium (CDP `SystemInfo.getProcessInfo`) over a loop of the frames in
    the page (no round trip per frame), divided by the frames. The 2D canvas
    is in software (`--disable-gpu --disable-accelerated-2d-canvas`), and a
    pixel is read back after each frame: without it, Chromium rasterizes
    nothing until the canvas is shown or read, and the frame cost the same
    as the logic.
- **Logic**: the same, with the raster and the copy skipped: all the code of
  the game and of the engine runs, the drawing calls included, and no pixel
  is written.
  - Port: `RL_NODRAW=1` (the patch: rlsw is never ready to render, so clears
    and primitives return at once; `SwapScreenBuffer` copies nothing).
  - Original: `NODRAW=1` (the harness: `drawImage`, `fillRect`,
    `clearRect`, `strokeRect`, `fillText`, `strokeText`, `fill`, `stroke`,
    `putImageData` of the 2D context do nothing).
- **Memory**: not the same thing on both sides. Port: the peak resident
  memory of the process (`ru_maxrss`), which counts the framebuffer, the
  textures and the code. Original: the JavaScript heap used at the end of
  the run (CDP `JSHeapUsedSize`), without the canvas, the images or Chromium.

Every measured run gives the trace of the original (`tst/<game>/<run>.out`),
in both modes: skipping the raster changes nothing that the trace sees.
The CPU time of Chromium has a resolution of 10 ms, so its numbers below are
within 10 ms / frames (0.001 to 0.008 ms) of the truth.

## Results

ms of CPU per frame; ratio = port / original.

| Game | Run | Frames | Port frame | Port logic | Original frame | Original logic | Ratio frame | Ratio logic | Port MB (RSS) | Original MB (JS heap) |
|------|-----|-------:|-----------:|-----------:|---------------:|---------------:|------------:|------------:|--------------:|----------------------:|
| Box Jump | win | 15100 | 0.452 | 0.145 | 0.197 | 0.096 | 2.30 | 1.51 | 26.7 | 10.1 |
| Connected | pairs | 7756 | 2.539 | 0.395 | 0.643 | 0.255 | 3.95 | 1.55 | 22.7 | 13.8 |
| Crazy Snake | greedy | 9400 | 1.998 | 0.267 | 0.829 | 0.085 | 2.41 | 3.14 | 34.3 | 9.1 |
| Dark Blue | bot | 6000 | 2.446 | 1.263 | 0.977 | 0.412 | 2.50 | 3.07 | 23.6 | 23.0 |
| Fill the Holes | win | 11293 | 1.214 | 0.222 | 0.229 | 0.097 | 5.29 | 2.28 | 27.0 | 9.4 |
| I Hate Rabbits | fast | 5700 | 1.870 | 0.112 | 0.330 | 0.100 | 5.67 | 1.12 | 27.2 | 8.2 |
| Man vs Penguins | jumpy | 4800 | 1.674 | 0.419 | 0.648 | 0.302 | 2.58 | 1.39 | 27.4 | 8.6 |
| Pixel War | dodge | 3600 | 0.599 | 0.108 | 0.178 | 0.119 | 3.37 | 0.90 | 20.9 | 12.8 |
| Princess Quest | drift | 4777 | 1.478 | 0.148 | 0.588 | 0.262 | 2.51 | 0.57 | 38.5 | 10.7 |
| Run! | random | 2400 | 0.571 | 0.078 | 0.275 | 0.096 | 2.08 | 0.81 | 21.4 | 6.5 |
| Save the City | fast | 1180 | 1.752 | 0.144 | 0.466 | 0.246 | 3.75 | 0.58 | 27.7 | 5.1 |
| The Three Hearts | bot | 1200 | 5.032 | 0.832 | 0.550 | 0.384 | 9.14 | 2.17 | 20.9 | 5.4 |

## What the numbers say

- All frames are far below the 16.7 ms of a frame at 60 fps, on both sides.
- The logic: faster than the original in 4 games (Pixel War, Princess
  Quest, Run!, Save the City), within a factor of 2.3 in 6 more, then Dark
  Blue (3.1) and Crazy Snake (3.1).
- The whole frame: the port spends most of its frame in the raster (in
  software, rlsw); Chromium's raster of the canvas (Skia) costs it 0.1 to
  0.6 ms. The ratio of the frame says more about the two rasterizers than
  about the ports.
- Memory: 21 to 39 MB for the ports.

## Since the first measure (2026-11-20)

The first measure (compiler 8c46149) found Dark Blue at 4.72 ms of logic a
frame (10 times the original) and three ports with a peak of 98 to 196 MB.
What changed (each with the same traces):

- Dark Blue: 4.72 to 1.26 ms. The input of the test mode (`RL_INPUT`) was
  read whole each frame (quadratic in the inputs of the bot); now it goes on
  from where it stopped. And the compiler is faster (lang 8c46149 to
  3ffac71); the tweens of `set :out` (branch `pin-out`, now merged) first
  cost 34% of its instructions, until each tween pinned its own table
  (reported: atmos-pin#30, #31, both fixed).
- Memory: a scaled text loaded a font for each size its tween went through
  (Crazy Snake: 32 sizes, 196 MB); it is now drawn at its size under its
  scale, as Pixi draws its picture (34 MB).
- The longest runs changed: Box Jump and Fill the Holes now have runs to
  their End (`win`).

## Running it

    tools/bench.py                  # all twelve
    tools/bench.py dark_blue        # one game
