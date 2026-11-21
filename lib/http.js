// リクエストとレスポンスの小さな道具。どの機能からも使う。

import { readFile } from 'node:fs/promises';
import path from 'node:path';

const MAX_BODY_BYTES = 100_000;

export function sendHtml(res, status, html) {
  res.writeHead(status, { 'content-type': 'text/html; charset=utf-8' });
  res.end(html);
}

export function sendJson(res, status, data) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

export function redirect(res, location) {
  res.writeHead(303, { location });
  res.end();
}

// フォーム（application/x-www-form-urlencoded）か JSON の本文を読み、オブジェクトにして返す
export async function readBody(req) {
  let size = 0;
  const chunks = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) throw new Error('本文が大きすぎます');
    chunks.push(chunk);
  }
  const text = Buffer.concat(chunks).toString('utf8');
  if (!text) return {};
  if ((req.headers['content-type'] ?? '').includes('application/json')) {
    return JSON.parse(text);
  }
  return Object.fromEntries(new URLSearchParams(text));
}

// public/ の下のファイル（CSS や画像）を返す。返したら true
const publicDir = path.join(import.meta.dirname, '..', 'public');
const types = {
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

export async function serveStatic(res, pathname) {
  const file = path.join(publicDir, path.normalize(decodeURIComponent(pathname)));
  if (!file.startsWith(publicDir + path.sep)) return false; // public/ の外は返さない
  try {
    const data = await readFile(file);
    res.writeHead(200, { 'content-type': types[path.extname(file)] ?? 'application/octet-stream' });
    res.end(data);
    return true;
  } catch {
    return false;
  }
}
