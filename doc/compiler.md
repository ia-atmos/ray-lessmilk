# The compiler

What this port found in the compiler `ia-atmos/lang` (branch `main`,
from `9ec67ec`; the port now builds with `8c9453c`), reported to the session
that maintains it (`atmos-lang`), and what became of each. Nothing here blocked the port.

## Semantics the port relies on

1. **The order in which tasks awake on the same event.** The tasks in a
   pool (or nested in a task) awake before the body of the task that holds
   them: in a test (`tst/lang/order.atm`),
   a task in the pool of `E` received an event before the body of `E`. Box
   Jump depends on it: a task spawned by `Play` and awaiting `:update`
   awoke before the body of `Play`, which did `collide` in the same
   `:update`, and so read `touching.down` before it was set. The port now
   keeps the steps that depend on each other in one task, in order, and
   uses the phases of `lib/game.atm` (`:pre`, `:particles`, `:update`,
   `:overlap`) between tasks. **Answer:** guaranteed, and in the manual (the
   tree of tasks): the tasks of a block awake in the order they were
   attached, those of a pool at the position of the pool, in the order they
   were spawned, and the body of a task after them.
2. **A task that starts during an emit does not receive it.** Checked
   (`tst/lang/order.atm`): a
   task spawned in a pool during an emit of `:X` awoke on the next `:X`
   only. The port relies on it (`Motion`, the particles). **Answer:**
   guaranteed, and now in the manual: a task only reacts to an emit that
   starts after its await.

## Friction

3. **`$x` in a native literal is a variable only.** `` `f($img.id)` `` fails
   in the C compiler (`'AVal' has no member named 'id'`), not in Atmos:
   the field must go through a local first (`val id = img.id`).
   **Answer:** as designed: what follows `$x` is C (`$x.u.i` reads a member
   of the `AVal`); the manual now says so.
4. **A native literal in single back quotes may not span lines.** The
   error is `unterminated native` at the line of its start, which is right;
   the long calls of the engine use one line each, or a block in triple
   back quotes.
5. **A table cannot refer to itself in its constructor.** In
   `val eng = [ f = func () { eng.x } ]`, `eng` is not declared in the
   body of `f` (as in Lua with `local`). The engine declares the constant
   before the table. Not a bug; noted because the student's modules did it
   in the reference Atmos with globals.

6. **`math.atan(y, x)` ignores its second argument.** `math.atan(1, 2)` is
   `0.785...` (the angle of 1), with no error; in Lua 5.4, which the manual
   follows for `math`, it is the angle of the point `(2, 1)`, `0.4636...`.
   The student's code used it so. **Fixed** in `ceu-atmos`: `math.atan(y, x)`
   is the angle of the point, as in Lua 5.4 (`tst/lang/atan.atm`).

7. **Aborting the tasks of a pool while iterating over it skips some.**
   `loop _, t in ts { abort t }` over a pool of two tasks aborted the first
   (`tst/lang/pool.atm`)
   only: the second was skipped, as when an element is removed from a list
   that is being iterated. `abort ts` aborts all of them, and the pool can
   be used again (Box Jump does this between levels). **Fixed** in
   `c467e60`: a loop over a pool tolerates aborts and spawns in its body
   (`tst/lang/pool.atm`).
8. **A pinned task cannot go in a variable that a function captures.**
   `set rotation = spawn @rotations Motion(...)` inside a `val func`, with
   `rotation` a `var` of the enclosing task, is `invalid escape : pinned
   value` at run time. Box Jump kept a control table in the variable
   instead (`Motion` took `ctl`, whose `stop` paused it). **Answer:** not
   changed then; the new rules of `pin` (below) allow it when the variable
   and the pool are in the same block. Box Jump now keeps the task
   (`set rotation = spawn @rotations Motion(...)`) and pauses it by its
   `pub` (`set rotation.pub.stop = true`); `ctl` is gone.

10. **`skip` is reserved** (the compiler added it, `e9cafa7`): `lib/sprite.atm`
    had a variable of that name (`nskip` now).
11. **A spawn that dies with its block is an error now**
    (`invalid spawn : the task is aborted at the end of its block`):
    `tst/lang/order.atm` had one, which showed nothing; it uses a pool now.

## The new rules of `pin` (2026-11-15)

The compiler (`98ad03a`, then `3a6ffe9`) made `pin` the only declaration of
a fresh value, and a value pinned in a block cannot be held by a value of
an outer block. The port was migrated (guide:
`.claude/plans/261115-pin-migration.md` of the compiler); the 26 tests give
the same traces as before.

- `val`/`var` of a fresh value became `pin`: the tables of the modules, the
  images, the sprites and texts, the groups, the vectors built in a block.
- **A registry of the whole game cannot hold what a screen owns.**
  `Physics.bodies` (the bodies, which every frame moves) held bodies whose
  sprite belonged to a screen; the tweens (`Tweens`) held their object. Now
  a body owns its sprite (`Body(Sprite(...), :tag)`, then `b.spr`; a sprite
  set up before its body is built in a `do` block given to `Body`), and
  the list of tweens holds only a mark of each tween: the pass emits
  `:tween.step` to the task `Motion`, which moves its object, in the order
  of the list as before.
- **The trace cannot read a screen from a global.** The hooks
  `set Con.play = [...]` became a task of the screen that answers the
  event `:trace` with its line (`Tracer` in `lib/game.atm`).
- A variable that received new tables (`var deleted = []` ... `set deleted
  = []`) is a `pin` emptied by `vector.clear`; the objects that the end of
  Save the City creates are fields of a pinned table (`fin`); a letter
  owns its text (`set pub = t0`).
- **Reported**: a fresh table given as an argument cannot receive a value
  of the global block (`get([])` with `set out@+ = o`), while a pinned one
  can. **Answer:** as designed (after its birth, the floor of a fresh value
  does not rise); recorded for the author as a strange case, with a
  proposed refinement (the floor may rise to the outermost block). In
  `lib/physics.atm`, `overlap_list` and `collide_group` give `qt_retrieve`
  a pinned vector (`pin found = []`).

Then the rules changed again (2026-11-17: `val`/`var` may hold a fresh
value, and a place that owns its value may be assigned): the 33 tests give
the same traces with the compiler at `f3389f6`; nothing needed a change.
The rewrites of the image cache, `sprite_add`, and the text of a letter
could go back to their first form (allowed, not required).

The second migration (guide `261117-pin-migration-2.md`, compiler
`94aedf1`): 20 values given away by their block became `val` (10 in the
library, 10 in the games); two shapes needed a rewrite: `Group` fills a
list held only by its name and makes the group at the end (an unpinned
table that another value holds cannot receive pinned values), and
`node_add(g, mk)` took a maker, so that the group adopted the node unnamed
(a node passed by parameter was only referenced); since `8c9453c` a named
value stored in a pinned value of its block or an outer one is adopted, and
`node_add(g, n)` is back. The 33 tests give the
same traces. Twice before (on `5da4b8e` and `ba28459`) the migration was
reverted, until the compiler settled these cases.

An experiment of a context per screen (branch `exp-screen-context`, asked
by the session `atmos-pin`): the bodies, tweens and inputs of a screen in
a table that its task pins, in place of the global lists of Phaser. Same
traces; 16 of the 22 bodies that owned their sprites go back to a `pin` of
the screen; the sprites of entities, the end of a tween and the events of
the mouse still cannot be named by what outlives them. Not merged: it
moves the port away from the structure of the original.

## Pitfalls met again

9. **A spawn inside an `if` dies with the block** (also in the list of the
   Pingus port). The task of the trace was spawned inside
   `if os.getenv("RL_FRAMES") { spawn {...} }` and printed nothing; it
   tests inside the task now.

## Checks

- Run! built with `ATMOS_ASAN=1` runs its three runs (3900 frames, 12
  games) with no error and no leak, and the same traces. `ASAN=1
  tst/run.sh` fails when a run exits with an error.
