/**
 * Pull the backend base URL from the RN bundle env. Override at build time
 * with API_BASE_URL=... in your build command (for example, point at a PR
 * preview URL or `http://localhost:3000` for local backend dev).
 * The default points at the deployed production backend so a fresh APK
 * works out of the box.
 */
const DEFAULT_API_BASE = 'https://marketpulse-tv.vercel.app';

declare const process: { env: Record<string, string | undefined> };

export const API_BASE_URL: string =
  (typeof process !== 'undefined' && process.env?.API_BASE_URL) || DEFAULT_API_BASE;
