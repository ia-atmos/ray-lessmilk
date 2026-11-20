# 10. Dark Blue

Game #10 of lessmilk.com (Thomas Palef, 2014), in Phaser 1.1.6: 307 lines
of JavaScript in 5 files. The port is in `games/dark_blue/` (421 lines, in
`end.atm`, `main.atm`, `menu.atm`, `play.atm`). The student's version
(`dark_blue/`) has no written analysis; this one is ours.

The game: A platformer of five levels: take all the coins of a level to go
to the next; the red tiles and the enemies send the player back to the
start.

## The shape of the port

`Menu`, `Play` and `End` are tasks; Phaser 1.1.6 has its own frame and its
own physics, which the port emulates in `lib/arcade116.atm` (bodies of
SAT, the walls of the world, `blocked`, tiles and their faces). In `Play`,
`load_map` makes a level from `levels.atm` (the five levels of the
original as data, `tools/levels10.py`): the tilemap, the coins (`Float`, a
loop of two tweens), the enemies, the labels; the end of a level is the
task `Next`, a turn of the player, then the next map. The order of the
bodies in a frame and the camera that follows the player are written in
`Play`. The jump lasts 12 frames, so its height depends on the frame rate:
see [fidelity.md](../fidelity.md).

## More

- The state of the game, and the variables that control its flow, kept
  or gone: [state.md](../state.md), section 10.
- What it took to be identical to the original, and its runs:
  [fidelity.md](../fidelity.md), section 10.
- Its row in [table.md](../table.md).
