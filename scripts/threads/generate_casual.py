#!/usr/bin/env python3
"""互換ラッパー: chitchat_gen へ委譲.

新規は scripts/threads/chitchat_gen.py を使ってください。
"""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from chitchat_gen import main  # noqa: E402

if __name__ == "__main__":
    # --mode openai 等の旧引数は無視（API生成は廃止）
    filtered = [a for a in sys.argv[1:] if a not in {"--mode", "local", "openai"}]
    # --mode X のペアを落とす
    argv: list[str] = []
    skip_next = False
    for i, a in enumerate(sys.argv[1:], start=1):
        if skip_next:
            skip_next = False
            continue
        if a == "--mode":
            skip_next = True
            continue
        argv.append(a)
    sys.argv = [sys.argv[0], *argv]
    raise SystemExit(main())
