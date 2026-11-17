# The games, one row each

- **Lines** and **tokens**: of code, counted by `tools/count.py` (no blank
  lines, no comments; in Atmos, no trace). JavaScript: all the files of the
  game in `js/` (states, boot, loading). Atmos: `games/<game>/`, without the
  shared modules of `lib/` (2106 lines and 18743 tokens for now), which do
  what Phaser did.
- **%**: the change from JavaScript to Atmos. In all, the twelve games have
  8% more lines and 23% fewer tokens (3287 to 3534 lines, 37669 to 28956
  tokens). Tokens are the measure that matters: lines depend on the layout
  (Atmos puts each step of a sequence, and each closing brace, on its own
  line; the originals put an `if` and its call on one), while tokens count
  what is written. `this.player.body.velocity.x = -300;` is one line and 13
  tokens; `set body.vx = -300` is one line and 7. The four lines of Run! that
  keep the time of the next enemy and of the next point (74 tokens in 8
  lines) are two loops with `await Wait(...)` in Atmos (51 tokens in 15
  lines).
- **Control**: the variables of the JavaScript that only control the flow
  (timestamps compared with the clock, flags, states), and how many are left
  in the port. The list is in [state.md](state.md).
- **Runs**: scripted runs, and whether the port is the same as the original
  on all of their trace lines ([fidelity.md](fidelity.md)).
- **Memory** and **CPU**: in [bench.md](bench.md), once measured.

| # | Game | Phaser | Lines JS | Lines Atmos | Lines % | Tokens JS | Tokens Atmos | Tokens % | Control JS | Control left | Runs | Same |
|--:|------|--------|---------:|------------:|--------:|----------:|-------------:|---------:|-----------:|-------------:|-----:|------|
| 1 | Run! | 1.1.3 | 144 | 142 | -1 | 1502 | 1025 | -32 | 4 | 0 | 3 (3900 frames, 12 games) | yes |
| 2 | Pixel War | 1.1.3 | 198 | 238 | +20 | 2188 | 1546 | -29 | 5 | 1 | 2 (6000 frames, 9 games) | yes |
| 3 | Box Jump | 1.1.3 | 185 | 214 | +16 | 2746 | 2291 | -17 | 3 | 2 | 2 (5400 frames, levels 1 to 4, 56 deaths) | yes |
| 4 | Man vs Penguins | 1.1.3 | 308 | 306 | -1 | 3566 | 2503 | -30 | 6 | 3 | 2 (8400 frames, many deaths) | yes |
| 5 | Fill the Holes | 1.1.3 | 363 | 416 | +15 | 4875 | 4015 | -18 | 3 | 2 | 2 (6659 frames, 6 levels solved) | yes |
| 6 | Princess Quest | 1.1.3 | 403 | 366 | -9 | 4306 | 2916 | -32 | 5 | 4 | 2 (8387 frames, 5 games) | yes |
| 7 | Connected | 1.1.3 | 334 | 357 | +7 | 3386 | 2633 | -22 | not counted | not counted | 2 (13033 frames, 3 games) | yes |
| 8 | Save the City | 1.1.3 | 176 | 194 | +10 | 1896 | 1598 | -16 | 2 | 1 | 2 (2162 frames, 2 cities gone, a restart) | yes |
| 9 | I Hate Rabbits | 1.1.3 | 252 | 247 | -2 | 3161 | 2250 | -29 | 3 | 1 | 2 (9200 frames, 5 games) | yes |
| 10 | Dark Blue | 1.1.6 | 307 | 421 | +37 | 3268 | 3252 | 0 | 4 | 3 (+1) | 3 (9900 frames, levels 1 and 2, 30 deaths) | yes |
| 11 | The Three Hearts | 2.0.1 | 331 | 339 | +2 | 3479 | 2590 | -26 | 3 | 3 | 2 (1900 frames, a death, a key, four doors, a heart) | yes |
| 12 | Crazy Snake | 2.0.2 | 286 | 294 | +3 | 3296 | 2337 | -29 | 4 | 3 (+1) | 2 (9800 frames, score 52, 2 games) | yes |

"(+1)": a flag that the port adds. Dark Blue: `over.done`, the end of the
turn of the last level. Crazy Snake, `over.dead`: the end of
the tween of the death, after which Phaser 2 starts End in the next frame.

Dark Blue: without `levels.atm` (229 lines, 1434 tokens), the five levels
of the original as Atmos data, which the original loads from its JSON
files. The port also does in `play.atm` what Phaser 1.1.6 did for it: the
order of the update of the bodies around the frame, and the camera that
follows the player (about 70 lines).

The Three Hearts: without `map.atm` (92 lines, 4579 tokens), the map
rebuilt as Atmos data, which the original loads from its JSON file.
