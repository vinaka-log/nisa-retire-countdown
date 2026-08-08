# Threads 自動投稿（みつき｜NISA「足りるか」確認係）

keiba-ev-app と同じく **GitHub Actions + Meta Threads Graph API** で投稿します。

- スクリプト: [`post.py`](./post.py) / [`ogiri_posts.py`](./ogiri_posts.py) / [`client.py`](./client.py)
- ワークフロー: [`.github/workflows/threads-daily.yml`](../../.github/workflows/threads-daily.yml)
- スケジュール: **毎日3回 JST（ジブリ大喜利・PRなし）**
  - **08:00 / 12:00 / 20:00** … 公式場面写真 + あるあるキャプション（URLなし・リプなし）
- 画像: [スタジオジブリ公式ギャラリー](https://www.ghibli.jp/)（「常識の範囲でご自由にお使いください」）
- 台帳: [`ogiri_ledger.json`](./ogiri_ledger.json)（一度きり。枯渇時のみ再利用）
- `SCHEDULE_ID` 変更で [`day_plans.json`](./day_plans.json) は自動再生成
- Actions 分節約のため、旧雑談補充の週次 cron は停止（手動のみ）

## 運用（手動は最小）

1. **プロフィール** … 下の推奨文言＋サイトリンクを反映（発見導線はプロフィール任せ）
2. **自動投稿に任せる** … 1日3本の大喜利
3. **来た通知だけ返す** … 自分の投稿へのコメントが来たら返信（任意）

投稿本文にシミュURL・アフィリエイトは入れない（PRなし）。

## プロフィール文言（推奨）

| 項目 | 推奨 |
|------|------|
| 表示名 | みつき｜NISA「足りるか」確認係 |
| リンク | `https://www.nisa-simulation.com` |

```
＼つみたての「足りるか不安」を数字に／
▶︎ 引退までの不足額が1分でわかる無料シミュ運営
▶︎ 銘柄おすすめはしない・投資助言ではないよ
▶︎ 毎日、ジブリ場面写真で大喜利してます
枠埋めより先に、距離を知ろう👇
```

## One-time setup

### 1. Meta Threads API

1. [Meta Developer](https://developers.facebook.com/) でアプリ作成（または既存アプリ）
2. **Threads** 製品を追加し、権限に `threads_basic` / `threads_content_publish` を含める
3. 長期アクセストークンと Threads **User ID** を控える

### 2. GitHub Secrets

| Secret | 内容 |
|------|------|
| `THREADS_ACCESS_TOKEN` | Meta 長期トークン |
| `THREADS_USER_ID` | Threads ユーザ ID |

### 3. 動作確認

1. Actions → **Threads daily post** → **Run workflow**
2. まず `dry_run = true` で本文＋画像URLを確認
3. 問題なければ `dry_run = false` で1回投稿

| slot | 時刻(JST) | 種類 |
|------|-----------|------|
| 0 | 08:00 | ogiri（ジブリ大喜利） |
| 1 | 12:00 | ogiri |
| 2 | 20:00 | ogiri |

## ローカル

```bash
cd /path/to/nisa-retire-countdown
python3 -m venv .venv-threads
source .venv-threads/bin/activate
pip install -r scripts/threads/requirements.txt

PYTHONPATH=scripts/threads python scripts/threads/post.py --dry-run
PYTHONPATH=scripts/threads python scripts/threads/post.py --list
PYTHONPATH=scripts/threads python scripts/threads/post.py --slot 0 --dry-run
PYTHONPATH=scripts/threads python scripts/threads/post.py --id ogiri-chihiro-yubaba-bill --dry-run
```

## 投稿文の追加

[`ogiri_posts.py`](./ogiri_posts.py) の `OGIRI_POSTS` に追記する。

- `kind=ogiri` … **画像＋短文・URLなし・リプなし**
- `image_url` … `https://www.ghibli.jp/gallery/{slug}{nnn}.jpg`
- キャプションは日常あるある（投資・PR禁止）
- 投稿成功後に [`ogiri_ledger.json`](./ogiri_ledger.json) へ記録

旧プール（`CASUAL_*` / `VALUE_*` / `CTA_*`）は `--id` 指定用に残しているが、スケジュールでは使わない。

## 失敗時の切り分け（GitHub Actions）

| 症状 | 原因 | 対処 |
|------|------|------|
| `Missing THREADS_ACCESS_TOKEN` | Secrets 未設定 | GitHub → Settings → Secrets に2つ登録 |
| `API失敗 ... is_transient ... code: 2` | Meta 側一時障害 | 自動リトライ。だめなら Re-run |
| 画像コンテナ失敗 | `image_url` が取れない / 処理待ち不足 | URL疎通と `THREADS_IMAGE_PUBLISH_DELAY_SEC`（既定20）を確認 |
| 想定時刻より遅い | GitHub cron の遅延 | 正常。slot は cron から渡す |

待ち時間:

- `THREADS_PUBLISH_DELAY_SEC` … TEXT（既定 8）
- `THREADS_IMAGE_PUBLISH_DELAY_SEC` … IMAGE（既定 20）
