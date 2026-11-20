# 5. Fill the Holes

Game #5 of lessmilk.com (Thomas Palef, 2014), in Phaser 1.1.3: 363 lines
of JavaScript in 6 files. The port is in `games/fill_the_holes/` (277
lines, in `end.atm`, `main.atm`, `menu.atm`, `play.atm`). The student's
version (`fill_the_holes/`) has no written analysis; this one is ours.

The game: Click a side of a box to push it; it slides until a wall, a
hole, or out of the board. Fill all the holes of each level.

## The shape of the port

`Menu`, `Play` and `End` are tasks. A level is drawn from a table of
characters (`levels.atm`, the levels of the original as data) by
`draw_level`, and cleared by `clear_level`; the boxes, walls and holes are
groups. A click is an event of the input of Phaser (`lib/input.atm`),
which the port emulates in full: the sprite on top under the pointer, the
side of the box clicked, from its corners, and a listener added once per
level (`Signal.add` does not add it twice). A box that leaves the board
starts the next state from inside the frame, as `onOutOfBounds` did.

## More

- The state of the game, and the variables that control its flow, kept
  or gone: [state.md](../state.md), section 5.
- What it took to be identical to the original, and its runs:
  [fidelity.md](../fidelity.md), section 5.
- Its row in [table.md](../table.md).
