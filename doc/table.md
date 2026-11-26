# The games, one row each

- **Lines** and **tokens**: of code, counted by `tools/count.py` (no blank
  lines, no comments; in Atmos, no trace). JavaScript: all the files of the
  game in `js/` (states, boot, loading). Atmos: `games/<game>/`, without the
  shared modules of `lib/` (2181 lines and 19428 tokens for now), which do
  what Phaser did.
- **%**: the change from JavaScript to Atmos. In all, the twelve games have
  7% more lines and 23% fewer tokens (3287 to 3514 lines, 37669 to 28980
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
| 1 | Run! | 1.1.3 | 144 | 141 | -2 | 1502 | 1031 | -31 | 4 | 0 | 3 (3900 frames, 12 games) | yes |
| 2 | Pixel War | 1.1.3 | 198 | 234 | +18 | 2188 | 1532 | -30 | 5 | 1 | 2 (6000 frames, 9 games) | yes |
| 3 | Box Jump | 1.1.3 | 185 | 210 | +14 | 2746 | 2290 | -17 | 3 | 2 | 3 (20500 frames, the 20 levels and End) | yes |
| 4 | Man vs Penguins | 1.1.3 | 308 | 301 | -2 | 3566 | 2491 | -30 | 6 | 3 | 2 (8400 frames, many deaths) | yes |
| 5 | Fill the Holes | 1.1.3 | 363 | 411 | +13 | 4875 | 4025 | -17 | 3 | 2 | 3 (17952 frames, the 15 levels solved, End) | yes |
| 6 | Princess Quest | 1.1.3 | 403 | 358 | -11 | 4306 | 2904 | -33 | 5 | 4 | 3 (9937 frames, 6 games, score 305 and the spikes) | yes |
| 7 | Connected | 1.1.3 | 334 | 362 | +8 | 3386 | 2646 | -22 | 2 | 0 | 2 (13033 frames, 3 games) | yes |
| 8 | Save the City | 1.1.3 | 176 | 193 | +10 | 1896 | 1604 | -15 | 2 | 1 | 2 (2162 frames, 2 cities gone, a restart) | yes |
| 9 | I Hate Rabbits | 1.1.3 | 252 | 245 | -3 | 3161 | 2252 | -29 | 3 | 1 | 2 (9200 frames, 5 games) | yes |
| 10 | Dark Blue | 1.1.6 | 307 | 424 | +38 | 3268 | 3266 | 0 | 4 | 3 (+1) | 3 (9900 frames, levels 1 and 2, 30 deaths) | yes |
| 11 | The Three Hearts | 2.0.1 | 331 | 339 | +2 | 3479 | 2590 | -26 | 3 | 3 | 2 (1800 frames, a death, a key, four doors, a heart) | yes |
| 12 | Crazy Snake | 2.0.2 | 286 | 296 | +3 | 3296 | 2349 | -29 | 4 | 2 (+1) | 2 (9800 frames, score 52, 2 games) | yes |

"(+1)": a flag that the port adds. Dark Blue: `over.done`, the end of the
turn of the last level. Crazy Snake, `over.dead`: the end of
the tween of the death, after which Phaser 2 starts End in the next frame.

Dark Blue: without `levels.atm` (229 lines, 1434 tokens), the five levels
of the original as Atmos data, which the original loads from its JSON
files. The port also does in `play.atm` what Phaser 1.1.6 did for it: the
order of the update of the bodies around the frame, and the camera that
follows the player (about 70 lines).

The Three Hearts: without `map.atm` (92 lines, 4579 tokens), the map as
Atmos data, which the original loads from its JSON file.
