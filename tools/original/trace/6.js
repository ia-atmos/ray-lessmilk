// Princess Quest: the score, the best score; in Play, the princess (x y,
// velocity, alive, scale, frame), the camera (y), the platforms that exist
// (how many, sums of x and y), the hearts, spikes, clouds, and particles that
// exist, if the emitter is on, the next platform, and took_heart
function nexist (grp) { var n = 0; grp.forEach(function () { n++; }, null, true); return n; }
window.__trace = function (g, f) {
    var s = g.state.states[g.state.current];
    var r = [score, best_score];
    if (g.state.current === 'Play' && s.princess) {
        var p = s.princess, b = p.body, n = 0, sx = 0, sy = 0;
        s.platforms.forEach(function (e) { n++; sx += e.x; sy += e.y; }, null, true);
        r.push(p.x.toFixed(2), p.y.toFixed(2), b.velocity.x.toFixed(2), b.velocity.y.toFixed(2),
               p.alive ? 1 : 0, p.scale.x.toFixed(3), p.scale.y.toFixed(3), p.frame, g.camera.y,
               n, sx.toFixed(2), sy.toFixed(2), nexist(s.hearts), nexist(s.spikes), nexist(s.clouds),
               nexist(s.emitter), s.emitter.on ? 1 : 0, s.next_platform, s.took_heart ? 1 : 0);
    }
    return r.join(' ');
};
