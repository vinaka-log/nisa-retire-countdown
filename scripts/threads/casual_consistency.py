"""同日内の雑談整合性（矛盾する事実・時間帯の衝突を防ぐ）.

各投稿は flags を sets / forbids で持ち、当日すでに立っている flags と衝突したら選ばない。
時間帯 (morning / daytime / evening) もソフト制約として使う。
"""

from __future__ import annotations

from typing import Dict, Iterable, List, Set

# 相互排他（片方が立っていたら、もう片方を sets する投稿は不可）
_EXCLUSIVE_PAIRS = (
    ("gym_skipped_today", "gym_done_today"),
    ("wfh_today", "at_office_today"),
)


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
    time = "any"

    yesterday_workout = ("昨日" in text) and any(
        k in text for k in ("脚トレ", "トレ", "ジム", "筋肉痛")
    )
    next_day_sore = ("翌日" in text) and any(
        k in text for k in ("トレ", "歩け", "筋肉")
    )

    if yesterday_workout or next_day_sore:
        pass
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

    return {"sets": sets, "forbids": forbids, "time": time}


def resolve_consistency(post: dict) -> Dict[str, object]:
    inferred = infer_consistency(str(post.get("text") or ""))
    explicit = post.get("consistency")
    if not isinstance(explicit, dict):
        explicit = {}

    sets = explicit.get("sets")
    forbids = explicit.get("forbids")
    time = explicit.get("time")

    return {
        "sets": list(sets) if isinstance(sets, list) else list(inferred["sets"]),  # type: ignore[index]
        "forbids": list(forbids)
        if isinstance(forbids, list)
        else list(inferred["forbids"]),  # type: ignore[index]
        "time": str(time) if time else str(inferred["time"]),
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
    forbids = {str(x) for x in cons["forbids"]}  # type: ignore[index]
    if forbids & existing_flags:
        return False
    for flag in cons["sets"]:  # type: ignore[index]
        f = str(flag)
        if _exclusive_blocks(f, existing_flags):
            return False
        # 既存が forbid 相当: 既に反対側が立っている
        if f in existing_flags:
            # 同じ flag の再セットは許容
            continue
    return True


def is_time_compatible(post: dict, slot: int, slot_hours: Iterable[float]) -> bool:
    cons = resolve_consistency(post)
    want = str(cons["time"])
    if want == "any":
        return True
    return want == slot_time_bucket(slot, slot_hours)
