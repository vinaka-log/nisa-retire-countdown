# Threads 自動投稿（みつきリタイア）

keiba-ev-app と同じく **GitHub Actions + Meta Threads Graph API** で投稿します。

- スクリプト: [`post.py`](./post.py) / [`posts.py`](./posts.py) / [`client.py`](./client.py)
- ワークフロー: [`.github/workflows/threads-daily.yml`](../../.github/workflows/threads-daily.yml)
- スケジュール: **毎日5回 JST**
  - **08:00 / 12:00 / 20:00** … 価値発信のみ（リンクなし・リプなし）
  - **10:00 / 18:00** … 教育＋自分リプにURL
- 誘導枠の導線: 本投稿はリンクなし → 自分リプで「続きを見る」＋URL
- 方針: [@ai_syuhu](https://www.threads.com/@ai_syuhu) 型＝**教育で信頼、誘導は1日2回に絞る**

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

### 3. 動作確認

1. Actions → **Threads daily post** → **Run workflow**
2. まず `dry_run = true` で本文ログを確認
3. 問題なければ `dry_run = false` で1回投稿
4. 以降は毎日5回のスケジュールに任せる

手動実行時に特定文だけ試す場合は、`post_id` に例: `val-checklist` / `cta-gap-check` を入れる。  
日内枠は `slot`:

| slot | 時刻(JST) | 種類 |
|------|-----------|------|
| 0 | 08:00 | value（リンクなし） |
| 1 | 10:00 | cta（リプにURL） |
| 2 | 12:00 | value |
| 3 | 18:00 | cta |
| 4 | 20:00 | value |

## ローカル

```bash
cd /path/to/nisa-retire-countdown
python3 -m venv .venv-threads
source .venv-threads/bin/activate
pip install -r scripts/threads/requirements.txt

# 本文だけ
python scripts/threads/post.py --dry-run
python scripts/threads/post.py --list
python scripts/threads/post.py --id gap-reveal-1 --dry-run
python scripts/threads/post.py --slot 0 --dry-run
python scripts/threads/post.py --slot 1 --dry-run
python scripts/threads/post.py --id cta-gap-check --dry-run

# 本番投稿（要 env）
export THREADS_ACCESS_TOKEN=...
export THREADS_USER_ID=...
python scripts/threads/post.py --publish
```

## 投稿文の追加・編集

[`posts.py`](./posts.py) の `VALUE_POSTS` / `CTA_POSTS` に追記する。  
- `kind=value` … `text` のみ（URL禁止）  
- `kind=cta` … `text` + `reply`（URLは reply のみ）

### 書くときの型（アフィにつなげる）

1. **1日3回（value）** … 悩みの言語化 / リスト / 誤解の訂正 / 問いかけ（リンクなし）
2. **1日2回（cta）** … 短く価値 → 自分リプでシミュ／ガイドURL
3. **サイト** … ギャップ確認のあと SoftAffiliateCta（マネックス・エポス）

❌ 本投稿で口座・カードの売り込み  
⭕ ほとんどの投稿は価値だけ。誘導は少数枠に集約

投資助言・銘柄推奨・誇大表現は入れない（サイトの免責と揃える）。  
トーンはみつきらしい軽さ＋絵文字可（勧誘っぽくしすぎない）。

## keiba-ev-app との違い

| | keiba-ev-app | みつきリタイア |
|--|--------------|----------------|
| 頻度 | 発走前・朝・夜（高頻度） | 毎日5回（value3 + cta2） |
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
