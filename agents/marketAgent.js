// agents/marketAgent.js — Global market presence mapping (Task 4)
const config = require("../config");
const { callClaude, extractText, parseJSON } = require("./claude");

const SYSTEM = `You are a global market strategy analyst. Given product research, identify the product's real-world market presence across global regions.

Return ONLY raw JSON — no markdown, no backticks, start with {:
{
  "regions": [
    {
      "name": "Region name (e.g. South & Southeast Asia)",
      "tier": "core OR growth OR emerging",
      "penetration": 65,
      "importance": "2-3 sentence explanation of why this region matters strategically for this product.",
      "countries": [356, 360, 764]
    }
  ]
}

Rules:
- Include ${config.MARKET.MIN_REGIONS} to ${config.MARKET.MAX_REGIONS} regions total
- tier must be exactly one of: core, growth, emerging
- core = established strong presence (penetration 50-90%)
- growth = actively expanding (penetration 20-55%)
- emerging = early stage or planned (penetration 5-25%)
- penetration is an integer between 5 and 90
- countries is an array of numeric ISO 3166-1 codes for countries in that region where the product has presence
- Base the analysis on the product's actual known markets, not generic assumptions

Common ISO 3166-1 numeric codes:
US=840, Canada=124, UK=826, Germany=276, France=250, Italy=380, Spain=724,
Netherlands=528, Sweden=752, Switzerland=756, Australia=36, New Zealand=554,
India=356, China=156, Japan=392, South Korea=410, Indonesia=360, Thailand=764,
Malaysia=458, Vietnam=704, Singapore=702, Pakistan=586, Bangladesh=50,
Brazil=76, Mexico=484, Argentina=32, Colombia=170, Chile=152,
UAE=784, Saudi Arabia=682, Egypt=818, Turkey=792, Israel=376,
Nigeria=566, South Africa=710, Kenya=404, Ghana=288, Ethiopia=231
Do NOT wrap the response in code fences or backticks.
Do NOT add any explanation or text before or after the JSON.
CRITICAL: Return raw JSON only. No backticks. No markdown. No code fences. Start your response with { and end with }.`;

async function marketAgent(research) {
  const data = await callClaude({
    model:      config.MODELS.market,
    max_tokens: config.MAX_TOKENS.market,
    system:     SYSTEM,
    messages:   [{
      role:    "user",
      content: `Identify global market presence for this product:\n${JSON.stringify(research, null, 2)}`,
    }],
  });
  return parseJSON(extractText(data));
}

module.exports = marketAgent;
