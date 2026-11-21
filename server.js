// サーバーの入り口。features/ の下のファイルを全部読み込み、
// それぞれが持つ routes（どの URL を受け持つか）に従ってリクエストを振り分ける。
// 機能を足すときは features/ にファイルを1つ足せばよく、このファイルは触らなくてよい。

import { createServer } from 'node:http';
import { readdir } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { sendHtml, sendJson, serveStatic } from './lib/http.js';
import { page } from './lib/html.js';

const port = Number(process.env.PORT ?? 3000);
const featuresDir = path.join(import.meta.dirname, 'features');

// features/*.js を読み込み、routes をまとめる
const routes = [];
for (const file of (await readdir(featuresDir)).sort()) {
  if (!file.endsWith('.js')) continue;
  const mod = await import(pathToFileURL(path.join(featuresDir, file)).href);
  for (const route of mod.routes ?? []) {
    routes.push({ ...route, file, match: compile(route.path) });
  }
}
// '/items/new' のような決まった URL を、'/items/:id' のような変わる URL より先に試す
routes.sort((a, b) => a.path.split(':').length - b.path.split(':').length);

// '/items/:id' のような書き方を、正規表現に直す
function compile(pattern) {
  const names = [];
  const source = pattern.replace(/:(\w+)/g, (_, name) => {
    names.push(name);
    return '([^/]+)';
  });
  const regex = new RegExp(`^${source}$`);
  return (pathname) => {
    const m = regex.exec(pathname);
    if (!m) return null;
    return Object.fromEntries(names.map((name, i) => [name, decodeURIComponent(m[i + 1])]));
  };
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host ?? 'localhost'}`);
  try {
    for (const route of routes) {
      if (route.method !== req.method) continue;
      const params = route.match(url.pathname);
      if (params) {
        await route.handler({ req, res, params, url });
        return;
      }
    }
    if (req.method === 'GET' && (await serveStatic(res, url.pathname))) return;

    if (url.pathname.startsWith('/api/')) {
      sendJson(res, 404, { error: '見つかりません' });
    } else {
      sendHtml(res, 404, page('見つかりません', '<p>このページはありません。</p>'));
    }
  } catch (err) {
    console.error(err);
    if (res.headersSent) return res.end();
    if (url.pathname.startsWith('/api/')) {
      sendJson(res, 500, { error: 'サーバーでエラーが起きました' });
    } else {
      sendHtml(res, 500, page('エラー', '<p>サーバーでエラーが起きました。ターミナルのログを見てください。</p>'));
    }
  }
});

server.listen(port, () => {
  console.log(`http://localhost:${port} で動いています`);
  for (const r of routes) console.log(`  ${r.method.padEnd(4)} ${r.path}  (features/${r.file})`);
});
