/**
 * api/scores.js — last game + next game per team
 * Cached 1 hour.
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
  if (!res.ok) throw new Error(`API-Sports ${sport} ${res.status}`);
  return res.json();
}

function normalize(sport, g) {
  try {
    if (sport === "NFL") return {
      home: g.teams?.home?.name, away: g.teams?.away?.name,
      homeScore: g.scores?.home?.total, awayScore: g.scores?.away?.total,
      date: g.game?.date?.date || g.game?.date, status: g.game?.status?.short,
    };
    if (sport === "NBA") return {
      home: g.teams?.home?.name, away: g.teams?.visitors?.name,
      homeScore: g.scores?.home?.points, awayScore: g.scores?.visitors?.points,
      date: g.date?.start, status: g.status?.short,
    };
    if (sport === "MLB") return {
      home: g.teams?.home?.name, away: g.teams?.away?.name,
      homeScore: g.scores?.home?.total, awayScore: g.scores?.away?.total,
      date: g.date, status: g.status?.short,
    };
    if (sport === "NHL") return {
      home: g.teams?.home?.name, away: g.teams?.away?.name,
      homeScore: g.scores?.home, awayScore: g.scores?.away,
      date: g.date, status: g.status?.short,
    };
    if (sport === "FIFA") return {
      home: g.teams?.home?.name, away: g.teams?.away?.name,
      homeScore: g.goals?.home, awayScore: g.goals?.away,
      date: g.fixture?.date, status: g.fixture?.status?.short,
    };
  } catch { return null; }
  return null;
}

export default async function handler(req, res) {
  const { teamId, sport, season } = req.query;
  if (!teamId || !sport || !HOSTS[sport]) return res.status(400).json({ error: "Missing params." });
  try {
    const paths = {
      NFL:  `/games?team=${teamId}&season=${season || "2024"}`,
      NBA:  `/games?team=${teamId}&season=${season || "2024-2025"}`,
      MLB:  `/games?team=${teamId}&season=${season || "2025"}`,
      NHL:  `/games?team=${teamId}&season=${season || "2024"}`,
      FIFA: `/fixtures?team=${teamId}&season=${season || "2025"}&last=10&next=3`,
    };
    const data  = await fetchSport(sport, paths[sport]);
    const games = (data.response || []).map(g => normalize(sport, g)).filter(Boolean);
    const done  = games.filter(g => g.homeScore !== null && g.homeScore !== undefined);
    const upcoming = games.filter(g => g.status === "NS" || g.status === "TBD");
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=600");
    return res.status(200).json({ lastGame: done.at(-1) || null, nextGame: upcoming[0] || null });
  } catch (err) {
    console.error("[scores]", err.message);
    return res.status(500).json({ error: err.message });
  }
}
