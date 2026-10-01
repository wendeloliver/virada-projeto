import express from "express";
import Anthropic from "@anthropic-ai/sdk";

const PORT = process.env.PORT || 3000;
const MODEL = process.env.CLAUDE_MODEL || "claude-sonnet-5-5";
const LIMITE_POR_HORA = Number(process.env.LIMITE_POR_HORA || 20);

const app = express();
app.use(express.json({ limit: "50kb" }));
app.use(express.static("public"));

// Limite simples por IP (em memória) para controlar custo.
const usos = new Map();
function limite(req, res, next) {
  const ip = req.ip;
  const agora = Date.now();
  const lista = (usos.get(ip) || []).filter((t) => agora - t < 3600_000);
  if (lista.length >= LIMITE_POR_HORA) {
    return res.status(429).json({ error: "Limite por hora atingido. Tente mais tarde." });
  }
  lista.push(agora);
  usos.set(ip, lista);
  next();
}

let client = null;
if (process.env.ANTHROPIC_API_KEY) client = new Anthropic();

app.post("/api/ai", limite, async (req, res) => {
  const prompt = String(req.body?.prompt || "");
  if (!prompt || prompt.length > 8000) {
    return res.status(400).json({ error: "Prompt inválido." });
  }
  if (!client) {
    return res.status(500).json({ error: "Falta ANTHROPIC_API_KEY no arquivo .env" });
  }
  try {
    const r = await client.messages.create({
      model: MODEL,
      max_tokens: 3000,
      messages: [{ role: "user", content: prompt }],
    });
    const text = r.content.filter((b) => b.type === "text").map((b) => b.text).join("");
    res.json({ text });
  } catch (e) {
    console.error("Erro na API:", e.message);
    res.status(502).json({ error: "Falha ao falar com a IA." });
  }
});

app.listen(PORT, () => console.log(`VIRADA rodando em http://localhost:${PORT}`));
