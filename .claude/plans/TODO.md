# TODO

Everything that is pending in the session that ports the Lessmilk games
(`ia-atmos/ray-lessmilk`): asked and not decided, reported and not
acknowledged, or known and not done. Keep it current: remove an item when
it is settled, add one whenever something is left open, in the same commit
when possible.

The numbers do not change. Numbers that are missing were settled (see the
end).

Last update: 2026-11-14.

## A. Decisions waiting for an answer

Each has the option recommended by this session.

| # | Decision | Recommended |
|---|----------|-------------|
| 4 | The harness sends no key repeat: a key held from one state into the next stays up in Phaser until pressed again; in a browser the keyboard would send it again after about half a second | Keep it so (deterministic, and the same in the port, `Cursor`/`key_down`); it is written in `doc/fidelity.md` |

## B. Work known and not done

| # | Work |
|---|------|
| 19 | Crazy Snake: the music loops and stops on the death, and the sound of the death stops when End restarts (`rl.stop_sound` and a looping sound are not in `raylib.atm`); the port plays each once |
| 22 | Dark Blue: no run reaches levels 3 to 5 or Endd; the bot (`tools/original/bot/10.js`) would need to get through level 2 (at 30 frames per second) |
| 23 | Dark Blue: the music (loop, stop) as in Crazy Snake (19) |
| 24 | The Three Hearts: no run reaches the second and third hearts or the end (the emitter of hearts is not ported); the bot gets stuck at a gap of one tile |
| 28 | The experiment of a context per screen (branch `exp-screen-context`, d7c8751): reported to `atmos-pin`; not to merge into the exact port; a candidate for the relaxed ports (15) |
| 30 | `doc/bench.md`: Dark Blue spends 10 times the logic of the original (4.7 ms a frame); three ports peak at 98 to 196 MB; not looked into |
| 17 | Princess Quest: no run reaches a score of 250, where the spikes come; a run would need to aim at the platforms |
| 18 | `skip` of the compiler: where a game emulates a `continue`, use it in the relaxed version (see 15) |
| 16 | Fill the Holes: no run gets through the fifteen levels (End not compared); a run would need the solutions of levels 7 to 15 |
| 12 | Box Jump: no run reaches the screen End (twenty levels); a run that wins would need a schedule of jumps found by search |
| 13 | Consider `await(n, :e)` of the compiler (the nth occurrence of a pattern) where a port counts frames |
| 15 | After the twelve games are identical to their originals: tag the last exact commit `exact`, then relax each port in favor of expressiveness, keeping the intent of the original (decided by the author, see Settled): `await Nms` in place of `Wait`, a task per entity in place of recycled slots, `await`s in place of the flags that stayed, the emulation of 32-bit floats and of the quadtree out of the games (kept in `lib/` for the exact version); the relaxed ports get traces of their own |
| 14 | Connected: try the move as a sequence (`await` of the press, then the updates while pressed, then `await Wait(300)`), in place of the flags `clicked` and `next_time`, keeping the traces |

## C. Reported or decided, and not acknowledged by the author

| # | What |
|---|------|
| 1 | The order of L4 and L5 changed: the games on Phaser 1.1.3 first (I Hate Rabbits, Man vs Penguins, Connected, then Fill the Holes and Princess Quest), the three games on other versions of Phaser last (10, 11, 12) |
| 2 | Of the student's documents, only Run! has an analysis; the other READMEs are a TODO of 6 to 9 lines. The documents of the other games are this session's |
| 3 | The assets of games 3 to 12 come from the student's port (the copy of the site has only games 1 and 2); compared byte by byte where both exist |
| 4 | The easings of `reasings.h` are not used for Motion: they are 32-bit floats, and the traces need the doubles of JavaScript (the formulas are the same) |
| 5 | The code that runs is `phaser113.min.js`, whose minifier reordered `updateMotion`; the other formulas were checked against it |
| 6 | Text: Liberation Sans and Mono for Arial and Courier (SIL OFL, in `lib/fonts/`); the line height and the width are those of Chromium, a vertical correction of `0.12 * size` was measured on two sizes only |
| 7 | A tween whose task is aborted is deleted; Phaser would go on moving the object. No run shows a difference |
| 10 | The new rules of `pin` (compiler `98ad03a`, approved by the author on 2026-11-15): the port was migrated with the same traces (26 tests on `3a6ffe9`); bodies own their sprites, the list of tweens holds marks and the pass emits `:tween.step`, the traces of the screens answer `:trace`; `ctl` of `Motion` gone (its `pub.stop`). Report sent to the compiler session; in `doc/compiler.md` |

## D. Older items

None.

## Items (#N)

The standing rule of the author (2026-11-18): everything put to him has a
number `#N`, unique in this session, in order, never reused; from another
session `session#N` (this one is `ray-lessmilk`). The numbers in the
tables above were given before the rule and stay as they are.

| # | Item | Kind | State |
|---|------|------|-------|
| #1 | What comes next: the new vocabulary of `ray.atm` (TODO 27, traces kept identical), or the relaxed ports on top of the tag `exact` (TODO 15) | decision | the vocabulary done by the session (to be confirmed); the relaxed ports next |
| #2 | Go back to the first form of three rewrites of the first migration of `pin` (the cache of images and sounds, `sprite_add`, the text of a letter of Save the City), which the rules allow again | decision | done on the branch `pin-out` (63d2e2b), by the session, to be confirmed: the compiler accepts the three first forms; not merged |
| #3 | `set :out` (compiler 8361f88): a place outside refers to a value pinned inside, until the block ends. Use it for the global lists that refer to what a screen owns: the bodies would refer to the sprites of the screen (no `Body(do { ... })`, no ownership by the list), the tweens would keep their object (no mark and emit per tween), the trace could read the screen (no `:trace` hooks). To try on a branch, keeping the traces | decision | done on the branch `pin-out`, by the session, not merged: bodies, traces, tweens; the 33 tests give the same traces (compiler 8c46149); 23 files, 164 lines in, 213 out. Merge is the author's call. See Settled |

## Settled

- The compiler at 34c381b (2026-11-21, asked by atmos-lang: atmos-pin#17,
  #3): the 33 tests pass, and no error output says `invalid pin : shared`.

- The case study (2026-11-20, TODO 7, by the session, to be confirmed):
  `doc/case-study.md`, six patterns (screens, timers, one-shot awaits,
  entities as tasks, chains of tweens, what a screen owns), from Run! and
  else Save the City and Box Jump, with what did not become simpler.

- The bench (2026-11-20, TODO 6, with the measure asked by paper-games,
  their #4): `doc/bench.md`, from `tools/bench.py`: the frame and the logic
  alone (raster and copy skipped on both sides: `RL_NODRAW` in the patch of
  raylib, `NODRAW` in the harness), CPU time of the process, median of 3,
  ms a frame, with the ratio; the memory of each side. Every measured run
  gives the trace of the original. The launcher: `tools/play.sh`, with
  raylib for a window (`DESKTOP=1 tools/setup.sh`, needs the X11 headers):
  tried under Xvfb (Mesa): Run! opens in a window and plays.

- `set :out` (#3, 2026-11-20, branch `pin-out`, on top of #2; not merged).
  Each screen that has bodies pins `Physics_screen()` (its bodies, the
  quadtree of the frame, its sprites that receive the mouse) and
  `set :out Physics.scr = phys`; the library reads `Physics.scr` (or an
  empty one between screens). `Body(Sprite(...))` stays: the list of the
  screen adopts the sprite. Found on the way: the quadtree is also a
  registry (it holds bodies), and a screen may overlap before its first
  quadtree (none: no bodies found), as on `exp-screen-context`; the input
  events are global, so they carry the index of the sprite, not the sprite
  (`input_of(e)`). The traces: a screen gives `pin trace_q = [...]` and
  `set :out Trace.q = trace_q`, two lines in place of a task answering
  `:trace`; `Tracer` prints `f(Trace.q)`. The 26 runs of the games give the
  same traces. The screens no longer remove their bodies at the end (13
  defers gone). The tweens: the record in the global list refers to its
  object, start, end and control (`set :out r.obj = obj`, ...); the pass
  moves them itself and emits `:tween.done` only when a tween ends, in
  place of a `:tween.step` per tween per frame. The 33 tests give the same
  traces (compiler 8c46149). Against main: 23 files, 164 lines in, 213 out.

- The vocabulary of `ray.atm` (2026-11-20, TODO 27, #1, by the session, to
  be confirmed): `env/ray.atm` copied from env-ray 8350e6f (with the patch
  of test mode), `rl.` became `ray.`, the events `:frame`, `:draw`,
  `:key.dn [key=, code=]`, `:mouse.button.dn/up`, `:quit`; the include of
  `reasings.h` added to `tools/atmos.sh`. Branch `ray-vocabulary`, merged:
  the 33 tests give the same traces.
- The fonts (2026-11-20, TODO 10, by the session, to be confirmed):
  `lib/engine.atm` loads them with `ray.font_ex` and keeps them in a table
  of Atmos (`ENG_FONTS`, by path and size); its C only lays out and draws.
  Branch `ray-font`, merged: the 33 tests give the same traces, and the
  screenshot of the test of the engine is the same. ASAN then found a text
  of size 0 in Crazy Snake: `180 / 0` gave a font of a garbage size (the C
  had loaded it at 0 through an integer cast); `eng_font` loads it at 0.
- ASAN on the compiler 8c46149 (2026-11-20, asked by atmos-lang: daab0b7,
  7e3b7b5): the 33 tests pass, no error and no leak of the sanitizer (after
  the fix of the font of size 0 above, which was the port's).

- Documents (2026-11-20, work with no input): `doc/games/` has one per
  game (the nine that lacked one); `doc/state.md` and `doc/table.md` count
  the control of Connected (2 in the JavaScript, 2 left). TODO 8, 9, 20 and
  23 (its document) done.
- ASAN (2026-11-20, TODO 11): `ASAN=1 tst/run.sh` on main (compiler
  c4e99c4): the 33 tests pass, no error and no leak of the sanitizer.

- Who to tell (2026-11-18): what concerns `pin` goes to the session
  `atmos-pin` (session_011eECogSDhkVfyt7qme5DLh); the rest of the compiler
  to `atmos-lang` (session_011eECogKVQ7ZzmWCoMST2wK); the binding of raylib
  to `env-ray` (session_011eECohyySVpgZiuUF17qc2).

- The second migration of `pin` (2026-11-18, compiler 94aedf1): done on
  main (47c6b0b), the 33 tests identical; reported to `atmos-lang`.

- The tag `exact` (the author, 2026-11-18): on eadb181, the twelve ports
  identical to their originals on their runs; the relaxed ports go on top.

- The Three Hearts (A3, the author, 2026-11-17): a map rebuilt from the
  student's port; replaced on 2026-11-18 by the real `levels/map.json`, from
  the site (the rebuilt one had its objects 40 px lower).
- The site (2026-11-18): www.lessmilk.com is reachable; its version of the
  twelve games gives the same traces as the copy of 2014 on all the runs
  (`tools/site.sh`, `SITE=1`), and its assets are the same.

- Dark Blue (A2, the author, 2026-11-17): a placeholder of the lost
  `tiles.png`; replaced on 2026-11-18 by the real one, from the site.

- Expressiveness over exactness (the author, 2026-11-14): once a port is
  identical to its original, it may relax the constraints of exactness in
  favor of expressiveness, as long as the intent of the original author is
  kept. Order: the five games left are done exact first; then the tag
  `exact` on `main`, and the relaxed ports on top of it, so that the study
  compares the original, the exact port, and the expressive port. Passed
  to the session `ceu-atmos` for the other ports.

- The names (A1): the author renamed the repositories of the organization;
  the documents and scripts now say `ia-atmos/lang` (the compiler),
  `ia-atmos/env-ray` (the binding of raylib, still copied in `env/` at a
  fixed commit, with its patch), and `ia-atmos/ray-lessmilk` (this one).
  The local checkouts in `ext/` and the remote of this repository keep the
  old addresses, which redirect.
- The library: raylib, through `raylib.atm` (the author, through the
  session `ceu-atmos`).
- The assets: copied into `assets/`, with credit to Thomas Palef (the
  author, in this session), although the originals say "do not copy".
- Coordinates in pixels (the author, in this session).
- `lessmilk.com` cannot be reached from the container; the author declined
  a new environment for it; the copy of the site is used.
- The compiler: `math.atan(y, x)`, aborts while iterating a pool (fixed);
  the order of awaking and of an emit and a spawn (guaranteed, in the
  manual); `$x.f` in a native, the message of a pinned escape (as designed).
