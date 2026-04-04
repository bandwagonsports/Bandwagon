/**
 * api/roster.js — on-demand roster, cached 24 hours
 * v2: replace with Vercel KV daily cron batch pull
 */
const HOSTS = {
  NFL:  "v1.american-football.api-sports.io",
  NBA:  "v2.nba.api-sports.io",
  MLB:  "v1.baseball.api-sports.io",
  NHL:  "v1.hockey.api-sports.io",
  FIFA: "v3.football.api-sports.io",
};

async function fetchSport(sport, path) {
  const host = HOSTS[sport];
  const res  = await fetch(`https://${host}${path}`, {
    headers: { "x-apisports-key": process.env.APISPORTS_KEY, "x-apisports-host": host },
  });
  if (!res.ok) throw new Error(`API-Sports roster ${sport} ${res.status}`);
  return res.json();
}

function parseRoster(sport, response) {
  try {
    if (sport === "NFL") return (response || []).map(p => ({ id: p.player?.id, name: p.player?.name, position: p.player?.position || "—", number: p.player?.number ?? "—", age: p.player?.age ?? null }));
    if (sport === "NBA") return ((response || [])[0]?.players || []).map(p => ({ id: p.id, name: `${p.firstname || ""} ${p.lastname || ""}`.trim(), position: p.leagues?.standard?.pos || "—", number: p.leagues?.standard?.jersey ?? "—", age: null }));
    if (sport === "MLB") return (response || []).map(p => ({ id: p.player?.id, name: p.player?.name, position: p.player?.position || "—", number: "—", age: null }));
    if (sport === "NHL") return (response || []).map(p => ({ id: p.player?.id, name: p.player?.name, position: p.player?.position || "—", number: p.player?.number ?? "—", age: null }));
    if (sport === "FIFA") return ((response || [])[0]?.players || []).map(p => ({ id: p.id, name: p.name, position: p.position || "—", number: p.number ?? "—", age: p.age ?? null }));
  } catch { return []; }
  return [];
}

export default async function handler(req, res) {
  const { teamId, sport } = req.query;
  if (!teamId || !sport || !HOSTS[sport]) return res.status(400).json({ error: "Missing params." });
  try {
    const paths = {
      NFL:  `/players?team=${teamId}&season=2024`,
      NBA:  `/players?team=${teamId}&season=2024-2025`,
      MLB:  `/players?team=${teamId}&season=2025`,
      NHL:  `/players?team=${teamId}&season=2024`,
      FIFA: `/players/squads?team=${teamId}`,
    };
    const data    = await fetchSport(sport, paths[sport]);
    const players = parseRoster(sport, data.response);
    const groups  = {};
    players.filter(p => p?.name).forEach(p => {
      const pos = p.position || "Other";
      if (!groups[pos]) groups[pos] = [];
      groups[pos].push(p);
    });
    const roster = Object.entries(groups).map(([pos, players]) => ({ pos, players }));
    res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate=3600");
    return res.status(200).json({ roster, total: players.length });
  } catch (err) {
    console.error("[roster]", err.message);
    return res.status(500).json({ error: err.message, roster: [] });
  }
}
