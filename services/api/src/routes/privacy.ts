import { Router } from 'express';

/**
 * Serves the public privacy policy as a self-contained HTML page.
 *
 * Roku (and Amazon) store submission requires a publicly reachable privacy
 * policy URL. Since the backend is already deployed on Vercel, serving it from
 * `/privacy` avoids standing up separate hosting. The policy is factual: the
 * app collects no personal data (no auth, no accounts, no tracking).
 *
 * Kept as an inline template (no fs reads) so it works identically in the
 * Vercel serverless bundle, where the markdown source file isn't shipped.
 */

const LAST_UPDATED = '2026-05-31';

const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>MarketPulse TV — Privacy Policy</title>
  <style>
    body { font-family: -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
           max-width: 760px; margin: 40px auto; padding: 0 20px; line-height: 1.6;
           color: #1a1a1a; background: #fff; }
    h1 { font-size: 28px; } h2 { font-size: 20px; margin-top: 32px; }
    .updated { color: #666; font-size: 14px; }
    code { background: #f4f4f4; padding: 1px 4px; border-radius: 3px; }
    a { color: #0b66c3; }
  </style>
</head>
<body>
  <h1>MarketPulse TV — Privacy Policy</h1>
  <p class="updated">Last updated: ${LAST_UPDATED}</p>

  <p>MarketPulse TV ("the app") is a lean-back financial dashboard for Amazon
  Fire TV and Roku. This policy describes exactly what data the app does and
  does not handle.</p>

  <h2>Data We Collect</h2>
  <p><strong>None.</strong> MarketPulse TV does not collect, store, or transmit
  any personal information. Specifically:</p>
  <ul>
    <li>No account creation, login, or authentication.</li>
    <li>No name, email, address, or contact information.</li>
    <li>No payment or financial-account information (subscription billing, where
        offered, is handled entirely by the platform — Amazon Appstore or Roku —
        and the app never sees your payment details).</li>
    <li>No device identifiers, advertising IDs, or location data collected by us.</li>
    <li>No analytics or tracking SDKs embedded by us.</li>
  </ul>

  <h2>How the App Works</h2>
  <p>The app displays publicly available market data (stock quotes,
  cryptocurrency prices, and AI-summarized financial news) fetched from our
  backend API. These requests contain no personal information — they ask only
  for the public market data shown on screen.</p>

  <h2>Third-Party Services</h2>
  <ul>
    <li><strong>Our backend</strong> (hosted on Vercel) proxies public market
        data from Alpaca Markets, CoinGecko, and a news provider, and generates
        news summaries via an AI model. It receives only the app's data
        requests, not personal data.</li>
    <li><strong>Roku</strong> (free tier) may serve ads through the Roku
        Advertising Framework (RAF) and handles any subscription billing. Roku's
        own privacy policy governs that data; see
        <a href="https://docs.roku.com/published/userprivacypolicy">Roku's policy</a>.</li>
    <li><strong>Amazon</strong> (Fire TV) handles subscription billing via Amazon
        In-App Purchasing. Amazon's privacy policy governs that data.</li>
  </ul>

  <h2>Children's Privacy</h2>
  <p>The app is a general-audience financial information tool and is not directed
  at children under 13. We do not knowingly collect data from anyone.</p>

  <h2>Changes to This Policy</h2>
  <p>If this policy changes, the updated version will be posted at this URL with
  a new "Last updated" date.</p>

  <h2>Contact</h2>
  <p>Questions about this policy can be directed to the app developer through the
  store listing's support contact.</p>
</body>
</html>`;

const router = Router();

router.get('/', (_req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.status(200).send(HTML);
});

export default router;
