"""Threads 投稿文プール（みつき｜NISA「足りるか」確認係）.

1日の枠（JST）: 雑談8 + 誘導2 の計10本（フォロワー少期は雑談8割）
  07:00 / 08:00 / 10:00 / 15:00 / 17:00 / 18:30 / 21:00 / 22:30 … 雑談（リンクなし）
  12:00 / 20:00 … 教育＋自分リプでURL（誘導・1日2回）

雑談はギャル / 仕事憂鬱 / 筋トレ / どうでもいい の4系統。
オチをきれいに着地させず、途中で終わる人間っぽい口調にする。
雑談は casual_ledger.json で一度きり（使い回し禁止）。枯渇したら value にフォールバック。
絵文字はハート系（💕❤️🫶等）を使わない。

誘導枠のみ投資・シミュ話可。投資助言・銘柄推奨・誇大表現・実績捏造は禁止。
"""

from __future__ import annotations

import json
import sys
from datetime import date
from pathlib import Path
from typing import List, Sequence, Set

SITE_URL = "https://www.nisa-simulation.com"
THREADS_TEXT_LIMIT = 500
CASUAL_LEDGER_PATH = Path(__file__).resolve().parent / "casual_ledger.json"

# 日内枠（JST）: casual=雑談 / cta=リプ末尾にURL
POSTS_PER_DAY = 10
SLOT_KINDS = (
    "casual",  # 0: 07:00
    "casual",  # 1: 08:00
    "casual",  # 2: 10:00
    "cta",     # 3: 12:00
    "casual",  # 4: 15:00
    "casual",  # 5: 17:00
    "casual",  # 6: 18:30
    "cta",     # 7: 20:00
    "casual",  # 8: 21:00
    "casual",  # 9: 22:30
)
SLOT_LABELS = (
    "07casual",
    "08casual",
    "10casual",
    "12cta",
    "15casual",
    "17casual",
    "18casual",
    "20cta",
    "21casual",
    "22casual",
)

# --- 雑談（URLなし・リプなし。フォロワー少期の主力） ---
# 系統: gal / work / gym / nonsense。毎日8枠なのでプールは多めに持つ。
CASUAL_POSTS: List[dict] = [
    # --- 承認済み8本 ---
    {
        "id": "cas-gal-nail-book",
        "topic": "雑談",
        "kind": "casual",
        "text": (
            "ネイルサロン予約したのに日程間違えとる\n"
            "来週の金曜じゃなくて再来週だった…金どぶ"
        ),
    },
    {
        "id": "cas-gal-lash-crush",
        "topic": "雑談",
        "kind": "casual",
        "text": (
            "まつげパーマした翌日なのに寝癖で潰れてて泣いた\n"
            "お金払った意味どこいった"
        ),
    },
    {
        "id": "cas-work-dinner-think",
        "topic": "雑談",
        "kind": "casual",
        "text": (
            "今日の退勤後なに食べよみたいなこと考えてる時点で仕事してない説ある\n"
            "でももう頭キャパない"
        ),
    },
    {
        "id": "cas-work-de",
        "topic": "雑談",
        "kind": "casual",
        "text": (
            "上司の「で？」が怖すぎる\n"
            "説明してる途中で来るのほんとにやめて"
        ),
    },
    {
        "id": "cas-gym-home-squat",
        "topic": "雑談",
        "kind": "casual",
        "text": (
            "ジム行くのダルいから今日は自宅でスクワットだけやった\n"
            "30回で息切れしてて草、運動不足すぎ"
        ),
    },
    {
        "id": "cas-gym-stairs",
        "topic": "雑談",
        "kind": "casual",
        "text": (
            "脚トレ後に階段登れなくて後輩に先に行かれた\n"
            "きついんだけどこれ効いてる証拠ってことでいい？"
        ),
    },
    {
        "id": "cas-nonsense-ice",
        "topic": "雑談",
        "kind": "casual",
        "text": (
            "アイスの棒、折れた方から食べ始めたらバランス崩れて落ちた\n"
            "床びちょびちょ、最悪"
        ),
    },
    {
        "id": "cas-nonsense-laundry",
        "topic": "雑談",
        "kind": "casual",
        "text": (
            "洗濯機まわり終わったと思って開けたら中ぬるいの残ってて絶望した\n"
            "もう一回回すのめんどくさいんだけど"
        ),
    },
    # --- 追加プール（同トーン・被りにくいネタ） ---
    {
        "id": "cas-gal-lip-stain",
        "topic": "雑談",
        "kind": "casual",
        "text": (
            "白い服着た日に限ってリップ落とすのなんで\n"
            "襟元見て発狂した"
        ),
    },
    {
        "id": "cas-gal-contact-one",
        "topic": "雑談",
        "kind": "casual",
        "text": (
            "コンタクト片眼だけ行方不明\n"
            "洗面台の排水溝見にいく勇気でない"
        ),
    },
    {
        "id": "cas-gal-hair-color",
        "topic": "雑談",
        "kind": "casual",
        "text": (
            "カラーしたてなのに今日雨\n"
            "傘さした意味あるのかこれ"
        ),
    },
    {
        "id": "cas-gal-mirror-light",
        "topic": "雑談",
        "kind": "casual",
        "text": (
            "家の照明だと盛れてるのに外の光で別人になるの\n"
            "照明詐欺やめてほしい"
        ),
    },
    {
        "id": "cas-gal-perfume",
        "topic": "雑談",
        "kind": "casual",
        "text": (
            "香水つけすぎた気がして電車でずっと気になってる\n"
            "周りに匂ってたらごめん"
        ),
    },
    {
        "id": "cas-gal-heels",
        "topic": "雑談",
        "kind": "casual",
        "text": (
            "ヒール履いて出たけど駅ついた時点で限界\n"
            "帰りフラットに履き替えた、正解"
        ),
    },
    {
        "id": "cas-work-monday-stomach",
        "topic": "雑談",
        "kind": "casual",
        "text": (
            "月曜朝、目覚ましより先に胃が重い\n"
            "身体が先に仕事拒否してる"
        ),
    },
    {
        "id": "cas-work-teams-ping",
        "topic": "雑談",
        "kind": "casual",
        "text": (
            "Teamsの通知音だけで肩に力入る\n"
            "ミュートにしてるのに脳が反応するのやめて"
        ),
    },
    {
        "id": "cas-work-ato-kore",
        "topic": "雑談",
        "kind": "casual",
        "text": (
            "「あとこれだけ」信用した自分がバカだった\n"
            "結局1時間半溶けた"
        ),
    },
    {
        "id": "cas-work-meeting-silence",
        "topic": "雑談",
        "kind": "casual",
        "text": (
            "「何かありますか？」のあとの無言\n"
            "あるけど言うほどじゃないやつどうすればいいの"
        ),
    },
    {
        "id": "cas-work-calendar",
        "topic": "雑談",
        "kind": "casual",
        "text": (
            "カレンダー開けたら今週水色多すぎて笑った\n"
            "笑う以外の処理方法教えて"
        ),
    },
    {
        "id": "cas-work-lunch-solo",
        "topic": "雑談",
        "kind": "casual",
        "text": (
            "昼休みスマホ見ながら一人飯してる時間だけが生きてる実感ある\n"
            "午後また別人になる"
        ),
    },
    {
        "id": "cas-gym-protein-taste",
        "topic": "雑談",
        "kind": "casual",
        "text": (
            "プロテインの味、3日目から急に無理になった\n"
            "ヨーグルト混ぜたらまた飲める、小勝利"
        ),
    },
    {
        "id": "cas-gym-hip-thrust",
        "topic": "雑談",
        "kind": "casual",
        "text": (
            "ヒップスラストのあと椅子に座るだけで筋肉痛\n"
            "きついけど後ろ姿のためならまあ…"
        ),
    },
    {
        "id": "cas-gym-form",
        "topic": "雑談",
        "kind": "casual",
        "text": (
            "隣の人の方が明らかにフォームうまい\n"
            "私回数だけ頑張ってる感ある"
        ),
    },
    {
        "id": "cas-gym-skip",
        "topic": "雑談",
        "kind": "casual",
        "text": (
            "今日ジム行く予定だったのに帰宅後ソファから動けず\n"
            "明日やる、たぶん"
        ),
    },
    {
        "id": "cas-gym-scale",
        "topic": "雑談",
        "kind": "casual",
        "text": (
            "体重計乗ったら昨日より増えててやる気削られた\n"
            "むくみってことにしとく"
        ),
    },
    {
        "id": "cas-gym-glute-band",
        "topic": "雑談",
        "kind": "casual",
        "text": (
            "ゴムバンド使った尻トレ、翌日歩けん\n"
            "でもジーンズのフィット感は好き"
        ),
    },
    {
        "id": "cas-nonsense-towel",
        "topic": "雑談",
        "kind": "casual",
        "text": (
            "お風呂上がりにタオルどこ置いたか毎回忘れる\n"
            "床に落ちてるの拾ってる時点で何してんだろ"
        ),
    },
    {
        "id": "cas-nonsense-cable",
        "topic": "雑談",
        "kind": "casual",
        "text": (
            "充電しながら寝て朝起きたらコード腕に巻きついてた\n"
            "コード短すぎ問題いつ解決する"
        ),
    },
    {
        "id": "cas-nonsense-elevator",
        "topic": "雑談",
        "kind": "casual",
        "text": (
            "エレベーターで押されてるボタンもう一回押してる\n"
            "押したあとの気まずい0.5秒なんとかして"
        ),
    },
    {
        "id": "cas-nonsense-remote",
        "topic": "雑談",
        "kind": "casual",
        "text": (
            "リモコン探して10分、自分の尻の下にあった\n"
            "誰にも言えない"
        ),
    },
    {
        "id": "cas-nonsense-sock",
        "topic": "雑談",
        "kind": "casual",
        "text": (
            "靴下片方だけ洗濯機から出てこない問題\n"
            "異次元に行ってる説ある"
        ),
    },
    {
        "id": "cas-nonsense-tab",
        "topic": "雑談",
        "kind": "casual",
        "text": (
            "スマホのタブ開きすぎてどれが何だか分からん\n"
            "全部閉じる勇気もない"
        ),
    },
]

# --- 価値発信（予備プール。現状スケジュールでは未使用） ---
# 基本形: 本投稿=疑問の自分語り＋数字予告↓ / 自分リプ=答え
VALUE_POSTS: List[dict] = [
    {
        "id": "val-checklist",
        "topic": "資産形成",
        "kind": "value",
        "text": (
            "で、つみたてしてるのに不安消えないのなんでなん？と思ってたけど\n\n"
            "無料の引退ギャップシミュ運営して分かった、\n"
            "不安が消えない人に共通すること、ほぼこの2つ↓"
        ),
        "replies": [
            (
                "・「足りない額」を一度も数字で出してない\n"
                "・想定年利を1パターンでしか見てない\n\n"
                "ホントにこれです🥹\n\n"
                "逆にこの2つやるだけで、\n"
                "「漠然とした不安」が「毎月あと○円」に変わる✨\n\n"
                "特別な才能いらない。数字を1回並べるだけ🙌\n\n"
                "この2つ、やったことある？"
            ),
        ],
    },
    {
        "id": "val-plus-1man",
        "topic": "積立投資",
        "kind": "value",
        "text": (
            "毎月＋1万円って正直意味あるん？と思ってたけど\n\n"
            "シミュでいじって分かった、\n"
            "＋1万円が効く人・効かない人の違いは1つだけ↓"
        ),
        "replies": [
            (
                "違いは「引退までの残り年数」💭\n\n"
                "年数が長い人ほど、＋1万円でギャップの減り方が変わる。\n"
                "年数が短い人は、積立より引退年齢や目標側のレバーが効くことも✨\n\n"
                "大事なのは「頑張る額」じゃなく\n"
                "「動かしたらどう見えるか」を先に知ること✨\n\n"
                "自分がどっち側か、見たことある？"
            ),
        ],
    },
    {
        "id": "val-return-myth",
        "topic": "資産形成",
        "kind": "value",
        "text": (
            "想定年利、けっきょく何%で置けばいいん？って迷ってたけど\n\n"
            "シミュ運営してて分かった、\n"
            "危ない置き方と迷わない置き方の違い、1つだけ↓"
        ),
        "replies": [
            (
                "危ない置き方＝帳尻が合うまで%を上げる💦\n"
                "迷わない置き方＝3%と5%みたいに幅で見る\n\n"
                "不安なときほど「いい数字」に寄るの、ホントあるある🥹\n\n"
                "幅で見ると、届く／届かないを一点で決めずに\n"
                "積立や年数のレバーも冷静に選べるよ✨\n\n"
                "いま何%で置いてる？"
            ),
        ],
    },
    {
        "id": "val-rogo-2000",
        "topic": "老後資金",
        "kind": "value",
        "text": (
            "老後2000万って、けっきょく自分にも当てはまるん？と思ってたけど\n\n"
            "自分の数字で出してみて分かったこと、1つだけ↓"
        ),
        "replies": [
            (
                "2000万は「平均モデルのたたき台」で、\n"
                "自分の答えはこの式からしか出ない💭\n\n"
                "毎月の不足（生活費−年金見込み）× 想定年数\n\n"
                "生活水準も年金も人それぞれ。\n"
                "金額の丸暗記より、自分用のたたき台を1回作る方が効くよ✨\n\n"
                "自分の「毎月の不足」、出したことある？"
            ),
        ],
    },
    {
        "id": "val-monthly",
        "topic": "つみたてNISA",
        "kind": "value",
        "text": (
            "つみたてNISA、毎月いくらが正解なん？ってずっと探してたけど\n\n"
            "分かったのは「正解」じゃなくて、\n"
            "混ぜちゃいけない2つがあること↓"
        ),
        "replies": [
            (
                "・目標から逆算した「必要額」\n"
                "・今の家計で続く「続けられる額」\n\n"
                "この2つ、別モノです🥹\n\n"
                "満額できない＝失敗、でもない。\n"
                "続けられる額で始めて、ギャップを見ながら調整が現実的✨\n\n"
                "いま、どっちで決めてる？"
            ),
        ],
    },
    {
        "id": "val-age-40",
        "topic": "資産形成",
        "kind": "value",
        "text": (
            "40代からじゃもう遅いん？って不安、よく見るけど\n\n"
            "見るべきは年齢じゃなくて、この3つ↓"
        ),
        "replies": [
            (
                "① 毎月の積立\n"
                "② 引退年齢\n"
                "③ 目標額そのもの\n\n"
                "利回りだけ上げて帳尻合わせるのはNG💦\n\n"
                "レバーは複数ある。\n"
                "数字で並べると、焦り方が変わるよ✨\n\n"
                "いま一番動かしやすいの、どれ？"
            ),
        ],
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
            "これが続く人のやり方だと思う✨\n\n"
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
            "「昨日の自分のギャップ」✨\n\n"
            "数字があると、焦りより調整ができるよ🙌\n\n"
            "最近、他人の積立額見て焦ったことある？"
        ),
    },
    {
        "id": "val-years-left",
        "topic": "積立投資",
        "kind": "value",
        "text": (
            "同じ目標額なのに、人によって必要な毎月積立が全然違うのなんでなん？\n\n"
            "答えは1つだけ↓"
        ),
        "replies": [
            (
                "「残り年数」です💭\n\n"
                "引退まで25年の人と10年の人じゃ、\n"
                "同じ目標でも毎月の必要額は別世界✨\n\n"
                "だから他人の積立額を真似するより、\n"
                "自分の残り年数で逆算した方が迷わないよ🙌\n\n"
                "引退まで、いま何年で置いてる？"
            ),
        ],
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
            "新NISAの枠、満額埋めないと損なん？って焦ってたけど\n\n"
            "分かったのは、枠より先に見るものが1つあること↓"
        ),
        "replies": [
            (
                "「自分のギャップ（目標までの距離）」です💭\n\n"
                "枠の理解＝上限まで\n"
                "目標に届くか＝別計算✨\n\n"
                "枠を埋めるゲームより、\n"
                "「今の積立で足りるか」の方が意思決定しやすい🥹\n\n"
                "枠埋めとギャップ確認、どっち先にしてる？"
            ),
        ],
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
            "「月いくら使えそうか」で見るとギャップが具体的になる✨\n\n"
            "目標、いま「総額」と「月の使い方」どっちで見てる？"
        ),
    },
    {
        "id": "val-formula",
        "topic": "老後資金",
        "kind": "value",
        "text": (
            "老後資金って、けっきょくいくら貯めればいいん？に対して\n\n"
            "いちばんシンプルな出し方、これだけ↓"
        ),
        "replies": [
            (
                "生活費 − 年金見込み = 毎月の不足\n"
                "→ × 想定年数\n\n"
                "ざっくりでいいんです🥹\n"
                "完璧な表より、一度出した数字の方が行動につながる✨\n\n"
                "生活費と年金見込み、ざっくり置いたことある？"
            ),
        ],
    },
    {
        "id": "val-order",
        "topic": "つみたてNISA",
        "kind": "value",
        "text": (
            "口座とかカードとか先に調べまくって疲れてたけど\n\n"
            "順番を1つ変えたら急に楽になった↓"
        ),
        "replies": [
            (
                "「ギャップ（不足額）→ 選択肢」の順💭\n\n"
                "「毎月あと○円」が見えてからだと\n"
                "何が自分に必要か判断しやすい✨\n\n"
                "逆だと比較表だけ増えて疲れる…🥹\n\n"
                "いま調べてるの、数字？口座条件？"
            ),
        ],
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
            "一度でも数字で見たかどうかだと思う🙌"
        ),
    },
    {
        "id": "val-anxiety-split",
        "topic": "資産形成",
        "kind": "value",
        "text": (
            "「これで合ってるのかな」が消えないのなんでなん？と思ってたけど\n\n"
            "不安の正体、分解するとだいたいこの3つ↓"
        ),
        "replies": [
            (
                "・積立額が足りてるか\n"
                "・引退年齢の置き方が現実的か\n"
                "・目標額そのものが大きすぎないか\n\n"
                "まとめて悩むと重い。\n"
                "1つずつ数字に落とすと、急に軽くなるよ✨\n\n"
                "いま一番気になってるの、どれ？"
            ),
        ],
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
            "続けたあとに、ギャップを見て調整すればいい✨\n\n"
            "いま止まってるとしたら、何が引っかかってる？"
        ),
    },
]

# --- 失敗談（共感）: 価値枠の約1/3でローテ ---
# 題材は公開されている定番失敗・SNSあるあるを一人称に精錬したもの。
# 例: NISA貧乏／満額FOMO／高め設定で生活苦／下落で狼狽／2000万で固まる／調べ疲れ
# 形式: 本投稿=告白フックで途中で切る↓ / 自分リプ=経緯＋学び＋問いかけ
# 禁止: 損失額の煽り・銘柄名・口座勧誘・投資助言
FAIL_STORY_POSTS: List[dict] = [
    {
        "id": "val-fail-nisa-binbo",
        "topic": "新NISA",
        "kind": "value",
        "text": (
            "失敗談なんだけど、\n"
            "SNSの「枠埋めた」見て生活まで削りかけたことある🥹💦\n\n"
            "あのとき混同してたもの、1つ↓"
        ),
        "replies": [
            (
                "「枠の上限」と「自分の続けられる額」です💭\n\n"
                "手元の現金が薄くなると、\n"
                "ちょっと下がっただけで胃が痛くなるんだよね…💦\n\n"
                "続けられる額に戻してから、やっと息ができた🙌\n\n"
                "枠埋め焦りで、生活キツくなったことある？"
            ),
        ],
    },
    {
        "id": "val-fail-sns-full",
        "topic": "積立投資",
        "kind": "value",
        "text": (
            "タイムラインが「今年の枠もう埋めた」だらけに見えて、\n"
            "自分だけ遅れてる気がしてた時期の話🥹↓"
        ),
        "replies": [
            (
                "あとから気づいたけど、\n"
                "見えてるのは「発信してる人」だけなんだよね💦\n\n"
                "焦りの正体、だいたい他人の家計💭\n\n"
                "比較相手を「昨日の自分のギャップ」に変えてから、\n"
                "だいぶ楽になったよ✨\n\n"
                "満額報告見て、一度でも沈んだことある？"
            ),
        ],
    },
    {
        "id": "val-fail-too-high",
        "topic": "つみたてNISA",
        "kind": "value",
        "text": (
            "最初の失敗、これでした🥹\n\n"
            "積立を気持ちよく高めに設定 → 翌月キツくて減額💦\n\n"
            "原因はシンプルに1つ↓"
        ),
        "replies": [
            (
                "「やる気」で金額を決めてたこと💭\n\n"
                "今は先に\n"
                "必要額（逆算）と続けられる額を分けて見る✨\n"
                "混ぜると苦しくなるんだよね…\n\n"
                "高め設定→すぐ減額、経験した人いる？"
            ),
        ],
    },
    {
        "id": "val-fail-dip-scare",
        "topic": "積立投資",
        "kind": "value",
        "text": (
            "下落の日、アプリ何回も開いて\n"
            "積立止めかけたことある🥹💦\n\n"
            "あのとき見てなかったもの、1つ↓"
        ),
        "replies": [
            (
                "「足りるか」の距離です💭\n\n"
                "見てたのは相場だけで、\n"
                "自分のギャップは一度も見てなかった…\n\n"
                "少額でも続く状態に戻して、\n"
                "距離を見てからの方がずっと落ち着いたよ🙌\n\n"
                "下落で止めかけたこと、ある人いる？"
            ),
        ],
    },
    {
        "id": "val-fail-2000man",
        "topic": "老後資金",
        "kind": "value",
        "text": (
            "「老後2000万」で頭真っ白になって、\n"
            "しばらく何も動けなかった話🥹↓"
        ),
        "replies": [
            (
                "あれ、平均モデルのたたき台なのに\n"
                "自分の生活費も年金も置かずに固まってた💦\n\n"
                "抜けたのはこの式に落としたとき↓\n"
                "生活費 − 年金見込み = 毎月の不足 → ×年数✨\n\n"
                "見出しじゃなく、自分用の数字1回で景色変わるよ✨\n\n"
                "2000万で固まったこと、ある人いる？"
            ),
        ],
    },
    {
        "id": "val-fail-no-number",
        "topic": "資産形成",
        "kind": "value",
        "text": (
            "いちばん恥ずかしい失敗談🥹\n\n"
            "積立は続いてたのに、\n"
            "「足りない額」を一度も出してなかった話↓"
        ),
        "replies": [
            (
                "情報は見る。口座もある。\n"
                "なのに不安だけ残る、って状態だった💦\n\n"
                "変わったのは正解探しをやめて、\n"
                "ざっくりでも数字を1回並べたあと✨\n\n"
                "「漠然と不安」と「毎月あと○円」って、\n"
                "同じ状況でも心の重さが全然違う💭\n\n"
                "積立してるのに不安が消えない人、同じことある？"
            ),
        ],
    },
    {
        "id": "val-fail-optimistic-sim",
        "topic": "資産形成",
        "kind": "value",
        "text": (
            "シミュで想定年利を上げて、\n"
            "安心したフリしてた話🥹\n\n"
            "これのタチが悪いとこ、1つ↓"
        ),
        "replies": [
            (
                "「確認した気」になれちゃうこと💦\n\n"
                "実際は確認じゃなくて自己暗示なんだよね💭\n\n"
                "今は3%と5%みたいに幅で見る✨\n"
                "一点で決めない方が、積立や年数のレバーも冷静に選べる✨\n\n"
                "いい数字に寄せちゃった経験、ある人いる？"
            ),
        ],
    },
    {
        "id": "val-fail-research-tired",
        "topic": "つみたてNISA",
        "kind": "value",
        "text": (
            "口座比較のタブ、開きすぎて\n"
            "何も決められず全部閉じた夜の話🥹💦↓"
        ),
        "replies": [
            (
                "比較表は増えるのに、不安は減らないんだよね…💭\n\n"
                "足りなかったのは情報じゃなくて\n"
                "「毎月あとどれくらい足りないか」の感覚だった✨\n\n"
                "順番をギャップ確認→選択肢に変えてから、やっと動けた🙌\n\n"
                "調べ疲れで止まったこと、ある人いる？"
            ),
        ],
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
                "並べると「感覚」が「距離」になるよ✨\n"
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
            "確認用の無料シミュはここ✨\n"
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
                "整理した話はここ✨\n\n"
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
                "満額できない＝失敗、でもない✨\n"
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
                "ざっくりでいい。一度出すと焦り方が変わるよ✨"
            ),
            (
                "くわしくはここ🙌\n\n"
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
            "まず距離を知る。口座やカードはそのあとで十分🙌\n\n"
            "続きはリプ👇"
        ),
        "replies": [
            (
                "年齢・積立・利回り・目標を入れるだけで\n"
                "不足額の概算は出せるよ✨\n"
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
                "年数を動かしてから、必要額を見直すのもあり✨\n\n"
                "動かして見る入口はここ🙌\n\n"
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
                "全部いっぺんに変えなくて大丈夫✨"
            ),
            (
                "距離の確認、無料シミュはここから🙌\n"
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
                "保証じゃない。でも感覚のたたき台にはなる✨"
            ),
            (
                "考え方の整理はここ🙌\n\n"
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
                "完璧な表より、一度出した数字の方が動けるよ✨"
            ),
            (
                "目安の考え方はここから🙌\n\n"
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
                "迷子になりにくいよ✨"
            ),
            (
                "枠の基本はここ🙌\n\n"
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
                "違いの整理はここ🙌\n\n"
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
                "よくある疑問はまとめてあるよ✨"
            ),
            (
                "FAQはここから🙌\n\n"
                f"{SITE_URL}/faq"
            ),
        ],
    },
]

# 互換: 全投稿の連結（--list / --id 用）
POSTS: List[dict] = [*CASUAL_POSTS, *VALUE_POSTS, *FAIL_STORY_POSTS, *CTA_POSTS]

# 価値投稿のうち失敗談にする割合（予備・value枠復帰時用）
_FAIL_STORY_EVERY_N = 3


def _truncate(text: str, limit: int = THREADS_TEXT_LIMIT) -> str:
    text = text.strip()
    if len(text) <= limit:
        return text
    return text[: limit - 1].rstrip() + "…"


def _post_replies(post: dict) -> List[str]:
    """自分リプ一覧。replies 優先、なければ reply。"""
    raw = post.get("replies")
    if isinstance(raw, (list, tuple)) and raw:
        return [_truncate(str(part)) for part in raw if str(part).strip()]
    single = post.get("reply")
    if single and str(single).strip():
        return [_truncate(str(single))]
    return []


def thread_texts(post: dict) -> List[str]:
    """本投稿→自分リプ連鎖。casual/value/num=URL禁止 / cta=URLは最終リプのみ。"""
    main = _truncate(str(post.get("text") or ""))
    texts = [t for t in (main, *_post_replies(post)) if t]
    if not texts:
        raise ValueError(f"empty thread for post id={post.get('id')}")
    return texts


def all_posts() -> Sequence[dict]:
    return POSTS


_SLOT_HOURS = (7.0, 8.0, 10.0, 12.0, 15.0, 17.0, 18.5, 20.0, 21.0, 22.5)


def slot_from_hour(hour: int) -> int:
    """Map JST hour to nearest daily slot 0..9."""
    return min(range(POSTS_PER_DAY), key=lambda i: abs(hour - _SLOT_HOURS[i]))


def slot_kind(slot: int) -> str:
    slot = max(0, min(POSTS_PER_DAY - 1, int(slot)))
    return SLOT_KINDS[slot]


def _hydrate(post: dict, *, index: int | None = None, slot: int | None = None) -> dict:
    out = dict(post)
    out["text"] = _truncate(out["text"])
    replies = _post_replies(out)
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


def load_casual_used_ids() -> List[str]:
    """使用済み雑談ID（一度きり・再利用禁止）。"""
    path = CASUAL_LEDGER_PATH
    if not path.is_file():
        return []
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return []
    raw = data.get("used_ids") if isinstance(data, dict) else None
    if not isinstance(raw, list):
        return []
    out: List[str] = []
    seen: Set[str] = set()
    for item in raw:
        pid = str(item).strip()
        if pid and pid not in seen:
            seen.add(pid)
            out.append(pid)
    return out


def unused_casual_posts(extra_used: Set[str] | None = None) -> List[dict]:
    used = set(load_casual_used_ids()) | (extra_used or set())
    return [p for p in CASUAL_POSTS if str(p.get("id") or "") not in used]


def casual_remaining_count(extra_used: Set[str] | None = None) -> int:
    return len(unused_casual_posts(extra_used))


def mark_casual_used(post_id: str) -> bool:
    """雑談IDを台帳に追加。変更があれば True。"""
    pid = str(post_id or "").strip()
    if not pid:
        return False
    used = load_casual_used_ids()
    if pid in used:
        return False
    used.append(pid)
    payload = {"used_ids": used}
    CASUAL_LEDGER_PATH.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    return True


def _pick_value_fallback(day: date, kind_index: int, per_day_kind: int, slot: int) -> dict:
    emit = day.toordinal() * max(per_day_kind, 1) + kind_index
    if FAIL_STORY_POSTS and emit % _FAIL_STORY_EVERY_N == 0:
        pool = FAIL_STORY_POSTS
        index = (emit // _FAIL_STORY_EVERY_N) % len(pool)
    else:
        pool = VALUE_POSTS
        index = emit % len(pool)
    out = _hydrate(pool[index], index=index, slot=slot)
    out["kind"] = "value"
    out["casual_exhausted"] = True
    return out


def pick_post_for_slot(
    day: date | None = None,
    slot: int = 0,
    *,
    session_used: Set[str] | None = None,
) -> dict:
    """枠の kind（casual/cta/value/num）に応じたプール/生成から選択。

    casual は台帳で一度きり（再利用しない）。未使用の先頭から消化。
    日内プレビューは session_used に逐次 add して同じIDを返さない。
    プール枯渇時は value/失敗談にフォールバック（雑談の使い回しはしない）。
    cta は CTA_POSTS ローテ。
    """
    day = day or date.today()
    slot = max(0, min(POSTS_PER_DAY - 1, int(slot)))
    kind = SLOT_KINDS[slot]
    kind_index = SLOT_KINDS[: slot + 1].count(kind) - 1
    per_day_kind = SLOT_KINDS.count(kind)
    emit = day.toordinal() * per_day_kind + kind_index

    if kind == "num":
        from num_posts import generate_num_post

        return _hydrate(
            generate_num_post(day, kind_index, per_day_kind), slot=slot
        )

    if kind == "casual":
        unused = unused_casual_posts(session_used)
        if not unused:
            print(
                "WARNING: CASUAL_POSTS が枯渇。雑談は再利用せず value にフォールバック。"
                " posts.py に新規雑談を追加してください。",
                file=sys.stderr,
            )
            return _pick_value_fallback(day, kind_index, per_day_kind, slot)
        post = unused[0]
        pid = str(post.get("id") or "")
        if session_used is not None and pid:
            session_used.add(pid)
        index = next(
            (i for i, p in enumerate(CASUAL_POSTS) if p.get("id") == pid),
            None,
        )
        return _hydrate(post, index=index, slot=slot)

    if kind == "cta":
        pool = CTA_POSTS
        index = emit % len(pool)
    elif FAIL_STORY_POSTS and emit % _FAIL_STORY_EVERY_N == 0:
        pool = FAIL_STORY_POSTS
        index = (emit // _FAIL_STORY_EVERY_N) % len(pool)
    else:
        pool = VALUE_POSTS
        index = emit % len(pool)

    return _hydrate(pool[index], index=index, slot=slot)


def pick_post_for_date(day: date | None = None) -> dict:
    """Backward-compatible: morning value slot."""
    return pick_post_for_slot(day, slot=0)


def pick_post_by_id(post_id: str) -> dict:
    for index, post in enumerate(POSTS):
        if post["id"] == post_id:
            return _hydrate(post, index=index)
    raise KeyError(f"unknown post id: {post_id}")
