# 12. Crazy Snake

Game #12 of lessmilk.com (Thomas Palef, 2014), in Phaser 2.0.2: 286 lines
of JavaScript in 5 files. The port is in `games/crazy_snake/` (294 lines,
in `end.atm`, `main.atm`, `menu.atm`, `play.atm`). The student's version
(`crazy_snake/`) has no written analysis; this one is ours.

The game: A snake eats coins on a board; every five coins the board turns,
shrinks, stretches or moves, and from fifty on it turns for good.

## The shape of the port

`Menu`, `Play` and `End` are tasks, in the frame of Phaser 2.0.2, where a
state starts in the next frame (a screen that ends awaits `:state`) and
the timers run first (`Every`, `game.time.events.loop`). The snake moves
by the timer (`move`); the board is a group with a transform
(`lib/scene.atm`), which the effects turn, scale and move with tweens, one
per five coins, in the update, as the original; the death is the task
`Vanish` (the board shrinks to nothing).

## More

- The state of the game, and the variables that control its flow, kept
  or gone: [state.md](../state.md), section 12.
- What it took to be identical to the original, and its runs:
  [fidelity.md](../fidelity.md), section 12.
- Its row in [table.md](../table.md).
