"""日次投稿プラン: その日の全枠を一括で決め、ファイルに記憶する.

- 毎日の内容を day_plans.json に保存（枠ごとに同じ文が再選定されない）
- 前日プランの flags を引き継ぎ、前日矛盾（例: 昨日トレしてないのに昨日の筋肉痛）を防ぐ
"""

from __future__ import annotations

import json
import sys
from copy import deepcopy
from datetime import date, timedelta
from pathlib import Path
from typing import Any, Dict, List, Set

from casual_consistency import (
    carry_yesterday_flags,
    flags_from_posts,
    resolve_consistency,
)

_THREADS_DIR = Path(__file__).resolve().parent
DAY_PLANS_PATH = _THREADS_DIR / "day_plans.json"


def load_day_plans() -> Dict[str, Any]:
    if not DAY_PLANS_PATH.is_file():
        return {}
    try:
        data = json.loads(DAY_PLANS_PATH.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return {}
    return data if isinstance(data, dict) else {}


def save_day_plans(plans: Dict[str, Any]) -> None:
    DAY_PLANS_PATH.write_text(
        json.dumps(plans, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def _slot_snapshot(post: dict, slot: int) -> dict:
    cons = resolve_consistency(post)
    out = {
        "id": post.get("id"),
        "kind": post.get("kind") or "casual",
        "topic": post.get("topic") or "",
        "theme": post.get("theme") or "",
        "text": post.get("text") or "",
        "consistency": cons,
        "slot": slot,
    }
    if post.get("image_url"):
        out["image_url"] = post["image_url"]
    if post.get("film"):
        out["film"] = post["film"]
    if post.get("replies"):
        out["replies"] = list(post["replies"])
    elif post.get("reply"):
        out["reply"] = post["reply"]
    return out


def all_planned_ids(plans: Dict[str, Any] | None = None) -> Set[str]:
    plans = plans if plans is not None else load_day_plans()
    out: Set[str] = set()
    for day_plan in plans.values():
        if not isinstance(day_plan, dict):
            continue
        slots = day_plan.get("slots")
        if not isinstance(slots, dict):
            continue
        for item in slots.values():
            if isinstance(item, dict):
                pid = str(item.get("id") or "").strip()
                if pid:
                    out.add(pid)
    return out


def get_day_plan(day: date) -> Dict[str, Any] | None:
    plans = load_day_plans()
    item = plans.get(day.isoformat())
    return item if isinstance(item, dict) else None


def ensure_day_plan(day: date | None = None, *, persist: bool = True) -> Dict[str, Any]:
    """その日の全枠を確定して返す。未作成なら整合性を見て新規作成。"""
    from ogiri_posts import load_ogiri_used_ids, pick_ogiri
    from posts import (
        CTA_POSTS,
        POSTS_PER_DAY,
        SCHEDULE_ID,
        SLOT_KINDS,
        _hydrate,
        _pick_casual_for_day,
        _pick_value_fallback,
        _select_value_pool,
        build_casual_posts,
        load_casual_used_ids,
        unused_casual_posts,
    )

    day = day or date.today()
    plans = load_day_plans()
    key = day.isoformat()
    existing = plans.get(key)
    if isinstance(existing, dict):
        slots = existing.get("slots")
        if (
            isinstance(slots, dict)
            and len(slots) >= POSTS_PER_DAY
            and existing.get("schedule") == SCHEDULE_ID
        ):
            return existing

    # 前日プランがあれば flags を引き継ぐ（無い日は空＝初日から記憶開始）
    yday = day - timedelta(days=1)
    yplan = plans.get(yday.isoformat())
    yflags: Set[str] = set()
    if isinstance(yplan, dict):
        raw_flags = yplan.get("flags")
        if isinstance(raw_flags, list):
            yflags = {str(x) for x in raw_flags}
        else:
            yslots = yplan.get("slots") if isinstance(yplan.get("slots"), dict) else {}
            yposts = [v for v in yslots.values() if isinstance(v, dict)]
            yflags = flags_from_posts(yposts)
    base_flags = carry_yesterday_flags(yflags)

    # 当日の未完成プラン／旧スケジュールは作り直し
    plans.pop(key, None)
    planned_ids = (
        all_planned_ids(plans)
        | set(load_casual_used_ids())
        | set(load_ogiri_used_ids())
    )
    day_session: Set[str] = set()
    slot_map: Dict[str, dict] = {}

    for slot in range(POSTS_PER_DAY):
        kind = SLOT_KINDS[slot]
        kind_index = SLOT_KINDS[: slot + 1].count(kind) - 1
        per_day_kind = SLOT_KINDS.count(kind)
        emit = day.toordinal() * per_day_kind + kind_index

        if kind in ("ogiri", "ogiri_fin"):
            post = pick_ogiri(
                session_used=day_session, planned_ids=planned_ids, kind=kind
            )
            pid = str(post.get("id") or "")
            if pid:
                day_session.add(pid)
                planned_ids.add(pid)
            hydrated = _hydrate(post, slot=slot)
        elif kind == "casual":
            pool = build_casual_posts()
            extra = set(planned_ids) | day_session
            unused = unused_casual_posts(extra)
            if not unused:
                post = _pick_value_fallback(day, kind_index, per_day_kind, slot)
                print(
                    f"WARNING: day_plan {key} slot={slot} casual枯渇 → value fallback",
                    file=sys.stderr,
                )
            else:
                post = _pick_casual_for_day(
                    unused,
                    session_used=day_session,
                    pool=pool,
                    day=day,
                    slot=slot,
                    base_flags=base_flags,
                )
                pid = str(post.get("id") or "")
                if pid:
                    day_session.add(pid)
                    planned_ids.add(pid)
            hydrated = _hydrate(post, slot=slot)
        elif kind == "cta":
            pool = CTA_POSTS
            index = emit % len(pool)
            hydrated = _hydrate(pool[index], index=index, slot=slot)
        elif kind == "num":
            from num_posts import generate_num_post

            hydrated = _hydrate(
                generate_num_post(day, kind_index, per_day_kind), slot=slot
            )
        else:
            # value（教育 / 褒め / 失敗談）
            pool, index = _select_value_pool(emit)
            hydrated = _hydrate(pool[index], index=index, slot=slot)
            hydrated["kind"] = "value"

        slot_map[str(slot)] = _slot_snapshot(hydrated, slot)

    casual_posts = [
        slot_map[str(s)]
        for s in range(POSTS_PER_DAY)
        if SLOT_KINDS[s] == "casual"
    ]
    today_flags = sorted(flags_from_posts(casual_posts))
    plan = {
        "date": key,
        "schedule": SCHEDULE_ID,
        "flags": today_flags,
        "yesterday_flags_carried": sorted(base_flags),
        "slots": slot_map,
    }
    plans[key] = plan
    if persist:
        save_day_plans(plans)
        print(f"DAY_PLAN: wrote {key} schedule={SCHEDULE_ID} flags={today_flags}", file=sys.stderr)
    return plan


def pick_from_day_plan(day: date, slot: int, *, persist: bool = True) -> dict:
    from posts import POSTS_PER_DAY, _hydrate

    slot = max(0, min(POSTS_PER_DAY - 1, int(slot)))
    plan = ensure_day_plan(day, persist=persist)
    raw = plan.get("slots", {}).get(str(slot))
    if not isinstance(raw, dict):
        raise KeyError(f"day plan missing slot {slot} for {day}")
    post = deepcopy(raw)
    return _hydrate(post, slot=slot)
