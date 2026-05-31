import type { IncomingMessage, ServerResponse } from 'http';
import { createApp } from '../services/api/src/app';

/**
 * Vercel serverless entry point at the canonical `<root>/api/` location.
 * Imports the Express app from the monorepo's services/api workspace and
 * dispatches all incoming requests through it. The `/api/(.*)` rewrite in
 * vercel.json funnels every request to this single function so Express
 * can do its own routing across /api/health, /api/stocks, etc.
 */
const app = createApp();

export default function handler(req: IncomingMessage, res: ServerResponse): void {
  // Express is request/response-compatible with Node's IncomingMessage/ServerResponse.
  app(req, res);
}
