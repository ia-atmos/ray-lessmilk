# Bench: the CPU of a frame, port against original

Measured on 2026-11-20 by `tools/bench.py`, in the container of the session:
4 vCPUs (Intel Xeon @ 2.10GHz), Chromium of Playwright (chromium-1243), node
22.23.4, the compiler `ia-atmos/lang` at 8c46149, raylib 6.2 with
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
| Box Jump | random | 3600 | 0.483 | 0.216 | 0.272 | 0.181 | 1.77 | 1.20 | 16.0 | 5.7 |
| Connected | pairs | 7756 | 2.632 | 0.477 | 0.656 | 0.267 | 4.01 | 1.79 | 22.9 | 15.3 |
| Crazy Snake | greedy | 9400 | 2.233 | 0.338 | 0.859 | 0.109 | 2.60 | 3.11 | 195.7 | 9.0 |
| Dark Blue | bot | 6000 | 5.668 | 4.720 | 1.084 | 0.460 | 5.23 | 10.26 | 23.6 | 22.9 |
| Fill the Holes | solve | 3600 | 1.119 | 0.214 | 0.253 | 0.144 | 4.42 | 1.48 | 114.4 | 5.4 |
| I Hate Rabbits | fast | 5700 | 2.209 | 0.228 | 0.344 | 0.102 | 6.42 | 2.24 | 27.1 | 9.5 |
| Man vs Penguins | jumpy | 4800 | 1.940 | 0.463 | 0.729 | 0.363 | 2.66 | 1.28 | 98.5 | 9.8 |
| Pixel War | dodge | 3600 | 0.764 | 0.178 | 0.197 | 0.139 | 3.87 | 1.28 | 20.9 | 12.8 |
| Princess Quest | drift | 4777 | 1.618 | 0.181 | 0.639 | 0.312 | 2.53 | 0.58 | 38.2 | 11.5 |
| Run! | random | 2400 | 0.693 | 0.096 | 0.271 | 0.113 | 2.56 | 0.85 | 21.2 | 6.9 |
| Save the City | fast | 1180 | 1.665 | 0.204 | 0.450 | 0.221 | 3.70 | 0.93 | 27.4 | 4.3 |
| The Three Hearts | bot | 1200 | 5.449 | 0.901 | 0.567 | 0.359 | 9.61 | 2.51 | 20.9 | 5.6 |

## What the numbers say

- All frames are far below the 16.7 ms of a frame at 60 fps, on both sides.
- The logic: faster than the original in 3 games (Princess Quest, Run!,
  Save the City), within a factor of 2.3 in 6 more, then The Three Hearts
  (2.5), Crazy Snake (3.1) and Dark Blue (10.3, 4.7 ms a frame). Dark Blue
  is the one game on the bodies of Phaser 1.1.6 (polygons,
  `lib/arcade116.atm`); its cost is not yet looked into.
- The whole frame: the port spends most of its frame in the raster (in
  software, rlsw); Chromium's raster of the canvas (Skia) costs it 0.1 to
  0.6 ms. The ratio of the frame says more about the two rasterizers than
  about the ports.
- Memory: three ports have a large peak (Crazy Snake 196 MB, Fill the
  Holes 114 MB, Man vs Penguins 98 MB, against 16 to 38 MB for the others);
  not yet looked into.

## Running it

    tools/bench.py                  # all twelve
    tools/bench.py dark_blue        # one game
