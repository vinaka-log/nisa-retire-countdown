# Threads 自動投稿（みつき｜NISA「足りるか」確認係）

keiba-ev-app と同じく **GitHub Actions + Meta Threads Graph API** で投稿します。

- スクリプト: [`post.py`](./post.py) / [`ogiri_posts.py`](./ogiri_posts.py) / [`client.py`](./client.py)
- ワークフロー: [`.github/workflows/threads-daily.yml`](../../.github/workflows/threads-daily.yml)
- スケジュール: **毎日10回 JST**（repo は public のため Actions 枠は消費しない）
  - 雑談 6 / ホットな金融トピック 4（サイトURLなし）
- 画像: [スタジオジブリ公式ギャラリー](https://www.ghibli.jp/)（「常識の範囲でご自由にお使いください」）
- 台帳: [`casual_ledger.json`](./casual_ledger.json)（雑談一度きり）
  / [`hot_ledger.json`](./hot_ledger.json)（金融トピック一度きり）
  / [`ogiri_ledger.json`](./ogiri_ledger.json)（旧・大喜利。スケジュールでは未使用）
- `SCHEDULE_ID` 変更で [`day_plans.json`](./day_plans.json) は自動再生成
- 雑談プール補充は [threads-casual-refill.yml](../../.github/workflows/threads-casual-refill.yml) を手動実行

## 運用（手動は最小）

1. **プロフィール** … 下の推奨文言＋サイトリンクを反映（発見導線はプロフィール任せ）
2. **自動投稿に任せる** … 1日10本
3. **来た通知だけ返す** … 自分の投稿へのコメントが来たら返信（任意）

投稿本文にサイトURLは入れない。発見導線はプロフィールのリンクだけ。
金融トピックは直近見出しへの反応（銘柄推奨・投資助言禁止）。見出しが取れない日は定番の反応文。

## プロフィール文言（推奨）

NISA系Threadsの定番（＼見出し／・実績数字・FP肩書き・▶︎箇条書き・DM相談・公式LINE）は使わない。
人のプロフィールに見える長さにする（Threads / Instagram は 150字）。リンク欄にサイトがあるので、本文でシミュを売らない。
スタジアム観戦回数などは投稿ネタ用。プロフィールには書かない。

| 項目 | 推奨 |
|------|------|
| 表示名 | みつき |
| リンク | `https://www.nisa-simulation.com` |

```
20代後半、都内IT会社員
ジムと美容とFC東京が好き
つみたてNISAは2025年からオルカン
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
| 0 | 08:00 | hot（金融トピック） |
| 1 | 09:30 | casual（雑談） |
| 2 | 11:00 | casual |
| 3 | 12:30 | hot |
| 4 | 14:00 | casual |
| 5 | 16:00 | hot |
| 6 | 18:00 | casual |
| 7 | 19:30 | casual |
| 8 | 21:00 | hot |
| 9 | 22:00 | casual |

## ローカル

```bash
cd /path/to/nisa-retire-countdown
python3 -m venv .venv-threads
source .venv-threads/bin/activate
pip install -r scripts/threads/requirements.txt

PYTHONPATH=scripts/threads python scripts/threads/post.py --dry-run
PYTHONPATH=scripts/threads python scripts/threads/post.py --list
PYTHONPATH=scripts/threads python scripts/threads/post.py --slot 0 --dry-run
PYTHONPATH=scripts/threads python scripts/threads/post.py --slot 1 --dry-run
PYTHONPATH=scripts/threads python scripts/threads/post.py --id ogiri-chihiro-yubaba-bill --dry-run
```

## 投稿文の追加

[`ogiri_posts.py`](./ogiri_posts.py) に追記する。

- `OGIRI_POSTS` / `kind=ogiri` … 生活あるある（投資・PR禁止）
- `OGIRI_FIN_POSTS` / `kind=ogiri_fin` … NISA・物価・貯蓄あるある（銘柄名・URL禁止）
- `image_url` … `https://www.ghibli.jp/gallery/{slug}{nnn}.jpg`
- 投稿成功後に [`ogiri_ledger.json`](./ogiri_ledger.json) へ記録

雑談は `CASUAL_HAND_POSTS` / `casual_generated.json`。金融トピックは [`hot_posts.py`](./hot_posts.py)（使用済みは `hot_ledger.json`）。

## 失敗時の切り分け（GitHub Actions）

| 症状 | 原因 | 対処 |
|------|------|------|
| `Missing THREADS_ACCESS_TOKEN` | Secrets 未設定 | GitHub → Settings → Secrets に2つ登録 |
| `API失敗 ... is_transient ... code: 2` | Meta 側一時障害 | 自動リトライ。だめなら Re-run |
| 画像コンテナ失敗 | `image_url` が取れない / 処理待ち不足 | URL疎通と `THREADS_IMAGE_PUBLISH_DELAY_SEC`（既定20）を確認 |
| 想定時刻より遅い | GitHub cron の遅延 | 正常。slot は cron から渡す |
| 雑談枯渇 | casual プール不足 | `threads-casual-refill` を手動実行 |

待ち時間:

- `THREADS_PUBLISH_DELAY_SEC` … TEXT（既定 8）
- `THREADS_IMAGE_PUBLISH_DELAY_SEC` … IMAGE（既定 20）
