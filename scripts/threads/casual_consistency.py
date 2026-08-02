"""同日内・日跨ぎの雑談整合性（矛盾する事実・時間帯・曜日の衝突を防ぐ）.

各投稿は flags を sets / forbids / requires で持つ。
前日プランの flags は gym_done_yesterday などに変換して引き継ぐ。
"""

from __future__ import annotations

from datetime import date
from typing import Dict, Iterable, List, Optional, Set

# 相互排他（片方が立っていたら、もう片方を sets する投稿は不可）
_EXCLUSIVE_PAIRS = (
    ("gym_skipped_today", "gym_done_today"),
    ("wfh_today", "at_office_today"),
)

_YESTERDAY_FLAG_MAP = {
    "gym_done_today": "gym_done_yesterday",
    "gym_skipped_today": "gym_skipped_yesterday",
    "wfh_today": "wfh_yesterday",
    "at_office_today": "at_office_yesterday",
}

_WEEKDAY_TOKENS = (
    ("月曜日", 0),
    ("火曜日", 1),
    ("水曜日", 2),
    ("木曜日", 3),
    ("金曜日", 4),
    ("土曜日", 5),
    ("日曜日", 6),
    ("月曜", 0),
    ("火曜", 1),
    ("水曜", 2),
    ("木曜", 3),
    ("金曜", 4),
    ("土曜", 5),
    ("日曜", 6),
)


def carry_yesterday_flags(yesterday_today_flags: Iterable[str]) -> Set[str]:
    """前日の *_today フラグを *_yesterday に変換。"""
    out: Set[str] = set()
    for flag in yesterday_today_flags:
        mapped = _YESTERDAY_FLAG_MAP.get(str(flag))
        if mapped:
            out.add(mapped)
    return out


def slot_time_bucket(slot: int, slot_hours: Iterable[float]) -> str:
    hours = list(slot_hours)
    hour = hours[max(0, min(len(hours) - 1, int(slot)))]
    if hour < 11:
        return "morning"
    if hour < 18:
        return "daytime"
    return "evening"


def infer_consistency(text: str) -> Dict[str, object]:
    """本文からざっくり整合メタを推定（明示指定がないときの保険）。"""
    text = text or ""
    sets: List[str] = []
    forbids: List[str] = []
    requires: List[str] = []
    time = "any"
    weekdays: Optional[List[int]] = None

    yesterday_workout = ("昨日" in text) and any(
        k in text for k in ("脚トレ", "トレ", "ジム", "筋肉痛")
    )
    next_day_sore = ("翌日" in text) and any(
        k in text for k in ("トレ", "歩け", "筋肉", "尻トレ")
    )

    if yesterday_workout or next_day_sore:
        requires.append("gym_done_yesterday")
        forbids.append("gym_skipped_yesterday")
    elif any(
        k in text
        for k in (
            "ジム行くのダルい",
            "今日は自宅",
            "ジム行か",
            "行く予定だったのに帰宅後",
            "今日は歩くだけでトレ",
            "やる気だけ先に帰宅",
        )
    ):
        sets.append("gym_skipped_today")
        forbids.append("gym_done_today")
    elif any(
        k in text
        for k in (
            "脚トレ後",
            "ジムのロッカー",
            "ランニングマシン",
            "ダンベル",
            "ヒップスラスト",
            "マシンの使い方",
            "腹筋ローラー",
            "懸垂",
            "グローブ忘れて",
            "クールダウン",
            "ランジの途中",
            "ウェア持ってきたのにシューズ",
        )
    ):
        sets.append("gym_done_today")
        forbids.append("gym_skipped_today")

    if any(k in text for k in ("退勤後", "退勤間際", "もうカバン", "帰宅後ソファ")):
        time = "evening"
    elif any(k in text for k in ("月曜朝", "朝イチ", "目覚まし", "寝癖で潰れて")):
        time = "morning"
    elif any(k in text for k in ("昼休み", "ランチ")):
        time = "daytime"
    elif "出社した" in text:
        time = "morning"

    if "在宅" in text:
        sets.append("wfh_today")
        forbids.append("at_office_today")
    if any(k in text for k in ("出社", "会議室", "プリンター前", "定例なのに")):
        if "在宅" not in text:
            sets.append("at_office_today")
            forbids.append("wfh_today")

    for token, dow in sorted(_WEEKDAY_TOKENS, key=lambda x: -len(x[0])):
        if token in text:
            weekdays = [dow]
            break

    return {
        "sets": sets,
        "forbids": forbids,
        "requires": requires,
        "time": time,
        "weekdays": weekdays,
    }


def resolve_consistency(post: dict) -> Dict[str, object]:
    inferred = infer_consistency(str(post.get("text") or ""))
    explicit = post.get("consistency")
    if not isinstance(explicit, dict):
        explicit = {}

    def _list(key: str) -> List[str]:
        raw = explicit.get(key)
        if isinstance(raw, list):
            return [str(x) for x in raw]
        inferred_list = inferred.get(key) or []
        return [str(x) for x in inferred_list]  # type: ignore[union-attr]

    weekdays = explicit.get("weekdays")
    time = explicit.get("time")

    return {
        "sets": _list("sets"),
        "forbids": _list("forbids"),
        "requires": _list("requires"),
        "time": str(time) if time else str(inferred["time"]),
        "weekdays": list(weekdays)
        if isinstance(weekdays, list)
        else inferred["weekdays"],
    }


def flags_from_posts(posts: Iterable[dict]) -> Set[str]:
    flags: Set[str] = set()
    for post in posts:
        cons = resolve_consistency(post)
        for flag in cons["sets"]:  # type: ignore[index]
            flags.add(str(flag))
    return flags


def _exclusive_blocks(flag: str, existing: Set[str]) -> bool:
    for a, b in _EXCLUSIVE_PAIRS:
        if flag == a and b in existing:
            return True
        if flag == b and a in existing:
            return True
    return False


def is_flag_compatible(post: dict, existing_flags: Set[str]) -> bool:
    cons = resolve_consistency(post)
    requires = {str(x) for x in cons["requires"]}  # type: ignore[index]
    if not requires <= existing_flags:
        return False
    forbids = {str(x) for x in cons["forbids"]}  # type: ignore[index]
    if forbids & existing_flags:
        return False
    for flag in cons["sets"]:  # type: ignore[index]
        if _exclusive_blocks(str(flag), existing_flags):
            return False
    return True


def is_time_compatible(post: dict, slot: int, slot_hours: Iterable[float]) -> bool:
    cons = resolve_consistency(post)
    want = str(cons["time"])
    if want == "any":
        return True
    return want == slot_time_bucket(slot, slot_hours)


def is_weekday_compatible(post: dict, day: date | None) -> bool:
    if day is None:
        return True
    cons = resolve_consistency(post)
    weekdays = cons.get("weekdays")
    if not weekdays:
        return True
    try:
        allowed = {int(x) for x in weekdays}  # type: ignore[arg-type]
    except (TypeError, ValueError):
        return True
    return day.weekday() in allowed
