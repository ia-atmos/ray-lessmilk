// Crazy Snake: a greedy player, for tools/original/run.js (BOT=...). In
// Play, it holds the arrow key of the step that does not turn back, leave
// the board, or hit the snake, and leaves room for the snake, by the
// shortest path to the coin; on the other screens, UP
// once (after 500 ms on End). It stops playing (and lets the snake die)
// at score STOP.
(function () {
    var held = null, upAt = -100;
    var STOP = 52;
    var KEY = { 1: 'UP', 2: 'DOWN', 3: 'RIGHT', 4: 'LEFT' };
    var D = { 1: [0, -20], 2: [0, 20], 3: [20, 0], 4: [-20, 0] };
    var OPP = { 1: 2, 2: 1, 3: 4, 4: 3 };
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
        if (st !== 'Play' || !s.snake_array) {
            if (held) return key(null);
            // UP for 3 frames, from 30 frames after the screen started
            if (f - upAt > 60 && (st === 'Menu' || st === 'End')) {
                if (window.__screenAt === undefined || window.__screen !== st) {
                    window.__screen = st; window.__screenAt = f;
                }
                if (f - window.__screenAt >= 40) { upAt = f; held = 'UP'; return ['dn:UP']; }
            }
            return [];
        }
        window.__screen = st;
        if (score >= STOP) return key(null);
        var h = s.snake_array[0], c = s.coin, cur = s.current_direction;
        var busy = {};
        s.snake.forEach(function (e) { busy[e.x + ',' + e.y] = true; });
        function ok (x, y) { return Math.abs(x) <= 160 && Math.abs(y) <= 160 && !busy[x + ',' + y]; }
        // the cells reachable from (x,y), and the distance to the coin
        function fill (x, y) {
            var seen = {}, q = [[x, y, 0]], n = 0, dc = 1e9;
            seen[x + ',' + y] = true;
            while (q.length) {
                var p = q.shift(); n++;
                if (p[0] === c.x && p[1] === c.y && p[2] < dc) dc = p[2];
                for (var e = 1; e <= 4; e++) {
                    var mx = p[0] + D[e][0], my = p[1] + D[e][1], k = mx + ',' + my;
                    if (!seen[k] && ok(mx, my)) { seen[k] = true; q.push([mx, my, p[2] + 1]); }
                }
            }
            return [n, dc];
        }
        var len = s.snake_array.length;
        var best = null, bs = -1e9;
        for (var d = 1; d <= 4; d++) {
            if (cur && OPP[cur] === d) continue;
            var nx = h.x + D[d][0], ny = h.y + D[d][1];
            if (!ok(nx, ny)) continue;
            var r = fill(nx, ny);
            // safe: room for the snake; then the nearest to the coin
            var score_ = (r[0] >= len + 2 ? 1e6 : r[0] * 100) - r[1];
            if (score_ > bs) { bs = score_; best = d; }
        }
        return key(best ? KEY[best] : null);
    };
})();
