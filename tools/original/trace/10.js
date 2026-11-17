// Dark Blue: the deaths; in Play, the level, the coins taken and in all,
// the player (x y, velocity, gravity, blocked down, alive, frame, scale.x,
// angle), the camera (x y), the coins alive (how many, sums of x y), the
// enemies alive (how many, sums of x y)
window.__trace = function (g, f) {
    var s = g.state.states[g.state.current];
    var r = [dead];
    if (g.state.current === 'Play' && s.player) {
        var p = s.player, b = p.body;
        var nc = 0, cx = 0, cy = 0, ne = 0, ex = 0, ey = 0;
        s.coins.forEachAlive(function (c) { nc++; cx += c.x; cy += c.y; });
        s.enemies.forEachAlive(function (e) { ne++; ex += e.x; ey += e.y; });
        r.push(s.level, s.coins_taken, s.total_coins,
               p.x.toFixed(2), p.y.toFixed(2), b.velocity.x.toFixed(2), b.velocity.y.toFixed(2),
               b.gravity.y, b.blocked.down ? 1 : 0, p.alive ? 1 : 0, p.frame, p.scale.x,
               p.angle.toFixed(2), g.camera.x, g.camera.y,
               nc, cx.toFixed(2), cy.toFixed(2), ne, ex.toFixed(2), ey.toFixed(2));
    }
    return r.join(' ');
};
