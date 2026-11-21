// 機能: 項目の追加（画面と API）

import { db } from '../lib/db.js';
import { readBody, redirect, sendHtml, sendJson } from '../lib/http.js';
import { page, escapeHtml } from '../lib/html.js';

const MAX_TITLE = 100;
const MAX_BODY = 2000;

// 入力を確かめる。問題があればエラーの文を返す
export function validate({ title, body }) {
  const errors = [];
  if (!title || !String(title).trim()) errors.push('名前を入れてください');
  if (String(title ?? '').length > MAX_TITLE) errors.push(`名前は ${MAX_TITLE} 文字までです`);
  if (String(body ?? '').length > MAX_BODY) errors.push(`説明は ${MAX_BODY} 文字までです`);
  return errors;
}

function addItem({ title, body }) {
  const result = db
    .prepare('INSERT INTO items (title, body) VALUES (?, ?)')
    .run(String(title).trim(), String(body ?? '').trim());
  return Number(result.lastInsertRowid);
}

function form({ title = '', body = '' } = {}, errors = []) {
  const errorList = errors.length
    ? `<ul class="errors">${errors.map((e) => `<li>${escapeHtml(e)}</li>`).join('')}</ul>`
    : '';
  return `${errorList}
    <form method="post" action="/items">
      <label>名前 <input name="title" required maxlength="${MAX_TITLE}" value="${escapeHtml(title)}"></label>
      <label>説明 <textarea name="body" rows="5" maxlength="${MAX_BODY}">${escapeHtml(body)}</textarea></label>
      <button type="submit">追加する</button>
    </form>`;
}

export const routes = [
  {
    method: 'GET',
    path: '/items/new',
    handler: ({ res }) => sendHtml(res, 200, page('追加', form())),
  },
  {
    // 画面のフォームから送られてくる
    method: 'POST',
    path: '/items',
    handler: async ({ req, res }) => {
      const input = await readBody(req);
      const errors = validate(input);
      if (errors.length) return sendHtml(res, 400, page('追加', form(input, errors)));
      redirect(res, `/items/${addItem(input)}`);
    },
  },
  {
    // JSON で送られてくる（{ "title": "...", "body": "..." }）
    method: 'POST',
    path: '/api/items',
    handler: async ({ req, res }) => {
      let input;
      try {
        input = await readBody(req);
      } catch {
        return sendJson(res, 400, { errors: ['JSON として読めませんでした'] });
      }
      const errors = validate(input);
      if (errors.length) return sendJson(res, 400, { errors });
      sendJson(res, 201, { id: addItem(input) });
    },
  },
];
