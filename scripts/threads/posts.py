"""Threads 投稿文プール（みつきリタイア集客用）.

1日の枠（JST）※初期は少なめ（閲覧・フォロー獲得優先）:
  08:00 / 20:00 … 価値発信のみ（リンクなし・リプなし）
  12:00         … 教育＋自分リプでURL（誘導・1日1回）

参考:
  - @ai_syuhu 型＝教育で信頼を積み、誘導は少数に絞る
  - 競合リサーチ＝末尾の会話フック / 自分リプ連鎖（フック→教育→URLは最終リプ）
  - タイムライン表示は1〜2行目が勝負。冒頭を止めフックに

投資助言・銘柄推奨・誇大表現は書かない。
始め方・銘柄戦争には入らず、「足りるか（ギャップ）」に寄せる。
"""

from __future__ import annotations

from datetime import date
from typing import List, Sequence

SITE_URL = "https://www.nisa-simulation.com"
THREADS_TEXT_LIMIT = 500

# slot: 0=08 value, 1=12 cta, 2=20 value
POSTS_PER_DAY = 3
SLOT_KINDS = ("value", "cta", "value")
SLOT_LABELS = ("08value", "12cta", "20value")

# --- 価値発信のみ（URLなし・replyなし） ---
# 1行目＝止めフック。末尾＝語りたくなる問いかけ1行
VALUE_POSTS: List[dict] = [
    {
        "id": "val-checklist",
        "topic": "資産形成",
        "kind": "value",
        "text": (
            "つみたて続けてるのに不安が消えない人、だいたいここ見てない🥹\n\n"
            "・引退したい年齢\n"
            "・目標の取り崩しイメージ\n"
            "・今の積立ペースで届くか\n"
            "・想定年利を何パターンか置いたか\n"
            "・「足りない額」を一度でも出したか\n\n"
            "特別な才能いらない。\n"
            "数字を1回並べるだけで、次の一手が決まるよ✨\n\n"
            "この5つ、いくつ埋まってる？"
        ),
    },
    {
        "id": "val-plus-1man",
        "topic": "積立投資",
        "kind": "value",
        "text": (
            "毎月＋1万円、地味に見えてギャップに効くことがある🥹\n\n"
            "引退までの年数が長いと、\n"
            "減り方、けっこう変わる💭\n\n"
            "大事なのは「頑張る額」じゃなく\n"
            "「動かしたらどう見えるか」を先に知ること✨\n\n"
            "理屈より一回いじった方が早いよ💪\n\n"
            "もし積立を1万円だけ動かしたら、\n"
            "自分のギャップどう変わりそう？"
        ),
    },
    {
        "id": "val-return-myth",
        "topic": "資産形成",
        "kind": "value",
        "text": (
            "想定年利7%で帳尻合わせ、危ないやつ💦\n\n"
            "不安なときほど「いい数字」に寄りがち🥹\n\n"
            "おすすめは 3% と 5% みたいに幅で見ること💭\n"
            "届く／届かないを一点で決めない。\n\n"
            "幅が見えると、積立や年数のレバーも冷静に選べるよ✨\n\n"
            "想定年利、今なん%で置いてる？"
        ),
    },
    {
        "id": "val-rogo-2000",
        "topic": "老後資金",
        "kind": "value",
        "text": (
            "「老後2000万円」は見出しであって、あなたの正解じゃない🥹\n\n"
            "大事なのはこの式↓\n"
            "毎月の不足 × 想定年数\n\n"
            "生活水準も年金見込みも人それぞれ。\n"
            "金額の丸暗記より、自分用のたたき台を1回作る方が効くよ✨\n\n"
            "自分の「毎月の不足」、ざっくりでも出したことある？"
        ),
    },
    {
        "id": "val-monthly",
        "topic": "つみたてNISA",
        "kind": "value",
        "text": (
            "「毎月いくらが正解？」→ 正直、ない🥹\n\n"
            "・目標から逆算した必要額\n"
            "・今の家計で続けられる額\n"
            "この2つは別モノ✨\n\n"
            "満額できない＝失敗、でもない。\n"
            "続けられる額で、ギャップを見ながら調整が現実的💕\n\n"
            "いま、必要額と続けられる額、どっちで決めてる？"
        ),
    },
    {
        "id": "val-age-40",
        "topic": "資産形成",
        "kind": "value",
        "text": (
            "40代で「足りないかも」→ まず見るのはこの3つ🥹\n\n"
            "① 毎月の積立\n"
            "② 引退年齢\n"
            "③ 目標額そのもの\n\n"
            "利回りだけ上げて帳尻合わせないでね💭\n"
            "レバーは複数ある。数字で並べると焦り方が変わるよ💕\n\n"
            "いま一番動かしやすいの、どれだと思う？"
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
            "これが続く人のやり方だと思う💕\n\n"
            "次に試すなら、どのレバーから動かす？"
        ),
    },
    {
        "id": "val-dont-compare",
        "topic": "積立投資",
        "kind": "value",
        "text": (
            "SNSの積立額、見すぎ注意🥹\n\n"
            "満額自慢も、ゼロ不安も、\n"
            "あなたの家計・年数・目標とは別物✨\n\n"
            "比較するなら他人じゃなく\n"
            "「昨日の自分のギャップ」💕\n\n"
            "数字があると、焦りより調整ができるよ🫶\n\n"
            "最近、他人の積立額見て焦ったことある？"
        ),
    },
    {
        "id": "val-years-left",
        "topic": "積立投資",
        "kind": "value",
        "text": (
            "同じ目標でも、残り年数で必要積立は別人になる🥹\n\n"
            "30代と50代で見え方が違うのは当然💭\n\n"
            "他人の積立額を真似するより、\n"
            "自分の残り年数で逆算した方が迷いにくいよ✨\n\n"
            "引退まで、いま何年くらいで置いてる？"
        ),
    },
    {
        "id": "val-nisa-ideco",
        "topic": "NISA",
        "kind": "value",
        "text": (
            "NISAとiDeCo、どっちが正解？→ 用途の切り分け🥹\n\n"
            "途中で使うかも → 流動性も意識\n"
            "老後まで触らない → 税制メリットの置き方が変わる\n\n"
            "「どっちが儲かる」より\n"
            "「自分の使い方に合うか」で選ぶと迷子になりにくい💭\n\n"
            "いまの優先、流動性寄り？老後固定寄り？"
        ),
    },
    {
        "id": "val-new-nisa",
        "topic": "新NISA",
        "kind": "value",
        "text": (
            "枠満額が目的になると、かえって苦しくなる人いるよ💭\n\n"
            "枠の理解＝上限まで🫶\n"
            "目標に届くか＝別計算✨\n\n"
            "枠を埋めるゲームより、\n"
            "「自分のギャップに対して、今の積立で足りるか」\n"
            "の方が意思決定しやすい🥹💕\n\n"
            "枠埋めとギャップ確認、どっちを先にしてる？"
        ),
    },
    {
        "id": "val-4pct",
        "topic": "FIRE",
        "kind": "value",
        "text": (
            "資産3000万→年4%仮定だと月約10万（年金は別）💭\n\n"
            "これは「保証」じゃなく、\n"
            "取り崩しの粗いイメージ用だよ🥹✨\n\n"
            "「いくら持つか」だけより\n"
            "「月いくら使えそうか」で見るとギャップが具体的になる💕\n\n"
            "目標、いま「総額」と「月の使い方」どっちで見てる？"
        ),
    },
    {
        "id": "val-formula",
        "topic": "老後資金",
        "kind": "value",
        "text": (
            "老後資金、「○千万円」だけで決めないで🥹\n\n"
            "たたき台はこの流れ↓\n"
            "生活費 − 年金見込み = 毎月の不足\n"
            "→ × 年数\n\n"
            "ざっくりでいい。\n"
            "完璧な表より、一度出した数字の方が行動につながるよ✨\n\n"
            "生活費と年金見込み、ざっくり置いたことある？"
        ),
    },
    {
        "id": "val-order",
        "topic": "つみたてNISA",
        "kind": "value",
        "text": (
            "口座・カードを先に調べると、条件比較で疲れがち🥹\n\n"
            "おすすめの順番は\n"
            "ギャップ（不足額）→ 選択肢💭\n\n"
            "「毎月あと○円」が見えてからだと\n"
            "何が自分に必要か判断しやすいよ✨💕\n\n"
            "いま調べてるの、数字？それとも口座条件？"
        ),
    },
    {
        "id": "val-q-amount",
        "topic": "つみたてNISA",
        "kind": "value",
        "text": (
            "つみたて、いま毎月いくら入れてる？💭\n\n"
            "正解探しじゃなく、共有してみて🥹\n\n"
            "金額より大事なのは、\n"
            "そのペースで「目標までどう見えるか」を\n"
            "一度でも数字で見たかどうかだと思う🫶"
        ),
    },
    {
        "id": "val-anxiety-split",
        "topic": "資産形成",
        "kind": "value",
        "text": (
            "「合ってるのかな」が消えないとき、不安は1つにまとめない🥹\n\n"
            "よくあるのはこの3つ↓\n"
            "・積立額が足りてるか\n"
            "・引退年齢の置き方が現実的か\n"
            "・目標額そのものが大きすぎないか\n\n"
            "まとめて悩むより、1つずつ数字に落とすと楽になるよ✨\n\n"
            "いま一番気になってるの、どれ？"
        ),
    },
    {
        "id": "val-frame-vs-goal",
        "topic": "新NISA",
        "kind": "value",
        "text": (
            "「NISA枠を早く埋めなきゃ」で生活削ってる人、いる…💦\n\n"
            "私は枠より先に\n"
            "「続けられる額」と「足りるか」を見る派🥹\n\n"
            "枠は上限の話。\n"
            "目標までの距離は別計算💭✨\n\n"
            "焦りの正体、枠？それともギャップの見えなさ？"
        ),
    },
    {
        "id": "val-continue-first",
        "topic": "積立投資",
        "kind": "value",
        "text": (
            "1年目に効くのは満額より「勝手に続く状態」🥹\n\n"
            "止まってる理由が怖さなら、\n"
            "まず少額でも設定完了の方が先✨\n\n"
            "続けたあとに、ギャップを見て調整すればいい💕\n\n"
            "いま止まってるとしたら、何が引っかかってる？"
        ),
    },
]

# --- 誘導枠（本投稿はURLなし、自分リプに教育、最終リプにURL） ---
# 末尾に「続きはリプ👇」。replies 優先 / reply は後方互換
CTA_POSTS: List[dict] = [
    {
        "id": "cta-gap-check",
        "topic": "つみたてNISA",
        "kind": "cta",
        "text": (
            "「引退まであとどれくらい足りない？」即答できる人、意外と少ない🥹\n\n"
            "つみたて続けてても、ここが見えてないと不安は残りやすい💭\n\n"
            "続きはリプ👇"
        ),
        "replies": [
            (
                "不安の正体、だいたい\n"
                "金額が見えてないことだったりする✨\n\n"
                "見るのはこのくらいで十分↓\n"
                "・いまの年齢\n"
                "・引退したい年齢\n"
                "・毎月の積立\n"
                "・想定利回り（幅でOK）\n"
                "・目標の取り崩しイメージ"
            ),
            (
                "並べると「感覚」が「距離」になるよ💕\n"
                "会員なし・概算・投資助言じゃないよ🥹\n\n"
                f"{SITE_URL}"
            ),
        ],
    },
    {
        "id": "cta-role-split",
        "topic": "資産形成",
        "kind": "cta",
        "text": (
            "売り込み投稿だけだと、フォローもクリックも続きにくい🥹\n\n"
            "大事なのは\n"
            "・悩みを言葉にする\n"
            "・考え方を渡す\n"
            "・小さな確認（数字）を届ける\n\n"
            "Threadsは気づき。確認の場所は分けた方がいいよ✨\n\n"
            "続きはリプ👇"
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
            "想定年利、いい数字に寄せてない？🥹\n\n"
            "不安なときほど、置き方がブレやすい💭\n\n"
            "続きはリプ👇"
        ),
        "replies": [
            (
                "おすすめは一点決めより幅で見ること✨\n"
                "例：3% と 5% を並べる\n\n"
                "届く／届かないを一点で決めないと、\n"
                "積立や年数のレバーも冷静に選べるよ💭"
            ),
            (
                "整理した話はここ💕\n\n"
                f"{SITE_URL}/guides/assumed-return"
            ),
        ],
    },
    {
        "id": "cta-monthly-guide",
        "topic": "つみたてNISA",
        "kind": "cta",
        "text": (
            "「毎月いくらが正解？」で苦しくなる人、多い🥹\n\n"
            "必要額と続けられる額、混ぜると詰みやすいよ✨\n\n"
            "続きはリプ👇"
        ),
        "replies": [
            (
                "必要額＝目標から逆算した目安\n"
                "続けられる額＝家計で無理なく続く額\n\n"
                "満額できない＝失敗、でもない💕\n"
                "続けられる額で始めて、ギャップを見ながら調整が現実的"
            ),
            (
                "逆算の見方はここ✨\n\n"
                f"{SITE_URL}/guides/monthly-contribution"
            ),
        ],
    },
    {
        "id": "cta-points-gap",
        "topic": "資産形成",
        "kind": "cta",
        "text": (
            "ギャップを縮めるの、積立アップだけじゃないよ💭\n\n"
            "ただし順番を間違えると疲れやすい✨\n\n"
            "続きはリプ👇"
        ),
        "replies": [
            (
                "① まず不足額を数字で見る\n"
                "② 増額・年数・支出の取りこぼしを並べる\n"
                "③ 合うものだけ選ぶ\n\n"
                "先に選択肢を探すと、疲れやすいよ💭"
            ),
            (
                "整理はここから✨\n"
                "サイトでは数字のあとに選択肢もそっと置いてるよ（広告含む）\n\n"
                f"{SITE_URL}/guides/points-and-gap"
            ),
        ],
    },
    {
        "id": "cta-rogo",
        "topic": "老後資金",
        "kind": "cta",
        "text": (
            "「老後2000万円」で止まると、次の一手が見えにくい🥹\n\n"
            "見出しじゃなく、自分の式に落とすと動きやすい💭\n\n"
            "続きはリプ👇"
        ),
        "replies": [
            (
                "生活費 − 年金見込み = 毎月の不足\n"
                "→ × 想定年数\n\n"
                "ざっくりでいい。一度出すと焦り方が変わるよ💕"
            ),
            (
                "くわしくはここ🫶\n\n"
                f"{SITE_URL}/guides/rogo-2000man"
            ),
        ],
    },
    {
        "id": "cta-sim-soft",
        "topic": "つみたてNISA",
        "kind": "cta",
        "text": (
            "シミュは占いじゃない。でも感覚はかなりはっきりする✨\n\n"
            "まず距離を知る。口座やカードはそのあとで十分🫶\n\n"
            "続きはリプ👇"
        ),
        "replies": [
            (
                "年齢・積立・利回り・目標を入れるだけで\n"
                "不足額の概算は出せるよ💕\n"
                "会員登録なしで試せるよ🥹\n\n"
                f"{SITE_URL}"
            ),
        ],
    },
    {
        "id": "cta-retire-age",
        "topic": "老後資金",
        "kind": "cta",
        "text": (
            "引退年齢、何歳に置いてる？ここ1つでギャップ変わる🥹\n\n"
            "積立だけがレバーじゃないよ💭\n\n"
            "続きはリプ👇"
        ),
        "replies": [
            (
                "年数を動かしてから、必要額を見直すのもあり💕\n\n"
                "動かして見る入口はここ🫶\n\n"
                f"{SITE_URL}"
            ),
        ],
    },
    {
        "id": "cta-anxiety-chain",
        "topic": "資産形成",
        "kind": "cta",
        "text": (
            "積立続いてるのに不安が消えない人、だいたい足りない額を出してない🥹\n\n"
            "銘柄比較より先に、距離を見る方が効くことが多い💭\n\n"
            "続きはリプ👇"
        ),
        "replies": [
            (
                "おすすめの順番は\n"
                "ギャップ確認 → レバー1つ動かす → 必要なら選択肢\n\n"
                "全部いっぺんに変えなくて大丈夫💕"
            ),
            (
                "距離の確認、無料シミュはここから🫶\n"
                "概算・会員なし（投資助言じゃない）\n\n"
                f"{SITE_URL}"
            ),
        ],
    },
    {
        "id": "cta-4pct-guide",
        "topic": "老後資金",
        "kind": "cta",
        "text": (
            "「いくら持つか」だけ見てると、月いくら使えそうかがぼやける🥹\n\n"
            "総額→月の感覚にすると、ギャップが具体的になる💭\n\n"
            "続きはリプ👇"
        ),
        "replies": [
            (
                "取り崩しの粗いイメージとして\n"
                "年4%÷12 みたいな見方があるよ✨\n\n"
                "保証じゃない。でも感覚のたたき台にはなる💕"
            ),
            (
                "考え方の整理はここ🫶\n\n"
                f"{SITE_URL}/guides/4-percent-rule"
            ),
        ],
    },
    {
        "id": "cta-retirement-funds",
        "topic": "老後資金",
        "kind": "cta",
        "text": (
            "老後資金いくら必要？万人共通の正解を探すと迷子🥹\n\n"
            "たたき台はシンプルでいい💭\n\n"
            "続きはリプ👇"
        ),
        "replies": [
            (
                "生活費 − 年金見込み = 毎月の不足\n"
                "→ × 想定年数\n\n"
                "完璧な表より、一度出した数字の方が動けるよ💕"
            ),
            (
                "目安の考え方はここから🫶\n\n"
                f"{SITE_URL}/guides/retirement-funds"
            ),
        ],
    },
    {
        "id": "cta-nisa-basics",
        "topic": "新NISA",
        "kind": "cta",
        "text": (
            "つみたて／成長で迷うとき、先に枠の地図だけ持っておくと楽🥹\n\n"
            "枠は上限。ギャップは別計算✨\n\n"
            "続きはリプ👇"
        ),
        "replies": [
            (
                "制度の基本とシミュの関係を分けて見ると\n"
                "迷子になりにくいよ💕"
            ),
            (
                "枠の基本はここ🫶\n\n"
                f"{SITE_URL}/guides/new-nisa-basics"
            ),
        ],
    },
    {
        "id": "cta-nisa-ideco",
        "topic": "資産形成",
        "kind": "cta",
        "text": (
            "NISAとiDeCo、どっちがいい？より「使い方に合うか」🥹\n\n"
            "儲かる比較より、用途の切り分けが先💭\n\n"
            "続きはリプ👇"
        ),
        "replies": [
            (
                "途中で使うかも → 流動性も意識\n"
                "老後まで触らない → 置き方が変わる✨"
            ),
            (
                "違いの整理はここ🫶\n\n"
                f"{SITE_URL}/guides/nisa-vs-ideco"
            ),
        ],
    },
    {
        "id": "cta-faq",
        "topic": "つみたてNISA",
        "kind": "cta",
        "text": (
            "シミュの数字、どこまで信じていい？って質問、けっこう来る🥹\n\n"
            "答えはシンプル。概算・比較用。投資助言じゃない✨\n\n"
            "続きはリプ👇"
        ),
        "replies": [
            (
                "精度・4%・想定年利の置き方など\n"
                "よくある疑問はまとめてあるよ💕"
            ),
            (
                "FAQはここから🫶\n\n"
                f"{SITE_URL}/faq"
            ),
        ],
    },
]

# 互換: 全投稿の連結（--list / --id 用）
POSTS: List[dict] = [*VALUE_POSTS, *CTA_POSTS]


def _truncate(text: str, limit: int = THREADS_TEXT_LIMIT) -> str:
    text = text.strip()
    if len(text) <= limit:
        return text
    return text[: limit - 1].rstrip() + "…"


def _cta_replies(post: dict) -> List[str]:
    """cta の自分リプ一覧。replies 優先、なければ reply。"""
    raw = post.get("replies")
    if isinstance(raw, (list, tuple)) and raw:
        return [_truncate(str(part)) for part in raw if str(part).strip()]
    single = post.get("reply")
    if single and str(single).strip():
        return [_truncate(str(single))]
    return []


def thread_texts(post: dict) -> List[str]:
    """value=本投稿のみ / cta=本投稿→自分リプ連鎖（URLは最終リプのみ）。"""
    main = _truncate(str(post.get("text") or ""))
    kind = (post.get("kind") or "value").strip()
    if kind == "cta":
        texts = [t for t in (main, *_cta_replies(post)) if t]
    else:
        texts = [main] if main else []
    if not texts:
        raise ValueError(f"empty thread for post id={post.get('id')}")
    return texts


def all_posts() -> Sequence[dict]:
    return POSTS


def slot_from_hour(hour: int) -> int:
    """Map JST hour to nearest daily slot 0..2."""
    # Midpoints between 8, 12, 20
    if hour < 10:
        return 0
    if hour < 16:
        return 1
    return 2


def slot_kind(slot: int) -> str:
    slot = max(0, min(POSTS_PER_DAY - 1, int(slot)))
    return SLOT_KINDS[slot]


def _hydrate(post: dict, *, index: int | None = None, slot: int | None = None) -> dict:
    out = dict(post)
    out["text"] = _truncate(out["text"])
    replies = _cta_replies(out)
    if replies:
        out["replies"] = replies
        # 互換: 最終リプを reply にも残す（ログ・旧呼び出し向け）
        out["reply"] = replies[-1]
    elif out.get("reply"):
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
    # 同日内の同 kind の何番目か（value: 0,1 / cta: 0）
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
