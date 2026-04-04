const BASE = "https://www.thesportsdb.com/api/v1/json/123";

function normalize(e) {
  if (!e) return null;
  return {
    home:      e.strHomeTeam,
    away:      e.strAwayTeam,
    homeScore: e.intHomeScore !== "" ? e.intHomeScore : null,
    awayScore: e.intAwayScore !== "" ? e.intAwayScore : null,
    date:      e.dateEvent,
    status:    e.strStatus,
  };
}

export default async function handler(req, res) {
  const { teamId } = req.query;
  if (!teamId) return res.status(400).json({ error: "Missing teamId." });

  try {
    const [lastRes, nextRes] = await Promise.all([
      fetch(`${BASE}/eventslast.php?id=${teamId}`),
      fetch(`${BASE}/eventsnext.php?id=${teamId}`),
    ]);
    const [lastData, nextData] = await Promise.all([lastRes.json(), nextRes.json()]);

    const lastGame = normalize((lastData.results || []).at(-1));
    const nextGame = normalize((nextData.events || [])[0]);

    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=600");
    return res.status(200).json({ lastGame, nextGame });
  } catch (err) {
    console.error("[scores]", err.message);
    return res.status(500).json({ error: err.message });
  }
}
