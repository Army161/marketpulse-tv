#!/usr/bin/env python3
"""
Package the Roku channel into dist/marketpulse-roku.zip with `manifest` at the
archive root (Roku's installer requires that — no nesting).

Excludes dev-only files (bsconfig.json) and build/tooling artifacts (out/,
node_modules, .git, brighterscript staging) so they never ship inside the .pkg.

Run from the repo root:
    python3 scripts/package-roku.py
"""
import os
import zipfile

ROKU_DIR = "apps/roku"
OUT = "dist/marketpulse-roku.zip"

EXCLUDE_FILES = {".DS_Store", "Thumbs.db", "bsconfig.json"}
EXCLUDE_DIRS = {"out", "node_modules", ".git", ".roku-deploy-staging"}


def main() -> None:
    os.makedirs("dist", exist_ok=True)
    written = []
    with zipfile.ZipFile(OUT, "w", zipfile.ZIP_DEFLATED) as z:
        for root, dirs, files in os.walk(ROKU_DIR):
            # Prune excluded directories in-place so os.walk skips them.
            dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
            for f in files:
                if f in EXCLUDE_FILES:
                    continue
                full = os.path.join(root, f)
                arc = os.path.relpath(full, ROKU_DIR).replace(os.sep, "/")
                z.write(full, arc)
                written.append(arc)

    names = sorted(written)
    assert "manifest" in names, "FATAL: manifest is not at the archive root"
    assert "bsconfig.json" not in names, "FATAL: bsconfig.json leaked into package"
    assert not any(n.startswith("out/") for n in names), "FATAL: out/ leaked into package"
    print(f"Packaged {OUT} with {len(names)} files (manifest at root).")


if __name__ == "__main__":
    main()
