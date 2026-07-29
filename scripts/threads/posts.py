"""Threads 投稿文プール（みつきリタイア集客用）.

1日の枠（JST）:
  08:00 / 12:00 / 20:00 … 価値発信のみ（リンクなし・リプなし）
  10:00 / 18:00         … 教育＋自分リプでURL（誘導）

参考: @ai_syuhu 型＝教育で信頼を積み、誘導は少数に絞る。
投資助言・銘柄推奨・誇大表現は書かない。
"""

from __future__ import annotations

from datetime import date
from typing import List, Sequence

SITE_URL = "https://www.nisa-simulation.com"
THREADS_TEXT_LIMIT = 500

# slot: 0=08 value, 1=10 cta, 2=12 value, 3=18 cta, 4=20 value
POSTS_PER_DAY = 5
SLOT_KINDS = ("value", "cta", "value", "cta", "value")
SLOT_LABELS = ("08value", "10cta", "12value", "18cta", "20value")

# --- 価値発信のみ（URLなし・replyなし） ---
VALUE_POSTS: List[dict] = [
    {
        "id": "val-checklist",
        "topic": "資産形成",
        "kind": "value",
        "text": (
            "つみたて続けてるのに不安が消えない人、\n"
            "だいたいここ見てない🥹💭\n\n"
            "・引退したい年齢\n"
            "・目標の取り崩しイメージ\n"
            "・今の積立ペースで届くか\n"
            "・想定年利を何パターンか置いたか\n"
            "・「足りない額」を一度でも出したか\n\n"
            "特別な才能いらない。\n"
            "数字を1回並べるだけで、次の一手が決まるよ✨"
        ),
    },
    {
        "id": "val-plus-1man",
        "topic": "積立投資",
        "kind": "value",
        "text": (
            "毎月＋1万円、地味に見えるよね🥹\n\n"
            "でも引退までの年数が長いと、\n"
            "ギャップの減り方、けっこう変わることがある💭\n\n"
            "大事なのは「頑張る額」じゃなく\n"
            "「動かしたらどう見えるか」を先に知ること✨\n\n"
            "理屈より一回いじった方が早いよ💪"
        ),
    },
    {
        "id": "val-return-myth",
        "topic": "資産形成",
        "kind": "value",
        "text": (
            "シミュで想定年利をいきなり7%にして\n"
            "帳尻合わせるの、ちょっと危ないやつ…💦\n\n"
            "不安なときほど「いい数字」に寄りがち🥹\n\n"
            "おすすめは 3% と 5% みたいに幅で見ること💭\n"
            "届く／届かないを一点で決めない。\n\n"
            "幅が見えると、積立や年数のレバーも冷静に選べるよ✨"
        ),
    },
    {
        "id": "val-rogo-2000",
        "topic": "老後資金",
        "kind": "value",
        "text": (
            "「老後2000万円」って見出しであって、\n"
            "あなたの正解じゃないことが多い🥹💭\n\n"
            "大事なのはこの式↓\n"
            "毎月の不足 × 想定年数\n\n"
            "生活水準も年金見込みも人それぞれ。\n"
            "金額の丸暗記より、自分用のたたき台を1回作る方が効くよ✨"
        ),
    },
    {
        "id": "val-monthly",
        "topic": "つみたてNISA",
        "kind": "value",
        "text": (
            "「つみたてNISA、毎月いくらが正解？」\n"
            "って聞かれることが多いんだけど🥹\n\n"
            "正直、正解はないよ💭\n\n"
            "・目標から逆算した必要額\n"
            "・今の家計で続けられる額\n"
            "この2つは別モノ✨\n\n"
            "満額できない＝失敗、でもない。\n"
            "続けられる額で、ギャップを見ながら調整が現実的💕"
        ),
    },
    {
        "id": "val-age-40",
        "topic": "資産形成",
        "kind": "value",
        "text": (
            "40代で「足りないかも…」って感じたら\n"
            "まず見る3つ🥹✨\n\n"
            "① 毎月の積立\n"
            "② 引退年齢\n"
            "③ 目標額そのもの\n\n"
            "利回りだけ上げて帳尻合わせないでね💭\n"
            "レバーは複数ある。数字で並べると焦り方が変わるよ💕"
        ),
    },
    {
        "id": "val-one-lever",
        "topic": "資産形成",
        "kind": "value",
        "text": (
            "不安なとき、全部いっぺんに変えないで🥹\n\n"
            "おすすめはレバーを1つだけ動かすこと💭\n"
            "例：積立＋5000円 / 引退＋2年 / 目標を現実寄りに\n\n"
            "1つ動かす → ギャップの変化を見る → 次を決める✨\n"
            "これが続く人のやり方だと思う💕"
        ),
    },
    {
        "id": "val-dont-compare",
        "topic": "積立投資",
        "kind": "value",
        "text": (
            "SNSの積立額、見すぎ注意🥹💭\n\n"
            "満額自慢も、ゼロ不安も、\n"
            "あなたの家計・年数・目標とは別物✨\n\n"
            "比較するなら他人じゃなく\n"
            "「昨日の自分のギャップ」💕\n\n"
            "数字があると、焦りより調整ができるよ🫶"
        ),
    },
    {
        "id": "val-years-left",
        "topic": "積立投資",
        "kind": "value",
        "text": (
            "同じ目標金額でも、\n"
            "残りの年数で「必要な毎月積立」は大きく変わる🥹\n\n"
            "30代と50代で見え方が違うのは当然💭\n\n"
            "他人の積立額を真似するより、\n"
            "自分の残り年数で逆算した方が迷いにくいよ✨"
        ),
    },
    {
        "id": "val-nisa-ideco",
        "topic": "NISA",
        "kind": "value",
        "text": (
            "NISAとiDeCo、どっちが正解？🥹\n\n"
            "→ 正解じゃなくて用途の切り分けっしょ✨\n\n"
            "途中で使うかも → 流動性も意識\n"
            "老後まで触らない → 税制メリットの置き方が変わる\n\n"
            "「どっちが儲かる」より\n"
            "「自分の使い方に合うか」で選ぶと迷子になりにくい💭"
        ),
    },
    {
        "id": "val-new-nisa",
        "topic": "新NISA",
        "kind": "value",
        "text": (
            "新NISAの枠、満額使うことが目的になると\n"
            "かえって苦しくなる人いるよ〜💭\n\n"
            "枠の理解＝上限まで🫶\n"
            "目標に届くか＝別計算✨\n\n"
            "枠を埋めるゲームより、\n"
            "「自分のギャップに対して、今の積立で足りるか」\n"
            "の方が意思決定しやすい🥹💕"
        ),
    },
    {
        "id": "val-4pct",
        "topic": "FIRE",
        "kind": "value",
        "text": (
            "資産3000万円 → 年4%仮定だと\n"
            "月あたり約10万円（年金は別）って感覚💭\n\n"
            "これは「保証」じゃなく、\n"
            "取り崩しの粗いイメージ用だよ🥹✨\n\n"
            "「いくら持つか」だけより\n"
            "「月いくら使えそうか」で見るとギャップが具体的になる💕"
        ),
    },
    {
        "id": "val-formula",
        "topic": "老後資金",
        "kind": "value",
        "text": (
            "老後資金、「○千万円」だけで決めないで🥹💭\n\n"
            "たたき台はこの流れ↓\n"
            "生活費 − 年金見込み = 毎月の不足\n"
            "→ × 年数\n\n"
            "ざっくりでいい。\n"
            "完璧な表より、一度出した数字の方が行動につながるよ✨"
        ),
    },
    {
        "id": "val-order",
        "topic": "つみたてNISA",
        "kind": "value",
        "text": (
            "カードや口座を先に調べると、\n"
            "条件比較で疲れがち🥹\n\n"
            "おすすめの順番は\n"
            "ギャップ（不足額）→ 選択肢💭\n\n"
            "「毎月あと○円」が見えてからだと\n"
            "何が自分に必要か判断しやすいよ✨💕"
        ),
    },
    {
        "id": "val-q-amount",
        "topic": "つみたてNISA",
        "kind": "value",
        "text": (
            "いま、つみたてNISA（or 投信積立）\n"
            "毎月いくら入れてる〜？💭✨\n\n"
            "正解探しじゃなく、共有してみて🥹\n\n"
            "金額より大事なのは、\n"
            "そのペースで「目標までどう見えるか」を\n"
            "一度でも数字で見たかどうかだと思う🫶"
        ),
    },
]

# --- 誘導枠（本投稿はURLなし、自分リプにURL） ---
CTA_POSTS: List[dict] = [
    {
        "id": "cta-gap-check",
        "topic": "つみたてNISA",
        "kind": "cta",
        "text": (
            "つみたて続けてるのに\n"
            "「引退まであとどれくらい足りない？」\n"
            "って即答できる人、意外と少ない🥹💭\n\n"
            "不安の正体、だいたい\n"
            "金額が見えてないことだったりする✨\n\n"
            "年齢・積立・利回り・目標を入れるだけで\n"
            "不足額の概算は出せるよ💕\n\n"
            "やり方はリプ👇"
        ),
        "reply": (
            "無料シミュはここから🫶\n"
            "会員登録なし・投資助言じゃないよ🥹\n\n"
            f"{SITE_URL}"
        ),
    },
    {
        "id": "cta-role-split",
        "topic": "資産形成",
        "kind": "cta",
        "text": (
            "売り込み投稿だけだと、\n"
            "フォローもクリックも続きにくい🥹\n\n"
            "大事なのは\n"
            "・悩みを言葉にする\n"
            "・考え方を渡す\n"
            "・小さな確認（数字）を届ける\n\n"
            "Threadsは気づき。\n"
            "確認の場所は分けた方がいいよ✨\n\n"
            "入口はリプ👇"
        ),
        "reply": (
            "確認用の無料シミュはここ💕\n"
            "概算・会員なし（投資助言じゃない）\n\n"
            f"{SITE_URL}"
        ),
    },
    {
        "id": "cta-return-guide",
        "topic": "資産形成",
        "kind": "cta",
        "text": (
            "想定年利の置き方、迷う人多いよね💭\n\n"
            "いきなり高い数字で帳尻合わせるより、\n"
            "幅で見る方が現実的🥹✨\n\n"
            "整理した話、リプに置いたよ👇"
        ),
        "reply": (
            "続きを見る（想定年利ガイド）💕\n\n"
            f"{SITE_URL}/guides/assumed-return"
        ),
    },
    {
        "id": "cta-monthly-guide",
        "topic": "つみたてNISA",
        "kind": "cta",
        "text": (
            "毎月いくらが正解かより、\n"
            "必要額と続けられる額を分けて見る方が楽🥹💭\n\n"
            "逆算の見方はリプへ👇✨"
        ),
        "reply": (
            "続きはここ✨\n\n"
            f"{SITE_URL}/guides/monthly-contribution"
        ),
    },
    {
        "id": "cta-points-gap",
        "topic": "資産形成",
        "kind": "cta",
        "text": (
            "ギャップを縮める方法、\n"
            "積立を増やすだけじゃないよ〜💭✨\n\n"
            "ただし順番が大事🥹\n"
            "① まず不足額を数字で見る\n"
            "② 増額・年数・支出の取りこぼしを並べる\n"
            "③ 合うものだけ選ぶ\n\n"
            "整理はリプへ👇"
        ),
        "reply": (
            "続きを見るよ〜✨\n"
            "サイトでは数字のあとに選択肢もそっと置いてるよ（広告含む）\n\n"
            f"{SITE_URL}/guides/points-and-gap"
        ),
    },
    {
        "id": "cta-rogo",
        "topic": "老後資金",
        "kind": "cta",
        "text": (
            "「老後2000万円」で止まらず、\n"
            "自分の不足×年数まで落とし込むと動きやすい🥹💕\n\n"
            "くわしくはリプ👇✨"
        ),
        "reply": (
            "続きを見るよ〜🫶\n\n"
            f"{SITE_URL}/guides/rogo-2000man"
        ),
    },
    {
        "id": "cta-sim-soft",
        "topic": "つみたてNISA",
        "kind": "cta",
        "text": (
            "シミュレーションは占いじゃないし、\n"
            "投資助言でもないよ🥹💭\n\n"
            "でも「感覚」はかなりはっきりする✨\n"
            "まず距離を知る。口座やカードはそのあとで十分🫶\n\n"
            "入口はリプ👇"
        ),
        "reply": (
            "続きを見るよ〜🥹✨\n\n"
            f"{SITE_URL}"
        ),
    },
    {
        "id": "cta-retire-age",
        "topic": "老後資金",
        "kind": "cta",
        "text": (
            "引退したい年齢、何歳に置いてる？💭\n\n"
            "ここを1つ動かすだけでも\n"
            "必要な積立やギャップの見え方、変わるよ🥹✨\n\n"
            "動かして見る入口はリプ👇💕"
        ),
        "reply": (
            "続き（無料シミュ）🫶\n\n"
            f"{SITE_URL}"
        ),
    },
]

# 互換: 全投稿の連結（--list / --id 用）
POSTS: List[dict] = [*VALUE_POSTS, *CTA_POSTS]


def _truncate(text: str, limit: int = THREADS_TEXT_LIMIT) -> str:
    text = text.strip()
    if len(text) <= limit:
        return text
    return text[: limit - 1].rstrip() + "…"


def thread_texts(post: dict) -> List[str]:
    """value=本投稿のみ / cta=本投稿→自分リプ（URLは reply のみ）。"""
    main = _truncate(str(post.get("text") or ""))
    kind = (post.get("kind") or "value").strip()
    if kind == "cta":
        reply = _truncate(str(post.get("reply") or ""))
        texts = [t for t in (main, reply) if t]
    else:
        texts = [main] if main else []
    if not texts:
        raise ValueError(f"empty thread for post id={post.get('id')}")
    return texts


def all_posts() -> Sequence[dict]:
    return POSTS


def slot_from_hour(hour: int) -> int:
    """Map JST hour to nearest daily slot 0..4."""
    # Midpoints between 8,10,12,18,20
    if hour < 9:
        return 0
    if hour < 11:
        return 1
    if hour < 15:
        return 2
    if hour < 19:
        return 3
    return 4


def slot_kind(slot: int) -> str:
    slot = max(0, min(POSTS_PER_DAY - 1, int(slot)))
    return SLOT_KINDS[slot]


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
        out["slot_label"] = SLOT_LABELS[slot]
        out["kind"] = SLOT_KINDS[slot] if "kind" not in out else out["kind"]
    return out


def pick_post_for_slot(day: date | None = None, slot: int = 0) -> dict:
    """枠の kind（value/cta）に応じたプールからローテ選択。"""
    day = day or date.today()
    slot = max(0, min(POSTS_PER_DAY - 1, int(slot)))
    kind = SLOT_KINDS[slot]
    pool = CTA_POSTS if kind == "cta" else VALUE_POSTS
    # 同日内の同 kind の何番目か（value: 0,1,2 / cta: 0,1）
    kind_index = SLOT_KINDS[: slot + 1].count(kind) - 1
    per_day_kind = SLOT_KINDS.count(kind)
    index = (day.toordinal() * per_day_kind + kind_index) % len(pool)
    return _hydrate(pool[index], index=index, slot=slot)


def pick_post_for_date(day: date | None = None) -> dict:
    """Backward-compatible: morning value slot."""
    return pick_post_for_slot(day, slot=0)


def pick_post_by_id(post_id: str) -> dict:
    for index, post in enumerate(POSTS):
        if post["id"] == post_id:
            return _hydrate(post, index=index)
    raise KeyError(f"unknown post id: {post_id}")
