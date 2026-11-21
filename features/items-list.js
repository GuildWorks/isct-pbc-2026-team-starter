// 機能: 項目の一覧（画面と API）

import { db } from '../lib/db.js';
import { sendHtml, sendJson } from '../lib/http.js';
import { page, escapeHtml } from '../lib/html.js';

function listItems() {
  return db.prepare('SELECT id, title, body, created_at FROM items ORDER BY id DESC').all();
}

export const routes = [
  {
    method: 'GET',
    path: '/',
    handler: ({ res }) => {
      const items = listItems();
      const list = items.length
        ? `<ul class="items">
      ${items
        .map(
          (item) => `<li>
        <a href="/items/${item.id}">${escapeHtml(item.title)}</a>
        <span class="meta">${escapeHtml(item.created_at)}</span>
      </li>`,
        )
        .join('\n      ')}
    </ul>`
        : '<p>まだ項目がありません。「追加」から足してください。</p>';
      sendHtml(res, 200, page('一覧', list));
    },
  },
  {
    method: 'GET',
    path: '/api/items',
    handler: ({ res }) => sendJson(res, 200, listItems()),
  },
];
