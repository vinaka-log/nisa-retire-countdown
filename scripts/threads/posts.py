"""Threads 投稿文プール（みつきリタイア集客用）.

日付インデックスでローテーション。投資助言・銘柄推奨は書かない。
"""

from __future__ import annotations

from datetime import date
from typing import List, Sequence

SITE_URL = "https://www.nisa-simulation.com"
THREADS_TEXT_LIMIT = 500

# id は台帳・ログ用。本文は SITE_URL を後段で付与してもよいが、各文にURLを含める。
POSTS: List[dict] = [
    {
        "id": "gap-reveal-1",
        "topic": "つみたてNISA",
        "text": (
            "つみたてNISA、続けてるのに\n"
            "「引退まであとどれくらい足りないか」\n"
            "はっきり言える人、意外と少ない。\n\n"
            "年齢・積立・利回り・目標を入れると\n"
            "不足額がすぐ出る無料シミュ、置いてます。\n\n"
            f"{SITE_URL}"
        ),
    },
    {
        "id": "one-var-1",
        "topic": "積立投資",
        "text": (
            "毎月の積立を＋1万円しただけで\n"
            "引退までのギャップ、けっこう動く。\n\n"
            "理屈より、数字を動かして見た方が早い。\n\n"
            f"{SITE_URL}"
        ),
    },
    {
        "id": "return-myth",
        "topic": "資産形成",
        "text": (
            "シミュレーションで想定年利を\n"
            "いきなり7%にして帳尻合わせるの、危ない。\n\n"
            "3%と5%で幅を見る方が現実的。\n"
            "置き方の整理↓\n\n"
            f"{SITE_URL}/guides/assumed-return"
        ),
    },
    {
        "id": "rogo-2000",
        "topic": "老後資金",
        "text": (
            "「老後2000万円」は見出しであって正解じゃない。\n\n"
            "大事なのは\n"
            "自分の不足（毎月）× 想定年数。\n\n"
            f"{SITE_URL}/guides/rogo-2000man"
        ),
    },
    {
        "id": "monthly-q",
        "topic": "つみたてNISA",
        "text": (
            "つみたてNISA、毎月いくらが正解？\n\n"
            "→ 正解はない。目標から逆算する。\n"
            "必要額と、続けられる額は別物。\n\n"
            f"{SITE_URL}/guides/monthly-contribution"
        ),
    },
    {
        "id": "age-40",
        "topic": "資産形成",
        "text": (
            "40代で「足りないかも」と感じたら見る3つ。\n\n"
            "① 毎月の積立\n"
            "② 引退年齢\n"
            "③ 目標額そのもの\n\n"
            "利回りだけ上げて誤魔化さない。\n\n"
            f"{SITE_URL}"
        ),
    },
    {
        "id": "4pct",
        "topic": "FIRE",
        "text": (
            "資産3000万円 → 年4%仮定だと\n"
            "月あたり約10万円（年金は別）。\n\n"
            "取り崩しの粗い感覚用。保証じゃない。\n\n"
            f"{SITE_URL}/guides/4-percent-rule"
        ),
    },
    {
        "id": "question-1",
        "topic": "つみたてNISA",
        "text": (
            "いま、つみたてNISA（or 投信積立）\n"
            "毎月いくら入れてる？\n\n"
            "返信くれたら、\n"
            "「そのペースで引退までどう見えるか」\n"
            "の試し方だけ返す。\n\n"
            f"{SITE_URL}"
        ),
    },
    {
        "id": "nisa-vs-ideco",
        "topic": "NISA",
        "text": (
            "NISAとiDeCo、どっちが正解？\n\n"
            "→ 正解ではなく用途の切り分け。\n"
            "途中で使うかも／老後まで触らない、で変わる。\n\n"
            f"{SITE_URL}/guides/nisa-vs-ideco"
        ),
    },
    {
        "id": "new-nisa",
        "topic": "新NISA",
        "text": (
            "新NISAの枠を満額使うことが目的じゃない。\n\n"
            "枠の理解は上限まで。\n"
            "目標に届くかは別計算。\n\n"
            f"{SITE_URL}/guides/new-nisa-basics"
        ),
    },
    {
        "id": "gap-reveal-2",
        "topic": "つみたてNISA",
        "text": (
            "「今の積立で、引退時に目標まで\n"
            "あとどれくらい足りないか」\n\n"
            "これが見えると、次に動かすレバーが決まる。\n\n"
            f"{SITE_URL}"
        ),
    },
    {
        "id": "soft-cta",
        "topic": "資産形成",
        "text": (
            "会員登録なし。入力はブラウザ上の概算。\n"
            "投資助言じゃない。\n\n"
            "でも「感覚」はかなりはっきりする。\n\n"
            f"{SITE_URL}"
        ),
    },
    {
        "id": "retirement-funds",
        "topic": "老後資金",
        "text": (
            "老後資金は「○千万円」だけで決めない。\n\n"
            "生活費 − 年金見込み = 毎月の不足\n"
            "→ × 年数 がたたき台。\n\n"
            f"{SITE_URL}/guides/retirement-funds"
        ),
    },
    {
        "id": "one-var-2",
        "topic": "積立投資",
        "text": (
            "同じ目標でも、\n"
            "残りの年数で「必要な毎月積立」は大きく変わる。\n\n"
            "30代と50代で見え方が違うのは当然。\n\n"
            f"{SITE_URL}/guides/nisa-simulation"
        ),
    },
    {
        "id": "question-2",
        "topic": "老後資金",
        "text": (
            "引退したい年齢、何歳に置いてる？\n\n"
            "ここを1つ動かすだけでも\n"
            "ギャップの見え方は変わる。\n\n"
            f"{SITE_URL}"
        ),
    },
    {
        "id": "points-gap-1",
        "topic": "資産形成",
        "text": (
            "積立を増やすだけが、\n"
            "ギャップを縮める方法じゃない。\n\n"
            "日常の支払いポイントを\n"
            "積立の余力に回す、という視点。\n\n"
            f"{SITE_URL}/guides/points-and-gap"
        ),
    },
    {
        "id": "points-gap-2",
        "topic": "積立投資",
        "text": (
            "「毎月あと○円足りない」が見えたら、\n"
            "増額以外の余力づくりも並べてみる。\n\n"
            "支出のポイント取りこぼし、ない？\n\n"
            f"{SITE_URL}/guides/points-and-gap"
        ),
    },
    {
        "id": "points-gap-3",
        "topic": "つみたてNISA",
        "text": (
            "ギャップを数字で見てから、\n"
            "カードや口座を調べる方が迷いにくい。\n\n"
            "先に不足額、次に選択肢。\n\n"
            f"{SITE_URL}"
        ),
    },
]


def _truncate(text: str, limit: int = THREADS_TEXT_LIMIT) -> str:
    text = text.strip()
    if len(text) <= limit:
        return text
    return text[: limit - 1].rstrip() + "…"


def all_posts() -> Sequence[dict]:
    return POSTS


def pick_post_for_date(day: date | None = None) -> dict:
    """Rotate by day-of-year so the same calendar day is stable."""
    day = day or date.today()
    index = (day.toordinal()) % len(POSTS)
    post = dict(POSTS[index])
    post["text"] = _truncate(post["text"])
    post["index"] = index
    return post


def pick_post_by_id(post_id: str) -> dict:
    for post in POSTS:
        if post["id"] == post_id:
            out = dict(post)
            out["text"] = _truncate(out["text"])
            return out
    raise KeyError(f"unknown post id: {post_id}")
