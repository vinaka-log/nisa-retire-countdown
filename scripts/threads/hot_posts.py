"""ホットな金融トピック（ニュースへの反応・URLなし）.

Google News / NHK経済の見出しを、みつきの口調の雑談に落とす。
投資助言・銘柄推奨・サイト誘導はしない。見出しが取れないときは定番の反応文。
"""

from __future__ import annotations

import hashlib
import json
import re
import sys
import xml.etree.ElementTree as ET
from datetime import date
from pathlib import Path
from typing import List, Optional, Sequence, Set
from urllib.parse import quote

import httpx

_THREADS_DIR = Path(__file__).resolve().parent
HOT_LEDGER_PATH = _THREADS_DIR / "hot_ledger.json"
THREADS_TEXT_LIMIT = 500

_GOOGLE_QUERY = (
    "(日銀 OR 政策金利 OR NISA OR 新NISA OR 円安 OR 円高 OR 為替 "
    "OR 物価 OR 消費者物価 OR 実質賃金 OR iDeCo OR 日経平均 OR 住宅ローン) when:2d"
)
_FEEDS = (
    "https://news.google.com/rss/search?q="
    + quote(_GOOGLE_QUERY)
    + "&hl=ja&gl=JP&ceid=JP:ja",
    "https://www3.nhk.or.jp/rss/news/cat6.xml",
)

_ALLOW = (
    "日銀",
    "政策金利",
    "利上げ",
    "利下げ",
    "金利",
    "円安",
    "円高",
    "ドル円",
    "為替",
    "物価",
    "消費者物価",
    "インフレ",
    "実質賃金",
    "賃金",
    "春闘",
    "NISA",
    "新NISA",
    "つみたて",
    "iDeCo",
    "イデコ",
    "年金",
    "日経平均",
    "日経",
    "TOPIX",
    "東証",
    "株価",
    "国債",
    "住宅ローン",
    "値上げ",
    "家計",
    "金融庁",
    "非課税",
)
_DENY = (
    "おすすめ",
    "買い時",
    "売り時",
    "爆益",
    "爆上げ",
    "仮想通貨",
    "ビットコイン",
    "暗号資産",
    "当選",
    "キャンペーン",
    "スポンサー",
    "広告",
    "PR",
    "予想",
    "見通し",
    "テクニカル",
    "コラム",
    "社説",
    "識者",
    "ファンド",
    "信託",
    "基準価格",
    "登場",
    "ご案内",
    "給付金",
    "注文情報",
    "要注目",
    "目標株価",
    "について",
    "発注",
    "事業者",
    "…",
    "代名詞",
    "http://",
    "https://",
)

# 見出しが無いときの反応。ニュースの事実は書かない。
FALLBACK_HOT_POSTS: List[dict] = [
    {
        "id": "hot-fb-headline-stomach",
        "topic": "金融",
        "kind": "hot",
        "text": (
            "金融の見出し、開く前から胃が重い日ある\n"
            "中身まで読む気力がない\n\n"
            "見る派、スルー派？"
        ),
    },
    {
        "id": "hot-fb-supermarket",
        "topic": "金融",
        "kind": "hot",
        "text": (
            "物価の話、ニュースよりスーパーの会計の方が早い\n"
            "同じカゴなのに高くなってる\n\n"
            "値上げ、もう慣れた？"
        ),
    },
    {
        "id": "hot-fb-nisa-quota",
        "topic": "金融",
        "kind": "hot",
        "text": (
            "今年のNISA枠、どこまで埋めるかまだ決めてない\n"
            "満額の話を見るたび焦る\n\n"
            "もう決めてる人いる？"
        ),
    },
    {
        "id": "hot-fb-rate-scroll",
        "topic": "金融",
        "kind": "hot",
        "text": (
            "金利のニュース、タイムラインに流れてきても読み飛ばす\n"
            "積立の金額は変えてない\n\n"
            "金利、追ってる？"
        ),
    },
    {
        "id": "hot-fb-yen",
        "topic": "金融",
        "kind": "hot",
        "text": (
            "円安円高、言葉は聞くのに自分の生活のどこに効くか曖昧\n"
            "輸入品が高くなった気はする\n\n"
            "実感ある人いる？"
        ),
    },
    {
        "id": "hot-fb-nikkei",
        "topic": "金融",
        "kind": "hot",
        "text": (
            "日経平均が上がった下がった、見て一喜一憂して終わる日\n"
            "積立は止まってない\n\n"
            "数字、毎日見る？"
        ),
    },
    {
        "id": "hot-fb-ideco",
        "topic": "金融",
        "kind": "hot",
        "text": (
            "iDeCoとNISA、違いを調べたままタブを閉じた\n"
            "また今度で止まってる\n\n"
            "どっちから触った？"
        ),
    },
    {
        "id": "hot-fb-loan",
        "topic": "金融",
        "kind": "hot",
        "text": (
            "住宅ローン金利の話、家を買う予定ないのに気になる\n"
            "他人事のはずなのにモヤる\n\n"
            "同じ人いる？"
        ),
    },
    {
        "id": "hot-fb-wage",
        "topic": "金融",
        "kind": "hot",
        "text": (
            "賃上げのニュース見たあと、自分の明細を見にいった\n"
            "見出しと手取りが一致しない\n\n"
            "実感、ある？"
        ),
    },
    {
        "id": "hot-fb-app-scared",
        "topic": "金融",
        "kind": "hot",
        "text": (
            "株のニュースが派手な日ほど、証券アプリを開きたくない\n"
            "開かなくても積立は走ってる\n\n"
            "開く派、閉じる派？"
        ),
    },
    {
        "id": "hot-fb-pension",
        "topic": "金融",
        "kind": "hot",
        "text": (
            "年金のニュース、20代だとまだピンとこない\n"
            "でも不安だけ先に来る\n\n"
            "考え始めた年齢、いつだった？"
        ),
    },
    {
        "id": "hot-fb-no-move",
        "topic": "金融",
        "kind": "hot",
        "text": (
            "ホットな金融ニュースを見ても、今日やることが増えない\n"
            "積立額はそのまま\n\n"
            "ニュース見て動かす人、いる？"
        ),
    },
]

_TEMPLATES = (
    "{title}\n\n積立の画面は開かなかった\nこういうニュース、見る派？",
    "{title}\n\nで、毎月の積立額は何も変えてない\n動かす人いる？",
    "{title}\n\n見出しだけ見て、中身は読んでない\n同じ人いる？",
    "{title}\n\n不安にはなるけど、今日やること増えない\nどう受け取ってる？",
    "{title}\n\nタイムラインで見て、証券アプリは閉じた\n開いた人いる？",
    "{title}\n\n生活がすぐ変わる気がしないのに、目は止まる\n気にしてる？",
)

_headline_cache: Optional[List[str]] = None


def _text_key(title: str) -> str:
    return re.sub(r"\s+", "", title)


def _clean_title(raw: str) -> str:
    title = re.sub(r"\s+", " ", raw or "").strip()
    title = title.replace("\u3000", " ")
    if " - " in title:
        head, tail = title.rsplit(" - ", 1)
        if 0 < len(tail) <= 24:
            title = head.strip()
    # 出典・サブ見出しを落として、先頭の事実だけ残す
    for sep in ("＝", "：", ":", "　"):
        if sep in title:
            lead = title.split(sep, 1)[0].strip()
            if len(lead) >= 12:
                title = lead
                break
    return title.strip(" 【】[]")


def _title_ok(title: str) -> bool:
    if not title or len(title) < 8 or len(title) > 42:
        return False
    if title[0] in "【［[(":
        return False
    if not any(word in title for word in _ALLOW):
        return False
    lowered = title.lower()
    if any(word.lower() in lowered for word in _DENY):
        return False
    return True


def _parse_rss_titles(xml_text: str) -> List[str]:
    try:
        root = ET.fromstring(xml_text)
    except ET.ParseError:
        return []
    titles: List[str] = []
    for item in root.iter("item"):
        node = item.find("title")
        if node is None or not node.text:
            continue
        title = _clean_title(node.text)
        if _title_ok(title):
            titles.append(title)
    return titles


def fetch_headlines(*, force: bool = False) -> List[str]:
    """直近の金融見出し。失敗時は空（呼び出し側が定番文に落とす）。"""
    global _headline_cache
    if _headline_cache is not None and not force:
        return list(_headline_cache)

    found: List[str] = []
    seen: Set[str] = set()
    headers = {"User-Agent": "Mozilla/5.0 (compatible; mitsuki-threads/1.0)"}
    try:
        with httpx.Client(timeout=12.0, follow_redirects=True, headers=headers) as client:
            for url in _FEEDS:
                try:
                    response = client.get(url)
                    response.raise_for_status()
                except httpx.HTTPError as exc:
                    print(f"WARNING: hot feed failed: {exc}", file=sys.stderr)
                    continue
                for title in _parse_rss_titles(response.text):
                    key = _text_key(title)
                    if key in seen:
                        continue
                    seen.add(key)
                    found.append(title)
    except httpx.HTTPError as exc:
        print(f"WARNING: hot headlines unavailable: {exc}", file=sys.stderr)
        found = []

    _headline_cache = found
    return list(found)


def _render(title: str, variant: int) -> str:
    template = _TEMPLATES[variant % len(_TEMPLATES)]
    text = template.format(title=title).strip()
    if len(text) > THREADS_TEXT_LIMIT:
        text = text[: THREADS_TEXT_LIMIT - 1].rstrip() + "…"
    return text


def _format_news(title: str, variant: int = 0) -> dict:
    digest = hashlib.sha1(_text_key(title).encode("utf-8")).hexdigest()[:10]
    return {
        "id": f"hot-{digest}",
        "topic": "金融",
        "kind": "hot",
        "theme": "news",
        "headline": title,
        "text": _render(title, variant),
    }


def load_hot_used_ids() -> List[str]:
    if not HOT_LEDGER_PATH.is_file():
        return []
    try:
        data = json.loads(HOT_LEDGER_PATH.read_text(encoding="utf-8"))
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


def mark_hot_used(post_id: str, *, day: date | None = None) -> bool:
    pid = str(post_id or "").strip()
    if not pid:
        return False
    day = day or date.today()
    used = load_hot_used_ids()
    history: List[dict] = []
    if HOT_LEDGER_PATH.is_file():
        try:
            data = json.loads(HOT_LEDGER_PATH.read_text(encoding="utf-8"))
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
    HOT_LEDGER_PATH.write_text(
        json.dumps({"used_ids": used, "history": history}, ensure_ascii=False, indent=2)
        + "\n",
        encoding="utf-8",
    )
    return True


def available_hot_posts(exclude_ids: Set[str] | None = None) -> List[dict]:
    excluded = set(exclude_ids or set()) | set(load_hot_used_ids())
    posts: List[dict] = []
    seen: Set[str] = set()
    for title in fetch_headlines():
        post = _format_news(title)
        pid = post["id"]
        if pid in excluded or pid in seen:
            continue
        seen.add(pid)
        posts.append(post)
    for post in FALLBACK_HOT_POSTS:
        pid = str(post.get("id") or "")
        if pid and pid not in excluded and pid not in seen:
            seen.add(pid)
            posts.append(dict(post))
    return posts


def pick_hot(
    *,
    session_used: Set[str] | None = None,
    planned_ids: Set[str] | None = None,
    day: date | None = None,
    slot: int = 0,
) -> dict:
    """未使用の見出し反応を1本。ニュースが無ければ定番文。"""
    day = day or date.today()
    exclude = set(session_used or set()) | set(planned_ids or set())
    posts = available_hot_posts(exclude)
    if posts:
        post = dict(posts[0])
        headline = str(post.get("headline") or "").strip()
        if headline:
            variant = sum(
                1 for pid in (session_used or set()) if str(pid).startswith("hot-")
            )
            post["text"] = _render(headline, variant)
        return post
    print(
        f"WARNING: hot pool exhausted day={day.isoformat()} slot={slot} → generic",
        file=sys.stderr,
    )
    return {
        "id": f"hot-generic-{day.isoformat()}-{slot}",
        "topic": "金融",
        "kind": "hot",
        "theme": "news",
        "text": (
            "今日の金融ニュース、見出しだけ流れてきた\n"
            "積立額は変えてない\n\n"
            "見る派、見ない派？"
        ),
    }


def contains_site_promo(texts: Sequence[str]) -> bool:
    blob = "\n".join(texts).lower()
    return "nisa-simulation.com" in blob
