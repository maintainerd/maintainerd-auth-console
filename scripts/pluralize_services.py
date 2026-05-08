#!/usr/bin/env python3
"""
Pluralize service folder names under src/services/api/ to match REST routes
and the plural pages/ siblings (per checklist §1).

Performs:
  1. Renames each src/services/api/<old>/ -> src/services/api/<new>/ on disk
     (uses git mv when the working dir is a git repo).
  2. Rewrites every import string referencing the old path across the source
     tree so that 'services/api/<old>' becomes 'services/api/<new>'.

Pure path/string substitution — no AST work needed because the strings are
unambiguous (always namespaced under `services/api/`).
"""
from __future__ import annotations
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SERVICES_DIR = ROOT / "src" / "services" / "api"

RENAMES: list[tuple[str, str]] = [
    ("api-key", "api-keys"),
    ("email-template", "email-templates"),
    ("identity-provider", "identity-providers"),
    ("login-template", "login-templates"),
    ("permission", "permissions"),
    ("policy", "policies"),
    ("role", "roles"),
    ("service", "services"),
    ("signup-flow", "signup-flows"),
    ("sms-template", "sms-templates"),
    ("tenant", "tenants"),
    ("user", "users"),
]

# Files we touch when rewriting paths.
EXTS = {".ts", ".tsx", ".js", ".jsx", ".json", ".md"}
# Folders to skip outright.
SKIP_DIRS = {"node_modules", ".git", "dist", "build", "coverage"}


def is_git_repo() -> bool:
    return (ROOT / ".git").exists()


def git_mv(src: Path, dst: Path) -> None:
    subprocess.run(
        ["git", "mv", str(src.relative_to(ROOT)), str(dst.relative_to(ROOT))],
        cwd=ROOT,
        check=True,
    )


def rename_dirs() -> list[tuple[str, str]]:
    moved: list[tuple[str, str]] = []
    use_git = is_git_repo()
    for old, new in RENAMES:
        src = SERVICES_DIR / old
        dst = SERVICES_DIR / new
        if not src.exists():
            print(f"  skip (missing): {src}")
            continue
        if dst.exists():
            print(f"  skip (target exists): {dst}", file=sys.stderr)
            continue
        if use_git:
            git_mv(src, dst)
        else:
            shutil.move(str(src), str(dst))
        moved.append((old, new))
        print(f"  mv {src.relative_to(ROOT)} -> {dst.relative_to(ROOT)}")
    return moved


def rewrite_paths(moved: list[tuple[str, str]]) -> tuple[int, int]:
    if not moved:
        return 0, 0
    # Build one substitution per resource. Match exactly the segment
    # `services/api/<old>` followed by `/` or end of import path.
    patterns = [
        (re.compile(rf"services/api/{re.escape(old)}(?=/|['\"`])"), f"services/api/{new}")
        for old, new in moved
    ]

    files_changed = 0
    subs = 0
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for fn in filenames:
            if not any(fn.endswith(ext) for ext in EXTS):
                continue
            path = Path(dirpath) / fn
            try:
                text = path.read_text(encoding="utf-8")
            except UnicodeDecodeError:
                continue
            new_text = text
            local = 0
            for pat, repl in patterns:
                new_text, n = pat.subn(repl, new_text)
                local += n
            if local:
                path.write_text(new_text, encoding="utf-8")
                files_changed += 1
                subs += local
    return files_changed, subs


def main() -> None:
    print("Renaming service folders...")
    moved = rename_dirs()
    print(f"\nRewriting import paths for {len(moved)} renamed folders...")
    files_changed, subs = rewrite_paths(moved)
    print(f"\n{files_changed} files updated, {subs} path substitutions total.")


if __name__ == "__main__":
    main()
