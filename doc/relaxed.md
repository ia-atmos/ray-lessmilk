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
