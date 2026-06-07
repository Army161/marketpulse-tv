import type { Article, Mover, Sentiment } from '@marketpulse/shared';
import { generateText } from '../lib/gemini';

/** Live inputs that get turned into the spoken market brief. */
export interface BriefInputs {
  gainers: Mover[];
  losers: Mover[];
  sentiment: Sentiment;
  headlines: Article[];
}

/** The composed script plus how it was produced. */
export interface BriefScript {
  text: string;
  source: 'gemini' | 'fallback';
}

/**
 * Compose the spoken brief script. Tries Gemini first; if Gemini is absent or
 * fails, falls back to a deterministic template so the endpoint always returns
 * a usable script (house style: every adapter has a fallback).
 */
export async function composeBriefScript(inputs: BriefInputs): Promise<BriefScript> {
  const ai = await generateText(buildBriefPrompt(inputs));
  if (ai) return { text: sanitize(ai), source: 'gemini' };
  return { text: composeFallbackScript(inputs), source: 'fallback' };
}

/**
 * THE ANCHOR'S PERSONALITY LIVES HERE. Tone, pacing, structure, and sign-off
 * are all defined by this prompt — tune it freely to reshape how the AI anchor
 * sounds. The data lines below are appended as ground truth.
 */
export function buildBriefPrompt(inputs: BriefInputs): string {
  const gainers = inputs.gainers.map(fmtMover).join(', ') || 'none notable';
  const losers = inputs.losers.map(fmtMover).join(', ') || 'none notable';
  const headlines =
    inputs.headlines
      .slice(0, 2)
      .map((h) => `- ${h.headline}`)
      .join('\n') || '- (no major headlines right now)';

  return [
    'You are the on-air anchor for "MarketPulse", a premium live finance TV channel.',
    'Write a spoken market brief of EXACTLY three short paragraphs, meant to be read aloud in about 30 seconds.',
    'Tone: confident, energetic, and clear — a sharp TV market anchor.',
    'Output rules: plain spoken sentences only. No markdown, no headings, no bullet points, no emojis, no stage directions.',
    'Paragraph 1: the overall market mood, anchored to the Fear & Greed reading.',
    "Paragraph 2: today's biggest movers — winners and losers — with their moves.",
    'Paragraph 3: the top headlines drawing attention, then a brief sign-off as "MarketPulse".',
    '',
    'Use ONLY these facts:',
    `Fear & Greed: ${inputs.sentiment.value} out of 100 (${inputs.sentiment.label}).`,
    `Top gainers: ${gainers}.`,
    `Top losers: ${losers}.`,
    `Headlines:\n${headlines}`,
  ].join('\n');
}

/** Deterministic, no-AI brief so the endpoint is useful without Gemini. */
function composeFallbackScript(inputs: BriefInputs): string {
  const g = inputs.gainers[0];
  const l = inputs.losers[0];
  const top = inputs.headlines[0];

  const p1 =
    `Welcome to your MarketPulse brief. Market sentiment is reading ` +
    `${inputs.sentiment.value} out of one hundred — ${inputs.sentiment.label.toLowerCase()}.`;

  const moves: string[] = [];
  if (g) moves.push(`${moverLabel(g)} is leading the gainers at ${pct(g.changePercent)}`);
  if (l) moves.push(`${moverLabel(l)} is leading the losers at ${pct(l.changePercent)}`);
  const p2 = moves.length > 0 ? `On the move today: ${moves.join(', and ')}.` : 'Movement is muted across the board today.';

  const p3 = top
    ? `In the headlines: ${top.headline}. That is your snapshot — stay with MarketPulse.`
    : `That is your snapshot — stay with MarketPulse.`;

  return [p1, p2, p3].join('\n\n');
}

function fmtMover(m: Mover): string {
  return `${moverLabel(m)} ${pct(m.changePercent)}`;
}

function moverLabel(m: Mover): string {
  return m.name && m.name.length > 0 ? m.name : m.symbol;
}

function pct(n: number): string {
  const sign = n >= 0 ? '+' : '';
  return `${sign}${n.toFixed(2)} percent`;
}

/** Strip any stray markdown Gemini may emit so TTS reads clean prose. */
function sanitize(s: string): string {
  return s
    .replace(/[*_#`>]/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
