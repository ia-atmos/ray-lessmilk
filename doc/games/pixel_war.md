# 2. Pixel War

Game #2 of lessmilk.com (Thomas Palef, 2014), in Phaser 1.1.3: 198 lines
of JavaScript in 5 files. The port is in `games/pixel_war/` (238 lines, in
`intro.atm`, `main.atm`, `over.atm`, `play.atm`). The student's version
(`pixel_war/`) has no written analysis; this one is ours.

The game: The player moves at the bottom and fires up; enemies and bullets
fall; a bonus adds fires. Three lives; then the score, and UP plays again.

## The shape of the port

The screens are tasks (`Intro`, `Play`, `Over`), awaited in turn by the
main program. In `Play`, the player, the enemies, the fires, the bullets
and the bonuses are recycled groups, as in the original; what the original
spread over `update` and timestamps (the next enemy, the next bullet, the
end of a bonus) is a set of tasks that loop with `await Wait(...)`, and a
hit of the player (`player_hit`) runs the loss of a life in one place.
`Bump` is the tween of the score that goes up and back.

## More

- The state of the game, and the variables that control its flow, kept
  or gone: [state.md](../state.md), section 2.
- What it took to be identical to the original, and its runs:
  [fidelity.md](../fidelity.md), section 2.
- Its row in [table.md](../table.md).
