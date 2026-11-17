#!/usr/bin/env python3
# The Three Hearts: levels/map.json of the original is lost (assets/README.md).
# This rebuilds one, in the format of Tiled that Phaser 2.0.1 reads, from the
# map of the port of Jessica Oliveira (ext/student/the_three_hearts/map.atm):
# the tiles (48 x 40 tiles of 40 px, layer "tiles", tileset "tiles" of
# images/tiles4.png) and the objects (layer "objects": enemies gid 16, walls
# 22, hearts 23, keys 24, doors 25, with their properties `move` and
# `key_id`). Her objects are at their top-left corner; Tiled keeps the
# bottom of a tile object, which Phaser moves up by the height of the sprite
# (createFromObjects, adjustY): here y + 40. The walls have no image:
# Phaser draws them with its image of a missing one.
# Not Thomas Palef's file: it goes
# next to the original in ext/ only (tools/setup.sh), never in assets/.
#
#   tools/map11.py <map.atm> <map.json> [<port.atm>]
#
# With <port.atm>, also the same map as Atmos data for the port
# (games/the_three_hearts/map.atm): a vector per row, and the objects
# [gid, x, y, visible, move, key_id], y as in the JSON.
import json, re, sys

src = open(sys.argv[1]).read()
tiles = [int(x) for x in re.findall(r'\d+', src[src.index('map = ['):src.index('],', src.index('map = ['))])]
assert len(tiles) == 48 * 40, len(tiles)

GID = { 'enemies': 16, 'walls': 22, 'hearts': 23, 'keys': 24, 'doors': 25 }
objects = []
for name in ['enemies', 'walls', 'hearts', 'keys', 'doors']:
    block = re.search(name + r' = \[\n(.*?)\n\s+\],\n', src, re.S).group(1)
    for m in re.finditer(r'\[\s*([^\[\]]*?)\s*\]', block):
        f = dict(kv.split('=') for kv in re.sub(r'\s', '', m.group(1)).split(',') if kv)
        props = {}
        if 'move' in f: props['move'] = f['move']
        if 'key_id' in f: props['key_id'] = f['key_id']
        objects.append({ 'gid': GID[name], 'name': '', 'type': '', 'visible': True,
                         'x': int(f['x']), 'y': int(f['y']) + 40, 'width': 0, 'height': 0,
                         'properties': props })

out = {
    'version': 1, 'orientation': 'orthogonal', 'width': 48, 'height': 40,
    'tilewidth': 40, 'tileheight': 40, 'properties': {},
    'layers': [
        { 'name': 'tiles', 'type': 'tilelayer', 'data': tiles, 'width': 48, 'height': 40,
          'opacity': 1, 'visible': True, 'x': 0, 'y': 0 },
        { 'name': 'objects', 'type': 'objectgroup', 'objects': objects, 'width': 48, 'height': 40,
          'opacity': 1, 'visible': True, 'x': 0, 'y': 0 },
    ],
    'tilesets': [ { 'name': 'tiles', 'firstgid': 1, 'image': '../images/tiles4.png',
                    'imagewidth': 280, 'imageheight': 160, 'tilewidth': 40, 'tileheight': 40,
                    'margin': 0, 'spacing': 0, 'properties': {} } ],
}
json.dump(out, open(sys.argv[2], 'w'), indent=1)
print('map11: %d tiles, %d objects' % (len(tiles), len(objects)))

if len(sys.argv) > 3:
    with open(sys.argv[3], 'w') as f:
        f.write(';; The map of The Three Hearts, rebuilt (tools/map11.py, from the map of\n')
        f.write(';; the port of Jessica Oliveira): the same as the levels/map.json that the\n')
        f.write(';; original reads in the comparisons. 48 x 40 tiles of 40 px; the objects\n')
        f.write(';; [gid, x, y, visible, move, key_id], y at the bottom (Tiled).\n\n')
        f.write('pin MAP = [\n    rows = [\n')
        for y in range(40):
            f.write('        [%s],\n' % ', '.join(str(t) for t in tiles[y*48:(y+1)*48]))
        f.write('    ],\n    objects = [\n')
        for o in objects:
            pr = o['properties']
            f.write('        [%d, %d, %d, %s, %s, %s],\n' % (o['gid'], o['x'], o['y'], 'true' if o['visible'] else 'false',
                    pr.get('move', 'nil'), pr.get('key_id', 'nil')))
        f.write('    ],\n]\n')
