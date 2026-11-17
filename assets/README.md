# Assets

Images, sounds, and levels of the twelve games, by Thomas Palef (lessmilk.com,
2014), unchanged, at the paths that each original loads them from. They are
his, not covered by the license of this repository.

- Games 1 and 2: from `www.lessmilk.com/games/<n>/` of
  [leokaplan/lessmilk](https://github.com/leokaplan/lessmilk) at commit
  `bf5ef89`. That copy of the site has no assets for games 3 to 12.
- Games 3 to 12: from the port of Jéssica Oliveira,
  [jessicacoliveira/atmos-lessmilk](https://github.com/jessicacoliveira/atmos-lessmilk)
  at commit `3e24458`: from `<game>/phaser/`, where she kept the original
  game, or else from `<game>/media/`. Where both exist, the 36 files that
  can be compared are the same, byte by byte.

Missing from every source found (the site itself cannot be reached from the
container):

| Game | File | Used for |
|------|------|----------|
| 5, 6, 7, 10, 11, 12 | `images/loading.png`, `images/loading2.png` | the loading bar |
| 6 | `images/orientation.png` | the message to turn a phone |
| 10 | `images/tiles.png` | the tiles of the levels (drawing only): **a placeholder** of this port, not his (see below) |
| 11 | `levels/map.json` | the map: tiles and objects |

`10/images/tiles.png` is a placeholder made by this port (decided by the
author, 2026-11-17): plain squares of 20 x 20 in a sheet of 140 x 20, as the
levels declare it, grey (#52555B, the grey of the logo) for the walls (tile 1)
and red (#E74C3C) for the tiles that kill (tile 3), the others transparent.
The original and the port both draw it, so that their screens can be
compared.
