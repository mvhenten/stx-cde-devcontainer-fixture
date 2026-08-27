# stx-cde devcontainer fixture

A repository the stx-cde recorder clones to prove devcontainer support end to end.

`.devcontainer/devcontainer.json` exercises what the workstation honours — a node
feature, `containerEnv`, `postCreateCommand`, `postStartCommand`, forwarded ports
and vscode extensions and settings — and one key it refuses, `image`, so a warning
always appears.

`server.mjs` answers `fixture ok` on `$PORT`, defaulting to 3000. On a stx-cde
workstation `$PORT` is 8080, the proxy port that `forwardPorts: [3000]` maps to,
so the forwarded-port row serves it.
