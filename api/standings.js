/**
 * api/standings.js — league standings per team's league
 * Cached 6 hours.
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
  if (!res.ok) throw new Error(`API-Sports standings ${sport} ${res.status}`);
  return res.json();
}

export default async function handler(req, res) {
  const { leagueId, sport, season, teamId } = req.query;
  if (!leagueId || !sport || !HOSTS[sport]) return res.status(400).json({ error: "Missing params." });
  try {
    const data = await fetchSport(sport, `/standings?league=${leagueId}&season=${season || "2024"}`);
    const flat = (data.response || []).flat(3);
    const rows = flat.map(e => ({
      teamId:   String(e.team?.id),
      teamName: e.team?.name || e.team?.id,
      wins:     e.won ?? e.win?.total ?? e.all?.win ?? 0,
      losses:   e.lost ?? e.loss?.total ?? e.all?.lose ?? 0,
      pct:      e.percentage || e.win?.percentage || "—",
      gb:       e.games_behind ?? e.gamesBehind ?? e.points ?? "—",
    })).filter(r => r.teamName);
    res.setHeader("Cache-Control", "s-maxage=21600, stale-while-revalidate=3600");
    return res.status(200).json({ standings: rows, highlightTeamId: teamId || null });
  } catch (err) {
    console.error("[standings]", err.message);
    return res.status(500).json({ error: err.message });
  }
}
