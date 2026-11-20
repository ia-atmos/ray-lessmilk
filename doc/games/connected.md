# 7. Connected

Game #7 of lessmilk.com (Thomas Palef, 2014), in Phaser 1.1.3: 334 lines
of JavaScript in 5 files. The port is in `games/connected/` (357 lines, in
`end.atm`, `main.atm`, `menu.atm`, `play.atm`). The student's version
(`connected/`) has no written analysis; this one is ours.

The game: Connect dots of the same color with the mouse; twenty moves; the
more dots in a move, the more each is worth.

## The shape of the port

`Menu`, `Play` and `End` are tasks. The board is a group of dots made by
`add_dot`; a move selects dots of one color in a row (`select`,
`in_range`, `try_select`), and on release the dots fall (`move_down`) and
new ones come from above, each with a tween (`Tween`, a task that waits
its delay, then moves). The move reads the pointer in each update, with
the two flags of the original (`clicked`, `next_time`), which stay
([state.md](../state.md)).

## More

- The state of the game, and the variables that control its flow, kept
  or gone: [state.md](../state.md), section 7.
- What it took to be identical to the original, and its runs:
  [fidelity.md](../fidelity.md), section 7.
- Its row in [table.md](../table.md).
