// server.js — Main entry point. Orchestrates the 5-agent pipeline.
const http = require("http");
const fs   = require("fs");
const path = require("path");

const config              = require("./config");
const researchAgent       = require("./agents/researchAgent");
const classifierAgent     = require("./agents/classifierAgent");
const levelsAgent         = require("./agents/levelsAgent");
const differentiatorAgent = require("./agents/differentiatorAgent");
const marketAgent         = require("./agents/marketAgent");

// ─── Orchestrator ─────────────────────────────────────────────────────────────
// Add this helper at the top of server.js
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runPipeline(product, sendEvent) {
  sendEvent({ type: "status", message: "🔍 Research Agent searching the web…", step: 1 });
  const research = await researchAgent(product);
  sendEvent({ type: "research", data: research });
  await wait(3000); // ← 3 second pause

  sendEvent({ type: "status", message: "🏷 Classifier Agent analysing product type…", step: 2 });
  const classification = await classifierAgent(research);
  sendEvent({ type: "task", index: 0, title: "Product Classification", ...classification });
  await wait(3000);

  sendEvent({ type: "status", message: "📐 Levels Agent mapping five product levels…", step: 3 });
  const levels = await levelsAgent(research);
  sendEvent({ type: "task", index: 1, title: "Five Product Levels", ...levels });
  await wait(3000);

  sendEvent({ type: "status", message: "💡 Differentiator Agent generating strategies…", step: 4 });
  const diff = await differentiatorAgent(research, classification, levels);
  sendEvent({ type: "task", index: 2, title: "Differentiation Recommendations", ...diff });
  await wait(3000);

  sendEvent({ type: "status", message: "🌍 Market Agent mapping global presence…", step: 5 });
  const market = await marketAgent(research);
  sendEvent({ type: "market", data: market });

  sendEvent({ type: "done", productName: research.productName, tagline: research.marketPosition });
}
async function runPipelineold(product, sendEvent) {
  sendEvent({ type: "status", message: "🔍 Research Agent searching the web…", step: 1 });
  const research = await researchAgent(product);
  sendEvent({ type: "research", data: research });
  const researchSlim = {
  productName:       research.productName,
  category:          research.category,
  keyFeatures:       research.keyFeatures,
  pricing:           research.pricing,
  targetCustomers:   research.targetCustomers,
  mainCompetitors:   research.mainCompetitors,
  marketPosition:    research.marketPosition,
};

  sendEvent({ type: "status", message: "🏷 Classifier Agent analysing product type…", step: 2 });
  const classification = await classifierAgent(researchSlim);
  sendEvent({ type: "task", index: 0, title: "Product Classification", ...classification });

  sendEvent({ type: "status", message: "📐 Levels Agent mapping five product levels…", step: 3 });
  const levels = await levelsAgent(researchSlim);
  sendEvent({ type: "task", index: 1, title: "Five Product Levels", ...levels });

  sendEvent({ type: "status", message: "💡 Differentiator Agent generating strategies…", step: 4 });
  const diff = await differentiatorAgent(researchSlim, classification, levels);
  sendEvent({ type: "task", index: 2, title: "Differentiation Recommendations", ...diff });

  sendEvent({ type: "status", message: "🌍 Market Agent mapping global presence…", step: 5 });
  const market = await marketAgent(researchSlim);
  sendEvent({ type: "market", data: market });

  sendEvent({ type: "done", productName: research.productName, tagline: research.marketPosition });
}

// ─── HTTP Server ──────────────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") { res.writeHead(204); return res.end(); }

  // Serve frontend
  if (req.method === "GET" && req.url === "/") {
    const html = fs.readFileSync(path.join(__dirname, "public", "index.html"), "utf8");
    res.writeHead(200, { "Content-Type": "text/html" });
    return res.end(html);
  }

  // SSE stream endpoint — called by the frontend
  if (req.method === "POST" && req.url === "/api/analyse") {
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", async () => {
      const { product } = JSON.parse(body);
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection":    "keep-alive",
      });
      const sendEvent = (obj) => res.write(`data: ${JSON.stringify(obj)}\n\n`);
      try {
        await runPipeline(product, sendEvent);
      } catch (err) {
        sendEvent({ type: "error", message: err.message });
      } finally {
        res.end();
      }
    });
    return;
  }

  res.writeHead(404); res.end("Not found");
});

server.listen(config.PORT, () => {
  const keyOk = (config.ANTHROPIC_API_KEY || "").startsWith("sk-ant");
  console.log(`\n✓ Strategos running at http://localhost:${config.PORT}`);
  console.log(`  API key : ${keyOk ? "✓ set" : "✗ missing — set ANTHROPIC_API_KEY in environment"}`);
  console.log(`  Models  : ${[...new Set(Object.values(config.MODELS))].join(", ")}`);
  console.log(`  Agents  : research → classifier → levels → differentiator → market\n`);
});
