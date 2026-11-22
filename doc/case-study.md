# Case study: twelve Phaser games in Atmos

The twelve games of lessmilk.com (Thomas Palef, 2014, Phaser 1.1 and 2.0)
were ported to Atmos over raylib, frame for frame: each run of a port prints
the same trace as the original in the browser ([fidelity.md](fidelity.md)).
This document goes through the patterns the ports use in place of the
callbacks and flags of Phaser, one per section, from the shortest game,
Run!, where it has the pattern, and else from another. The numbers are in [table.md](table.md) (lines, tokens,
control variables) and [bench.md](bench.md) (CPU, memory).

## 1. The states of the game are a sequence of screens

Phaser runs a game as named states (`game.state.start('over')`), each an
object with `create` and `update`, which share globals to pass results.
In the port each screen is a task, the game is a loop that awaits them, and
the result of a screen is the value of its task (Run!, `games/run/main.atm`):

```
loop {
    set score = await Play()
    await Over(score)
}
```

A screen ends when its body ends: Play ends at `await :overlap until
overlap_any(body, :enemy)`, the line after it is `score`. Everything the
screen started (its tasks, its sprites, its timers) ends with it.

## 2. A timer is a loop that awaits

The original keeps a timestamp per timer and compares it with the clock in
every update (Run!, `js/play.js`):

```
if (this.game.time.now > this.enemyTime)
    this.newEnemy();                            // enemyTime = now + 500
if (this.game.time.now > this.scoreTime) {
    this.scoreTime = game.time.now + 1000;
    score += 1;
    this.labelScore.content = 'score: ' + score;
}
```

The port has a loop per timer, which says the period where it acts
(`games/run/play.atm`):

```
spawn {
    await :update
    loop {
        set score += 1
        set label_score.s = "score: " ++ tostring(score)
        await Wait(1000)
    }
}
```

`Wait` counts on the clock of Phaser, so that the frames in which a timer
fires are those of the original. The two timestamps of Run! are gone:
the four control variables of its JavaScript (timestamps and flags), none
left in the port ([state.md](state.md)).

## 3. A one-shot condition is an await, not a flag

The label of Run! fades at the first UP. The original needs a flag
(`firstKey`) tested in every update; the port awaits the condition once:

```
spawn {
    await :update until cursor_down(keys, 'UP')
    await Motion(label_keys, [alpha=0], 800)
}
```

## 4. An entity is a task

Phaser recycles sprites in a group (`createMultiple(30, ...)`,
`getFirstExists(false)`, `outOfBoundsKill`). In the port an enemy is a task
in a pool, and its life is the task's (`games/run/enemy.atm`):

```
task Enemy (kind, x, y, tox, toy) {
    ...
    par :any {
        await Motion(spr, [x=tox, y=toy], 3000)
        await false                         ;; stays where it stopped
    } with {
        await :pre until !in_world(spr)     ;; outOfBoundsKill
    } with {
        loop on :pre {
            sprite_update(spr)
        }
    }
}
```

with `pin enemies = tasks(60)` and `spawn @enemies Enemy(new_enemy())` in
Play. What ends the enemy is written where the enemy is: whichever branch
ends first ends the `par`, the task, its body (`defer`) and its tween.

The same holds when an entity waits for something addressed to it: a letter
of Save the City waits to be fired, by its index, then flies
(`games/save_the_city/play.atm`):

```
await :fire until it.i == i
eng.play(SND_FIRE, 0.2)
spawn Motion(t, [y=bomb.y - 20, x=W/2], (H - bomb.y) * 3)
```

## 5. A chain of tweens is a sequence of awaits

Phaser chains tweens with `.to().to()`, `onComplete` and `.loop()`. The
port writes them in order. The shake of Save the City is nine tweens, one
after another, each relative to where the group is:

```
task Shake (g) {
    val m, t = (15, 50)
    loop _, d in [ [-m, t], [m*2, t*2], [-m, t], ... ] {
        await Motion(g, [y=(if d@0 >= 0 => "+" => "") ++ tostring(d@0)], d@1)
    }
}
```

A tween that must be stopped from outside is a task with a handle: Box Jump
pauses the rotation of a jump with `set rotation.pub.stop = true`, as
`this.rotation.pause()` did.

## 6. What a screen owns ends with it

In the exact ports, what the whole game shares (the list of bodies that
Phaser moves every frame, the list of tweens) is global, and a global
cannot own what a screen owns. So the screens remove their bodies at their
end (`defer { body_remove(body) }`), and the tweens keep a mark in the global
list and are moved by an event to their task.

With `set :out` (compiler 8361f88), a place outside refers to a value of a
block until the block ends. On the branch `pin-out` (not merged, see
`.claude/plans/TODO.md`, #3), each screen pins its bodies and the library
refers to them, so the 13 `defer`s that removed bodies are gone, and a tween
record refers to the object it moves:

```
task Play () {
    pin phys = Physics_screen()         ;; the bodies of the screen (Physics)
    set :out Physics.scr = phys
    ...
```

The 33 tests give the same traces on that branch.

## What did not become simpler

- Fidelity has a cost. A port reproduces the order in which Phaser updates
  its sprites, bodies, tweens and timers, frame by frame: the library
  (`lib/`, 2181 lines) emulates Phaser 1.1.3, 1.1.6, 2.0.1 and 2.0.2 where
  the games depend on them, down to 32-bit floats and the quadtree of the
  collisions. The relaxed ports (TODO 15) will drop that, against traces of
  their own.
- Some control remains: the control variables left are counted in
  [table.md](table.md), with the reason for each in [state.md](state.md).
- The cost of a frame: see [bench.md](bench.md); the logic is within a
  factor of 2.3 of the browser in 10 games, and about 3 times it in Dark
  Blue and Crazy Snake.
