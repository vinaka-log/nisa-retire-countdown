"""Threads 投稿文プール（みつきリタイア集客用）.

導線（運用で効きやすい型）:
  1投稿目 = フック＋価値（外部リンクなし）→ リーチを落とさない
  2投稿目 = 自分リプで「続きを見る」＋URL

投資助言・銘柄推奨は書かない。トーンはみつきらしい軽さ＋絵文字。
"""

from __future__ import annotations

from datetime import date
from typing import List, Sequence

SITE_URL = "https://www.nisa-simulation.com"
THREADS_TEXT_LIMIT = 500

# id は台帳・ログ用。
# text = 本投稿（URL禁止）。reply = 自分リプ（URLここ）。
POSTS: List[dict] = [
    {
        "id": "gap-reveal-1",
        "topic": "つみたてNISA",
        "text": (
            "つみたてNISA、続けてるのに…💭\n"
            "「引退まであとどれくらい足りない？」\n"
            "って聞かれて即答できる人、意外と少ないらしくて🥹\n\n"
            "年齢・積立・利回り・目標いれるだけで\n"
            "不足額がサクッと出るやり方、まとめたよ〜✨\n\n"
            "続きはリプ👇💕"
        ),
        "reply": (
            "無料シミュはここから見れるよ〜🫶✨\n"
            "会員登録なし・概算だよ（投資助言じゃない）🥹\n\n"
            f"{SITE_URL}"
        ),
    },
    {
        "id": "one-var-1",
        "topic": "積立投資",
        "text": (
            "毎月の積立、＋1万円しただけで🥹\n"
            "引退までのギャップ、けっこう動くんだよね〜💕\n\n"
            "理屈より、数字いじって見た方が早い説💪✨\n\n"
            "試し方はリプに置いたよ👇💭"
        ),
        "reply": (
            "続きはこっちでサクッと試せるよ〜✨\n\n"
            f"{SITE_URL}"
        ),
    },
    {
        "id": "return-myth",
        "topic": "資産形成",
        "text": (
            "シミュで想定年利いきなり7%にして\n"
            "帳尻合わせるの、ちょっと危ないやつ…💭💦\n\n"
            "3%と5%で幅見る方がリアル寄り🫶\n\n"
            "置き方の整理、リプに置いたよ👇✨"
        ),
        "reply": (
            "続きを見る（想定年利ガイド）💕\n\n"
            f"{SITE_URL}/guides/assumed-return"
        ),
    },
    {
        "id": "rogo-2000",
        "topic": "老後資金",
        "text": (
            "「老後2000万円」って見出しであって\n"
            "正解じゃない説、あるある🥹💭\n\n"
            "大事なのは\n"
            "自分の不足（毎月）× 想定年数っしょ💕\n\n"
            "くわしくはリプへ👇✨"
        ),
        "reply": (
            "続きを見るよ〜🫶\n\n"
            f"{SITE_URL}/guides/rogo-2000man"
        ),
    },
    {
        "id": "monthly-q",
        "topic": "つみたてNISA",
        "text": (
            "つみたてNISA、毎月いくらが正解？💭\n\n"
            "→ 正解ないよ〜🥹 目標から逆算っしょ✨\n"
            "必要額と、続けられる額は別モノ💕\n\n"
            "逆算の見方はリプ👇"
        ),
        "reply": (
            "続きはここ✨\n\n"
            f"{SITE_URL}/guides/monthly-contribution"
        ),
    },
    {
        "id": "age-40",
        "topic": "資産形成",
        "text": (
            "40代で「足りないかも…」って感じたら見る3つ🥹✨\n\n"
            "① 毎月の積立\n"
            "② 引退年齢\n"
            "③ 目標額そのもの\n\n"
            "利回りだけ上げて誤魔化さないでね💭💕\n"
            "数字で見る入口はリプ👇"
        ),
        "reply": (
            "続き（無料シミュ）はこっち🫶\n\n"
            f"{SITE_URL}"
        ),
    },
    {
        "id": "4pct",
        "topic": "FIRE",
        "text": (
            "資産3000万円 → 年4%仮定だと\n"
            "月あたり約10万円（年金は別）って感覚💭\n\n"
            "取り崩しの粗いイメージ用だよ〜✨\n"
            "保証じゃないから注意ね🥹💕\n\n"
            "もう少し整理した話はリプ👇"
        ),
        "reply": (
            "続きを見るよ〜✨\n\n"
            f"{SITE_URL}/guides/4-percent-rule"
        ),
    },
    {
        "id": "question-1",
        "topic": "つみたてNISA",
        "text": (
            "いま、つみたてNISA（or 投信積立）\n"
            "毎月いくら入れてる〜？💭✨\n\n"
            "返信くれたら、\n"
            "「そのペースで引退までどう見えるか」\n"
            "の試し方だけ返すね🫶💕\n\n"
            "自分で先に見たい人はリプへ👇"
        ),
        "reply": (
            "試し方（無料シミュ）はここだよ〜🥹✨\n\n"
            f"{SITE_URL}"
        ),
    },
    {
        "id": "nisa-vs-ideco",
        "topic": "NISA",
        "text": (
            "NISAとiDeCo、どっちが正解？🥹\n\n"
            "→ 正解じゃなくて用途の切り分けっしょ✨\n"
            "途中で使うかも／老後まで触らない、で変わるよ💭💕\n\n"
            "切り分けメモはリプ👇"
        ),
        "reply": (
            "続きを見る🫶\n\n"
            f"{SITE_URL}/guides/nisa-vs-ideco"
        ),
    },
    {
        "id": "new-nisa",
        "topic": "新NISA",
        "text": (
            "新NISAの枠、満額使うことが目的じゃないよ〜💭\n\n"
            "枠の理解は上限まで🫶\n"
            "目標に届くかは別計算だよ✨💕\n\n"
            "整理はリプに置いたよ👇"
        ),
        "reply": (
            "続きはこっち✨\n\n"
            f"{SITE_URL}/guides/new-nisa-basics"
        ),
    },
    {
        "id": "gap-reveal-2",
        "topic": "つみたてNISA",
        "text": (
            "「今の積立で、引退時に目標まで\n"
            "あとどれくらい足りない？」🥹💭\n\n"
            "これ見えると、次に動かすレバー決まるよ〜✨💕\n\n"
            "見方はリプへ👇"
        ),
        "reply": (
            "続き（シミュ）はここから🫶\n\n"
            f"{SITE_URL}"
        ),
    },
    {
        "id": "soft-cta",
        "topic": "資産形成",
        "text": (
            "会員登録なし🫶 入力はブラウザ上の概算✨\n"
            "投資助言じゃないよ〜🥹\n\n"
            "でも「感覚」はかなりはっきりするんだよね💕💭\n\n"
            "入口はリプ👇"
        ),
        "reply": (
            "続きを見るよ〜🥹✨\n\n"
            f"{SITE_URL}"
        ),
    },
    {
        "id": "retirement-funds",
        "topic": "老後資金",
        "text": (
            "老後資金、「○千万円」だけで決めないで🥹💭\n\n"
            "生活費 − 年金見込み = 毎月の不足\n"
            "→ × 年数 がたたき台だよ〜✨💕\n\n"
            "くわしくはリプ👇"
        ),
        "reply": (
            "続きを見る🫶\n\n"
            f"{SITE_URL}/guides/retirement-funds"
        ),
    },
    {
        "id": "one-var-2",
        "topic": "積立投資",
        "text": (
            "同じ目標でも〜💭\n"
            "残りの年数で「必要な毎月積立」は大きく変わるよ🥹\n\n"
            "30代と50代で見え方違うの、当然っしょ✨💕\n\n"
            "試し方はリプに置いたよ👇"
        ),
        "reply": (
            "続きはここから✨\n\n"
            f"{SITE_URL}/guides/nisa-simulation"
        ),
    },
    {
        "id": "question-2",
        "topic": "老後資金",
        "text": (
            "引退したい年齢、何歳に置いてる〜？💭✨\n\n"
            "ここを1つ動かすだけでも\n"
            "ギャップの見え方変わるんだよね🥹💕\n\n"
            "動かして見る入口はリプ👇"
        ),
        "reply": (
            "続き（無料シミュ）🫶\n\n"
            f"{SITE_URL}"
        ),
    },
    {
        "id": "points-gap-1",
        "topic": "資産形成",
        "text": (
            "積立を増やすだけが、\n"
            "ギャップ縮める方法じゃないよ〜💭✨\n\n"
            "日常の支払いポイントを\n"
            "積立の余力に回す、って視点もあるよ🫶💕\n\n"
            "整理はリプへ👇"
        ),
        "reply": (
            "続きを見るよ〜✨\n\n"
            f"{SITE_URL}/guides/points-and-gap"
        ),
    },
    {
        "id": "points-gap-2",
        "topic": "積立投資",
        "text": (
            "「毎月あと○円足りない」が見えたら🥹\n"
            "増額以外の余力づくりも並べてみよ〜✨\n\n"
            "支出のポイント取りこぼし、ない？💭💕\n\n"
            "くわしくはリプ👇"
        ),
        "reply": (
            "続きはこっち🫶\n\n"
            f"{SITE_URL}/guides/points-and-gap"
        ),
    },
    {
        "id": "points-gap-3",
        "topic": "つみたてNISA",
        "text": (
            "ギャップを数字で見てから、\n"
            "カードや口座調べる方が迷いにくいよ〜✨\n\n"
            "先に不足額、次に選択肢🥹💕💭\n\n"
            "数字の入口はリプ👇"
        ),
        "reply": (
            "続き（シミュ）はここだよ〜🥹✨\n\n"
            f"{SITE_URL}"
        ),
    },
]


# 1日あたりの投稿枠（朝・昼・夜）。ワークフローの cron と揃える。
POSTS_PER_DAY = 3


def _truncate(text: str, limit: int = THREADS_TEXT_LIMIT) -> str:
    text = text.strip()
    if len(text) <= limit:
        return text
    return text[: limit - 1].rstrip() + "…"


def thread_texts(post: dict) -> List[str]:
    """本投稿 → 自分リプ（リンク）の順。URLは reply 側のみ。"""
    main = _truncate(str(post.get("text") or ""))
    reply = _truncate(str(post.get("reply") or ""))
    texts = [t for t in (main, reply) if t]
    if not texts:
        raise ValueError(f"empty thread for post id={post.get('id')}")
    return texts


def all_posts() -> Sequence[dict]:
    return POSTS


def slot_from_hour(hour: int) -> int:
    """Map JST hour to morning(0) / noon(1) / evening(2)."""
    if hour < 10:
        return 0
    if hour < 16:
        return 1
    return 2


def _hydrate(post: dict, *, index: int | None = None, slot: int | None = None) -> dict:
    out = dict(post)
    out["text"] = _truncate(out["text"])
    if out.get("reply"):
        out["reply"] = _truncate(out["reply"])
    out["thread"] = thread_texts(out)
    if index is not None:
        out["index"] = index
    if slot is not None:
        out["slot"] = slot
    return out


def pick_post_for_slot(day: date | None = None, slot: int = 0) -> dict:
    """Rotate by calendar day × slot so each daily run gets a different post."""
    day = day or date.today()
    slot = max(0, min(POSTS_PER_DAY - 1, int(slot)))
    index = (day.toordinal() * POSTS_PER_DAY + slot) % len(POSTS)
    return _hydrate(POSTS[index], index=index, slot=slot)


def pick_post_for_date(day: date | None = None) -> dict:
    """Backward-compatible: morning slot for the given day."""
    return pick_post_for_slot(day, slot=0)


def pick_post_by_id(post_id: str) -> dict:
    for index, post in enumerate(POSTS):
        if post["id"] == post_id:
            return _hydrate(post, index=index)
    raise KeyError(f"unknown post id: {post_id}")
