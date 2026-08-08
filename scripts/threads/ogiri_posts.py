"""ジブリ場面写真 × 大喜利キャプションの投稿プール.

画像はスタジオジブリ公式ギャラリー（常識の範囲で自由利用可）を参照する。
https://www.ghibli.jp/ の gallery/*.jpg

方針: キャプションは「そのカットで見える表情・動作・構図」に噛み合わせる。
PR・URL・投資話は入れない。1投稿完結・画像＋短文のみ。
"""

from __future__ import annotations

import json
from datetime import date
from pathlib import Path
from typing import List, Set

_THREADS_DIR = Path(__file__).resolve().parent
OGIRI_LEDGER_PATH = _THREADS_DIR / "ogiri_ledger.json"
GHIBLI_GALLERY = "https://www.ghibli.jp/gallery"


def _still(name: str) -> str:
    return f"{GHIBLI_GALLERY}/{name}.jpg"


# kind=ogiri / URLなし / リプなし
# 各 text は image の見え方（表情・動作・構図）に合わせてある
OGIRI_POSTS: List[dict] = [
    # --- 千と千尋 ---
    {
        "id": "ogiri-chihiro-car-sulk",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "chihiro",
        "image_url": _still("chihiro001"),
        "text": "帰省の車、後ろの席で不機嫌アピールしてる時の顔",
    },
    {
        "id": "ogiri-chihiro-haku-blow",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "chihiro",
        "image_url": _still("chihiro005"),
        "text": "期限切れクーポン、成仏させる儀式",
    },
    {
        "id": "ogiri-chihiro-stop-frog",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "chihiro",
        "image_url": _still("chihiro012"),
        "text": "エレベーターで隣の人の匂いに耐えてる時のチームワーク",
    },
    {
        "id": "ogiri-chihiro-yubaba-bill",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "chihiro",
        "image_url": _still("chihiro016"),
        "text": "クレカの明細開いた瞬間の顔",
    },
    {
        "id": "ogiri-chihiro-noface",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "chihiro",
        "image_url": _still("chihiro020"),
        "text": "会話に入れず、橋の上で立ち尽くす飲み会の自分",
    },
    {
        "id": "ogiri-chihiro-noface-gift",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "chihiro",
        "image_url": _still("chihiro025"),
        "text": "いらないのに、大量にもらって困ってる時の顔",
    },
    {
        "id": "ogiri-chihiro-kitchen",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "chihiro",
        "image_url": _still("chihiro030"),
        "text": "ランチピークの厨房、笑顔だけが元気な人",
    },
    {
        "id": "ogiri-chihiro-boat-follow",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "chihiro",
        "image_url": _still("chihiro040"),
        "text": "後ろからずっとついてくる気配に気づいた帰り道",
    },
    # --- トトロ ---
    {
        "id": "ogiri-totoro-run-home",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "totoro",
        "image_url": _still("totoro001"),
        "text": "宅配の再配達、あと3分ってなって全力疾走",
    },
    {
        "id": "ogiri-totoro-stairs",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "totoro",
        "image_url": _still("totoro005"),
        "text": "冷蔵庫開けて、何もないのに二度見してる顔",
    },
    {
        "id": "ogiri-totoro-soot",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "totoro",
        "image_url": _still("totoro008"),
        "text": "手が真っ黒なのに『私やってない』って顔してる時",
    },
    {
        "id": "ogiri-totoro-catbus",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "totoro",
        "image_url": _still("totoro012"),
        "text": "満員電車なのに席空いた瞬間の空気感",
    },
    {
        "id": "ogiri-totoro-rain",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "totoro",
        "image_url": _still("totoro015"),
        "text": "洗濯干した直後に空が怪しくなってきた時",
    },
    {
        "id": "ogiri-totoro-night",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "totoro",
        "image_url": _still("totoro020"),
        "text": "夜中に冷蔵庫開けて、何もないのを確認する儀式",
    },
    # --- 魔女の宅急便 ---
    {
        "id": "ogiri-majo-grass",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "majo",
        "image_url": _still("majo001"),
        "text": "有給取った日の午後、何もしてないのに充実してる顔",
    },
    {
        "id": "ogiri-majo-mom-hug",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "majo",
        "image_url": _still("majo005"),
        "text": "実家帰ったら母親の説教が始まる前触れ",
    },
    {
        "id": "ogiri-majo-hair-up",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "majo",
        "image_url": _still("majo010"),
        "text": "ヘルメット外した直後、自信だけ残ってる髪型",
    },
    {
        "id": "ogiri-majo-police",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "majo",
        "image_url": _still("majo015"),
        "text": "『ちょっとお話いいですか』って呼ばれた時の顔",
    },
    {
        "id": "ogiri-majo-delivery",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "majo",
        "image_url": _still("majo020"),
        "text": "宅配ボックス満杯で再配達になった時の虚無",
    },
    {
        "id": "ogiri-majo-wind",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "majo",
        "image_url": _still("majo025"),
        "text": "強風で髪型ぜんぶ崩壊した通勤",
    },
    # --- ハウル ---
    {
        "id": "ogiri-howl-sophie-shop",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "howl",
        "image_url": _still("howl001"),
        "text": "接客の笑顔、心はすでに退勤してる",
    },
    {
        "id": "ogiri-howl-sky-walk",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "howl",
        "image_url": _still("howl005"),
        "text": "デートで手繋いだ瞬間、急にキラキラして見えた（本人談）",
    },
    {
        "id": "ogiri-howl-mirror-shock",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "howl",
        "image_url": _still("howl008"),
        "text": "寝起きに鏡見て『誰』ってなる朝",
    },
    {
        "id": "ogiri-howl-clean",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "howl",
        "image_url": _still("howl012"),
        "text": "掃除始める前に、まずスマホ見るやつ",
    },
    {
        "id": "ogiri-howl-magic",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "howl",
        "image_url": _still("howl015"),
        "text": "締め切り前だけ神が降りるタイプ",
    },
    {
        "id": "ogiri-howl-door",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "howl",
        "image_url": _still("howl020"),
        "text": "どのタブ開けばいいかわからんブラウザ地獄",
    },
    # --- もののけ ---
    {
        "id": "ogiri-mononoke-watch",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "mononoke",
        "image_url": _still("mononoke001"),
        "text": "コンビニ前で宅配待ち、ずっと遠く見てる二人",
    },
    {
        "id": "ogiri-mononoke-fight",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "mononoke",
        "image_url": _still("mononoke005"),
        "text": "セール開始0秒でカート争奪する姿",
    },
    {
        "id": "ogiri-mononoke-stare",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "mononoke",
        "image_url": _still("mononoke010"),
        "text": "「大丈夫？」って聞かれて、大丈夫じゃない時の目",
    },
    {
        "id": "ogiri-mononoke-forest",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "mononoke",
        "image_url": _still("mononoke015"),
        "text": "リモートなのにカメラON強制の会議",
    },
    # --- ポニョ ---
    {
        "id": "ogiri-ponyo-school",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "ponyo",
        "image_url": _still("ponyo001"),
        "text": "満員電車、魚群と同じ密度で進んでる",
    },
    {
        "id": "ogiri-ponyo-run",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "ponyo",
        "image_url": _still("ponyo005"),
        "text": "セール品見つけて、カートごと全力ダッシュ",
    },
    {
        "id": "ogiri-ponyo-ham",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "ponyo",
        "image_url": _still("ponyo008"),
        "text": "夜中のカップ麺、明日の自分への宣戦布告",
    },
    {
        "id": "ogiri-ponyo-sea",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "ponyo",
        "image_url": _still("ponyo012"),
        "text": "風呂の水位上げすぎて、溢しそうな瞬間",
    },
    # --- ラピュタ ---
    {
        "id": "ogiri-laputa-sky",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "laputa",
        "image_url": _still("laputa001"),
        "text": "有給取れた金曜の空の見え方",
    },
    {
        "id": "ogiri-laputa-robot",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "laputa",
        "image_url": _still("laputa005"),
        "text": "自動更新で課金されてたアプリ見つけた時",
    },
    {
        "id": "ogiri-laputa-crystal",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "laputa",
        "image_url": _still("laputa010"),
        "text": "パスワード忘れて、ヒントもわからん時の祈り",
    },
    {
        "id": "ogiri-laputa-fly",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "laputa",
        "image_url": _still("laputa015"),
        "text": "電車の扉閉まる直前に滑り込んだ達成感",
    },
    # --- 紅の豚 ---
    {
        "id": "ogiri-porco-beach",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "porco",
        "image_url": _still("porco001"),
        "text": "休日出勤の電話鳴ってるのに、雑誌で顔隠して無視",
    },
    {
        "id": "ogiri-porco-bar",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "porco",
        "image_url": _still("porco005"),
        "text": "一人居酒屋、最初の一杯が一番うまい",
    },
    {
        "id": "ogiri-porco-cool",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "porco",
        "image_url": _still("porco008"),
        "text": "サングラス外したら、ただの眠い人だった",
    },
    # --- 猫の恩返し ---
    {
        "id": "ogiri-baron-street",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "baron",
        "image_url": _still("baron001"),
        "text": "友達の話聞いてるフリで、完全に別のこと考えてる",
    },
    {
        "id": "ogiri-baron-pose",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "baron",
        "image_url": _still("baron005"),
        "text": "証明写真、いい顔できたと思って見返すと別人が写ってる",
    },
    {
        "id": "ogiri-baron-hat",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "baron",
        "image_url": _still("baron008"),
        "text": "制服以外の服選ぶと、急に迷子になる",
    },
    # --- マーニー ---
    {
        "id": "ogiri-marnie-look",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "marnie",
        "image_url": _still("marnie001"),
        "text": "既読スルーした側の罪悪感（でも返信する気力ない）",
    },
    {
        "id": "ogiri-marnie-window",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "marnie",
        "image_url": _still("marnie005"),
        "text": "窓の外ぼーっと見てて、仕事してるフリ",
    },
    {
        "id": "ogiri-marnie-alone",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "marnie",
        "image_url": _still("marnie008"),
        "text": "グループLINEで、自分だけ話題についていけてない時",
    },
    # --- かぐや ---
    {
        "id": "ogiri-kaguya-moon",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "kaguyahime",
        "image_url": _still("kaguyahime001"),
        "text": "理想の自分と現実の自分、月と地上くらい離れてる",
    },
    {
        "id": "ogiri-kaguya-run",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "kaguyahime",
        "image_url": _still("kaguyahime005"),
        "text": "「今すぐ逃げたい」が顔に出てる会議",
    },
    {
        "id": "ogiri-kaguya-dress",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "kaguyahime",
        "image_url": _still("kaguyahime012"),
        "text": "服たくさんあるのに、今日着たいものがゼロ",
    },
    # --- 風立ちぬ ---
    {
        "id": "ogiri-kaze-plane",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "kazetachinu",
        "image_url": _still("kazetachinu001"),
        "text": "夢見てたキャリアと、今の経費精算の距離感",
    },
    {
        "id": "ogiri-kaze-smoke",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "kazetachinu",
        "image_url": _still("kazetachinu005"),
        "text": "締切前に突然きた「ひらめき」（だいたい使えない）",
    },
    {
        "id": "ogiri-kaze-desk",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "kazetachinu",
        "image_url": _still("kazetachinu010"),
        "text": "デスク周りだけは整ってるのに、中身ぐちゃぐちゃ",
    },
    # --- アリエッティ ---
    {
        "id": "ogiri-kari-small",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "karigurashi",
        "image_url": _still("karigurashi001"),
        "text": "一人暮らし、冷蔵庫の中が常にスカスカ",
    },
    {
        "id": "ogiri-kari-sugar",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "karigurashi",
        "image_url": _still("karigurashi008"),
        "text": "砂糖の袋、持ち上げた瞬間に破れるあるある",
    },
    # --- おもひでぽろぽろ ---
    {
        "id": "ogiri-omoide-school",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "omoide",
        "image_url": _still("omoide001"),
        "text": "学生時代の写真出てきた時のタイムスリップ",
    },
    {
        "id": "ogiri-omoide-train",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "omoide",
        "image_url": _still("omoide005"),
        "text": "帰省の新幹線、ホームに着いた瞬間ちょっと泣きそう",
    },
    # --- ぽんぽこ ---
    {
        "id": "ogiri-tanuki-crowd",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "tanuki",
        "image_url": _still("tanuki001"),
        "text": "セール会場、人と人のあいだをすり抜ける技術",
    },
    {
        "id": "ogiri-tanuki-transform",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "tanuki",
        "image_url": _still("tanuki005"),
        "text": "会社では大人、家では床に転がる生き物",
    },
    # --- 山田くん ---
    {
        "id": "ogiri-yamada-family",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "yamada",
        "image_url": _still("yamada001"),
        "text": "親戚集まり、話題が自分に振られるまでの緊張",
    },
    {
        "id": "ogiri-yamada-dinner",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "yamada",
        "image_url": _still("yamada005"),
        "text": "「今日何食べる？」で毎日夫婦喧嘩しそうになる",
    },
    # --- ナウシカ ---
    {
        "id": "ogiri-nausicaa-wind",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "nausicaa",
        "image_url": _still("nausicaa001"),
        "text": "マスク外したら化粧落ちてて別人だった",
    },
    {
        "id": "ogiri-nausicaa-bug",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "nausicaa",
        "image_url": _still("nausicaa005"),
        "text": "部屋に虫出て、どっちが逃げ出すか勝負してる",
    },
    # --- 耳をすませば ---
    {
        "id": "ogiri-mimi-listen",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "mimi",
        "image_url": _still("mimi001"),
        "text": "隣の席の通話が丸聞こえで仕事にならん",
    },
    {
        "id": "ogiri-mimi-cat",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "mimi",
        "image_url": _still("mimi008"),
        "text": "猫カフェ行くより、家の猫に無視される方が好き",
    },
    # --- コクリコ坂 ---
    {
        "id": "ogiri-kokuriko-bike",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "kokurikozaka",
        "image_url": _still("kokurikozaka001"),
        "text": "坂道の途中で足つりそうになりながら笑顔",
    },
    {
        "id": "ogiri-kokuriko-flag",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "kokurikozaka",
        "image_url": _still("kokurikozaka008"),
        "text": "朝から気合い入れてるのに、中身は眠い",
    },
    # --- ゲド ---
    {
        "id": "ogiri-ged-dragon",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "ged",
        "image_url": _still("ged001"),
        "text": "寝不足の目、ドラゴン並みに赤い",
    },
    {
        "id": "ogiri-ged-shadow",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "ged",
        "image_url": _still("ged008"),
        "text": "自分の影（やり残したタスク）から逃げ続けてる",
    },
    # --- 海がきこえる ---
    {
        "id": "ogiri-umi-wave",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "umi",
        "image_url": _still("umi001"),
        "text": "海見て深呼吸したつもりが、潮の匂いでくしゃみ",
    },
    {
        "id": "ogiri-umi-call",
        "kind": "ogiri",
        "topic": "大喜利",
        "film": "umi",
        "image_url": _still("umi008"),
        "text": "電話する勇気がなくて、既読だけついてるチャット",
    },
]


def load_ogiri_used_ids() -> List[str]:
    if not OGIRI_LEDGER_PATH.is_file():
        return []
    try:
        data = json.loads(OGIRI_LEDGER_PATH.read_text(encoding="utf-8"))
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


def unused_ogiri_posts(extra_used: Set[str] | None = None) -> List[dict]:
    used = set(load_ogiri_used_ids()) | (extra_used or set())
    return [p for p in OGIRI_POSTS if str(p.get("id") or "") not in used]


def ogiri_remaining_count(extra_used: Set[str] | None = None) -> int:
    return len(unused_ogiri_posts(extra_used))


def mark_ogiri_used(post_id: str, *, day: date | None = None) -> bool:
    pid = str(post_id or "").strip()
    if not pid:
        return False
    day = day or date.today()
    used = load_ogiri_used_ids()
    history: List[dict] = []
    if OGIRI_LEDGER_PATH.is_file():
        try:
            data = json.loads(OGIRI_LEDGER_PATH.read_text(encoding="utf-8"))
            if isinstance(data, dict) and isinstance(data.get("history"), list):
                history = [h for h in data["history"] if isinstance(h, dict)]
        except (OSError, json.JSONDecodeError):
            history = []

    changed = False
    if pid not in used:
        used.append(pid)
        changed = True
    day_s = day.isoformat()
    if not any(
        str(h.get("id") or "") == pid and str(h.get("date") or "") == day_s
        for h in history
    ):
        history.append({"id": pid, "date": day_s})
        changed = True
    if not changed:
        return False
    OGIRI_LEDGER_PATH.write_text(
        json.dumps({"used_ids": used, "history": history}, ensure_ascii=False, indent=2)
        + "\n",
        encoding="utf-8",
    )
    return True


def pick_ogiri(
    *,
    session_used: Set[str] | None = None,
    planned_ids: Set[str] | None = None,
) -> dict:
    """未使用の大喜利を1本返す。枯渇時はプール先頭から再利用。"""
    extra = set(session_used or []) | set(planned_ids or [])
    unused = unused_ogiri_posts(extra)
    if unused:
        return dict(unused[0])
    pool = [p for p in OGIRI_POSTS if str(p.get("id") or "") not in set(session_used or [])]
    if not pool:
        pool = list(OGIRI_POSTS)
    return dict(pool[0])
