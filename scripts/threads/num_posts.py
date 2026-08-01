"""数字ネタ投稿の自動生成（みつき｜NISA「足りるか」確認係）.

複利・逆算・取り崩し・開始時期の4形式を、パラメータの組み合わせで
毎回計算して生成する。固定文プールと違い内容が日々変わるので、
1日4本出しても文面が重複しない。

ルール:
  - URL禁止（value枠と同じ）
  - 前提（年利・単純計算・税費用未考慮）と「投資助言ではないよ」を必ず明記
  - 銘柄名は出さない
  - 本投稿はクイズ形式で「答えはリプ👇」、リプの最後は問いかけ
"""

from __future__ import annotations

from datetime import date
from itertools import product
from typing import List, Tuple


def _fv_man(monthly_man: float, years: int, rate_pct: float) -> float:
    """毎月末積立・月次複利の将来価値（万円）。"""
    r = rate_pct / 100 / 12
    n = years * 12
    if r == 0:
        return monthly_man * n
    return monthly_man * (((1 + r) ** n - 1) / r)


def _monthly_for_target_man(target_man: float, years: int, rate_pct: float) -> float:
    """目標額（万円）に必要な毎月積立額（万円）。"""
    r = rate_pct / 100 / 12
    n = years * 12
    if r == 0:
        return target_man / n
    return target_man * r / ((1 + r) ** n - 1)


def _round_man(v: float) -> int:
    """万円を見やすく丸める（1,000万超は10万円単位、それ以下は1万円単位）。"""
    return int(round(v, -1)) if v >= 1000 else int(round(v))


# --- 形式ごとのパラメータ空間（決定的ローテ用） ---
_FV_PARAMS: List[Tuple[float, int, float]] = list(
    product((1, 2, 3, 5, 7, 10), (10, 15, 20, 25, 30), (3.0, 5.0, 7.0))
)  # 90通り
_REVERSE_PARAMS: List[Tuple[int, int, float]] = list(
    product((1000, 1500, 2000, 3000), (10, 15, 20, 25, 30), (3.0, 5.0))
)  # 40通り
_WITHDRAW_PARAMS: List[Tuple[float, float]] = list(
    product((5, 8, 10, 12, 15, 20, 25, 30), (4.0, 3.0))
)  # 16通り（4%ルール / 保守的な3%ルール）
_LATE_PARAMS: List[Tuple[float, float, int, int]] = list(
    product((1, 3, 5), (3.0, 5.0), ((25, 35), (30, 40), (35, 45)))
)
_LATE_PARAMS = [(m, r, a[0], a[1]) for (m, r, a) in _LATE_PARAMS]  # 18通り

_FORMATS = ("fv", "reverse", "withdraw", "late")

_DISCLAIMER = "※税金・手数料は考慮しない単純計算だよ\n※投資助言ではないよ"


def _gen_fv(i: int) -> dict:
    m, y, r = _FV_PARAMS[i % len(_FV_PARAMS)]
    principal = int(m * 12 * y)
    fv = _round_man(_fv_man(m, y, r))
    gain = fv - principal
    return {
        "id": f"num-fv-{m}-{y}-{int(r)}",
        "topic": "積立投資",
        "kind": "num",
        "text": (
            f"【数字クイズ】\n"
            f"月{m:g}万円を{y}年、年利{r:g}%でつみたてたら\n"
            f"いくらになると思う？💭\n\n"
            f"ちなみに元本は{principal:,}万円。\n"
            f"答えはリプ👇"
        ),
        "replies": [
            (
                f"答え: 約{fv:,}万円✨\n\n"
                f"・元本 {principal:,}万円\n"
                f"・運用益 約{gain:,}万円\n\n"
                f"※年利{r:g}%固定・毎月積立で計算\n"
                f"{_DISCLAIMER}\n\n"
                f"想像より多かった？少なかった？"
            ),
        ],
    }


def _gen_reverse(i: int) -> dict:
    target, y, r = _REVERSE_PARAMS[i % len(_REVERSE_PARAMS)]
    monthly_yen = int(round(_monthly_for_target_man(target, y, r) * 10000, -2))
    return {
        "id": f"num-rev-{target}-{y}-{int(r)}",
        "topic": "資産形成",
        "kind": "num",
        "text": (
            f"【逆算クイズ】\n"
            f"{y}年後に{target:,}万円ほしいなら、\n"
            f"月いくら積み立てればいい？💭\n\n"
            f"年利{r:g}%想定での答え、リプに置いた👇"
        ),
        "replies": [
            (
                f"答え: 月 約{monthly_yen:,}円✨\n\n"
                f"「{target:,}万円」って聞くと遠いけど、\n"
                f"月額にすると具体的に見えてくるよね💭\n\n"
                f"※年利{r:g}%固定・毎月積立で計算\n"
                f"{_DISCLAIMER}\n\n"
                f"この月額、いける？きつい？"
            ),
        ],
    }


def _gen_withdraw(i: int) -> dict:
    w, rule = _WITHDRAW_PARAMS[i % len(_WITHDRAW_PARAMS)]
    need = int(w * 12 / (rule / 100))
    yearly = int(w * 12)
    rule_note = "有名な「4%ルール」" if rule == 4.0 else "保守的な「3%ルール」"
    return {
        "id": f"num-wd-{w:g}-{rule:g}",
        "topic": "老後資金",
        "kind": "num",
        "text": (
            f"【取り崩しクイズ】\n"
            f"引退後、月{w:g}万円を運用しながら取り崩すなら\n"
            f"資産はいくら必要だと思う？💭\n\n"
            f"{rule_note}で計算した答え、リプ👇"
        ),
        "replies": [
            (
                f"答え: 約{need:,}万円✨\n\n"
                f"計算はシンプルで、年間{yearly:,}万円 ÷ {rule:g}%。\n\n"
                f"※取り崩しルールは米国の過去データ由来の目安で、将来を保証しないよ\n"
                f"{_DISCLAIMER}\n\n"
                f"月{w:g}万円の暮らし、あなたなら足りる？"
            ),
        ],
    }


def _gen_late(i: int) -> dict:
    m, r, a1, a2 = _LATE_PARAMS[i % len(_LATE_PARAMS)]
    goal = 65
    fv1 = _round_man(_fv_man(m, goal - a1, r))
    fv2 = _round_man(_fv_man(m, goal - a2, r))
    diff = fv1 - fv2
    return {
        "id": f"num-late-{m:g}-{int(r)}-{a1}",
        "topic": "資産形成",
        "kind": "num",
        "text": (
            f"【差がつくクイズ】\n"
            f"月{m:g}万円・年利{r:g}%、まったく同じ条件で\n"
            f"{a1}歳から始めた人と{a2}歳から始めた人。\n\n"
            f"65歳の時点でいくら差がつくと思う？💭\n"
            f"答えはリプ👇"
        ),
        "replies": [
            (
                f"答え: 差は約{diff:,}万円✨\n\n"
                f"・{a1}歳スタート → 約{fv1:,}万円\n"
                f"・{a2}歳スタート → 約{fv2:,}万円\n\n"
                f"※年利{r:g}%固定・毎月積立で計算\n"
                f"{_DISCLAIMER}\n\n"
                f"とはいえ、いつ始めても「今日がいちばん若い日」だよ🙌\n"
                f"何歳で始めた？これから？"
            ),
        ],
    }


_GENERATORS = {
    "fv": _gen_fv,
    "reverse": _gen_reverse,
    "withdraw": _gen_withdraw,
    "late": _gen_late,
}


def generate_num_post(day: date, kind_index: int, per_day: int) -> dict:
    """日付×枠から決定的に数字ネタを1本生成する。

    形式は枠ごとにローテし、パラメータは日が進むごとにずれる。
    """
    emit = day.toordinal() * per_day + kind_index
    fmt = _FORMATS[emit % len(_FORMATS)]
    param_index = emit // len(_FORMATS)
    return _GENERATORS[fmt](param_index)
