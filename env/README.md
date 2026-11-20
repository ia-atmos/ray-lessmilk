# env

The raylib environment for Atmos, written by the port of the raylib games,
copied at a fixed commit so that its changes do not break this port:

| File | From | Commit |
|------|------|--------|
| `ray.atm` | [ia-atmos/env-ray](https://github.com/ia-atmos/env-ray) `ray.atm` | `8350e6f` (as of `0d8b477`) |
| `raylib.patch` | [ia-atmos/env-ray](https://github.com/ia-atmos/env-ray) `tools/raylib.patch` | `4360cb2` (unchanged since) |

`ray.atm` is used as it is, with the vocabulary of events of all the
environments: the table `ray`; `:key.dn`/`:key.up [key=name, code=]`,
`:mouse.button.dn`/`:mouse.button.up [button=, x=, y=]`, `:frame [n=, us=]`,
`:draw`, `:quit`. It includes `reasings.h` of the examples of raylib
(`tools/atmos.sh` adds `-I<raylib>/examples/shapes`).

`raylib.patch` adds a test mode to raylib 6.2 built for its platform with no
screen (`RL_FRAMES`, `RL_SEED`, `RL_INPUT`, `RL_SHOT`). What this port adds
or fixes here is sent back to that repository, so that there is one
environment.
