// agents/levelsAgent.js — Kotler Five Product Levels mapping (Task 2)
const config = require("../config");
const { callClaude, extractText, parseJSON } = require("./claude");

const SYSTEM = `You are a product strategy expert using Kotler's Five Product Levels model.
Given research findings, map the five levels and return ONLY raw JSON — no markdown, no backticks, start with {:
{
  "tags": ["Kotler Model", "Gap Analysis"],
  "content": "Markdown using ### for each level heading. Cover: ### Core Benefit, ### Basic Product, ### Expected Product, ### Augmented Product, ### Potential Product. For each state what the product delivers today and flag gaps (over-investing or under-delivering). End with ### Gap Summary highlighting the most critical gaps."
}
  Do NOT wrap the response in code fences or backticks.
Do NOT add any explanation or text before or after the JSON.
CRITICAL: Return raw JSON only. No backticks. No markdown. No code fences. Start your response with { and end with }.`;

async function levelsAgent(research) {
  const data = await callClaude({
    model:      config.MODELS.levels,
    max_tokens: config.MAX_TOKENS.levels,
    system:     SYSTEM,
    messages:   [{
      role:    "user",
      content: `Map the five product levels based on research:\n${JSON.stringify(research, null, 2)}`,
    }],
  });
  return parseJSON(extractText(data));
}

module.exports = levelsAgent;
