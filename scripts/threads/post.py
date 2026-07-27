#!/usr/bin/env python3
"""みつきリタイア: Threads 自動投稿 CLI（keiba-ev-app 方式）.

デフォルトは dry-run。本番は --publish または THREADS_AUTO_POST=true。

Examples:
  python scripts/threads/post.py --dry-run
  python scripts/threads/post.py --publish
  python scripts/threads/post.py --id gap-reveal-1 --dry-run
"""

from __future__ import annotations

import argparse
import asyncio
import os
import sys
from datetime import date, datetime
from pathlib import Path
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(Path(__file__).resolve().parent))

from client import ThreadsApiError, ThreadsClient  # noqa: E402
from posts import (  # noqa: E402
    all_posts,
    pick_post_by_id,
    pick_post_for_slot,
    slot_from_hour,
)

JST = ZoneInfo("Asia/Tokyo")


def _env(name: str) -> str:
    return (os.environ.get(name) or "").strip()


def credentials_ready() -> bool:
    return bool(_env("THREADS_ACCESS_TOKEN") and _env("THREADS_USER_ID"))


def resolve_dry_run(args: argparse.Namespace) -> bool:
    if args.publish:
        return False
    if args.dry_run:
        return True
    # Default: dry-run unless THREADS_AUTO_POST=true
    return _env("THREADS_AUTO_POST").lower() not in {"1", "true", "yes"}


async def main_async(args: argparse.Namespace) -> int:
    if args.list:
        for i, post in enumerate(all_posts()):
            print(f"{i:02d}  {post['id']}  #{post.get('topic', '')}")
        return 0

    if args.id:
        post = pick_post_by_id(args.id)
        slot = None
    else:
        now_jst = datetime.now(JST)
        day = date.fromisoformat(args.date) if args.date else now_jst.date()
        if args.slot is not None:
            slot = args.slot
        else:
            slot = slot_from_hour(now_jst.hour)
        post = pick_post_for_slot(day, slot=slot)

    dry_run = resolve_dry_run(args)
    text = post["text"]
    topic = (args.topic_tag or post.get("topic") or "").strip() or None

    slot_label = post.get("slot", slot)
    print(
        f"post_id={post['id']} slot={slot_label if slot_label is not None else '-'} "
        f"topic={topic or '-'} dry_run={dry_run}"
    )
    print("-----")
    print(text)
    print("-----")

    if dry_run:
        print("DRY-RUN: not published")
        return 0

    if not credentials_ready():
        print(
            "ERROR: THREADS_ACCESS_TOKEN / THREADS_USER_ID が未設定です",
            file=sys.stderr,
        )
        return 1

    client = ThreadsClient(
        access_token=_env("THREADS_ACCESS_TOKEN"),
        user_id=_env("THREADS_USER_ID"),
    )
    try:
        result = await client.publish_thread(
            [text],
            topic_tag=topic,
            dry_run=False,
        )
    except (ThreadsApiError, ValueError) as exc:
        msg = str(exc)
        print(f"ERROR: {msg}", file=sys.stderr)
        lower = msg.lower()
        if (
            "permission" in lower
            or "threads_content_publish" in lower
            or ("code" in lower and "10" in msg)
        ):
            print(
                "ヒント: Meta Developer で threads_content_publish を確認し、"
                "長期トークンを再発行して THREADS_ACCESS_TOKEN を更新。",
                file=sys.stderr,
            )
        return 1

    print(f"PUBLISHED: {result.post_ids}")
    return 0


def main() -> None:
    parser = argparse.ArgumentParser(description="Threads へ集客投稿（みつきリタイア）")
    parser.add_argument(
        "--date",
        default="",
        help="投稿選択用の日付 YYYY-MM-DD（省略時は今日・ローテーション）",
    )
    parser.add_argument(
        "--slot",
        type=int,
        choices=(0, 1, 2),
        default=None,
        help="日内枠 0=朝 1=昼 2=夜（省略時は JST の時刻から判定）",
    )
    parser.add_argument("--id", default="", help="投稿IDを直接指定（posts.py の id）")
    parser.add_argument("--topic-tag", default="", help="トピックタグ（#なし・省略可）")
    parser.add_argument("--list", action="store_true", help="投稿ID一覧")
    group = parser.add_mutually_exclusive_group()
    group.add_argument(
        "--dry-run",
        action="store_true",
        help="投稿せず本文のみ表示",
    )
    group.add_argument(
        "--publish",
        action="store_true",
        help="実際に Threads へ投稿",
    )
    args = parser.parse_args()
    raise SystemExit(asyncio.run(main_async(args)))


if __name__ == "__main__":
    main()
