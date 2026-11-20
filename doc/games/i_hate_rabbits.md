# 9. I Hate Rabbits

Game #9 of lessmilk.com (Thomas Palef, 2014), in Phaser 1.1.3: 252 lines
of JavaScript in 6 files. The port is in `games/i_hate_rabbits/` (247
lines, in `end.atm`, `level.atm`, `main.atm`, `menu.atm`, `play.atm`). The
student's version (`i_hate_rabbits/`) has no written analysis; this one is
ours.

The game: The bad one walks around the circle; the rabbits of each level
come to the circle, and SPACE makes the next one jump over the bad one.
Nine levels, one per turn; then the rabbits saved.

## The shape of the port

`Menu`, `Play` and `End` are tasks. The bad one turns around the circle; a
level is a set of rabbits (`level.atm`, the levels of the original as
data), each with three tasks in its life: `Enter` (it comes to the
circle), `Jump` (over the bad one, on SPACE), and `Fade` (it leaves). The
tween that the original kept in `rabbit.t` to know if the entry ran is the
life of the task `Enter`. The change of level once per turn
(`change_level`) stays a flag ([state.md](../state.md)).

## More

- The state of the game, and the variables that control its flow, kept
  or gone: [state.md](../state.md), section 9.
- What it took to be identical to the original, and its runs:
  [fidelity.md](../fidelity.md), section 9.
- Its row in [table.md](../table.md).
