// ─────────────────────────────────────────────────────────────────────────────
// config.js — Single source of truth for all configuration
// Set ANTHROPIC_API_KEY as an environment variable before running:
//   Mac/Linux: export ANTHROPIC_API_KEY=sk-ant-your-key-here
//   Windows:   set ANTHROPIC_API_KEY=sk-ant-your-key-here
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {

  // ── API credentials ──────────────────────────────────────────────────────
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || "sk-ant-your-key-here",
  ANTHROPIC_API_URL: "https://api.anthropic.com/v1/messages",
  ANTHROPIC_VERSION: "2023-06-01",
  ANTHROPIC_BETA:    "web-search-2025-03-05",

  // ── Model selection per agent ────────────────────────────────────────────
  MODELS: {
    research:      "claude-haiku-4-5-20251001",  // uses web search
    classifier:    "claude-haiku-4-5-20251001",
    levels:        "claude-haiku-4-5-20251001",
    differentiator:"claude-haiku-4-5-20251001",
    market:        "claude-haiku-4-5-20251001",
  },

  // ── Token limits per agent ───────────────────────────────────────────────
 MAX_TOKENS: {
  research:       1500,  
  classifier:      1500,  
  levels:         2500,  
  differentiator: 2500,  
  market:          2500,  
},

  // ── Server settings ──────────────────────────────────────────────────────
  PORT: process.env.PORT || 3050,

  // ── Research agent settings ──────────────────────────────────────────────
  RESEARCH: {
    MAX_SEARCHES: 2,  // number of web searches the research agent will run
  },

  // ── Market agent settings ────────────────────────────────────────────────
  MARKET: {
    MIN_REGIONS: 2,
    MAX_REGIONS: 3,
  },

};
