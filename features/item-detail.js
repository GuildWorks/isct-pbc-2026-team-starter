// 機能: 項目の詳細（画面と API）

import { db } from '../lib/db.js';
import { sendHtml, sendJson } from '../lib/http.js';
import { page, escapeHtml } from '../lib/html.js';

export function getItem(id) {
  return db.prepare('SELECT id, title, body, created_at FROM items WHERE id = ?').get(Number(id));
}

export const routes = [
  {
    method: 'GET',
    path: '/items/:id',
    handler: ({ res, params }) => {
      const item = getItem(params.id);
      if (!item) return sendHtml(res, 404, page('見つかりません', '<p>この項目はありません。</p>'));
      sendHtml(
        res,
        200,
        page(
          item.title,
          `<p class="meta">${escapeHtml(item.created_at)}</p>
    <p class="body">${escapeHtml(item.body)}</p>
    <p><a href="/items/${item.id}/summary">AI でひとことにまとめる</a></p>`,
        ),
      );
    },
  },
  {
    method: 'GET',
    path: '/api/items/:id',
    handler: ({ res, params }) => {
      const item = getItem(params.id);
      if (!item) return sendJson(res, 404, { error: 'この項目はありません' });
      sendJson(res, 200, item);
    },
  },
];
