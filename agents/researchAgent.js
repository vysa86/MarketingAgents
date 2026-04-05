// agents/researchAgent.js — Searches the web and returns structured product summary
const config = require("../config");
const { callClaude, extractText, parseJSON } = require("./claude");

const SYSTEM = `You are a market research analyst. Search the web for information about the given product.
Run exactly ${config.RESEARCH.MAX_SEARCHES} searches:
1. "[product] features and specifications"
2. "[product] pricing and target customers"
3. "[product] customer reviews and complaints"
4. "[product] competitors and market position"

After searching, return ONLY raw JSON — no markdown, no backticks, start with {:
{
  "productName": "official product name",
  "category": "product category",
  "keyFeatures": ["feature1", "feature2", "feature3"],
  "pricing": "pricing summary",
  "targetCustomers": "who buys this",
  "customerSentiment": "summary of reviews — positives and pain points",
  "mainCompetitors": ["competitor1", "competitor2"],
  "marketPosition": "how it is positioned vs competitors"
}
  Do NOT wrap the response in code fences or backticks.
Do NOT add any explanation or text before or after the JSON.
CRITICAL: Return raw JSON only. No backticks. No markdown. No code fences. Start your response with { and end with }.`;

async function researchAgent(product) {
  const data = await callClaude({
    model:      config.MODELS.research,
    max_tokens: config.MAX_TOKENS.research,
    system:     SYSTEM,
    tools:      [{ type: "web_search_20250305", name: "web_search" }],
    messages:   [{ role: "user", content: `Research this product: ${product}` }],
  });
  return parseJSON(extractText(data));
}

module.exports = researchAgent;
