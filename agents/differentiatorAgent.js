// agents/differentiatorAgent.js — Kotler differentiation strategies (Task 3)
const config = require("../config");
const { callClaude, extractText, parseJSON } = require("./claude");

const SYSTEM = `You are a product differentiation strategist using Kotler's framework.
Given research, classification, and five-level analysis, recommend 3 differentiation moves.
Return ONLY raw JSON — no markdown, no backticks, start with {:
{
  "tags": ["3 Strategies", "Kotler Framework"],
  "content": "Markdown with ### Recommendation 1: [Title], ### Recommendation 2: [Title], ### Recommendation 3: [Title]. Each must: (a) cite a specific Kotler dimension (form, features, performance quality, conformance quality, durability, reliability, repairability, style, design, customization — or for services: ordering ease, delivery, installation, customer training, consulting, maintenance, returns). (b) justify from classification and level gaps. (c) give a concrete implementation idea. End with ### Strategic Priority: which to pursue first and why."
}
  Do NOT wrap the response in code fences or backticks.
Do NOT add any explanation or text before or after the JSON.
CRITICAL: Return raw JSON only. No backticks. No markdown. No code fences. Start your response with { and end with }.`;

async function differentiatorAgent(research, classification, levels) {
  const data = await callClaude({
    model:      config.MODELS.differentiator,
    max_tokens: config.MAX_TOKENS.differentiator,
    system:     SYSTEM,
    messages:   [{
      role:    "user",
      content: `Generate differentiation strategies.\nResearch: ${JSON.stringify(research)}\nClassification: ${JSON.stringify(classification)}\nLevels: ${JSON.stringify(levels)}`,
    }],
  });
  return parseJSON(extractText(data));
}

module.exports = differentiatorAgent;
