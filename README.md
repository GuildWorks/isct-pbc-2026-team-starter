# isct-pbc-2026-team-starter

東京科学大学 プログラミングブートキャンプ 2026 のラーニングフェーズ4回目で使う、チーム開発のスターターです。
題材を持たない「項目（item）」の一覧・詳細・追加と、AI 機能の例が1つだけ入っています。チームの題材に置き換えて使います。

依存パッケージはありません。Node.js 24 以上だけで動きます。

## 動かし方

```bash
npm start
```

ブラウザで http://localhost:3000 を開きます。止めるときはターミナルで Ctrl+C。

`npm start` は `node --env-file-if-exists=.env server.js` と同じです。初めて起動すると `data.db` ができ、見本の項目が3つ入ります。

起動したときに次の2行が出ることがありますが、問題ありません。

- `.env not found. Continuing without it.`（`.env` をまだ作っていない。AI 機能はモックで動く）
- `ExperimentalWarning: SQLite is an experimental feature ...`（Node.js 標準の SQLite が「試験中」の扱いであるという知らせ）

## テスト

```bash
node --test
```

`test/` の下のテストを動かします。テストは実際の Gemini を呼びません。

## AI 機能（Gemini）

キーが無いうちは、AI 機能はモックの応答で動きます。画面と流れはモックのまま作れます。

実際の Gemini で試すとき:

1. Google AI Studio（https://aistudio.google.com/apikey）でキーを取る（個人の Google アカウントで）
2. `.env.example` をコピーして `.env` を作り、`GEMINI_API_KEY=` の後ろにキーを書く
3. サーバーを起動し直す

注意:

- `.env` はコミットしません（`.gitignore` に入っています）。キーはチームで共有せず、各自の `.env` に各自のキーを置きます。
- 無料枠には上限があります（1分あたり・1日あたりの回数）。上限に達すると「上限に達しました」と出ます。少し待つか、`.env` のキーを消してモックで続けます。
- 無料枠に送った入力と出力は、Google が製品改善に使います。個人情報や秘密を送らないでください。

## ファイルの構成

| 場所 | 中身 | 誰が触るか |
|---|---|---|
| `features/` | 機能ごとに1ファイル（画面と API）。新しい機能はここにファイルを足す | 機能の担当者 |
| `shared/nav.js` | 画面の上のナビ。機能を足したらリンクを1行足す | 全員（コンフリクトが起きやすい） |
| `lib/` | 全員が使う道具（DB、HTML、HTTP、Gemini の呼び出し） | 直すときはチームに一言 |
| `public/style.css` | 見た目 | 誰でも |
| `test/` | `node --test` で動くテスト | 機能の担当者 |
| `server.js` | `features/` を読み込んで動かす入り口。ふだんは触らない | |
| `CLAUDE.md` | チームの約束ごと。空欄をチームで埋める | 全員（PR で） |
| `.claude/settings.json` | Claude Code に触らせないもの（`.env` の読み取り、main への push など） | |
| `.claude/skills/write-pr/` | 「PR を書いて」と頼んだときのやり方 | |

## 機能の足し方

1. ブランチを切る（例: 「`add-deadline` というブランチを切って」と Claude に頼む）
2. `features/` に新しいファイルを作り、`routes` を書き出す（`features/item-detail.js` が見本）
3. `shared/nav.js` にリンクを1行足す
4. 手で確かめ、テストを足し、PR を出す（「PR を書いて」）
