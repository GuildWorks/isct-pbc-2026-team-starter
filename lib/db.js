// データの保存先（SQLite のファイル data.db）を開く。
// テーブルの形を変えたら、data.db を消すのではなく、チームで相談して移し方を決める。

import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';

const file = process.env.DB_PATH ?? path.join(import.meta.dirname, '..', 'data.db');
export const db = new DatabaseSync(file);

db.exec(`
  CREATE TABLE IF NOT EXISTS items (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    title      TEXT NOT NULL,
    body       TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
  )
`);

// 初めて起動したときだけ、見本の項目を3つ入れる
const { count } = db.prepare('SELECT COUNT(*) AS count FROM items').get();
if (count === 0) {
  const insert = db.prepare('INSERT INTO items (title, body) VALUES (?, ?)');
  insert.run('見本の項目 1', 'これは見本です。チームの題材に合わせて、項目の名前や中身を置き換えてください。');
  insert.run('見本の項目 2', '「追加」の画面から項目を増やせます。');
  insert.run('見本の項目 3', '詳細の画面から、AI に項目をひとことでまとめてもらえます（キーが無ければモックの応答）。');
}
