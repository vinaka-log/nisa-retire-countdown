# Threads 自動投稿（みつきリタイア）

keiba-ev-app と同じく **GitHub Actions + Meta Threads Graph API** で投稿します。

- スクリプト: [`post.py`](./post.py) / [`posts.py`](./posts.py) / [`client.py`](./client.py)
- ワークフロー: [`.github/workflows/threads-daily.yml`](../../.github/workflows/threads-daily.yml)
- スケジュール: **毎日 08:00 / 12:00 / 20:00 JST**（手動実行も可）
- 導線: **本投稿はリンクなし** → **自分リプで「続きを見る」＋URL**（リーチ低下を避ける型）

## One-time setup

### 1. Meta Threads API

1. [Meta Developer](https://developers.facebook.com/) でアプリ作成（または既存アプリ）
2. **Threads** 製品を追加し、権限に `threads_basic` / `threads_content_publish` を含める
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
4. 以降は毎日3回のスケジュールに任せる

手動実行時に特定文だけ試す場合は、`post_id` に例: `gap-reveal-1` を入れる。  
日内枠を固定したい場合は `slot` に `0`（朝）/ `1`（昼）/ `2`（夜）を指定する。

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
python scripts/threads/post.py --slot 2 --dry-run

# 本番投稿（要 env）
export THREADS_ACCESS_TOKEN=...
export THREADS_USER_ID=...
python scripts/threads/post.py --publish
```

## 投稿文の追加・編集

[`posts.py`](./posts.py) の `POSTS` に追記する。  
各投稿は `text`（本投稿・URLなし）と `reply`（自分リプ・URLあり）。  
ローテーションは `(日付 × 3 + slot) % len(POSTS)`（同日の朝・昼・夜で別文）。

投資助言・銘柄推奨・誇大表現は入れない（サイトの免責と揃える）。  
トーンはみつきらしい軽さ＋絵文字可（勧誘っぽくしすぎない）。

## keiba-ev-app との違い

| | keiba-ev-app | みつきリタイア |
|--|--------------|----------------|
| 頻度 | 発走前・朝・夜（高頻度） | 毎日3回（8/12/20 JST） |
| 台帳 | Postgres `threads_post_ledger` | 日付×枠ローテ |
| 内容 | 予想・的中 | 固定プールの集客コピー |
