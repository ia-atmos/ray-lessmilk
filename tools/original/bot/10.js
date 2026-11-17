// Dark Blue: a player for tools/original/run.js (BOT=...). In Play, it
// walks toward the nearest coin (the exit when none: it keeps going right),
// and holds UP when a wall, a gap or a red tile is ahead, or the coin is
// above, pressing it again when a jump ends (to climb walls); on Menu and Endd, UP.
(function () {
    var held = {}, since = 0, upFor = 0, out = 0;
    function set (k, on, ops) {
        if (on && !held[k]) { ops.push('dn:' + k); held[k] = true; }
        if (!on && held[k]) { ops.push('up:' + k); held[k] = false; }
    }
    window.__bot = function (g, f) {
        var st = g.state.current, s = g.state.states[st], ops = [];
        if (st !== 'Play' || !s.map) {
            set('LEFT', false, ops); set('RIGHT', false, ops);
            since++;
            set('UP', since > 40 && since % 20 < 3, ops);
            return ops;
        }
        since = 0;
        var p = s.player, L = s.map.layers[0].data;
        function tile (x, y) {
            var tx = Math.floor(x / 20), ty = Math.floor(y / 20);
            if (ty < 0) return 0;
            if (!L[ty] || !L[ty][tx]) return 0;
            return L[ty][tx].index;
        }
        var best = null, bd = 1e9;
        s.coins.forEachAlive(function (c) {
            var d = Math.abs(c.x - p.x) + Math.abs(c.y - p.y) * 2;
            if (d < bd) { bd = d; best = c; }
        });
        var tx = best ? best.x : p.x + 200;
        var dir = tx > p.x + 4 ? 1 : (tx < p.x - 4 ? -1 : 0);
        // a coin above, with a tile over the head: out from under it first
        // (to the right), then back
        function roof (x) {
            for (var y = p.y - 30; y > (best ? best.y : 0); y -= 20)
                if (tile(x, y) === 1) return true;
            return false;
        }
        if (best && best.y < p.y - 25 && (roof(p.x - 11) || roof(p.x + 11))) { dir = 1; out = 25; }
        else if (out > 0) { out--; dir = best && Math.abs(best.x - p.x) > 30 ? dir : 1; }
        set('RIGHT', dir > 0, ops); set('LEFT', dir < 0, ops);
        var ahead = p.x + dir * 22, feet = p.y + 15;
        var wall = dir && (tile(ahead, p.y) === 1 || tile(ahead, p.y - 10) === 1);
        var red = dir && (tile(ahead, feet + 5) === 3 || tile(ahead + dir * 20, feet + 5) === 3 || tile(ahead, p.y) === 3);
        var gap = dir && tile(ahead, feet + 5) === 0 && tile(ahead, feet + 25) === 0 && tile(ahead, feet + 45) === 0;
        var above = best && best.y < p.y - 25 && Math.abs(best.x - p.x) < 60;
        var jump = wall || red || gap || above;
        // a jump lasts while UP is held, up to 12 frames; then UP is
        // released, and pressed again (against a wall, blocked.down stays
        // true in 1.1.6, and the player climbs)
        if (held.UP) {
            upFor++;
            if (upFor > 13 || (upFor > 2 && s.playerJumpCount === 0)) { set('UP', false, ops); upFor = 0; }
        } else if (jump) { set('UP', true, ops); upFor = 0; }
        return ops;
    };
})();
