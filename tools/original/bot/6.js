// Princess Quest: a player for tools/original/run.js (BOT=...). The
// princess jumps by herself when she lands; in Play the bot holds LEFT or
// RIGHT toward the lowest platform above her feet (or, falling, the highest
// one below her that she is over), and nothing when she is above it within
// 12 px; on Menu and Dead, UP after 40 frames.
(function () {
    var held = null, since = 0;
    function key (k) {
        var ops = [];
        if (held === k) return ops;
        if (held) ops.push('up:' + held);
        if (k) ops.push('dn:' + k);
        held = k;
        return ops;
    }
    window.__bot = function (g, f) {
        var st = g.state.current, s = g.state.states[st];
        if (st !== 'Play' || !s.princess) {
            since++;
            if (since === 40) return key('UP');
            if (since === 43) return key(null);
            return [];
        }
        since = 0;
        var p = s.princess;
        if (!p.alive) return key(null);
        var target = null, best = Infinity;
        var rising = p.body.velocity.y < 0;
        s.platforms.forEachAlive(function (q) {
            // above her feet when rising; when falling, any platform below
            // her feet that she could land on first
            var dy = p.y - q.y;
            if (rising) {
                if (dy > 10 && dy < best) { best = dy; target = q; }
            } else {
                if (dy < 0 && -dy < best) { best = -dy; target = q; }
            }
        });
        if (!target) return key(null);
        var dx = target.x - p.x;
        if (dx > 12) return key('RIGHT');
        if (dx < -12) return key('LEFT');
        return key(null);
    };
})();
