# 4. Man vs Penguins

Game #4 of lessmilk.com (Thomas Palef, 2014), in Phaser 1.1.3: 308 lines
of JavaScript in 4 files. The port is in `games/man_penguins/` (306 lines,
in `main.atm`, `menu.atm`, `play.atm`). The student's version
(`man_penguins/`) has no written analysis; this one is ours.

The game: A platformer on one screen: take the coins, jump on the
penguins; a penguin that touches the man, or a fall, kills him, and he
starts again.

## The shape of the port

`Menu` and `Play` are tasks. The bricks and the walls are groups made from
tables (`Bricks`); the penguins are a recycled group, as in the original,
and a new one comes when the clock passes `enemyTime`, which stays (the
order of the random draws depends on it). The deaths are sequences: `Fall`
(the man falls out of the screen, then starts again in the middle) and
`Flatten` (a penguin squashed), and the camera shakes with `Shake`, three
tweens chained, as the original chains them.

## More

- The state of the game, and the variables that control its flow, kept
  or gone: [state.md](../state.md), section 4.
- What it took to be identical to the original, and its runs:
  [fidelity.md](../fidelity.md), section 4.
- Its row in [table.md](../table.md).
