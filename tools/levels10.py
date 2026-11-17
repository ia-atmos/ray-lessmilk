#!/usr/bin/env python3
# Dark Blue: games/dark_blue/levels.atm from the levels of the original
# (assets/10/levels/<n>.json, Tiled): the tiles, a string per row (one digit
# per tile, 0 for none), and the objects that the game creates (coins,
# enemies, labels), in their order in the file.
#
#   tools/levels10.py > games/dark_blue/levels.atm
import json
print(';; The five levels of Dark Blue, from assets/10/levels/<n>.json (Tiled),')
print(';; written by tools/levels10.py: the tiles, a string per row (a digit per')
print(';; tile: 0 none, 1 wall, 3 red), and the objects [gid, x, y, move, text].')
print('')
print('pin LEVELS = [')
for n in range(1, 6):
    d = json.load(open('assets/10/levels/%d.json' % n))
    L = d['layers'][0]; O = d['layers'][1]
    w, h = L['width'], L['height']
    print('    [   ;; %d' % n)
    print('        rows = [')
    for y in range(h):
        print('            "%s",' % ''.join(str(t) for t in L['data'][y*w:(y+1)*w]))
    print('        ],')
    print('        objects = [')
    for o in O['objects']:
        p = o.get('properties') or {}
        mv = p.get('move')
        tx = p.get('text')
        print('            [%d, %s, %s, %s, %s],' % (o['gid'], o['x'], o['y'],
              mv if mv is not None else 'nil', json.dumps(tx) if tx is not None else 'nil'))
    print('        ],')
    print('    ],')
print(']')
