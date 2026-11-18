#!/usr/bin/env python3
# The Three Hearts: games/the_three_hearts/map.atm, the map of the original
# (assets/11/levels/map.json, Tiled) as Atmos data for the port: a vector per
# row of tiles, and the objects [gid, x, y, visible, move, key_id], in their
# order in the file.
#
#   tools/map11.py assets/11/levels/map.json games/the_three_hearts/map.atm
import json, sys

d = json.load(open(sys.argv[1]))
L = [l for l in d['layers'] if l['type'] == 'tilelayer'][0]
O = [l for l in d['layers'] if l['type'] == 'objectgroup'][0]['objects']
w, h = L['width'], L['height']
with open(sys.argv[2], 'w') as f:
    f.write(';; The map of The Three Hearts, from assets/11/levels/map.json (Tiled),\n')
    f.write(';; written by tools/map11.py: %d x %d tiles of %d px; the objects\n' % (w, h, d['tilewidth']))
    f.write(';; [gid, x, y, visible, move, key_id], in their order in the file.\n\n')
    f.write('pin MAP = [\n    rows = [\n')
    for y in range(h):
        f.write('        [%s],\n' % ', '.join(str(t) for t in L['data'][y*w:(y+1)*w]))
    f.write('    ],\n    objects = [\n')
    for o in O:
        if not o.get('gid'):
            continue
        p = o.get('properties') or {}
        f.write('        [%d, %s, %s, %s, %s, %s],\n' % (o['gid'], o['x'], o['y'],
                'true' if o.get('visible', True) else 'false', p.get('move', 'nil'), p.get('key_id', 'nil')))
    f.write('    ],\n]\n')
print('map11: %d tiles, %d objects' % (len(L['data']), len(O)))
