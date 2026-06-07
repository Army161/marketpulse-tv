import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { apiLimiter } from './middleware/rateLimit';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import healthRoute from './routes/health';
import stocksRoute from './routes/stocks';
import cryptoRoute from './routes/crypto';
import newsRoute from './routes/news';
import moversRoute from './routes/movers';
import privacyRoute from './routes/privacy';
import sentimentRoute from './routes/sentiment';
import calendarRoute from './routes/calendar';
import briefRoute from './routes/brief';

/**
 * Build the Express app. Exported as a factory so the same app can be
 * mounted by the local dev server and by the Vercel serverless handler.
 */
export function createApp(): Express {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: '32kb' }));
  app.use(apiLimiter);

  app.use('/api/health', healthRoute);
  app.use('/api/stocks', stocksRoute);
  app.use('/api/crypto', cryptoRoute);
  app.use('/api/news', newsRoute);
  app.use('/api/movers', moversRoute);
  app.use('/api/sentiment', sentimentRoute);
  app.use('/api/calendar', calendarRoute);
  app.use('/api/brief', briefRoute);

  // Privacy policy for store submission. Mounted at both paths: `/privacy`
  // for the clean public URL (needs a vercel.json rewrite to reach the
  // function) and `/api/privacy` which already routes through the existing
  // `/api/*` rewrite with no infra change.
  app.use('/privacy', privacyRoute);
  app.use('/api/privacy', privacyRoute);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
