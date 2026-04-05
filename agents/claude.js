// agents/claude.js — Shared Anthropic API helper
const config = require("../config");

async function callClaude({ model, system, messages, tools, max_tokens }) {
  const { default: fetch } = await import("node-fetch");

  const body = { model, max_tokens, system, messages };
  if (tools) body.tools = tools;

  const res = await fetch(config.ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type":    "application/json",
      "x-api-key":       config.ANTHROPIC_API_KEY,
      "anthropic-version": config.ANTHROPIC_VERSION,
      "anthropic-beta":  config.ANTHROPIC_BETA,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Anthropic API error");
  return data;
}

function extractText(data) {
  return (data.content || [])
    .map(b => (b.type === "text" ? b.text : ""))
    .filter(Boolean)
    .join("\n");
}
function parseJSON(text, agentName = "unknown") {
  console.log(`\n[${agentName}] RAW:\n`, text.slice(0, 500), "\n");
let cleaned = text
  .replace(/```json\s*/gi, "")   // ← the \s* is critical — removes the newline after ```json
  .replace(/```\s*/g, "")
  .replace(/`/g, "")
  .trim();
  const cleaned_old = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .replace(/`/g, "")        // ← catch any stray backticks
    .trim();

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new Error(`No JSON found in agent response [${agentName}]`);
  }

  try {
    return JSON.parse(cleaned.slice(start, end + 1));
  } catch (e) {
    throw new Error(`Invalid JSON [${agentName}]: ${e.message}`);
  }
}
function parseJSON_oLD(text) {
  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  // Try to find the first { and last } to extract JSON
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new Error("No JSON found in agent response");
  }

  const jsonStr = cleaned.slice(start, end + 1);

  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    throw new Error("Invalid JSON in agent response: " + e.message);
  }
}
module.exports = { callClaude, extractText, parseJSON };
