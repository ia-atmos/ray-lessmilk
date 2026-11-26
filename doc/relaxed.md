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
- **The Three Hearts** (`11.patch`): `player_dead` plays the sound of the
  death if `this.sound`, a field that is never set (the flag of sound is
  the global `sound`): JavaScript reads `undefined` with no error, and the
  sound never plays. Now it plays when the sound is on. The traces do not
  see sounds: the runs are the same.

## A task per entity, in place of the recycled slots of a group

Phaser recycles the sprites of a group (`createMultiple`,
`getFirstExists`); the exact ports kept those slots (`Group`, `.slots`).
A relaxed port makes each entity a task that owns its sprite and body,
spawned into a pool, and ends when the entity dies; its tweens go to a
pool of its own, and end with it.

- **I Hate Rabbits**: `Rabbit` (2026-11-26). The two runs give the same
  traces. 250 lines and 2306 tokens (were 245 and 2252): a few more, for a
  lifetime in one place.
- **Pixel War**: kept with its slots (tried 2026-11-26). Each sprite of a
  group remembers whether it was in the world when it died
  (`outOfBoundsKill` compares with where it was), and a spawn takes the
  first dead sprite: one that never lived (made at 0, 0) or that died in
  the world (shot) is killed at its first preUpdate, where it appears above
  the screen, so that enemy, bullet or bonus never shows; one that died out
  of the world lives. Which spawns vanish depends on the history of each
  slot, which the runs see (from frame 7 on): the slots are behaviour here,
  and a task per entity would have to keep them.
- **Connected**: `Dot` (2026-11-26). The two runs give the same traces,
  once the trace sums the scales of the dots in an order that does not
  depend on the list (each rounded to thousandths, summed as an integer,
  in `tools/original/trace/7.js` and in the port): in another order, the
  sum of the same scales differed in its last digit in one line of each
  run. A dot that is removed grows over its neighbours while it fades; it
  is drawn in the order of the pool, not of the slots of the group.
- **Man vs Penguins**: `Penguin` (2026-11-26). The two runs give the same
  traces. A penguin that falls out is replaced inside the loop over the
  penguins; a new task is visited by that loop, where a reused slot before
  it was not, but a new penguin does nothing in it (not on the ground, not
  below the screen).
- **Fill the Holes**: keeps its slots, as Pixel War: when each reused
  sprite starts as a new one (no memory of where it died), its run `solve`
  changes from line 3031.
- **Princess Quest**: `Thing`, for the clouds, platforms, hearts and spikes
  (2026-11-26). The three runs give the same traces.
- **Dark Blue**: `Coin`, `Enemy` (2026-11-26). Its coins and enemies were
  lists to which each death of the player added the coins of the level
  again, the dead ones kept and walked in each phase of each frame (the
  groups of Phaser keep their killed sprites too, which changes nothing
  that can be seen). Each is now a task that ends when its sprite no
  longer exists. The three runs give the same traces; the logic of the run
  `bot` (6000 frames, no drawing, CPU of the process with its loading,
  median of 3) went from 1.25 to 0.54 ms a frame.

## Control in place of flags

- **Crazy Snake** (2026-11-26): the nine effects by score, an `ifs` with a
  counter `effect` tested in each update, are a table walked by a task
  that awaits each score (`await :update until score == e@0`), and then
  turns the level in each update from 50 on. The task is a branch of the
  `par` after the update, so that it sees the score of the coin taken in
  the same update, as the original. The two runs give the same traces.

## Where the relaxed ports stand (2026-11-26)

- The 36 tests pass, with the traces of the originals (Princess Quest
  and The Three Hearts against their originals with the bugs fixed, and
  Connected with its trace summing in any order).
- A task per entity in five games (I Hate Rabbits, Connected, Man vs
  Penguins, Princess Quest, Dark Blue); Pixel War and Fill the Holes keep
  their slots (behaviour); Run!, Box Jump and Save the City already had
  theirs as tasks.
- Size (`doc/table.md`, without `lib/`): 3571 lines and 29299 tokens, from
  3514 and 28980 in the exact ports: the life of each entity is now written
  in the game, where the slots of `lib/` did it before.
- Not changed: the 32-bit floats and the order of the frame of Phaser
  (behaviour); the control left, where it is read and written in the same
  update in the order of the original (`doc/state.md`).
