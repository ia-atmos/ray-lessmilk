# State variables

For each game, every variable of the JavaScript that lives across frames
(fields of `this` in a state, and globals) and what became of it in the
port. Positions, scores, and what is drawn may stay; a variable that only
controls the flow (a timestamp compared with the clock in `update`, a flag
that guards a phase, the current state) should become an `await`, a block,
or a task.

## 1. Run!

| JavaScript | Kind | Port |
|------------|------|------|
| `w`, `h` | constant | `W`, `H` |
| `score` (global) | data, passed from Play to Over through a global | the value that `Play` returns, which `Over` receives as an argument; it is still a global of the port, which `Play` sets, so that the trace reads it in each frame |
| `this.enemyTime` (Play) | control: the time of the next enemy, compared with `game.time.now` in each update | `await Wait(500)` in the loop of the enemies |
| `this.scoreTime` (Play) | control: the time of the next point | `await Wait(1000)` in the loop of the points |
| `this.firstKey` (Play) | control: the label fades once, at the first UP | the sequence `await :update until UP` then `await Motion(...)`, which runs once |
| `this.time` (Over) | control: UP is ignored for 800 ms | `await Wait(800)` before awaiting UP |
| `this.player`, `this.labelScore`, `this.labelKeys` | drawn | locals of `Play` |
| `this.enemies1`, `this.enemies2` (groups of 30, recycled) | data | a pool of tasks, `enemies`: an enemy is a task, which ends when it leaves the world |
| `this.cursor` | input | `keys = Cursor()`, local to each screen |
| `this.hit_s` | a sound, never played | gone |
| `game.state.current` | control: the current state | the main `loop`, `Play` then `Over` |

Control: 4 in the JavaScript (`enemyTime`, `scoreTime`, `firstKey`, and
`time` of Over), 0 in the port. Left in the port for the trace only:
`screen`, which the game never reads.

## 2. Pixel War

| JavaScript | Kind | Port |
|------------|------|------|
| `w`, `h`, `this.playerY` | constant | `W`, `H`, `player_y` |
| `score` (global) | data, shown in Play and Over | `score`, a global of the port too |
| `this.lives`, `this.evolution` (Play) | data | locals of `Play` |
| `this.fireTime` (Play) | control: one fire every 300 ms while UP is down | the loop of the fires: UP, `fire()`, `await Wait(300)` |
| `this.enemyTime`, `this.bulletTime`, `this.bonusTime` (Play) | control: the time of the next enemy, bullet, bonus | three loops, each with its `await Wait(...)` |
| `this.time` (Over) | control: UP is ignored for 800 ms | `await Wait(800)` |
| `this.enemies`, `this.fires`, `this.bonuses`, `this.bullets` | groups of sprites, recycled | `Group`: the same slots, recycled the same way (see below) |
| `this.player`, `this.emitter`, labels | drawn | locals of `Play` |
| `this.cursor` | input | `keys = Cursor()`, in each state |

Control: 5 in the JavaScript, 1 left: `over` in Play, the score at the
moment of the last life, which ends the loop of the overlaps after the rest
of that frame (the original starts Over inside the callback, and the update
goes on).

The groups stay groups of slots. A sprite of Phaser keeps what it had in
its last life (its angle, the size of its body, `inWorld`), and the game
shows it: the first enemy of each slot is born out of the world with
`inWorld` true, from the constructor, and dies at once; a bonus turns from
the angle where its last one stopped. A task per life with a new sprite
would not be the same game.

## 3. Box Jump

| JavaScript | Kind | Port |
|------------|------|------|
| `w`, `h`, `map` | constant | `W`, `H`, `MAP` (`map.atm`) |
| `death` (global) | data: shown in Play and in End | `death`, a global of the port too |
| `this.level` (Play) | data: the level shown | `Box.level` |
| `this.start` (Play) | control: before the first jump, the player does not run | two loops in sequence: the update before the first jump, and after it |
| `this.rotation` (Play) | control: the tween of the last jump, paused when the player starts again | a table `ctl` given to `Motion`, kept in `rotation`, whose `stop` pauses it |
| `player.alive` | control: after a hit, no other hit until the player lands | the same flag: Phaser's `sprite.alive`, which also keeps the body out of the overlaps; set in the update, as in the original |
| `this.player`, `this.line`, `this.cubes`, labels | drawn | locals of `Play`; the cubes are tasks in a pool, aborted when the level changes |
| `this.emitter` | particles | an `Emitter` and its task (`lib/particles.atm`) |
| `this.spaceKey` | input | `keys = Cursor()` |
| `this.hit_s`, `this.jump_s` | sounds | `SND_HIT`, `SND_JUMP` |

Control: 3 in the JavaScript (`start`, `rotation`, `alive`), 2 left in the
port (`rotation`, now a control table rather than a tween, and `alive`, which
the physics reads).

## 4. Man vs Penguins

| JavaScript | Kind | Port |
|------------|------|------|
| `w`, `h`, the level, the places of the coins | constant | `W`, `H`, `PLATFORMS`, `WALLS`, `COINS0..2` |
| `this.score`, `this.bestScore`, `this.coinX` (Play) | data | locals of `Play` |
| `this.playerJumpCount` (Play) | control: the jump goes higher while UP is held, up to 20 updates; 0 when UP is released in the air | `jump_count`, the same counter |
| `this.enemyTime` (Play) | control: the time of the next penguin | `enemy_time`, the same comparison with the clock (see below) |
| `this.half` (Play) | control: the next penguin walks to the other side | `half`, the same flag |
| `this.oneCoin`, `this.oneKill`, `labelTutorial.alive` (Play) | control: the tutorial fades once a coin was taken and a penguin killed | `await <:coin && :kill>`, then the fade |
| `this.jumped` (Play) | never read | gone |
| `this.enemies` (group of 40) | recycled sprites | `Group` |
| `this.platforms`, `this.walls` | groups of bricks | `Bricks` |

Control: 6 in the JavaScript, 3 left. The counter of the jump is a level
of a key counted over updates. The time of the next penguin stays a
comparison in the update: its `rand(500)` must be drawn after the one of
the coin in the same update, and a loop with `await Wait` in another task
would draw it before (the tasks of `Play` awake before its body). `half`
alternates between two places that call `newEnemy`.

## 5. Fill the Holes

| JavaScript | Kind | Port |
|------------|------|------|
| `map`, `text`, `w`, `h`, `tile_size`, `offset` | constant | `MAP`, `TEXT` (`levels.atm`), `W`, `H`, `TILE`, `OX`, `OY` |
| `user_clicks` (global) | data, shown in End | a global of the port too |
| `this.level` (Play) | data | a local of `Play` |
| `this.holes_to_fill` (Play) | data and control: 0 ends the level, then 42 so that it ends once | `holes_to_fill`, the same |
| `this.timer_end_level` (Play) | control: the next level 1200 ms after the end | `timer_end`, the same comparison in the update |
| `this.hand` (Play) | the cursor of the browser | gone (raylib has no hand cursor here) |
| `this.holes`, `this.boxes`, `this.walls` (groups of 10) | recycled sprites | `Group` |
| the box of the menu, `onOutOfBounds` | control: the game starts when the box leaves | `await :particles until box.left_world` |

Control: 3 in the JavaScript (`holes_to_fill` as a gate, `timer_end_level`,
`hand`), 2 left. The end of a level and the next one stay in the update:
the next level is drawn in the middle of an update, and the boxes of the
new level are tested in that same update.

## 6. Princess Quest

| JavaScript | Kind | Port |
|------------|------|------|
| `w`, `h` | constant | `W`, `H` |
| `score`, `best_score`, `sound` (globals) | data | globals of the port too |
| `this.next_platform`, `this.next_cloud` (Play) | data: the height of the next platform and cloud | the same locals |
| `this.count_update` (Play) | control: the platforms are tested once every 21 updates | `count_update`, the same counter |
| `this.took_heart` (Play) | control: a spike does not hurt while the heart throws her up | `took_heart`, the same flag |
| `this.emitter.on` | control: the hearts fly while she goes up fast | `emitter.on`, the same |
| `princess.alive` | control: after a spike she falls through everything | the same flag of the sprite |
| `this.clouds`, `this.platforms`, `this.hearts`, `this.spikes` | recycled sprites | `Group` |

Control: 5 in the JavaScript, 4 left (`count_update`, `took_heart`,
`emitter.on`, `alive`); the jump (a tween whose `onComplete` sets the
velocity) is a task, `Squash`. The flags are read and written in the same
update, in its order, by the physics and the princess.

## 7. Connected

| JavaScript | Kind | Port |
|------------|------|------|
| `w`, `h`, `tile_size`, `this.offset_x`, `this.offset_y` | constant | `W`, `H`, `TILE`, `offset_x`, `offset_y` |
| `score`, `best_score`, `sound` (globals) | data, shown in Play and End | globals of the port too |
| `this.moves`, `this.count` (Play) | data: the moves made (twenty end the game), the dots of the move | `moves`, `count` |
| `this.type`, `this.pos_i`, `this.pos_j` (Play) | data: the color of the move (-1 for none), the last dot selected | `type`, `pos_i`, `pos_j` |
| `this.deleted_dots` (Play) | data: the dots removed, for the fall of the others | `deleted` |
| `this.clicked` (Play) | control: a move is in progress (the button went down on a dot) | gone: the place in the sequence (the updates while the button is down) |
| `this.next_time` (Play) | control: a new move waits 300 ms after the last one | gone: `await Wait(300)` after the move |
| `this.dots`, labels, the bar, sounds | drawn | locals of `Play` |

Control: 2 in the JavaScript, 0 left (2026-11-22, TODO 14). A move is a
sequence: an `await` of the press, the updates while the button is down
(`try_select` in each), the end of the move in the update of the release,
then `await Wait(300)`, which ends in the first update where the clock is
past the release plus 300 ms, the test of `next_time` of the original. The
death of the dots grown to 2 is a trail of its own, spawned first, so that
it still comes first in each update. The two runs give the same traces.

## 8. Save the City

| JavaScript | Kind | Port |
|------------|------|------|
| `w`, `h`, `sentences` | constant | `W`, `H`, `SENTENCES` |
| `this.i` (Play) | data: the next letter to type | `Save.i` |
| `this.level` (Play) | data: the next sentence | `Save.level` |
| `this.score` (Play) | data | `Save.score` |
| `this.dead` (Play) | control: `update` returns at once after the end | the loop of the update ends (`until bomb.y > H - 115`), and the end follows it as a sequence |
| `this.keyReset` (Play) | control: a key fires one letter, and must be up before it fires another | `reset`, the same flag: an edge detector on a level, on a key that changes with `i` (see below) |
| `this.text`, `this.group_text` | drawn | a task per letter, in a pool: it appears, waits for its `:fire`, flies, and dies when it reaches the bomb |
| `this.s` | data: the current sentence | `s` |
| `this.city`, `this.bomb`, `this.tuto` | drawn | locals of `Play` |
| `exp`, `grp`, `dead`, `restart` (locals of `end` and `annimation_ended`) | drawn | locals of `Play`, after the loop |

Control: 2 in the JavaScript, 1 left. `keyReset` stays: the original tests
the key of the current letter in each update, and a key that goes down one
frame after the previous letter fired is not taken (it was still `reset`
from the letter before, with no frame up in between). An `await` of the
key press would take it, and the game would not be the same.

## 9. I Hate Rabbits

| JavaScript | Kind | Port |
|------------|------|------|
| `w`, `h`, `map` | constant | `W`, `H`, `MAP` (`level.atm`) |
| `score`, `level`, `best_score` (globals) | data, shown in Play and End | globals of the port too |
| `this.change_level` (Play) | control: a new level once per turn of the bad one | `change`, the same flag (see below) |
| `this.end` (Play) | control: a delayed end, whose code is commented out in the original; always 0 | gone |
| `this.time` (End) | control: SPACE is ignored for 500 ms | `time`, in the predicate of the `await` of SPACE |
| `rabbit.t` (each rabbit) | control: the tween of its entry, to know if it is running | `entering`, set by the task `Enter` while its tween runs |
| `rabbit.jump`, `rabbit.pos` | data of a rabbit | the same fields, on the sprite of its slot |
| `this.rabbits` (group of 30) | recycled sprites | `Group` |
| `this.bad`, `this.circle`, labels | drawn | locals of `Play` |

Control: 3 in the JavaScript that work (`change_level`, End's `time`, and
the tween kept in `rabbit.t`), 1 left (`change`). The level changes when
the angle of the bad one, which grows by 1.2 in each update, passes the
top; `change` makes sure it happens once per turn, and stays: the angle is
read and written in the same update, and a sequence would have to test the
same numbers. End's `time` is now part of the `await` of the key, and
`rabbit.t` became the life of the task `Enter`.

## 12. Crazy Snake

| JavaScript | Kind | Port |
|------------|------|------|
| `w`, `h`, `this.max` | constant | `W`, `H`, `max` |
| `score`, `best_score`, `sound` (globals) | data, shown in Play and End | globals of the port too |
| `this.direction`, `this.current_direction` (Play) | data: the direction asked, and the one of the last move | `direction`, `current` |
| `this.effect` (Play) | control: the next effect of the board, once per five coins | `effect`, the same counter (see below) |
| `this.is_dead` (Play) | control: the death happens once, and the moves stop | `is_dead`, the same flag |
| `square.head` (each square) | control: the head is left out of the test of collision | `head`, the same field |
| `this.time` (End) | control: UP is ignored for 500 ms | `time`, in the predicate of the `await` of UP |
| `this.snake_array`, `this.snake` | the squares, head first, and the group that draws them | `snake_array`, `snake` (a `Group2`) |
| `this.level`, `this.bg`, `this.coin`, labels | drawn | locals of `Play`, nodes of `level` |

Control: 4 in the JavaScript (`effect`, `is_dead`, `head`, End's `time`), 2
left, and 1 added. The effects are a table by score, walked by a task that
awaits each score in the update in which it is reached (after the update
that takes the coin); `effect` is now only the position in it, for the
trace (relaxed, 2026-11-26). `is_dead` is read by the
timer of the moves, by `dead`, and by the trace; `head` marks the head
during the test in `move`, as the original. The port adds `over.dead`, set
when the tween of the death ends, which Play awaits in the next `:state`
(Phaser 2 starts End in the next frame). End's `time` is part of the
`await` of the key.

## 10. Dark Blue

| JavaScript | Kind | Port |
|------------|------|------|
| `w`, `h` | constant | `W`, `H` |
| `dead`, `sound` (globals) | data, shown in Endd | globals of the port too |
| `this.level`, `this.coins_taken`, `this.total_coins` (Play) | data: the level, and the coins of the level | `st.level`, `st.taken`, `st.total` |
| `this.playerJumpCount` (Play) | control: the frames of a jump while UP is held | `st.jump`, the same counter |
| `e.direction` (each enemy) | control: where the enemy goes, flipped when it hits a tile | `e.dir`, the same field |
| `player.alive` used as a flag (Play) | control: the end of a level runs once, and the player does not move meanwhile | `player.alive`, the same (see below) |
| `this.time` (Endd) | control: UP is ignored for 500 ms | `time`, in the predicate of the `await` of UP |
| `this.map`, `this.layer`, groups, sounds | the level and what it holds | `st.map`, `st.lv`, `st.coins`, `st.enemies`, `st.labels` |

Control: 4 in the JavaScript (`playerJumpCount`, `direction`, `alive` as a
flag, End's `time`), 3 left. The jump counts frames in each update, as the
original, since its height depends on it; the direction of an enemy is
flipped in the callback of a tile, which can come more than once per
frame; `alive` stops the update of the player and the next level while the
player turns. End's `time` is part of the `await` of the key. The port adds
`over.done`, set when the turn of the last level ends (Endd), which the
update awaits.

## 11. The Three Hearts

| JavaScript | Kind | Port |
|------------|------|------|
| `w`, `h`, `tile_size` | constant | `W`, `H`, 40 |
| `sound` (global) | data | a global of the port too |
| `this.camera` (Play) | data: the room shown | `st.cx`, `st.cy` |
| `this.number_hearts` (Play) | data | `st.hearts` |
| `this.tween` (Play) | control: the camera slides to the next room, once at a time; the player is slow meanwhile | `st.tween`, the same flag |
| `player.alive` used as a flag (Play) | control: a death runs once, and the player does not move meanwhile | `player.alive`, the same |
| `heart.alive` used as a flag (each heart) | control: a heart is taken once | `h.alive`, the same |
| `player.direction` | data: the frame when it stops | `player.direction` |
| the groups, the map, the sprite of death | drawn | locals of `Play`, nodes of `world` |

Control: 3 in the JavaScript, 3 left. `st.tween` is read by the movement
of the player while the slide runs and by the next test of the rooms in
the same update; `alive` of the player and of the hearts are read by the
overlaps of each frame, which Phaser calls whatever the state.

