const BOT_PATTERNS = [
  { name: "GPTBot", family: "openai", pattern: /GPTBot/i },
  { name: "ChatGPT-User", family: "openai", pattern: /ChatGPT-User/i },
  { name: "OAI-SearchBot", family: "openai", pattern: /OAI-SearchBot/i },
  { name: "ClaudeBot", family: "anthropic", pattern: /ClaudeBot/i },
  { name: "Claude-User", family: "anthropic", pattern: /Claude-User/i },
  { name: "anthropic-ai", family: "anthropic", pattern: /anthropic-ai/i },
  { name: "PerplexityBot", family: "perplexity", pattern: /PerplexityBot/i },
  { name: "Perplexity-User", family: "perplexity", pattern: /Perplexity-User/i },
  { name: "Google-Extended", family: "google", pattern: /Google-Extended/i },
  { name: "Googlebot", family: "google", pattern: /Googlebot/i },
  { name: "Applebot-Extended", family: "apple", pattern: /Applebot-Extended/i },
  { name: "Applebot", family: "apple", pattern: /Applebot/i },
  { name: "meta-externalagent", family: "meta", pattern: /meta-externalagent/i },
  { name: "FacebookBot", family: "meta", pattern: /FacebookBot/i },
  { name: "CCBot", family: "common-crawl", pattern: /CCBot/i },
  { name: "Bytespider", family: "other", pattern: /Bytespider/i },
  { name: "Amazonbot", family: "other", pattern: /Amazonbot/i },
  { name: "Bingbot", family: "other", pattern: /bingbot/i },
  { name: "YouBot", family: "other", pattern: /YouBot/i },
  { name: "DuckAssistBot", family: "other", pattern: /DuckAssistBot/i },
];

export function classifyBot(userAgent = "") {
  const ua = String(userAgent || "");
  const match = BOT_PATTERNS.find((bot) => bot.pattern.test(ua));
  if (match) return { botName: match.name, family: match.family };
  if (/bot|crawler|spider|crawl|slurp/i.test(ua)) return { botName: "Other crawler", family: "other" };
  return null;
}

export { BOT_PATTERNS };
