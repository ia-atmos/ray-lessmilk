# 11. The Three Hearts

Game #11 of lessmilk.com (Thomas Palef, 2014), in Phaser 2.0.1: 331 lines
of JavaScript in 4 files. The port is in `games/the_three_hearts/` (339
lines, in `main.atm`, `menu.atm`, `play.atm`). The student's version
(`the_three_hearts/`) has no written analysis; this one is ours.

The game: A maze of rooms, seen one at a time: keys open doors, enemies go
back and forth, and three hearts end the game.

## The shape of the port

`Menu` and `Play` are tasks; the physics is that of the minified Phaser
2.0.1 (`lib/arcade201.atm`), over the display tree of `lib/scene.atm`.
`Play` makes the map (`map.atm`, from the `map.json` of the original,
`tools/map11.py`) and its objects (`create`, as `createFromObjects`); a
door that opens is the task `Open` (it shrinks, then dies), a death is the
task `Death` (the screen darkens, the player returns), and the slide of
the camera to the next room is the task `Slide`, with the flag `tween` of
the original, which the movement of the player reads
([state.md](../state.md)).

## More

- The state of the game, and the variables that control its flow, kept
  or gone: [state.md](../state.md), section 11.
- What it took to be identical to the original, and its runs:
  [fidelity.md](../fidelity.md), section 11.
- Its row in [table.md](../table.md).
