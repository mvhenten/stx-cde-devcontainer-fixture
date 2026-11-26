# Contributing

This repository is a fixture: it exists so the stx-cde recorder can prove
devcontainer support end to end. There is no package manager, no test runner and
no CI — the "checks" below are the devcontainer behaviours the fixture asserts.
Keep `.devcontainer/devcontainer.json` exercising those keys when you change it.

## Opening the devcontainer

The repository has a single container definition at
`.devcontainer/devcontainer.json`. Open it either way:

- **VS Code** — install the Dev Containers extension, open the repository folder
  and accept *Reopen in Container* (or run **Dev Containers: Reopen in
  Container** from the command palette).
- **CLI** — with [`@devcontainers/cli`](https://github.com/devcontainers/cli):

  ```sh
  devcontainer up --workspace-folder .
  devcontainer exec --workspace-folder . bash
  ```

  This builds the container and runs the lifecycle commands, but it does **not**
  forward ports: the standalone CLI does not implement `forwardPorts`
  ([devcontainers/cli#22](https://github.com/devcontainers/cli/issues/22)).
  Checks 1–5 all pass under it; check 6 does not apply. Use VS Code or an
  stx-cde workstation to exercise forwarding.

On a stx-cde workstation the repository is cloned and the container started for
you. Expect a warning that the `image` key is unsupported: that key is in the
fixture deliberately, so a refusal always shows up. The workstation builds from
its own base instead and applies the rest of the file.

## Running the checks

Run these inside the container, from the workspace folder.

1. **`postCreateCommand` ran** — created once, when the container was built:

   ```sh
   cat ~/devcontainer-created.txt   # -> created
   ```

2. **`postStartCommand` ran** — rewritten on every start, and it also launches
   the server in the background:

   ```sh
   cat ~/devcontainer-started.txt   # -> a date
   cat ~/fixture-server.log         # -> fixture listening on 3000
   ```

3. **`containerEnv` applied**:

   ```sh
   echo "$FIXTURE_ENV"              # -> yes
   ```

4. **The node feature is present** — `ghcr.io/devcontainers/features/node:1`
   installs it; nothing else in the image provides it:

   ```sh
   node --version
   ```

5. **The server answers** — `server.mjs` listens on port 3000:

   ```sh
   curl -s http://localhost:3000/   # -> fixture ok
   ```

   If `postStartCommand` did not leave it running, start it yourself with
   `node server.mjs`.

6. **Port forwarding works** — *VS Code or stx-cde only; skip this under the
   standalone CLI, which does not forward ports.* `forwardPorts` declares 3000
   and 8000.

   - Request 3000 from *outside* the container and you should get the same
     `fixture ok`. On a stx-cde workstation the forwarded-port row for 3000
     serves it through the proxy on 8080.
   - On stx-cde, also confirm a row appears for **8000**. Nothing listens on
     8000, so it will not serve anything — the row appearing at all is the
     check, because it shows every declared port is picked up and not just the
     one with a server behind it.

A change is good when all six still hold — five if you are on the CLI.
