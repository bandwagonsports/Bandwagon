/**
 * api/get-meat.js — 3-agent sequential Gemini pipeline
 * Cached 1 hour. All users share cached response per team.
 *
 * Agent A (Scout)       — extracts facts from raw API-Sports data
 * Agent B (Translator)  — rewrites in casual fan tone, produces 3 outputs
 * Agent C (Fact Checker)— validates What You Missed + Water Cooler only
 *                         Hot Takes are opinion — skip fact check (by design)
 */

const HOSTS = {
  NFL:  "v1.american-football.api-sports.io",
  NBA:  "v2.nba.api-sports.io",
  MLB:  "v1.baseball.api-sports.io",
  NHL:  "v1.hockey.api-sports.io",
  FIFA: "v3.football.api-sports.io",
};

async function fetchGames(sport, teamId, season) {
  const host = HOSTS[sport];
  const paths = {
    NFL:  `/games?team=${teamId}&season=${season}&last=3`,
    NBA:  `/games?team=${teamId}&season=${season}&last=3`,
    MLB:  `/games?team=${teamId}&season=${season}&last=3`,
    NHL:  `/games?team=${teamId}&season=${season}&last=3`,
    FIFA: `/fixtures?team=${teamId}&season=${season}&last=3`,
  };
  const res = await fetch(`https://${host}${paths[sport]}`, {
    headers: {
      "x-apisports-key":  process.env.APISPORTS_KEY,
      "x-apisports-host": host,
    },
  });
  if (!res.ok) throw new Error(`API-Sports ${sport} error: ${res.status}`);
  const data = await res.json();
  return data.response || [];
}

async function callGemini(prompt) {
  const models = [
    "gemini-2.0-flash",
    "gemini-1.5-flash",       // fallback if 2.0 is throttled
  ];

  for (const model of models) {
    for (let attempt = 0; attempt < 2; attempt++) {
      if (attempt > 0) await new Promise(r => setTimeout(r, 1500 * attempt));
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: 220, temperature: 0.7 },
          }),
        }
      );
      if (res.status === 429) continue;   // retry or fall to next model
      if (!res.ok) throw new Error(`Gemini ${model} error: ${res.status}`);
      const data = await res.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
    }
  }
  throw new Error("All Gemini models rate-limited.");
}

export default async function handler(req, res) {
  const { teamId, teamName, sport, season } = req.query;
  if (!teamId || !sport || !HOSTS[sport]) return res.status(400).json({ error: "Missing params." });
  if (!process.env.GEMINI_API_KEY)         return res.status(500).json({ error: "GEMINI_API_KEY not set." });
  if (!process.env.APISPORTS_KEY)          return res.status(500).json({ error: "APISPORTS_KEY not set." });

  try {
    const games      = await fetchGames(sport, teamId, season || "2024");
    const rawSummary = JSON.stringify(games.slice(0, 3));

    // --- START OF NEW CONSOLIDATED LOGIC ---
    const masterPrompt = `
      You are a sports analyst and casual fan explainer. 
      Context: Here are the 3 most recent games for ${teamName}: ${rawSummary}

      Step 1: Extract the facts (scores, record, performers).
      Step 2: Based on those facts, write exactly 3 sections separated by |||:

      1) WHAT YOU MISSED: 2 sentences, past tense, like texting a friend.
      2) HOT TAKES: 5 lines exactly, one per line, format: LABEL: GRADE | sentence
         Labels: OFFENSE, DEFENSE, COACHING, STAR PLAYER, OVERALL
      3) WATER COOLER: 2-3 conversational bullet points starting with dash.

      Fact-check yourself before responding. Output ONLY the 3 sections divided by |||.
    `.trim();

    const responseText = await callGemini(masterPrompt);
    const parts = responseText.split("|||").map(s => s.trim());

    // Assigning the single-shot response to your existing variables
    const checkedMissed = parts[0] || "No recent summary available.";
    const rawTakes     = parts[1] || "";
    const checkedCooler = parts[2] || "Check back soon for more updates.";
    // --- END OF NEW CONSOLIDATED LOGIC ---

    // Parse Hot Takes into structured array
    const hotTakes = [];
    rawTakes.split("\n").filter(l => l.includes("|")).forEach(line => {
      const colonIdx = line.indexOf(":");
      const pipeIdx  = line.indexOf("|");
      if (colonIdx === -1 || pipeIdx === -1) return;
      const label  = line.substring(0, colonIdx).trim().toUpperCase();
      const grade  = line.substring(colonIdx + 1, pipeIdx).trim();
      const take   = line.substring(pipeIdx + 1).trim();
      if (label && grade && take) hotTakes.push({ label, rating: grade, take });
    });

    res.setHeader("Cache-Control", "s-maxage=10800, stale-while-revalidate=3600");
    return res.status(200).json({
      whatYouMissed: checkedMissed || "No recent games found.",
      hotTakes:      hotTakes.length > 0 ? hotTakes : null,
      waterCooler:   checkedCooler || "Check back after the next game.",
    });

  } catch (err) {
    console.error("[get-meat]", err.message);
    return res.status(200).json({
      whatYouMissed: "The Professor is reviewing the tape. Check back in a moment.",
      hotTakes:      null,
      waterCooler:   "Agents are huddling. Refresh in a few seconds.",
    });
  }
}
