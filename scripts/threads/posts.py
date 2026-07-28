"""Threads 投稿文プール（みつきリタイア集客用）.

参考導線（@ai_syuhu 型を NISA/ギャップ向けに翻訳）:
  Threads = 教育・共感で「この人の話、続き聞きたい」を積む
  サイト = 問題解決（シミュ・ガイド）→ そこからソフトにアフィ
  ❌ 売り込み投稿の連打
  ⭕ 悩みの言語化 / 考え方 / 小さな気づき → 自分リプで続きURL

導線フォーマット:
  text  = 本投稿（外部URLなし）
  reply = 自分リプ（「続きを見る」＋URL）

投資助言・銘柄推奨・誇大表現は書かない。
"""

from __future__ import annotations

from datetime import date
from typing import List, Sequence

SITE_URL = "https://www.nisa-simulation.com"
THREADS_TEXT_LIMIT = 500

# id は台帳・ログ用。
POSTS: List[dict] = [
    # --- 教育：リスト型（信頼を積む） ---
    {
        "id": "edu-checklist-gap",
        "topic": "資産形成",
        "text": (
            "つみたて続けてるのに不安が消えない人、\n"
            "だいたいここ見てない🥹💭\n\n"
            "・引退したい年齢\n"
            "・目標の取り崩しイメージ\n"
            "・今の積立ペースで届くか\n"
            "・想定年利を何パターンか置いたか\n"
            "・「足りない額」を一度でも出したか\n\n"
            "特別な才能いらない。\n"
            "数字を1回並べるだけで、次の一手が決まるよ✨\n\n"
            "並べ方はリプに置いた👇💕"
        ),
        "reply": (
            "無料で不足額（ギャップ）出す入口はここ🫶\n"
            "会員なし・概算・投資助言じゃないよ🥹\n\n"
            f"{SITE_URL}"
        ),
    },
    {
        "id": "edu-role-split",
        "topic": "つみたてNISA",
        "text": (
            "積立の投稿、がんばってるのに\n"
            "「で、自分はどうすれば？」が残る人多い🥹\n\n"
            "❌ 毎日「口座開け」「満額積め」だけ言う\n"
            "⭕ 先に「足りない額」を見せてから選択肢を並べる\n\n"
            "人は商品じゃなく、\n"
            "「この人の考え方、しっくりくる」で動く💭\n\n"
            "だから私は\n"
            "悩みの言語化 → 考え方 → 数字で確認\n"
            "の順を意識してるよ✨\n\n"
            "数字の入口はリプ👇"
        ),
        "reply": (
            "続き（ギャップ確認）はこっち💕\n\n"
            f"{SITE_URL}"
        ),
    },
    {
        "id": "edu-plus-1man",
        "topic": "積立投資",
        "text": (
            "毎月＋1万円、地味に見えるよね🥹\n\n"
            "でも引退までの年数が長いと、\n"
            "ギャップの減り方、けっこう変わることがある💭\n\n"
            "大事なのは「頑張る額」じゃなく\n"
            "「動かしたらどう見えるか」を先に知ること✨\n\n"
            "理屈より一回いじった方が早いよ💪\n\n"
            "試し方はリプ👇"
        ),
        "reply": (
            "積立を動かしてギャップ見るのはここから🫶\n\n"
            f"{SITE_URL}"
        ),
    },
    # --- 教育：誤解をほどく ---
    {
        "id": "edu-return-myth",
        "topic": "資産形成",
        "text": (
            "シミュで想定年利をいきなり7%にして\n"
            "帳尻合わせるの、ちょっと危ないやつ…💦\n\n"
            "不安なときほど「いい数字」に寄りがち🥹\n\n"
            "私のおすすめは\n"
            "3%と5%みたいに幅で見ること💭\n\n"
            "届く／届かないを一点で決めない。\n"
            "幅が見えると、積立や年数のレバーも冷静に選べるよ✨\n\n"
            "置き方の整理はリプへ👇"
        ),
        "reply": (
            "続きを見る（想定年利ガイド）💕\n\n"
            f"{SITE_URL}/guides/assumed-return"
        ),
    },
    {
        "id": "edu-rogo-2000",
        "topic": "老後資金",
        "text": (
            "「老後2000万円」って見出しであって、\n"
            "あなたの正解じゃないことが多い🥹💭\n\n"
            "大事なのはこの式↓\n"
            "毎月の不足 × 想定年数\n\n"
            "生活水準も年金見込みも人それぞれ。\n"
            "だから金額の丸暗記より、\n"
            "自分用のたたき台を1回作る方が効くよ✨\n\n"
            "作り方はリプ👇"
        ),
        "reply": (
            "続きを見るよ〜🫶\n\n"
            f"{SITE_URL}/guides/rogo-2000man"
        ),
    },
    {
        "id": "edu-monthly-no-answer",
        "topic": "つみたてNISA",
        "text": (
            "「つみたてNISA、毎月いくらが正解？」\n"
            "って聞かれることが多いんだけど🥹\n\n"
            "正直、正解はないよ💭\n\n"
            "・目標から逆算した必要額\n"
            "・今の家計で続けられる額\n"
            "この2つは別モノ✨\n\n"
            "満額できない＝失敗、でもない。\n"
            "続けられる額で、ギャップを見ながら調整が現実的💕\n\n"
            "逆算の見方はリプへ👇"
        ),
        "reply": (
            "続きはここ✨\n\n"
            f"{SITE_URL}/guides/monthly-contribution"
        ),
    },
    {
        "id": "edu-nisa-vs-ideco",
        "topic": "NISA",
        "text": (
            "NISAとiDeCo、どっちが正解？🥹\n\n"
            "→ 正解じゃなくて用途の切り分けっしょ✨\n\n"
            "途中で使うかも → 流動性も意識\n"
            "老後まで触らない → 税制メリットの置き方が変わる\n\n"
            "「どっちが儲かる」より\n"
            "「自分の使い方に合うか」で選ぶと迷子になりにくい💭\n\n"
            "切り分けメモはリプ👇"
        ),
        "reply": (
            "続きを見る🫶\n\n"
            f"{SITE_URL}/guides/nisa-vs-ideco"
        ),
    },
    {
        "id": "edu-new-nisa-frame",
        "topic": "新NISA",
        "text": (
            "新NISAの枠、満額使うことが目的になると\n"
            "かえって苦しくなる人いるよ〜💭\n\n"
            "枠の理解＝上限まで🫶\n"
            "目標に届くか＝別計算✨\n\n"
            "枠を埋めるゲームより、\n"
            "「自分のギャップに対して、今の積立で足りるか」\n"
            "の方が意思決定しやすい🥹💕\n\n"
            "整理はリプに置いたよ👇"
        ),
        "reply": (
            "続きはこっち✨\n\n"
            f"{SITE_URL}/guides/new-nisa-basics"
        ),
    },
    # --- 教育：年齢・レバー ---
    {
        "id": "edu-age-40",
        "topic": "資産形成",
        "text": (
            "40代で「足りないかも…」って感じたら\n"
            "まず見る3つ🥹✨\n\n"
            "① 毎月の積立\n"
            "② 引退年齢\n"
            "③ 目標額そのもの\n\n"
            "利回りだけ上げて帳尻合わせないでね💭\n\n"
            "レバーは複数ある。\n"
            "数字で並べると、焦り方が変わるよ💕\n\n"
            "入口はリプ👇"
        ),
        "reply": (
            "続き（無料シミュ）はこっち🫶\n\n"
            f"{SITE_URL}"
        ),
    },
    {
        "id": "edu-retire-age",
        "topic": "老後資金",
        "text": (
            "引退したい年齢、何歳に置いてる？💭\n\n"
            "ここを1つ動かすだけでも\n"
            "必要な積立やギャップの見え方、変わるよ🥹\n\n"
            "「早く辞めたい」気持ちと\n"
            "「いくら必要か」はセットで見ると現実的✨\n\n"
            "動かして見る入口はリプ👇💕"
        ),
        "reply": (
            "続き（無料シミュ）🫶\n\n"
            f"{SITE_URL}"
        ),
    },
    {
        "id": "edu-years-left",
        "topic": "積立投資",
        "text": (
            "同じ目標金額でも、\n"
            "残りの年数で「必要な毎月積立」は大きく変わる🥹\n\n"
            "30代と50代で見え方が違うのは当然💭\n\n"
            "他人の積立額を真似するより、\n"
            "自分の残り年数で逆算した方が迷いにくいよ✨\n\n"
            "試し方はリプ👇"
        ),
        "reply": (
            "続きはここから✨\n\n"
            f"{SITE_URL}/guides/nisa-simulation"
        ),
    },
    # --- 教育：取り崩し・老後設計 ---
    {
        "id": "edu-4pct",
        "topic": "FIRE",
        "text": (
            "資産3000万円 → 年4%仮定だと\n"
            "月あたり約10万円（年金は別）って感覚💭\n\n"
            "これは「保証」じゃなく、\n"
            "取り崩しの粗いイメージ用だよ🥹✨\n\n"
            "目標額を決めるとき、\n"
            "「いくら持つか」だけより\n"
            "「月いくら使えそうか」で見るとギャップが具体的になる💕\n\n"
            "整理はリプ👇"
        ),
        "reply": (
            "続きを見るよ〜✨\n\n"
            f"{SITE_URL}/guides/4-percent-rule"
        ),
    },
    {
        "id": "edu-retirement-formula",
        "topic": "老後資金",
        "text": (
            "老後資金、「○千万円」だけで決めないで🥹💭\n\n"
            "たたき台はこの流れ↓\n"
            "生活費 − 年金見込み = 毎月の不足\n"
            "→ × 年数\n\n"
            "ざっくりでいい。\n"
            "完璧な表より、一度出した数字の方が行動につながるよ✨\n\n"
            "くわしくはリプ👇"
        ),
        "reply": (
            "続きを見る🫶\n\n"
            f"{SITE_URL}/guides/retirement-funds"
        ),
    },
    # --- 教育：余力・ポイント（アフィ導線に自然） ---
    {
        "id": "edu-points-not-only",
        "topic": "資産形成",
        "text": (
            "ギャップを縮める方法、\n"
            "積立を増やすだけじゃないよ〜💭✨\n\n"
            "日常の支払いポイントを\n"
            "積立の余力に回す、って視点もある🫶\n\n"
            "ただし順番が大事🥹\n"
            "① まず不足額を数字で見る\n"
            "② 増額・年数・支出の取りこぼしを並べる\n"
            "③ 合うものだけ選ぶ\n\n"
            "先に口座やカードを探すと迷子になりやすい💕\n\n"
            "整理はリプへ👇"
        ),
        "reply": (
            "続きを見るよ〜✨\n"
            "サイトでは数字のあとに選択肢もそっと置いてるよ（広告含む）\n\n"
            f"{SITE_URL}/guides/points-and-gap"
        ),
    },
    {
        "id": "edu-order-gap-then-choice",
        "topic": "つみたてNISA",
        "text": (
            "カードや口座を先に調べると、\n"
            "条件比較で疲れがち🥹\n\n"
            "おすすめの順番は\n"
            "ギャップ（不足額）→ 選択肢💭\n\n"
            "「毎月あと○円」が見えてからだと\n"
            "何が自分に必要か判断しやすいよ✨💕\n\n"
            "数字の入口はリプ👇"
        ),
        "reply": (
            "続き（シミュ）はここだよ〜🥹✨\n"
            "結果のあとに参考リンクがある場合あり（広告）\n\n"
            f"{SITE_URL}"
        ),
    },
    # --- 共感・問いかけ（返信誘導） ---
    {
        "id": "q-monthly-amount",
        "topic": "つみたてNISA",
        "text": (
            "いま、つみたてNISA（or 投信積立）\n"
            "毎月いくら入れてる〜？💭✨\n\n"
            "正解探しじゃなく、共有してみて🥹\n\n"
            "返信くれたら\n"
            "「そのペースで引退までどう見えるか」\n"
            "の試し方だけ返すね🫶\n\n"
            "先に自分で見たい人はリプへ👇"
        ),
        "reply": (
            "試し方（無料シミュ）はここ💕\n\n"
            f"{SITE_URL}"
        ),
    },
    {
        "id": "q-gap-unknown",
        "topic": "つみたてNISA",
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
        "id": "edu-soft-cta-trust",
        "topic": "資産形成",
        "text": (
            "売り込み投稿だけだと、\n"
            "フォローもクリックも続きにくい🥹\n\n"
            "私が大事にしてるのは\n"
            "・悩みを言葉にする\n"
            "・考え方を渡す\n"
            "・小さな確認（数字）を届ける\n\n"
            "すると「もっと詳しく見たい」が自然に出る💭\n\n"
            "Threadsは気づき。\n"
            "サイトは確認の場所✨\n\n"
            "入口はリプ👇"
        ),
        "reply": (
            "確認用の無料シミュはここ💕\n"
            "概算・会員なし（投資助言じゃない）\n\n"
            f"{SITE_URL}"
        ),
    },
    {
        "id": "edu-dont-compare",
        "topic": "積立投資",
        "text": (
            "SNSの積立額、見すぎ注意🥹💭\n\n"
            "満額自慢も、ゼロ不安も、\n"
            "あなたの家計・年数・目標とは別物✨\n\n"
            "比較するなら他人じゃなく\n"
            "「昨日の自分のギャップ」💕\n\n"
            "数字があると、焦りより調整ができるよ🫶\n\n"
            "見方はリプへ👇"
        ),
        "reply": (
            "ギャップ確認はこっちから✨\n\n"
            f"{SITE_URL}"
        ),
    },
    {
        "id": "edu-one-lever",
        "topic": "資産形成",
        "text": (
            "不安なとき、全部いっぺんに変えないで🥹\n\n"
            "おすすめはレバーを1つだけ動かすこと💭\n"
            "例：積立＋5000円 / 引退＋2年 / 目標を現実寄りに\n\n"
            "1つ動かす → ギャップの変化を見る → 次を決める✨\n\n"
            "これが続く人のやり方だと思う💕\n\n"
            "動かして見る入口はリプ👇"
        ),
        "reply": (
            "続き（シミュ）🫶\n\n"
            f"{SITE_URL}"
        ),
    },
    {
        "id": "edu-simulation-not-advice",
        "topic": "つみたてNISA",
        "text": (
            "シミュレーションは占いじゃないし、\n"
            "投資助言でもないよ🥹💭\n\n"
            "でも「感覚」はかなりはっきりする✨\n\n"
            "会員登録なしで、\n"
            "今のペースと目標の距離を概算できる場所、置いてる💕\n\n"
            "まず距離を知る。\n"
            "口座やカードはそのあとで十分🫶\n\n"
            "入口はリプ👇"
        ),
        "reply": (
            "続きを見るよ〜🥹✨\n\n"
            f"{SITE_URL}"
        ),
    },
]


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
