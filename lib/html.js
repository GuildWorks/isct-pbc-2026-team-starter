// 画面の外枠（ヘッダー・ナビ・本文）を組み立てる道具。

import { nav } from '../shared/nav.js';

// 利用者の入力や AI の出力を画面に出すときは、必ずこれを通す（HTML として解釈させない）
export function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export const APP_NAME = 'チームのアプリ（名前を決める）';

export function page(title, body) {
  const links = nav
    .map((item) => `<a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a>`)
    .join('\n      ');
  return `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)} | ${escapeHtml(APP_NAME)}</title>
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <header>
    <p class="app-name">${escapeHtml(APP_NAME)}</p>
    <nav>
      ${links}
    </nav>
  </header>
  <main>
    <h1>${escapeHtml(title)}</h1>
    ${body}
  </main>
</body>
</html>`;
}
