// The Three Hearts: in Play, the hearts taken, the player (x y, velocity,
// alive, frame, direction), the camera (x y) and the room (camera of the
// game), the flag of its tween, the alpha of the screen of death, the
// enemies (sums of x y), the keys, doors and hearts that exist (how many,
// sums of the scale of the doors and of the alpha of the hearts)
window.__trace = function (g, f) {
    var s = g.state.states[g.state.current];
    var r = [];
    if (g.state.current === 'Play' && s.player) {
        var p = s.player, b = p.body;
        var ex = 0, ey = 0, nk = 0, nd = 0, ds = 0, nh = 0, ha = 0;
        s.enemies.forEach(function (e) { ex += e.x; ey += e.y; });
        s.keys.forEachExists(function () { nk++; });
        s.doors.forEachExists(function (d) { nd++; ds += d.scale.x; });
        s.hearts.forEachExists(function (h) { nh++; ha += h.alpha; });
        r.push(s.number_hearts, p.x.toFixed(2), p.y.toFixed(2), b.velocity.x.toFixed(2),
               b.velocity.y.toFixed(2), p.alive ? 1 : 0, p.frame, p.direction,
               g.camera.x.toFixed(2), g.camera.y.toFixed(2), s.camera.x, s.camera.y,
               s.tween ? 1 : 0, s.dead.alpha.toFixed(3),
               ex.toFixed(2), ey.toFixed(2), nk, nd, ds.toFixed(3), nh, ha.toFixed(3));
    }
    return r.join(' ');
};
