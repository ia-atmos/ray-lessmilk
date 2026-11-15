// Crazy Snake: the score, the best score; in Play, the direction, the effect,
// dead, the head and the tail (x y), the length, the coin (x y), the group of
// the level (x y angle scale), and the body of the head (x y)
window.__trace = function (g, f) {
    var s = g.state.states[g.state.current];
    var r = [score, best_score];
    if (g.state.current === 'Play' && s.snake_array) {
        var a = s.snake_array, h = a[0], t = a[a.length - 1], L = s.level;
        r.push(s.direction, s.effect, s.is_dead ? 1 : 0, h.x, h.y, t.x, t.y, a.length,
               s.coin.x, s.coin.y, L.x.toFixed(2), L.y.toFixed(2), L.angle.toFixed(2),
               L.scale.x.toFixed(3), L.scale.y.toFixed(3),
               h.body.position.x.toFixed(2), h.body.position.y.toFixed(2));
    }
    return r.join(' ');
};
