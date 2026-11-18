#!/bin/sh
# The games as www.lessmilk.com serves them today (each page loads one
# bundle: its Phaser, then its code, minified again by the host), in
# ext/site/games/<n>/, next to the same assets, so that
# `SITE=1 node tools/original/run.js <n> <run>` runs them like the copy of
# the site of 2014 in ext/originals. Also the files that copy lacks.
#
#   tools/site.sh
set -e
cd "$(dirname "$0")/.."
S=ext/site; mkdir -p $S
set -- 1:run 2:pixel-war-1 3:box-jump 4:man-vs-penguins 5:fill-the-holes 6:princess-quest 7:connected 8:save-the-city 9:i-hate-rabbits 10:dark-blue 11:the-three-hearts 12:crazy-snake
for p in "$@"; do
    n=${p%%:*}; s=${p#*:}; d=$S/games/$n
    mkdir -p $d
    curl -sS --max-time 30 "https://www.lessmilk.com/$s/" -o $d/page.html
    u=$(grep -o "src='[^']*bundles[^']*'" $d/page.html | sed "s/src='//;s/'$//")
    curl -sS --max-time 60 "$u" -o $d/bundle.js
    # Phaser ends where the game begins: its first statement, Game={}
    # (game 9 defines its map first)
    python3 -I - $d/bundle.js $d $n <<'PY'
import sys
b=open(sys.argv[1]).read(); d=sys.argv[2]; n=int(sys.argv[3])
i=b.find('var map=[[') if n == 9 else b.find('Game={}')
open(d+'/phaser.js','w').write(b[:i]); open(d+'/game.js','w').write(b[i:])
PY
    cp -r ext/originals/www.lessmilk.com/games/$n/images ext/originals/www.lessmilk.com/games/$n/sounds $d/ 2>/dev/null || true
    [ -d ext/originals/www.lessmilk.com/games/$n/levels ] && cp -r ext/originals/www.lessmilk.com/games/$n/levels $d/
    for f in images/loading.png images/loading2.png images/tiles.png levels/map.json; do
        code=$(curl -sS -L -o $d/tmp -w "%{http_code}" --max-time 30 "https://www.lessmilk.com/$s/$f")
        [ "$code" = 200 ] && { mkdir -p $d/$(dirname $f); mv $d/tmp $d/$f; } || rm -f $d/tmp
    done
    # the width of the page of the copy of 2014, which the harness reads
    w=$(grep -o 'gameContainer" style="width:[0-9]*px' ext/originals/www.lessmilk.com/games/$n/index.html | head -1)
    printf '<!DOCTYPE html><html><body>\n<div id="%s"></div>\n<script src="phaser.js"></script>\n<script src="game.js"></script>\n</body></html>\n' "${w:-gameContainer\" style=\"width:600px}" > $d/index.html
    echo "site: $n $s"
done
