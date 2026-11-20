# 6. Princess Quest

Game #6 of lessmilk.com (Thomas Palef, 2014), in Phaser 1.1.3: 403 lines
of JavaScript in 5 files. The port is in `games/princess_quest/` (366
lines, in `dead.atm`, `main.atm`, `menu.atm`, `play.atm`). The student's
version (`princess_quest/`) has no written analysis; this one is ours.

The game: The princess jumps by herself from platform to platform; the
arrows move her; the screen goes up with her; a heart throws her high; a
spike, or a fall, ends the game.

## The shape of the port

`Menu`, `Play` and `Dead` are tasks. The princess jumps by herself: each
jump is `Squash`: a tween squashes her, then her body gets its velocity
up. The level is generated as the camera goes up (`generate_level`, with
`add_platform`, `add_moving`, `add_double`, `add_spike`, `add_cloud`),
from the score; the platforms, hearts, spikes and clouds are recycled
groups, as in the original, and so is the emitter of the hearts. Two
quirks of the original stay: the jump ends facing left, and no heart is
killed (see [fidelity.md](../fidelity.md)).

## More

- The state of the game, and the variables that control its flow, kept
  or gone: [state.md](../state.md), section 6.
- What it took to be identical to the original, and its runs:
  [fidelity.md](../fidelity.md), section 6.
- Its row in [table.md](../table.md).
