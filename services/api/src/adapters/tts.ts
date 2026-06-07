import axios from 'axios';
import { config, hasTtsCreds } from '../config';
import { logger } from '../lib/logger';

export interface SynthResult {
  audioUrl: string;
  voice: string;
}

/**
 * Synthesize the brief script to an MP3 and host it on Vercel Blob, returning
 * the public URL. Returns null (graceful) when TTS creds are absent — the brief
 * endpoint then serves a script-only response (audioUrl: null).
 *
 * To "turn on": set GOOGLE_TTS_API_KEY + BLOB_READ_WRITE_TOKEN in .env. No code
 * change required. NOTE: the Google synth call uses the stable v1 REST contract;
 * the Vercel Blob PUT contract is the one spot to re-validate against current
 * Vercel docs when you first wire real creds.
 */
export async function synthesizeBrief(text: string): Promise<SynthResult | null> {
  if (!hasTtsCreds()) return null;

  try {
    const mp3 = await googleSynthesize(text);
    const audioUrl = await uploadMp3(mp3);
    return { audioUrl, voice: config.googleTts.voice };
  } catch (err) {
    logger.error('TTS synthesis/upload failed — serving script-only', { err: String(err) });
    return null;
  }
}

/** Google Cloud Text-to-Speech REST (API-key auth) → MP3 bytes. */
async function googleSynthesize(text: string): Promise<Buffer> {
  const url = `${config.googleTts.baseUrl}/text:synthesize?key=${config.googleTts.apiKey}`;
  const resp = await axios.post(
    url,
    {
      input: { text },
      voice: { languageCode: config.googleTts.languageCode, name: config.googleTts.voice },
      audioConfig: { audioEncoding: 'MP3' },
    },
    { timeout: 20000 },
  );

  const b64 = resp.data?.audioContent;
  if (typeof b64 !== 'string' || b64.length === 0) {
    throw new Error('Google TTS returned no audioContent');
  }
  return Buffer.from(b64, 'base64');
}

/** Upload MP3 bytes to Vercel Blob (public) and return the hosted URL. */
async function uploadMp3(bytes: Buffer): Promise<string> {
  // Random suffix guarantees the PUT always succeeds (no overwrite race). The
  // brief regenerates on the cache TTL, so a periodic blob-cleanup is a future
  // refinement, not a correctness issue.
  const pathname = 'briefs/market-brief.mp3';
  const resp = await axios.put(`${config.blob.baseUrl}/${pathname}`, bytes, {
    headers: {
      authorization: `Bearer ${config.blob.token}`,
      'x-content-type': 'audio/mpeg',
      'x-add-random-suffix': '1',
      'x-api-version': '7',
    },
    timeout: 20000,
  });

  const hostedUrl = resp.data?.url;
  if (typeof hostedUrl !== 'string' || hostedUrl.length === 0) {
    throw new Error('Vercel Blob upload returned no url');
  }
  return hostedUrl;
}
