#!/bin/sh
# The launcher of the twelve ports, to play them in a window.
#
#   tools/play.sh               lists the games
#   tools/play.sh <n|name>      builds the game (if it changed) and plays it
#
# It needs raylib for the desktop: DESKTOP=1 tools/setup.sh builds it in
# ext/raylib/build-desktop (the tests use the build with no screen).

cd "$(dirname "$0")/.."
ROOT=$(pwd)
RL="$ROOT/ext/raylib"

# the twelve, by their number on the site (tst/<game>/N)
list () {
    for d in games/*/; do
        g=$(basename $d)
        echo "$(cat tst/$g/N) $g"
    done | sort -n
}

if [ -z "$1" ]; then
    list | while read n g; do printf '%2d  %s\n' $n $g; done
    echo "play: tools/play.sh <n|name>"
    exit 0
fi

game=$(list | while read n g; do
    if [ "$1" = "$n" ] || [ "$1" = "$g" ]; then echo $g; fi
done)
[ -n "$game" ] || { echo "play: no game $1 (tools/play.sh lists them)" >&2; exit 1; }

LIB="$RL/build-desktop/libraylib.a"
[ -f "$LIB" ] || { echo "play: no raylib for the desktop: DESKTOP=1 tools/setup.sh" >&2; exit 1; }

OUT="$ROOT/out/play"
mkdir -p "$OUT"
# rebuild when a source of the game, of lib/ or of env/ is newer
if [ ! -x "$OUT/$game" ] || [ -n "$(find games/$game lib env -newer "$OUT/$game" -type f | head -1)" ]; then
    ATMOS_HOME="$ROOT/ext/ceu-atmos" \
    ATMOS_CFLAGS="-O2 -I$RL/src -I$RL/examples/shapes" \
    ATMOS_LDFLAGS="$LIB -lm -lpthread -ldl -lX11" \
        "$ROOT/ext/ceu-atmos/atmos" -o "$OUT/$game" games/$game/main.atm \
        || { echo "play: $game does not build" >&2; exit 1; }
fi
exec "$OUT/$game"
