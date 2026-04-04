const BASE = "https://www.thesportsdb.com/api/v1/json/123";

export default async function handler(req, res) {
  const { teamId } = req.query;
  if (!teamId) return res.status(400).json({ error: "Missing teamId." });

  try {
    const r    = await fetch(`${BASE}/lookup_all_players.php?id=${teamId}`);
    const data = await r.json();
    const players = (data.player || []).map(p => ({
      id:       p.idPlayer,
      name:     p.strPlayer,
      position: p.strPosition || "—",
      number:   p.strNumber   || "—",
      age:      null,
    }));

    const groups = {};
    players.filter(p => p.name).forEach(p => {
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
