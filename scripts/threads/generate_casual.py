#!/usr/bin/env python3
"""雑談投稿の自動生成（OpenAI互換API）.

未使用残が減ったら CASUAL_HAND_POSTS と同トーンの文を作り、
casual_generated.json に追記する。一度きりの台帳とは別ファイル。

Examples:
  PYTHONPATH=scripts/threads python scripts/threads/generate_casual.py --dry-run --count 8
  PYTHONPATH=scripts/threads python scripts/threads/generate_casual.py --count 16
  PYTHONPATH=scripts/threads python scripts/threads/generate_casual.py --refill
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Sequence, Set

import httpx

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(Path(__file__).resolve().parent))

from posts import (  # noqa: E402
    CASUAL_GENERATED_PATH,
    CASUAL_HAND_POSTS,
    THREADS_TEXT_LIMIT,
    build_casual_posts,
    casual_remaining_count,
    load_generated_casual_posts,
)

THEMES = ("gal", "work", "gym", "nonsense")
THEME_LABEL = {
    "gal": "ギャル寄り（ネイル・メイク・髪型・服・盛れなど）",
    "work": "仕事が憂鬱（上司・会議・通知・残業など）",
    "gym": "筋トレ・女性の体型キープ（ジム・自宅トレ・筋肉痛など）",
    "nonsense": "どうでもいい雑談（家事・ガジェット・些細な失敗）",
}

FORBIDDEN_EMOJI = ("💕", "❤️", "❤", "🫶", "💗", "💖", "💘", "💓", "💞", "♥️")
FORBIDDEN_WORDS = (
    "NISA",
    "nisa",
    "積立",
    "つみたて",
    "投資",
    "資産",
    "利回り",
    "老後",
    "FIRE",
    "iDeCo",
    "イドコ",
    "証券",
    "シミュ",
    "http://",
    "https://",
    "www.",
)

STYLE_EXAMPLES = [
    "ネイルサロン予約したのに日程間違えとる\n来週の金曜じゃなくて再来週だった…金どぶ",
    "上司の「で？」が怖すぎる\n説明してる途中で来るのほんとにやめて",
    "ジム行くのダルいから今日は自宅でスクワットだけやった\n30回で息切れしてて草、運動不足すぎ",
    "アイスの棒、折れた方から食べ始めたらバランス崩れて落ちた\n床びちょびちょ、最悪",
]

SYSTEM_PROMPT = """あなたは日本人女性のSNS（Threads）用の雑談ライター。
フォロワーゼロ〜少人数向け。投資・お金の話は一切しない。

必ず守る文体:
- スマホで打った生の口語。きれいなオチ・教訓・まとめを付けない
- 途中で終わる感じ、ムラのある文でよい
- 1投稿は1〜3行。具体的な場面だけ書く
- 「あるある？」「教えて」「異論は？」などの締めを多用しない
- AIっぽい並列・きれいな対句・「〜ってことでいい？」連発を避ける
- ハート系絵文字は禁止。使うなら草・笑・… 程度
- URL・ハッシュタグ・メンション禁止
- 投資・NISA・積立・老後・証券の単語禁止

出力は JSON のみ。スキーマ:
{"posts":[{"theme":"gal|work|gym|nonsense","text":"本文\\n2行目"}]}
"""


def _env(name: str, default: str = "") -> str:
    return (os.environ.get(name) or default).strip()


def _normalize_text(text: str) -> str:
    text = text.replace("\r\n", "\n").replace("\r", "\n").strip()
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text


def _text_key(text: str) -> str:
    collapsed = re.sub(r"\s+", "", _normalize_text(text))
    return collapsed


def existing_text_keys() -> Set[str]:
    keys: Set[str] = set()
    for post in build_casual_posts():
        keys.add(_text_key(str(post.get("text") or "")))
    return keys


def existing_ids() -> Set[str]:
    return {str(p.get("id") or "") for p in build_casual_posts()}


def validate_post(theme: str, text: str) -> str | None:
    """問題があれば理由、OKなら None。"""
    if theme not in THEMES:
        return f"invalid theme: {theme}"
    text = _normalize_text(text)
    if not text:
        return "empty text"
    if len(text) > THREADS_TEXT_LIMIT:
        return "too long"
    if len(text) < 12:
        return "too short"
    if "http://" in text.lower() or "https://" in text.lower():
        return "url forbidden"
    for emoji in FORBIDDEN_EMOJI:
        if emoji in text:
            return f"forbidden emoji: {emoji}"
    for word in FORBIDDEN_WORDS:
        if word in text:
            return f"forbidden word: {word}"
    # きれいすぎる締めの簡易ガード
    bad_endings = ("教えて", "ある？", "いる？", "異論は", "誰？")
    last = text.strip().split("\n")[-1]
    if any(last.endswith(b) or last.endswith(b + "？") or last.endswith(b + "?") for b in bad_endings):
        if last.count("？") + last.count("?") >= 1 and len(last) < 20:
            return f"quizzy ending: {last}"
    return None


def make_id(theme: str, text: str) -> str:
    digest = hashlib.sha1(_text_key(text).encode("utf-8")).hexdigest()[:10]
    return f"cas-gen-{theme}-{digest}"


def _theme_quota(count: int) -> List[str]:
    """テーマをできるだけ均等に割り当て。"""
    base, rem = divmod(count, len(THEMES))
    themes: List[str] = []
    for i, theme in enumerate(THEMES):
        themes.extend([theme] * (base + (1 if i < rem else 0)))
    return themes


def build_user_prompt(count: int, avoid_samples: Sequence[str]) -> str:
    themes = _theme_quota(count)
    avoid_block = "\n".join(f"- {s}" for s in avoid_samples[:24]) or "- （なし）"
    examples = "\n\n".join(f"例:\n{s}" for s in STYLE_EXAMPLES)
    theme_lines = "\n".join(f"- {t}: {THEME_LABEL[t]}" for t in THEMES)
    return f"""次の件数だけ雑談を作って。件数={count}
テーマ配分（この順でその件数）: {", ".join(themes)}

テーマ意味:
{theme_lines}

口調の参考（真似するな・近い温度感だけ）:
{examples}

既存と被るな（似た場面も避ける）:
{avoid_block}

JSONのみ返せ。posts はちょうど {count} 件。
各 text は改行入り可。theme は gal/work/gym/nonsense のみ。
"""


def call_openai(messages: List[Dict[str, str]], *, model: str, base_url: str, api_key: str) -> Dict[str, Any]:
    url = base_url.rstrip("/") + "/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": model,
        "temperature": 0.95,
        "response_format": {"type": "json_object"},
        "messages": messages,
    }
    with httpx.Client(timeout=90.0) as client:
        res = client.post(url, headers=headers, json=payload)
        res.raise_for_status()
        data = res.json()
    content = data["choices"][0]["message"]["content"]
    return json.loads(content)


def parse_model_posts(payload: Dict[str, Any]) -> List[Dict[str, str]]:
    raw = payload.get("posts")
    if not isinstance(raw, list):
        raise ValueError("model JSON missing posts[]")
    out: List[Dict[str, str]] = []
    for item in raw:
        if not isinstance(item, dict):
            continue
        theme = str(item.get("theme") or "").strip()
        text = _normalize_text(str(item.get("text") or ""))
        out.append({"theme": theme, "text": text})
    return out


def generate_batch(count: int, *, api_key: str, model: str, base_url: str) -> List[dict]:
    keys = existing_text_keys()
    ids = existing_ids()
    avoid = [str(p.get("text") or "") for p in build_casual_posts()][-24:]
    accepted: List[dict] = []
    attempts = 0
    max_attempts = 4

    while len(accepted) < count and attempts < max_attempts:
        attempts += 1
        need = count - len(accepted)
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": build_user_prompt(need, avoid)},
        ]
        payload = call_openai(messages, model=model, base_url=base_url, api_key=api_key)
        for item in parse_model_posts(payload):
            theme = item["theme"]
            text = item["text"]
            reason = validate_post(theme, text)
            if reason:
                print(f"skip: {reason} :: {text[:40]!r}", file=sys.stderr)
                continue
            key = _text_key(text)
            if key in keys:
                print(f"skip: duplicate text :: {text[:40]!r}", file=sys.stderr)
                continue
            pid = make_id(theme, text)
            if pid in ids:
                print(f"skip: duplicate id {pid}", file=sys.stderr)
                continue
            post = {
                "id": pid,
                "topic": "雑談",
                "kind": "casual",
                "theme": theme,
                "text": text,
                "created_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
            }
            accepted.append(post)
            keys.add(key)
            ids.add(pid)
            avoid.append(text)
            if len(accepted) >= count:
                break
        print(f"attempt={attempts} accepted={len(accepted)}/{count}", file=sys.stderr)

    return accepted[:count]


def save_generated(posts: List[dict]) -> int:
    existing = load_generated_casual_posts()
    # preserve unknown fields from file where possible
    path = CASUAL_GENERATED_PATH
    raw_posts: List[dict] = []
    if path.is_file():
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
            if isinstance(data, dict) and isinstance(data.get("posts"), list):
                raw_posts = [p for p in data["posts"] if isinstance(p, dict)]
        except (OSError, json.JSONDecodeError):
            raw_posts = list(existing)

    known = {str(p.get("id") or "") for p in raw_posts}
    added = 0
    for post in posts:
        pid = str(post.get("id") or "")
        if not pid or pid in known:
            continue
        raw_posts.append(post)
        known.add(pid)
        added += 1

    path.write_text(
        json.dumps({"posts": raw_posts}, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    return added


def resolve_count(args: argparse.Namespace) -> int:
    if args.refill:
        remaining = casual_remaining_count()
        target = args.target_remaining
        if remaining >= args.min_remaining:
            print(
                f"refill skip: remaining={remaining} >= min_remaining={args.min_remaining}"
            )
            return 0
        need = max(target - remaining, 0)
        # 4テーマ均等になるよう切り上げ
        if need % 4:
            need += 4 - (need % 4)
        print(
            f"refill: remaining={remaining} → generate {need} (target={target})",
            file=sys.stderr,
        )
        return need
    return max(int(args.count), 0)


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate casual Threads posts")
    parser.add_argument("--count", type=int, default=16, help="生成件数（--refill 時は無視）")
    parser.add_argument(
        "--refill",
        action="store_true",
        help="残数が min_remaining 未満なら target_remaining まで補充",
    )
    parser.add_argument("--min-remaining", type=int, default=24, help="補充開始の残数閾値")
    parser.add_argument("--target-remaining", type=int, default=48, help="補充後の目標残数")
    parser.add_argument("--dry-run", action="store_true", help="ファイルに書かず表示のみ")
    parser.add_argument(
        "--model",
        default=_env("OPENAI_MODEL", "gpt-4o-mini"),
        help="OpenAI互換モデル名",
    )
    parser.add_argument(
        "--base-url",
        default=_env("OPENAI_BASE_URL", "https://api.openai.com/v1"),
        help="OpenAI互換 base URL",
    )
    args = parser.parse_args()

    count = resolve_count(args)
    if count <= 0:
        return 0

    api_key = _env("OPENAI_API_KEY")
    if not api_key:
        print(
            "ERROR: OPENAI_API_KEY が未設定です（GitHub Secrets / ローカル env）",
            file=sys.stderr,
        )
        return 1

    print(
        f"hand={len(CASUAL_HAND_POSTS)} generated={len(load_generated_casual_posts())} "
        f"remaining={casual_remaining_count()} gen_count={count} model={args.model}",
        file=sys.stderr,
    )

    try:
        posts = generate_batch(
            count,
            api_key=api_key,
            model=args.model,
            base_url=args.base_url,
        )
    except (httpx.HTTPError, json.JSONDecodeError, KeyError, ValueError) as exc:
        print(f"ERROR: generation failed: {exc}", file=sys.stderr)
        return 1

    if len(posts) < count:
        print(
            f"WARNING: requested={count} got={len(posts)} (validation drops)",
            file=sys.stderr,
        )
    if not posts:
        print("ERROR: no posts accepted", file=sys.stderr)
        return 1

    for post in posts:
        print(f"----- {post['id']} theme={post['theme']} -----")
        print(post["text"])
        print()

    if args.dry_run:
        print("DRY-RUN: not written")
        return 0

    added = save_generated(posts)
    print(f"WROTE: +{added} → {CASUAL_GENERATED_PATH}")
    print(f"remaining_after={casual_remaining_count()}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
