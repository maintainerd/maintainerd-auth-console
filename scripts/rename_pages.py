#!/usr/bin/env python3
"""
Rename src/pages/<feature>/index.tsx -> src/pages/<feature>/<ComponentName>.tsx
and create a small `index.ts` barrel that re-exports the default.

Why: per docs/checklist.md §1 "File naming", page components should be named
files (so component names show in stack traces and refactor tools), with the
folder retaining a barrel `index.ts` so `import X from './pages/<feature>'`
keeps working.

Usage:
    python3 scripts/rename_pages.py [--dry-run]
"""
from __future__ import annotations

import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PAGES = ROOT / "src" / "pages"

# Match either:
#   export default function ComponentName(
#   export default ComponentName            (preceded by `const ComponentName = ...`)
RE_DEFAULT_FN = re.compile(r"^export\s+default\s+function\s+([A-Z][A-Za-z0-9_]*)\b", re.M)
RE_DEFAULT_ID = re.compile(r"^export\s+default\s+([A-Z][A-Za-z0-9_]*)\s*;?\s*$", re.M)


def detect_component_name(source: str) -> str | None:
    m = RE_DEFAULT_FN.search(source)
    if m:
        return m.group(1)
    m = RE_DEFAULT_ID.search(source)
    if m:
        return m.group(1)
    return None


def git_mv(src: Path, dst: Path, dry: bool) -> None:
    rel_src = src.relative_to(ROOT)
    rel_dst = dst.relative_to(ROOT)
    print(f"  git mv {rel_src} -> {rel_dst}")
    if dry:
        return
    subprocess.run(
        ["git", "mv", str(rel_src), str(rel_dst)],
        cwd=ROOT,
        check=True,
    )


def write_barrel(barrel: Path, component: str, dry: bool) -> None:
    content = f"export {{ default }} from './{component}'\n"
    rel = barrel.relative_to(ROOT)
    print(f"  write {rel}  ->  {content.strip()}")
    if dry:
        return
    barrel.write_text(content, encoding="utf-8")


def main() -> int:
    dry = "--dry-run" in sys.argv

    candidates = sorted(PAGES.rglob("index.tsx"))
    if not candidates:
        print("No page index.tsx files found under src/pages/", file=sys.stderr)
        return 1

    renamed = 0
    skipped = 0
    failed: list[str] = []

    for index_tsx in candidates:
        folder = index_tsx.parent
        source = index_tsx.read_text(encoding="utf-8")
        component = detect_component_name(source)

        if component is None:
            failed.append(str(index_tsx.relative_to(ROOT)))
            continue

        target_tsx = folder / f"{component}.tsx"
        barrel_ts = folder / "index.ts"

        if target_tsx.exists():
            print(f"SKIP (target exists): {target_tsx.relative_to(ROOT)}")
            skipped += 1
            continue
        if barrel_ts.exists():
            print(f"SKIP (barrel exists): {barrel_ts.relative_to(ROOT)}")
            skipped += 1
            continue

        print(f"\n# {index_tsx.relative_to(ROOT)}  ({component})")
        git_mv(index_tsx, target_tsx, dry)
        write_barrel(barrel_ts, component, dry)
        renamed += 1

    print()
    print(f"Renamed: {renamed}, skipped: {skipped}, failed: {len(failed)}")
    if failed:
        print("Could not detect component name in:")
        for f in failed:
            print(f"  {f}")
        return 2
    return 0


if __name__ == "__main__":
    sys.exit(main())
