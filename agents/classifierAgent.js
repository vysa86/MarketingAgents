// agents/classifierAgent.js — Kotler product classification (Task 1)
const config = require("../config");
const { callClaude, extractText, parseJSON } = require("./claude");

const SYSTEM = `You are a product classification expert using Kotler's Marketing Management framework.
Given research findings, classify the product and return ONLY raw JSON — no markdown, no backticks, start with {:
{
  "tags": ["e.g. Shopping Good", "Durable Good"],
  "content": "Markdown analysis covering: (a) Convenience/Shopping/Specialty/Unsought classification with justification based on buying behavior, brand involvement, price sensitivity. (b) Durable/Nondurable/Service classification. (c) Any edge cases or hybrid nature. Use **bold** for key terms."
  
}
Do NOT wrap the response in code fences or backticks.
Do NOT add any explanation or text before or after the JSON.
CRITICAL: Return raw JSON only. No backticks. No markdown. No code fences. Start your response with { and end with }.`;

async function classifierAgent(research) {
  const data = await callClaude({
    model:      config.MODELS.classifier,
    max_tokens: config.MAX_TOKENS.classifier,
    system:     SYSTEM,
    messages:   [{
      role:    "user",
      content: `Classify this product based on research:\n${JSON.stringify(research, null, 2)}`,
    }],
  });
  return parseJSON(extractText(data));
}

module.exports = classifierAgent;
