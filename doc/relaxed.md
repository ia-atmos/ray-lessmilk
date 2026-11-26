# The relaxed ports

The exact ports (tag `exact`) give the same trace as the originals, frame
by frame. The relaxed ports follow the general instruction of the author
(2026-11-26): fidelity is the behaviour that can be observed while the
program runs, not the shape of the code; idiomatic Atmos; no bugs of the
originals that are about safety or tied to their language. Branch
`relaxed`.

## What the behaviour needs

Each emulation of an internal of Phaser is kept only if removing it changes
what happens in a run.

- **32-bit floats** (the transforms of Pixi, `lib/physics.atm`, `PHS_F`):
  kept. Measured on 2026-11-26 with doubles in their place, against the
  traces of the originals: three runs change what happens, from a
  collision at an edge on (Dark Blue `bot` from frame 428, deaths and
  positions; Man vs Penguins `jumpy` from frame 163; Princess Quest
  `spikes` from frame 183). Eight more differ only in the last printed
  digits of a few lines, which nothing on the screen shows.

## Bugs of the originals that the ports do not reproduce

Bugs about safety or tied to JavaScript are fixed in the port, and in a
local copy of the original for the checks only (`tools/original/fixes/`,
applied by `tools/setup.sh`; nothing goes upstream).

- **Princess Quest** (`6.patch`):
  - `update_heart(h)`: the parameter hides the global `h` (the height), and
    `camera.y + h` becomes a string, so the test compares a number with a
    string and no heart ever dies. Now a heart below the screen dies, as
    the platforms and the spikes do.
  - `add_platform_moving`, `add_platform_heart`, `add_platform_spike`: when
    the pool of 15 platforms is empty, `add_platform` returns nothing and
    the next line reads its body; the exception stops the loop of frames of
    Phaser for good (the game freezes in a browser). Now no platform is
    added.

  The runs `play` and `drift` are the same as before; `spikes` changed (the
  hearts die), and now goes on through five games (6000 frames, a best
  score of 522), where before it stopped in its second game.
