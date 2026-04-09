#!/usr/bin/env python3
from __future__ import annotations

import json
import os
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parent
PROJECTS_DIR = ROOT / "projects"
LOGBOOK_DIR = ROOT / "logbook"

ISO_DATE_MD = re.compile(r"^\d{4}-\d{2}-\d{2}\.md$")


def list_md_files(directory: Path) -> list[str]:
    if not directory.exists():
        return []
    return sorted(
        [
            path.name
            for path in directory.iterdir()
            if path.is_file() and path.suffix.lower() == ".md" and not path.name.startswith(".")
        ],
        key=lambda name: name.lower(),
    )


def write_index(directory: Path, names: list[str]) -> None:
    directory.mkdir(parents=True, exist_ok=True)
    index_path = directory / "index.json"
    index_path.write_text(json.dumps(names, indent=2) + "\n", encoding="utf-8")


def main() -> int:
    projects = [name for name in list_md_files(PROJECTS_DIR) if name != "index.json"]
    write_index(PROJECTS_DIR, projects)

    logbook = [name for name in list_md_files(LOGBOOK_DIR) if ISO_DATE_MD.match(name)]
    logbook.sort(reverse=True)
    write_index(LOGBOOK_DIR, logbook)

    print(f"Wrote {PROJECTS_DIR / 'index.json'} ({len(projects)} entries)")
    print(f"Wrote {LOGBOOK_DIR / 'index.json'} ({len(logbook)} entries)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

