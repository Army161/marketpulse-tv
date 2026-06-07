import axios from 'axios';
import { config } from '../config';
import { logger } from './logger';

/**
 * General single-prompt text generation via Gemini.
 *
 * Returns null when no Gemini key is configured or the call fails, so callers
 * can fall back gracefully. (News summarization keeps its own batched path in
 * adapters/newsAI.ts; this is the general helper used by the market-brief
 * script writer.)
 */
export async function generateText(prompt: string, timeoutMs = 15000): Promise<string | null> {
  if (!config.gemini.apiKey) return null;

  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/` +
    `${config.gemini.model}:generateContent?key=${config.gemini.apiKey}`;

  try {
    const resp = await axios.post(
      url,
      { contents: [{ parts: [{ text: prompt }] }] },
      { timeout: timeoutMs },
    );
    const text = resp.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (typeof text === 'string' && text.trim().length > 0) return text.trim();
    return null;
  } catch (err) {
    logger.error('Gemini generateText failed', { err: String(err) });
    return null;
  }
}
