// Gemini（Google の LLM）を呼ぶ雛形。SDK は使わず、fetch で REST API を直接呼ぶ。
//
// - キー（GEMINI_API_KEY）が無いときは、Gemini を呼ばずにモックの応答を返す（既定はモック）。
// - キーは .env に置き、ブラウザには出さない。この関数はサーバーの中だけで使う。
// - 無料枠には上限がある（1分あたり・1日あたりの回数）。開発中はモックで作り、実キーは最後に数回だけ試す。
// - 無料枠に送った入力と出力は Google が製品改善に使う。個人情報や秘密を送らない。

const API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
const TIMEOUT_MS = 30_000;

export class GeminiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'GeminiError';
    this.status = status; // 429 なら上限に達した
  }
}

/**
 * プロンプトを送り、返ってきた文章を返す。
 *
 * @param {string} prompt 送る文章
 * @param {object} [options]
 * @param {string} [options.system] システム指示（AI への前提や守ること）
 * @param {(prompt: string) => string} [options.mock] モックのときに返す文章を作る関数
 * @param {string} [options.apiKey] 省略すると環境変数 GEMINI_API_KEY
 * @param {string} [options.model] 省略すると環境変数 GEMINI_MODEL
 * @param {typeof fetch} [options.fetch] テストで差し替えるための fetch
 * @returns {Promise<{ text: string, mock: boolean }>}
 */
export async function generateText(prompt, options = {}) {
  const apiKey = options.apiKey ?? process.env.GEMINI_API_KEY;
  const model = options.model ?? process.env.GEMINI_MODEL;
  const fetchFn = options.fetch ?? fetch;

  if (!apiKey) {
    const mock = options.mock ?? ((p) => `（モックの応答）プロンプトを ${p.length} 文字受け取りました。`);
    return { text: mock(prompt), mock: true };
  }
  if (!model) {
    throw new GeminiError('GEMINI_MODEL が空です。.env.example を見て .env にモデル名を書いてください');
  }

  const body = { contents: [{ role: 'user', parts: [{ text: prompt }] }] };
  if (options.system) body.systemInstruction = { parts: [{ text: options.system }] };

  let res;
  try {
    res = await fetchFn(`${API_BASE}/${encodeURIComponent(model)}:generateContent`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (err) {
    throw new GeminiError(`Gemini につながりませんでした（${err.name}）`);
  }

  if (res.status === 429) {
    throw new GeminiError('Gemini の無料枠の上限に達しました。1分ほど待つか、モックで続けてください', 429);
  }
  if (!res.ok) {
    // エラーの本文にキーは入らないが、念のため画面には出さずログにだけ出す
    console.error('Gemini error', res.status, await res.text().catch(() => ''));
    const hint = [400, 403, 404].includes(res.status)
      ? '。.env のキーとモデル名が正しいか確かめてください（詳しくはサーバーのログ）'
      : '';
    throw new GeminiError(`Gemini がエラーを返しました（${res.status}）${hint}`, res.status);
  }

  const data = await res.json();
  const text = (data.candidates?.[0]?.content?.parts ?? [])
    .map((part) => part.text ?? '')
    .join('')
    .trim();
  if (!text) {
    // 安全フィルターで止められたときなど、文章が返らないことがある
    throw new GeminiError('Gemini から文章が返りませんでした（安全フィルターで止められた可能性があります）');
  }
  return { text, mock: false };
}
