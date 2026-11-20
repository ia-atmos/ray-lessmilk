#!/usr/bin/env python3
# The CPU of a frame, port against original (doc/bench.md).
#
#   tools/bench.py [game ...]       all twelve by default
#
# For each game, its longest run (tst/<game>/*.run), three times each:
#   - the port (out/bench/<game>, built by tools/atmos.sh): CPU time of the
#     process (user + system) for the run, minus that of the same run cut to
#     one frame (the loading), per frame; and its peak memory (maxrss);
#   - the original (tools/original/run.js with BENCH=1): CPU time of the
#     renderer process of Chromium over the loop of frames, per frame; and
#     the JavaScript heap used at the end;
# each whole (the frame drawn), then with the logic only (RL_NODRAW=1 in the
# port, NODRAW=1 in the original: no pixel rasterized nor presented). Every
# run must give the trace of the original (tst/<game>/<run>.out), or the
# measure is refused. Prints a line per game: the medians, in ms per frame.

import os, re, statistics, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
OUT = 'out/bench'
os.makedirs(OUT, exist_ok=True)
N = 3

def parse_run (path):
    r = {'FRAMES': '600', 'SEED': '1', 'FPS': '60', 'INPUT': ''}
    for line in open(path):
        m = re.match(r'^\s*([A-Z_]+)=(.*)$', line)
        if m:
            r[m.group(1)] = m.group(2).strip().strip('"')
    return r

def longest (game):
    runs = [f for f in sorted(os.listdir('tst/' + game)) if f.endswith('.run')]
    return max(runs, key=lambda f: int(parse_run('tst/%s/%s' % (game, f))['FRAMES']))[:-4]

def port (game, r, frames, nodraw):
    env = dict(os.environ, RL_FRAMES=str(frames), RL_SEED=r['SEED'],
               RL_FPS=r['FPS'], RL_INPUT=r['INPUT'])
    env.pop('RL_NODRAW', None)
    if nodraw:
        env['RL_NODRAW'] = '1'
    # the usage of this child alone (wait4), not of all children
    p = subprocess.Popen([OUT + '/' + game], env=env, stdout=subprocess.PIPE,
                         stderr=subprocess.DEVNULL)
    out = p.stdout.read()
    _, st, ru = os.wait4(p.pid, 0)
    p.returncode = os.waitstatus_to_exitcode(st)
    if p.returncode != 0:
        sys.exit('bench: %s failed (%d)' % (game, p.returncode))
    return (ru.ru_utime + ru.ru_stime) * 1000, ru.ru_maxrss, out

def original (n, run, bot, nodraw):
    env = dict(os.environ, BENCH='1')
    env.pop('NODRAW', None)
    env.pop('BOT', None)
    if nodraw:
        env['NODRAW'] = '1'
    if bot:
        env['BOT'] = bot
    p = subprocess.run(['node', 'tools/original/run.js', n, run, OUT + '/shots'],
                       env=env, capture_output=True)
    m = re.search(r'bench: cpu_ms=([\d.]+) frames=(\d+) heap=([\d.]+)', p.stderr.decode())
    if p.returncode != 0 or not m:
        sys.exit('bench: original %s failed: %s' % (n, p.stderr.decode()[-400:]))
    return float(m.group(1)), float(m.group(3)), p.stdout

def check (out, ref, what):
    if out != open(ref, 'rb').read():
        sys.exit('bench: %s: the trace differs from %s' % (what, ref))

def main ():
    games = sys.argv[1:] or sorted(os.listdir('games'))
    print('# game run frames | port: frame logic MB | original: frame logic heapMB | ratio: frame logic')
    for g in games:
        rn = longest(g)
        run = 'tst/%s/%s.run' % (g, rn)
        ref = 'tst/%s/%s.out' % (g, rn)
        r = parse_run(run)
        frames = int(r['FRAMES'])
        n = open('tst/%s/N' % g).read().strip()
        bot = None              # a run made by a bot has its input in INPUT
        if subprocess.run(['tools/atmos.sh', 'games/%s/main.atm' % g, OUT + '/' + g]).returncode != 0:
            sys.exit('bench: %s does not build' % g)
        res = {}
        for nodraw in (False, True):
            ps, os_ = [], []
            for _ in range(N):
                base, _, _ = port(g, r, 1, nodraw)
                cpu, rss, out = port(g, r, frames, nodraw)
                check(out, ref, '%s %s port%s' % (g, rn, ' nodraw' if nodraw else ''))
                ps.append((cpu - base) / (frames - 1))
                res['rss'] = rss
                ocpu, heap, oout = original(n, run, bot, nodraw)
                check(oout, ref, '%s %s original%s' % (g, rn, ' nodraw' if nodraw else ''))
                os_.append(ocpu / (frames - 1))
                res['heap'] = heap
            res[('p', nodraw)] = statistics.median(ps)
            res[('o', nodraw)] = statistics.median(os_)
        pf, pl = res[('p', False)], res[('p', True)]
        of, ol = res[('o', False)], res[('o', True)]
        print('%s %s %d | %.3f %.3f %.1f | %.3f %.3f %.1f | %.2f %.2f' % (
            g, rn, frames, pf, pl, res['rss'] / 1024, of, ol, res['heap'] / 1e6,
            pf / of, pl / ol), flush=True)

main()
