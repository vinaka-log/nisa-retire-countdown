#!/usr/bin/env python3
"""chitchat_gen: 雑談の自動追加（APIなし）.

完成した口語ツイートをプールから未使用分だけ取り出し、
casual_generated.json に追記する。場面×反応の機械的な組み合わせはしない。

文体:
  - スマホで打った感じ。オチ・教訓なし
  - 絵文字は基本なし（どうしてもなら「草」程度）
  - 投資・NISA・URL禁止
  - 一度使ったら台帳で再利用しない（posts.py 側）

Examples:
  PYTHONPATH=scripts/threads python scripts/threads/chitchat_gen.py --dry-run --count 8
  PYTHONPATH=scripts/threads python scripts/threads/chitchat_gen.py --count 16
  PYTHONPATH=scripts/threads python scripts/threads/chitchat_gen.py --refill
"""

from __future__ import annotations

import argparse
import hashlib
import json
import random
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Sequence, Set, Tuple

sys.path.insert(0, str(Path(__file__).resolve().parent))

from posts import (  # noqa: E402
    CASUAL_GENERATED_PATH,
    CASUAL_HAND_POSTS,
    THREADS_TEXT_LIMIT,
    build_casual_posts,
    casual_remaining_count,
    load_generated_casual_posts,
)
from casual_consistency import resolve_consistency  # noqa: E402

THEMES = ("gal", "work", "gym", "nonsense")

# 完成文のみ。組み合わせ生成はしない（不自然な接続を避けるため）。
CHITCHAT_BANK: Dict[str, Sequence[str]] = {
    "gal": (
        "ネイルサロン予約したのに日程間違えとる\n来週の金曜じゃなくて再来週だった…金どぶ",
        "まつげパーマした翌日なのに寝癖で潰れてて泣いた\nお金払った意味どこいった",
        "カラコン左右でメーカー違くて、鏡見るたびに目の色ちょっとズレてる\n出かける前に自分で「ん？」ってなる",
        "マスカラ失敗して下まつ毛くっついたまま出社した\n誰も何も言わなかったけど絶対見てた",
        "白い服の日に限ってリップ落とすのなんで\n襟元見て発狂した",
        "コンタクト片眼だけ行方不明\n洗面台の排水溝見にいく勇気でない",
        "カラーしたてなのに今日雨\n傘さした意味あるのかこれ",
        "家の照明だと盛れてるのに外の光で別人\n照明詐欺やめてほしい",
        "香水つけすぎた気がして電車でずっと気になってる\n周りに匂ってたらごめん…",
        "ヒール履いて出たけど駅ついた時点で限界\n帰りフラットに履き替えた",
        "前髪切りすぎた\n前髪なし人生、急に始まった",
        "ネイル乾く前にスマホ触った\nもう取り返しつかん",
        "美容院の予約、午前と午後間違えてた\n電話するの恥ずかしい",
        "新しいチーク、塗り方わからんまま出勤した\n多分変な顔になってる",
        "ヘアオイルつけすぎて頭ぴかぴか\n電車の窓に映って発覚",
        "カバンの中で化粧水あふれてた\n中ぐちゃぐちゃ、最悪",
        "つけまつ毛片方だけ電車で消えてた\nいつ取れたん",
        "眉毛整えすぎた\n別人すぎて笑えない",
        "髪半乾きのまま外出した\n結んだらさらに変",
        "グロス塗りすぎて髪が口に張り付く\n一日中これ",
        "アイプチ片眼だけ剥がれてた\n写真見返して気づいた",
        "ヒールの中に石入ってて駅まで地獄\nなんで気づかんかった",
        "新しいバッグ、チャック開けっぱなしで歩いてた\n中身落ちてなくてよかった…",
        "リップと服の色が喧嘩してるの鏡見て発覚\nもう出ちゃったあと",
        "ヘアピン全部落として床が戦場\n拾う気力がない",
        "新しいシャツ、タグ付けたまま昼まで気づかず\n誰か言ってくれよ",
        "カラー剤の匂いが服についてて一日中気になる\n自分だけかもなのに気になる",
        "今日のコーデ、靴だけ浮いてるの後から気づいた\n写真残してしまった",
    ),
    "work": (
        "今日の退勤後なに食べよみたいなこと考えてる時点で仕事してない説ある\nでももう頭キャパない",
        "上司の「で？」が怖すぎる\n説明してる途中で来るのほんとにやめて",
        "月曜朝、目覚ましより先に胃が重い\n身体が先に仕事拒否してる",
        "Teamsの通知音だけで肩に力入る\nミュートにしてるのに脳が反応するのやめて",
        "「あとこれだけ」信用した自分がバカだった\n結局1時間半溶けた",
        "「何かありますか？」のあとの無言\nあるけど言うほどじゃないやつどうすればいいの",
        "カレンダー開けたら今週水色多すぎて笑った\n笑う以外の処理方法がない",
        "昼休みスマホ見ながら一人飯してる時間だけが生きてる実感ある\n午後また別人になる",
        "朝イチのメンション見たくなくてロック画面伏せた\n見たら負けな気がする",
        "会議資料、最終版じゃなかったやつ共有した\n気づいた瞬間終わった",
        "「簡単なので」案件、全然簡単じゃなかった\n簡単って誰が決めた",
        "退勤間際に「ちょっといい？」来た\nもうカバン持ってたのに",
        "返信したつもりが下書きのまま残ってた\n相手どう思ってるんだろ",
        "週報書く内容がなにも思い出せない\n一週間なにやってた",
        "ランチ食べてる間にメンション3件来てた\n胃もたれる",
        "共有フォルダの場所またわからなくなった\n毎回迷子",
        "Excelのフィルタ解除忘れて数字おかしく見えてた\n一瞬で焦った",
        "定例なのにアジェンダ空っぽで入室した\n気まずい空気自分発",
        "「後で共有します」言った案件、自分でも忘れてた\n後でっていつ",
        "会議室予約、終了時間だけ押してなかった\n次の人来て発覚",
        "イヤホン付けたまま大声で独り言言ってた\n在宅の怖さここにある",
        "画面共有で別タブ映った気がする\n確認する勇気がない",
        "有給希望出した日に限って大事そうな予定入る\nなんでこうなる",
        "チャットの「了解です」打ちすぎて指が痛い\n今日の成果これだけかも",
        "自分のカメラオフ忘れて変顔映ってた説ある\n誰も指摘してこないの逆に怖い",
        "電話出たら全然知らない用件だった\n名前聞き返すタイミング逃した",
        "プリンター前で順番待ちしてる時間が長い\nこの時間なに",
        "今日のタスク、朝書いた時点で破綻してた\n計画性どこいった",
    ),
    "gym": (
        "ジム行くのダルいから今日は自宅でスクワットだけやった\n30回で息切れしてて草、運動不足すぎ",
        "昨日の脚トレのせいだと思うけど階段がつらい\n後輩に先に行かれた",
        "プロテインの味、3日目から急に無理になった\nヨーグルト混ぜたらまた飲める",
        "ヒップスラストのあと椅子に座るだけで筋肉痛\nきついけどまあ続く",
        "隣の人の方が明らかにフォームうまい\n私回数だけ頑張ってる感ある",
        "今日ジム行く予定だったのに帰宅後ソファから動けず\n明日やる、たぶん",
        "体重計乗ったら昨日より増えててやる気削られた\nむくみってことにしとく",
        "ゴムバンド使った尻トレ、翌日歩けん\nでもジーンズのフィット感は好き",
        "ランジの途中でふくらはぎつりそうになった\n無理しすぎた",
        "ダンベルの重さ見栄張って後悔した\n下ろすのも一苦労",
        "腹筋ローラー、3回で人生終了した\n床に伏せたまましばらく動けず",
        "ジムのロッカー鍵、どこ置いたかわからん\n手の中にあった",
        "プロテインシェイカー洗わず放置してた\n蓋開けた瞬間終わった",
        "ウェア持ってきたのにシューズ忘れた\nもう帰るしかない",
        "マシンの使い方、隣の人見て学んでる\nわかったフリしてる",
        "ストレッチ足りず首だけ痛い\n本末転倒",
        "今日のメニュー、やる気だけ先に帰宅した\n体はまだ家にいる",
        "ランニングマシン速度上げすぎて降りられない\n緊急停止した",
        "ジムの鏡、自分の姿勢ひどすぎて見るのやめたい\n見てしまったあと",
        "自宅トレ用マット、畳む気力がない\n床に出したまま翌日",
        "カーフレイズやりすぎて階段が敵\n会社の階段つらい",
        "新メニュー挑戦したら翌日動けず\nやりすぎた",
        "水分足りず頭くらくらになった\n休憩足りてなかった",
        "グローブ忘れて手のひら赤い\nバーがすべる",
        "クールダウン飛ばして後悔してる\n夜になって効いてきた",
        "懸垂補助マシンでも腕プルプル\n補助ありがたい…",
        "今日は歩くだけでトレ扱いする日\nそれでいい日もある",
        "インナーマッスル意識しすぎて呼吸忘れてる\n酸欠気味",
    ),
    "nonsense": (
        "アイスの棒、折れた方から食べ始めたらバランス崩れて落ちた\n床びちょびちょ、最悪",
        "洗濯機まわり終わったと思って開けたら中ぬるいの残ってて絶望した\nもう一回回すのめんどくさいんだけど",
        "お風呂上がりにタオルどこ置いたか毎回忘れる\n床に落ちてるの拾ってる時点で何してんだろ",
        "充電しながら寝て朝起きたらコード腕に巻きついてた\nコード短すぎ問題いつ解決する",
        "エレベーターで押されてるボタンもう一回押してる\n押したあとの気まずい感じなんとかして",
        "リモコン探して10分、自分の尻の下にあった\n誰にも言えない",
        "靴下片方だけ洗濯機から出てこない問題\n異次元に行ってる説ある",
        "スマホのタブ開きすぎてどれが何だか分からん\n全部閉じる勇気もない",
        "充電ケーブル、また机の裏側に落ちた\n取り出すのが地味にむずい",
        "コンビニ袋の持ち手が途中でちぎれた\n両手で抱えて帰った",
        "鍵閉めたか不安で駅から戻った\n閉まってた、いつものやつ",
        "冷蔵庫開けたら何取りに来たか忘れた\n冷気だけ出てる",
        "洗濯干し終わったと思って部屋見たら籠まだ満タン\n気のせいだった",
        "スマホの明るさ自動が暴れて目が痛い\n夜なのに海岸みたいな明るさ",
        "郵便受けのチラシだけ異常に多い日\n必要な郵便は来ない",
        "自動販売機、お金戻ってこない数秒が長い\n戻ってきた、よかった",
        "イヤホン左右どっちが右かわからんまま挿した\n音変で気づく",
        "コーヒー淹れてる間に用事足して冷めた\n電子レンジ行き",
        "ゴミ箱の袋、結ぶところで手が汚れる\n毎回これ",
        "傘、晴れだと忘れる雨だと持ってない\n法則すぎる",
        "ベッドに潜ったらリモコンが見つからない\n布団の海に沈んだ",
        "髪の毛一本が服について取れない\n静電気かなにか",
        "水道の水出っぱなし一瞬あった気がする\n戻って確認した、出てなかった",
        "宅配ボックスの暗証番号また忘れた\nメモどこいった",
        "靴下のゴムだけ先に寿命迎えてる\nかかと落ちる",
        "部屋の電気、消し忘れ確認で往復した\n消えてた",
        "カバンの中でイヤホン絡まりすぎ問題\n毎朝の儀式",
        "食パン、冷凍したの忘れて無理に焼いた\n中が凍ったまま",
        "シャンプーとリンス、また順番逆\n気づくのいつも途中",
        "時計5分進めてるの忘れて早起きした\n得した気も損した気もする",
    ),
}

FORBIDDEN_EMOJI = ("💕", "❤️", "❤", "🫶", "💗", "💖", "💘", "💓", "💞", "♥️", "✨", "🥹", "💭", "💦", "🙌", "💪", "🪞", "💻", "🍪", "🍩", "🍰", "🎧", "🚪")
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


def _normalize_text(text: str) -> str:
    text = text.replace("\r\n", "\n").replace("\r", "\n").strip()
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text


def _text_key(text: str) -> str:
    return re.sub(r"\s+", "", _normalize_text(text))


def existing_text_keys() -> Set[str]:
    return {_text_key(str(p.get("text") or "")) for p in build_casual_posts()}


def existing_ids() -> Set[str]:
    return {str(p.get("id") or "") for p in build_casual_posts()}


def validate_post(theme: str, text: str) -> str | None:
    if theme not in THEMES:
        return f"invalid theme: {theme}"
    text = _normalize_text(text)
    if not text or len(text) < 10:
        return "too short"
    if len(text) > THREADS_TEXT_LIMIT:
        return "too long"
    lower = text.lower()
    if "http://" in lower or "https://" in lower:
        return "url forbidden"
    for emoji in FORBIDDEN_EMOJI:
        if emoji in text:
            return f"forbidden emoji: {emoji}"
    for word in FORBIDDEN_WORDS:
        if word in text:
            return f"forbidden word: {word}"
    return None


def make_id(theme: str, text: str) -> str:
    digest = hashlib.sha1(_text_key(text).encode("utf-8")).hexdigest()[:10]
    return f"cas-gen-{theme}-{digest}"


def bank_entries() -> List[Tuple[str, str]]:
    out: List[Tuple[str, str]] = []
    for theme in THEMES:
        for text in CHITCHAT_BANK[theme]:
            out.append((theme, _normalize_text(text)))
    return out


def pick_from_bank(count: int, *, seed: int | None = None) -> List[dict]:
    """未使用の完成文だけをテーマ均等で取り出す。"""
    rng = random.Random(seed)
    keys = existing_text_keys()
    ids = existing_ids()

    by_theme: Dict[str, List[str]] = {t: [] for t in THEMES}
    for theme, text in bank_entries():
        if validate_post(theme, text):
            continue
        key = _text_key(text)
        if key in keys:
            continue
        by_theme[theme].append(text)

    for theme in THEMES:
        rng.shuffle(by_theme[theme])

    need = {t: 0 for t in THEMES}
    base, rem = divmod(count, len(THEMES))
    for i, t in enumerate(THEMES):
        need[t] = base + (1 if i < rem else 0)

    accepted: List[dict] = []
    for theme in THEMES:
        take = need[theme]
        for text in by_theme[theme][:take]:
            pid = make_id(theme, text)
            if pid in ids:
                continue
            accepted.append(
                {
                    "id": pid,
                    "topic": "雑談",
                    "kind": "casual",
                    "theme": theme,
                    "text": text,
                    "consistency": resolve_consistency({"text": text}),
                    "source": "chitchat_gen",
                    "created_at": datetime.now(timezone.utc).strftime(
                        "%Y-%m-%dT%H:%M:%SZ"
                    ),
                }
            )
            keys.add(_text_key(text))
            ids.add(pid)

    # 不足分は他テーマの余りから
    if len(accepted) < count:
        leftovers: List[Tuple[str, str]] = []
        taken_keys = {_text_key(p["text"]) for p in accepted}
        for theme in THEMES:
            for text in by_theme[theme]:
                key = _text_key(text)
                if key in taken_keys or key in existing_text_keys():
                    continue
                leftovers.append((theme, text))
        rng.shuffle(leftovers)
        for theme, text in leftovers:
            if len(accepted) >= count:
                break
            pid = make_id(theme, text)
            if pid in ids:
                continue
            accepted.append(
                {
                    "id": pid,
                    "topic": "雑談",
                    "kind": "casual",
                    "theme": theme,
                    "text": text,
                    "consistency": resolve_consistency({"text": text}),
                    "source": "chitchat_gen",
                    "created_at": datetime.now(timezone.utc).strftime(
                        "%Y-%m-%dT%H:%M:%SZ"
                    ),
                }
            )
            ids.add(pid)

    return accepted[:count]


def save_generated(posts: List[dict]) -> int:
    path = CASUAL_GENERATED_PATH
    raw_posts: List[dict] = []
    if path.is_file():
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
            if isinstance(data, dict) and isinstance(data.get("posts"), list):
                raw_posts = [p for p in data["posts"] if isinstance(p, dict)]
        except (OSError, json.JSONDecodeError):
            raw_posts = list(load_generated_casual_posts())

    known = {str(p.get("id") or "") for p in raw_posts}
    # 既存テキストとも照合（手書きと被るID違い対策）
    known_keys = {_text_key(str(p.get("text") or "")) for p in raw_posts}
    known_keys |= existing_text_keys()

    added = 0
    for post in posts:
        pid = str(post.get("id") or "")
        text = str(post.get("text") or "")
        if not pid or pid in known:
            continue
        if _text_key(text) in known_keys:
            continue
        raw_posts.append(post)
        known.add(pid)
        known_keys.add(_text_key(text))
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
        if need % 4:
            need += 4 - (need % 4)
        print(
            f"refill: remaining={remaining} → generate {need} (target={target})",
            file=sys.stderr,
        )
        return need
    return max(int(args.count), 0)


def main() -> int:
    parser = argparse.ArgumentParser(description="chitchat_gen: 雑談を自動追加（APIなし）")
    parser.add_argument("--count", type=int, default=16, help="追加件数（--refill 時は無視）")
    parser.add_argument(
        "--refill",
        action="store_true",
        help="残数が min_remaining 未満なら target_remaining まで補充",
    )
    parser.add_argument("--min-remaining", type=int, default=24)
    parser.add_argument("--target-remaining", type=int, default=48)
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--seed", type=int, default=None)
    parser.add_argument(
        "--reset-generated",
        action="store_true",
        help="casual_generated.json を空にしてから追加（手書きは消さない）",
    )
    args = parser.parse_args()

    if args.reset_generated and not args.dry_run:
        CASUAL_GENERATED_PATH.write_text(
            json.dumps({"posts": []}, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        print("RESET: casual_generated.json cleared", file=sys.stderr)

    count = resolve_count(args)
    if count <= 0:
        return 0

    print(
        f"chitchat_gen hand={len(CASUAL_HAND_POSTS)} "
        f"generated={len(load_generated_casual_posts())} "
        f"remaining={casual_remaining_count()} add={count}",
        file=sys.stderr,
    )

    posts = pick_from_bank(count, seed=args.seed)
    if len(posts) < count:
        print(
            f"WARNING: requested={count} got={len(posts)} "
            f"（CHITCHAT_BANK の未使用分が不足。chitchat_gen.py の文面を追加して）",
            file=sys.stderr,
        )
    if not posts:
        print("ERROR: no unused chitchat left in bank", file=sys.stderr)
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
