# Threads 自動投稿（みつき｜NISA「足りるか」確認係）

keiba-ev-app と同じく **GitHub Actions + Meta Threads Graph API** で投稿します。

- スクリプト: [`post.py`](./post.py) / [`posts.py`](./posts.py) / [`client.py`](./client.py)
- ワークフロー: [`.github/workflows/threads-daily.yml`](../../.github/workflows/threads-daily.yml)
- スケジュール: **毎日10回 JST（雑談8 : 誘導2）**
  - **07:00 / 08:00 / 10:00 / 15:00 / 17:00 / 18:30 / 21:00 / 22:30** … 雑談（手書き + 自動生成・リンクなし・**一度きり**）
  - **12:00 / 20:00** … 教育＋自分リプにURL（誘導は1日2回）
- 雑談補充: [`chitchat_gen.py`](./chitchat_gen.py) + [`.github/workflows/threads-casual-refill.yml`](../../.github/workflows/threads-casual-refill.yml)（週次 / 残数不足時）
- 誘導枠の導線: 本投稿はリンクなし＋「続きはリプ👇」→ 自分リプで教育 → 最終リプにURL
- 方針: フォロワー少期は**雑談8割**で接点を作り、誘導は少数。価値発信・数字ネタプールはコードに残置（枠復帰用）

## 運用（手動は最小）

**必須はプロフィール整備だけ。** 他アカへのリプ回りはしない（自動もやらない）。

1. **プロフィール** … 下の推奨文言＋サイトリンクを反映
2. **自動投稿に任せる** … 08 / 10 / 12 / 18 / 20（JST）
3. **来た通知だけ返す** … 自分の投稿へのコメントが来たら返信（任意・無理しない）

伸びはゆっくりになりやすいが、運用負荷とBANリスクを優先する方針。

## プロフィール文言（推奨）

ポジションは **「足りるか不安な人の確認係」**。始め方・銘柄・満額自慢と被らない。

| 項目 | 推奨 |
|------|------|
| 表示名 | みつき｜NISA「足りるか」確認係 |
| ユーザー名 | （既存のまま。変えるとプロフィールURLが変わるため） |
| リンク | `https://www.nisa-simulation.com` |

表示名はThreads内検索の対象。「NISA」を含めて発見性を確保しつつ、「リタイア」はFIRE自慢系と誤認されやすいため外した（2026-08 競合調査）。

**自己紹介（推奨・そのまま貼付）**

競合調査（2026-08）より: 伸びているNISA系アカウントは「＼キャッチ／1行目 + ▶︎箇条書き + 数字 + 最終行にリンクCTA👇」の構成。数字が3つ以上あるプロフィールはフォロー転換率が約1.5〜1.8倍。

```
＼つみたての「足りるか不安」を数字に／
▶︎ 引退までの不足額が1分でわかる無料シミュ運営
▶︎ 銘柄おすすめはしない・投資助言ではないよ
▶︎ 毎日、積立の失敗談と数字ネタを投稿中
枠埋めより先に、距離を知ろう👇
```

旧版（参考）:

```
つみたて続けてるのに不安が消えない人へ
引退まで「足りるか」を数字で見る係
無料ギャップシミュ運営｜投資助言ではないよ
枠埋めより先に、距離を知ろう
```

❌ 避ける: 〇年で〇万／銘柄おすすめ／NISA始め方完全ガイド／実績の捏造  
⭕ 入れる: 不安の言語化・ギャップ・無料・助言ではない・リンクへのCTA👇

## One-time setup

### 1. Meta Threads API

1. [Meta Developer](https://developers.facebook.com/) でアプリ作成（または既存アプリ）
2. **Threads** 製品を追加し、権限に次を含める  
   - `threads_basic` / `threads_content_publish`（投稿必須）  
   - `threads_manage_replies`（**自分リプ連鎖・reply_to_id 用。無いと code 10 になりやすい**）
3. テストユーザー or 本番権限で長期アクセストークンを発行
4. Threads の **User ID** を控える

権限エラー（code 10）が出たら:

1. `threads_content_publish` を確認
2. 長期トークンを再発行
3. GitHub Secret `THREADS_ACCESS_TOKEN` を更新

### 2. GitHub Secrets

Repo → **Settings → Secrets and variables → Actions**:

| Secret | 内容 |
|--------|------|
| `THREADS_ACCESS_TOKEN` | Meta 長期トークン |
| `THREADS_USER_ID` | Threads ユーザ ID |
| `OPENAI_API_KEY` | （任意）`--mode openai` を使うときだけ |

### 3. 動作確認

1. Actions → **Threads daily post** → **Run workflow**
2. まず `dry_run = true` で本文ログを確認
3. 問題なければ `dry_run = false` で1回投稿
4. 以降は毎日5回のスケジュールに任せる

手動実行時に特定文だけ試す場合は、`post_id` に例: `val-checklist` / `cta-gap-check` を入れる。  
日内枠は `slot`:

| slot | 時刻(JST) | 種類 |
|------|-----------|------|
| 0 | 07:00 | casual（雑談・リンクなし） |
| 1 | 08:00 | casual |
| 2 | 10:00 | casual |
| 3 | 12:00 | cta（最終リプにURL） |
| 4 | 15:00 | casual |
| 5 | 17:00 | casual |
| 6 | 18:30 | casual |
| 7 | 20:00 | cta |
| 8 | 21:00 | casual |
| 9 | 22:30 | casual |

## ローカル

```bash
cd /path/to/nisa-retire-countdown
python3 -m venv .venv-threads
source .venv-threads/bin/activate
pip install -r scripts/threads/requirements.txt

# 本文だけ
python scripts/threads/post.py --dry-run
python scripts/threads/post.py --list
python scripts/threads/post.py --id val-checklist --dry-run
python scripts/threads/post.py --slot 0 --dry-run
python scripts/threads/post.py --slot 1 --dry-run
python scripts/threads/post.py --id cta-gap-check --dry-run

# 雑談の自動追加（APIなし・chitchat_gen）
python scripts/threads/chitchat_gen.py --dry-run --count 8
python scripts/threads/chitchat_gen.py --refill

# 本番投稿（要 env）
export THREADS_ACCESS_TOKEN=...
export THREADS_USER_ID=...
python scripts/threads/post.py --publish
```

## 雑談の自動追加（chitchat_gen）

**ChatGPT API 不要。** [`chitchat_gen.py`](./chitchat_gen.py) が人間向けに書いた完成文プールから未使用分を取り出し、`casual_generated.json` に追加する。  
場面×反応の機械的な組み合わせはしない（口調が不自然になるため）。

手書き（`CASUAL_HAND_POSTS`）＋ chitchat_gen 追加分を結合。投稿後は [`casual_ledger.json`](./casual_ledger.json) で**再利用しない**。

| ファイル / スクリプト | 役割 |
|------------------------|------|
| [`chitchat_gen.py`](./chitchat_gen.py) | 雑談の自動追加（完成文バンク） |
| [`casual_generated.json`](./casual_generated.json) | 追加結果の保存先 |
| [`threads-casual-refill.yml`](../../.github/workflows/threads-casual-refill.yml) | 週次で残数を見て補充 → commit |

文体ルール:
- オチ・教訓なし、途中で終わる口語
- 絵文字は基本なし（ハート／✨系は禁止）
- 投資・NISA・URL禁止
- **一日の整合性**: `casual_consistency.py` が「今日ジム行った/サボった」「出社/在宅」「朝/昼/夜」の衝突を避けて枠を選ぶ

補充（`--refill`）: 未使用残が24未満なら目標48まで追加。バンク不足時は `CHITCHAT_BANK` に文面を足す。

```bash
PYTHONPATH=scripts/threads python scripts/threads/chitchat_gen.py --count 16
PYTHONPATH=scripts/threads python scripts/threads/chitchat_gen.py --refill
```

Actions → **Threads chitchat_gen refill** → Run workflow（APIキー不要）。

## 投稿文の追加・編集

[`posts.py`](./posts.py) の `CASUAL_HAND_POSTS` / `CTA_POSTS` に追記する（主力）。  
自動追加分は `chitchat_gen.py` 経由で `casual_generated.json` へ。  
`VALUE_POSTS` / `FAIL_STORY_POSTS` / `num_posts.py` は枠を戻すとき用に残している。  
- `kind=casual` … **1投稿完結・URLなし**。ギャル / 仕事憂鬱 / 筋トレ / どうでもいい雑談  
  - オチをきれいに着地させない。途中で終わる口調  
  - 絵文字は基本なし（ハート／✨系禁止）  
  - **一度きり**: 投稿成功後に [`casual_ledger.json`](./casual_ledger.json) へ記録し、再利用しない  
  - 枯渇時は value にフォールバック。`chitchat_gen.py` / 週次 Actions で補充  
  
- `kind=cta` … `text` + `replies`（推奨）または `reply`（単発）  
  - 本投稿末尾に **「続きはリプ👇」**  
  - 自分リプは **フック本投稿 → 教育リプ → 最終リプにURL** の連鎖可  
  - **URLは最終リプのみ**（本投稿・途中リプにリンク禁止）

### 書くときの型（アフィにつなげる）

1. **1日8回（casual）** … 日常雑談で接点（投資の話は出さない）
2. **1日2回（cta）** … 短くフック → 自分リプで教育 → 最終リプでシミュ／ガイドURL
3. **サイト** … ギャップ確認のあと SoftAffiliateCta（マネックス・エポス）

ポジションは **「足りるか（ギャップ）」**。始め方・銘柄戦争には入らない。  
他アカへのリプ回り・自動エンゲージはしない。

❌ 本投稿で口座・カードの売り込み  
⭕ ほとんどの投稿は雑談。誘導は少数枠に集約

投資助言・銘柄推奨・誇大表現は入れない（サイトの免責と揃える）。  
**ハート系絵文字（💕❤️🫶等）は使わない**。

## keiba-ev-app との違い

| | keiba-ev-app | みつきリタイア |
|--|--------------|----------------|
| 頻度 | 発走前・朝・夜（高頻度） | 毎日5回（value4 + cta1） |
| 台帳 | Postgres `threads_post_ledger` | 日付×枠ローテ（value/cta別プール） |
| 内容 | 予想・的中 | 教育中心＋少数のリプ誘導 |

## 失敗時の切り分け（GitHub Actions）

| 症状 | 原因 | 対処 |
|------|------|------|
| `Missing THREADS_ACCESS_TOKEN` | Secrets 未設定 | GitHub → Settings → Secrets に2つ登録 |
| `API失敗 ... is_transient ... code: 2` | Meta 側一時障害 | 自動リトライ（最大4回）。それでも失敗なら Actions で Re-run |
| `code: 10` / permission（reply） | `reply_to_id` に権限不足 | Meta で `threads_manage_replies` 追加→トークン再発行 |
| `PARTIAL` / reply failed | 親は成功・リプ失敗 | ジョブは成功扱い。権限と `THREADS_REPLY_GAP_SEC` を確認 |
| 想定時刻より1時間以上遅い | GitHub cron の遅延 | 正常。slot は cron から渡すので誤ローテは起きにくい |

待ち時間（環境変数・既定値）:

- `THREADS_PUBLISH_DELAY_SEC` … コンテナ作成→publish（既定 8）
- `THREADS_REPLY_GAP_SEC` … 親公開→リプ作成（既定 5）
