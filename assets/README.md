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

- From www.lessmilk.com itself (reached on 2026-11-18, where each game now
  has a page of its own, `/<name>/`): the files that the two sources above
  lack, `images/loading.png` and `images/loading2.png` of games 5, 6, 7, 10,
  11 and 12, `10/images/tiles.png`, and `11/levels/map.json`. The other 127
  files of this directory are the same as the site's, byte by byte
  (`tools/site.sh` downloads them; see `doc/fidelity.md`).

Missing still: `6/images/orientation.png` (the message to turn a phone),
which the site does not serve either.

Before the site was reached, Dark Blue drew a placeholder of `tiles.png`
(grey and red squares) and The Three Hearts read a map rebuilt from the
student's port (whose objects came out 40 px lower than in the real one);
both were replaced by the files of the site. The runs of The Three Hearts
were made again; the traces of Dark Blue do not depend on the image.
