// The Three Hearts: a player for tools/original/run.js (BOT=...). In Play,
// it walks, by the shortest path over the tiles (BFS; the walls and the
// doors that exist block), to the nearest key or heart left, keeping to the
// middle of the tiles of its path; for its first 400 frames, and when
// nothing is reachable or it is stuck, to the nearest enemy; on Menu, UP.
(function () {
    var held = null, since = 0, stuck = 0, lastx = 0, lasty = 0;
    var K = { '1,0': 'RIGHT', '-1,0': 'LEFT', '0,1': 'DOWN', '0,-1': 'UP' };
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
        if (st !== 'Play' || !s.player) {
            since++;
            if (since === 40) return key('UP');
            if (since === 43) return key(null);
            return [];
        }
        var p = s.player;
        if (!p.alive) return key(null);
        var L = s.map.layers[0].data, W = 48, H = 40;
        var block = {};
        s.doors.forEachExists(function (d) { block[Math.floor(d.x / 40) + ',' + Math.floor(d.y / 40)] = true; });
        function free (x, y) {
            if (x < 0 || y < 0 || x >= W || y >= H) return false;
            var t = L[y][x];
            if (t && t.index >= 1 && t.index <= 6) return false;
            return !block[x + ',' + y];
        }
        var goals = {};
        s.keys.forEachExists(function (k) { goals[Math.floor((k.x + 20) / 40) + ',' + Math.floor((k.y + 20) / 40)] = true; });
        s.hearts.forEachExists(function (h) { if (h.alive) goals[Math.floor(h.x / 40) + ',' + Math.floor(h.y / 40)] = true; });
        var sx = Math.floor(p.x / 40), sy = Math.floor(p.y / 40);
        var prev, goal;
        function bfs () {
            prev = {}; goal = null;
            var q = [[sx, sy]], seen = {};
            seen[sx + ',' + sy] = true;
            while (q.length) {
                var c = q.shift(), ck = c[0] + ',' + c[1];
                if (goals[ck]) { goal = c; return; }
                for (var d in K) {
                    var v = d.split(','), nx = c[0] + +v[0], ny = c[1] + +v[1], nk = nx + ',' + ny;
                    if (!seen[nk] && free(nx, ny)) { seen[nk] = true; prev[nk] = ck; q.push([nx, ny]); }
                }
            }
        }
        if (f >= 400) bfs();
        // the first 400 frames, nothing reachable, or stuck: toward the
        // nearest enemy (to die)
        if (f < 400 || !goal || stuck > 120) {
            goals = {};
            s.enemies.forEach(function (e) { goals[Math.floor((e.x + 20) / 40) + ',' + Math.floor((e.y + 20) / 40)] = true; });
            bfs();
        }
        if (p.x === lastx && p.y === lasty) stuck++; else stuck = 0;
        lastx = p.x; lasty = p.y;
        if (!goal) return key(null);
        // the first step of the path
        var k = goal[0] + ',' + goal[1], first = k;
        while (prev[k] && prev[k] !== sx + ',' + sy) { k = prev[k]; }
        first = k;
        var t = first.split(','), tx = +t[0] * 40 + 20, ty = +t[1] * 40 + 20;
        if (first === sx + ',' + sy) { tx = goal[0] * 40 + 20; ty = goal[1] * 40 + 20; }
        var dx = tx - p.x, dy = ty - p.y;
        // the body (40 x 40) must fit in free cells to step: if not, slide
        // along the other axis toward the middle of the next cell
        var l = Math.floor((p.x - 20) / 40), r = Math.floor((p.x + 19.9) / 40);
        var u = Math.floor((p.y - 20) / 40), b = Math.floor((p.y + 19.9) / 40);
        if (+t[1] !== sy) {
            var ny = +t[1] > sy ? b + 1 : u - 1;
            if (free(l, ny) && free(r, ny)) return key(+t[1] > sy ? 'DOWN' : 'UP');
            return key(dx > 0 ? 'RIGHT' : 'LEFT');
        }
        if (+t[0] !== sx) {
            var nx = +t[0] > sx ? r + 1 : l - 1;
            if (free(nx, u) && free(nx, b)) return key(+t[0] > sx ? 'RIGHT' : 'LEFT');
            return key(dy > 0 ? 'DOWN' : 'UP');
        }
        if (Math.abs(dx) >= Math.abs(dy)) return key(dx > 0 ? 'RIGHT' : (dx < 0 ? 'LEFT' : null));
        return key(dy > 0 ? 'DOWN' : 'UP');
    };
})();
