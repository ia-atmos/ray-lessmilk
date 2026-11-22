// Box Jump: a player for tools/original/run.js (BOT=...) that learns each
// level by dying. An obstacle is a run of adjacent cubes on the line (the
// floating ones, type 5, are not); the bot presses SPACE, on the line, when
// the left edge of the next obstacle is within d of the player, d kept per
// level and obstacle. A death (the global `death` grows) moves d of the
// obstacle where it died to the next value of a list (when the list is done,
// it starts again and the obstacle before moves on, as a counter), and the
// player is back at the start of the same level, as in the game.
(function () {
    var DS = [30, 20, 40, 15, 50, 25, 35, 10, 45, 60, 5, 55, 70, 0, 80];
    var tries = {};             // "level:obstacle" -> index in DS
    var held = 0, lastDeath = 0, current = null, started = false;
    function obstacles (s, lineY) {
        var cs = [];
        s.cubes.forEachAlive(function (c) {
            if (Math.abs(c.y - lineY) < 1) cs.push(c);
        });
        cs.sort(function (a, b) { return a.x - b.x; });
        var out = [];
        for (var i = 0; i < cs.length; i++) {
            var c = cs[i], last = out[out.length - 1];
            if (last && Math.abs(c.x - last.right) < 1) last.right = c.x + c.width;
            else out.push({ left: c.x, right: c.x + c.width });
        }
        return out;
    }
    window.__bot = function (g, f) {
        var st = g.state.current, s = g.state.states[st];
        if (held > 0) {
            held--;
            return held === 0 ? ['up:SPACE'] : [];
        }
        if (st !== 'Play' || !s.player) return [];
        var p = s.player, lv = s.level;
        if (window.death !== lastDeath) {
            lastDeath = window.death;
            // the obstacle where it died takes the next d; when it has tried
            // them all, the one before it too (its jump may be the cause)
            for (var j = current; j !== null && j >= 0; j--) {
                var k = lv + ':' + j;
                tries[k] = ((tries[k] || 0) + 1) % DS.length;
                if (tries[k] !== 0) break;
            }
            current = null;
        }
        if (!p.body.touching.down) return [];
        if (!started) {
            started = true;
            held = 2;
            return ['dn:SPACE'];
        }
        var obs = obstacles(s, s.line.y);
        for (var j = 0; j < obs.length; j++) {
            if (obs[j].right > p.x - 10) {
                current = j;
                var d = DS[tries[lv + ':' + j] || 0];
                if (obs[j].left - (p.x + p.width / 2) <= d) {
                    held = 2;
                    return ['dn:SPACE'];
                }
                return [];
            }
        }
        return [];
    };
})();
