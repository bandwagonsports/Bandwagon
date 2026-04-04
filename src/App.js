import { Search, Award, Shield, Zap, ChevronRight, Layout, RefreshCw, Trophy, Users, BarChart3, Info } from "lucide-react";
import { useState, useEffect, useMemo, useCallback } from "react";

// ─── Worn All-Star Palette ────────────────────────────────────────────────
const C = {
  bg:      "#1D2329",
  bgCard:  "#232B33",
  bgDeep:  "#181E24",
  cream:   "#F4E8C1",
  tan:     "#D2B48C",
  red:     "#E13054",
  blue:    "#6C8EAD",
  gold:    "#F5C842",
  midnight:"#1D2329",
  dusty:   "#C9D6DF",
};

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`;

// ─── Teams & Leagues ──────────────────────────────────────────────────────
// teamId = API-Sports numeric ID
// leagueId = API-Sports league ID for standings
// season = current active season string

const SPORTS = [
  { id: "NFL",  label: "NFL",      emoji: "🏈" },
  { id: "NBA",  label: "NBA",      emoji: "🏀" },
  { id: "MLB",  label: "MLB",      emoji: "⚾"  },
  { id: "NHL",  label: "NHL",      emoji: "🏒" },
  { id: "FIFA", label: "World Cup",emoji: "🌍" },
];

const LEAGUE_META = {
  NFL:  { leagueId: "4391", season: "2025" },
  NBA:  { leagueId: "4387", season: "2025-2026" },
  MLB:  { leagueId: "4424", season: "2026" },
  NHL:  { leagueId: "4380", season: "2025-2026" },
};

const TEAMS = {
  NFL: [
    { id: "134936", name: "Eagles",   city: "Philadelphia",  color: "#004C54", accent: "#A5ACAF" },
    { id: "134934", name: "Cowboys",  city: "Dallas",        color: "#003594", accent: "#869397" },
    { id: "134931", name: "Chiefs",   city: "Kansas City",   color: "#E31837", accent: "#FFB81C" },
    { id: "134948", name: "49ers",    city: "San Francisco", color: "#AA0000", accent: "#B3995D" },
    { id: "134940", name: "Packers",  city: "Green Bay",     color: "#203731", accent: "#FFB612" },
    { id: "134918", name: "Bills",    city: "Buffalo",       color: "#00338D", accent: "#C60C30" },
    { id: "134920", name: "Patriots", city: "New England",   color: "#002244", accent: "#C60C30" },
    { id: "134935", name: "Giants",   city: "New York",      color: "#0B2265", accent: "#A71930" },
  ],
  NBA: [
    { id: "134867", name: "Lakers",   city: "Los Angeles",   color: "#552583", accent: "#FDB927" },
    { id: "134860", name: "Celtics",  city: "Boston",        color: "#007A33", accent: "#BA9653" },
    { id: "134865", name: "Warriors", city: "Golden State",  color: "#1D428A", accent: "#FFC72C" },
    { id: "134863", name: "76ers",    city: "Philadelphia",  color: "#006BB6", accent: "#F58426" },
    { id: "134882", name: "Heat",     city: "Miami",         color: "#98002E", accent: "#F9A01B" },
    { id: "134870", name: "Bulls",    city: "Chicago",       color: "#CE1141", accent: "#cccccc" },
    { id: "134885", name: "Nuggets",  city: "Denver",        color: "#0E2240", accent: "#FEC524" },
    { id: "134874", name: "Bucks",    city: "Milwaukee",     color: "#00471B", accent: "#EEE1C6" },
  ],
  MLB: [
    { id: "135260", name: "Yankees",  city: "New York",      color: "#003087", accent: "#E4002C" },
    { id: "135252", name: "Red Sox",  city: "Boston",        color: "#BD3039", accent: "#aaaaaa" },
    { id: "135272", name: "Dodgers",  city: "Los Angeles",   color: "#005A9C", accent: "#EF3E42" },
    { id: "135256", name: "Astros",   city: "Houston",       color: "#002D62", accent: "#EB6E1F" },
    { id: "135268", name: "Braves",   city: "Atlanta",       color: "#CE1141", accent: "#aaaaaa" },
    { id: "135269", name: "Cubs",     city: "Chicago",       color: "#0E3386", accent: "#CC3433" },
    { id: "135276", name: "Phillies", city: "Philadelphia",  color: "#E81828", accent: "#002D72" },
    { id: "135279", name: "Giants",   city: "San Francisco", color: "#FD5A1E", accent: "#27251F" },
  ],
  NHL: [
    { id: "134830", name: "Bruins",      city: "Boston",      color: "#7a5c00", accent: "#FFB81C" },
    { id: "133642", name: "Rangers",     city: "New York",    color: "#0038A8", accent: "#CE1126" },
    { id: "134844", name: "Penguins",    city: "Pittsburgh",  color: "#333333", accent: "#FCB514" },
    { id: "134837", name: "Maple Leafs", city: "Toronto",     color: "#003E7E", accent: "#aaccee" },
    { id: "134855", name: "Avalanche",   city: "Colorado",    color: "#6F263D", accent: "#aaaacc" },
    { id: "134832", name: "Red Wings",   city: "Detroit",     color: "#CE1126", accent: "#cccccc" },
  ],
};

const BADGES = [
  { id: "rookie",  emoji: "🧢", label: "Rookie",        desc: "First check-in",  days: 1   },
  { id: "hat",     emoji: "🎩", label: "Hat Trick",     desc: "3-day streak",    days: 3   },
  { id: "home",    emoji: "🏟", label: "Home Game",     desc: "7-day streak",    days: 7   },
  { id: "run",     emoji: "🔥", label: "On a Run",      desc: "14-day streak",   days: 14  },
  { id: "season",  emoji: "🎟", label: "Season Ticket", desc: "30-day streak",   days: 30  },
  { id: "film",    emoji: "📼", label: "Film Junkie",   desc: "50-day streak",   days: 50  },
  { id: "champ",   emoji: "🏆", label: "Champion",      desc: "180-day streak",  days: 180 },
  { id: "goat",    emoji: "🐐", label: "GOAT",          desc: "365-day streak",  days: 365 },
];

function ratingColor(r) {
  if (!r) return C.dusty;
  if (r[0] === "A") return "#4ade80";
  if (r[0] === "B") return C.blue;
  if (r[0] === "C") return C.gold;
  return C.red;
}

function formatDate(dateStr) {
  if (!dateStr) return "TBD";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  } catch { return dateStr; }
}

function formatScore(game) {
  if (!game) return "";
  if (game.homeScore == null) return "Upcoming";
  return `${game.home} ${game.homeScore} – ${game.awayScore} ${game.away}`;
}

// ─── CSS ──────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;800;900&family=Barlow:wght@400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
::-webkit-scrollbar{display:none}
body{background:${C.bg}}
.card{background:${C.bgCard};border-radius:14px;overflow:hidden;position:relative}
.card::after{content:'';position:absolute;inset:0;background:${GRAIN};pointer-events:none;border-radius:14px}
.pill{display:inline-block;padding:3px 10px;border-radius:100px;font-size:10px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;font-family:'Barlow',sans-serif}
.tab-btn{flex:1;padding:10px 2px 8px;text-align:center;font-size:10px;font-weight:700;letter-spacing:.3px;text-transform:uppercase;font-family:'Barlow',sans-serif;border:none;background:transparent;cursor:pointer}
.sw-btn{flex-shrink:0;padding:6px 13px;border-radius:20px;border:none;cursor:pointer;font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:800;white-space:nowrap;transition:all .2s}
.chip{padding:12px;border-radius:12px;cursor:pointer;text-align:center;border:2px solid ${C.dusty}33;background:${C.bgCard};transition:all .2s;position:relative;overflow:hidden}
.chip::after{content:'';position:absolute;inset:0;background:${GRAIN};pointer-events:none}
.trow{display:flex;align-items:center;padding:13px 14px;border-radius:12px;cursor:pointer;border:2px solid ${C.dusty}33;background:${C.bgCard};margin-bottom:8px;transition:all .2s;position:relative;overflow:hidden}
.trow::after{content:'';position:absolute;inset:0;background:${GRAIN};pointer-events:none}
.cal-cell{width:100%;aspect-ratio:1;display:flex;flex-direction:column;align-items:center;justify-content:center;border-radius:8px;cursor:pointer}
.ai{animation:su .3s ease forwards;opacity:0}
@keyframes su{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
.bump{animation:bmp .5s ease}
@keyframes bmp{0%{transform:scale(1)}40%{transform:scale(1.3)}100%{transform:scale(1)}}
.pulse{animation:pl 1.5s ease-in-out infinite}
@keyframes pl{0%,100%{opacity:1}50%{opacity:0.4}}
`;

const TABS = ["Home", "Schedule", "Roster", "Water Cooler"];

// ─── Component ────────────────────────────────────────────────────────────
export default function Bandwagon() {
  // ── Onboarding state
  const [screen,    setScreen]    = useState("sports");
  const [selSports, setSelSports] = useState([]);
  const [selTeams,  setSelTeams]  = useState({});
  const [sportStep, setSportStep] = useState(0);

  // ── App state
  const [activeTab,  setActiveTab]  = useState("Home");
  const [activeKey,  setActiveKey]  = useState(null);
  const [streakOpen, setStreakOpen] = useState(false);
  const [bumping,    setBumping]    = useState(false);
  const [streak,     setStreak]     = useState(12);
  const [checkedIn,  setCheckedIn]  = useState(false);
  const [openPos,    setOpenPos]    = useState(null);
  const [selDate,    setSelDate]    = useState(null);

  // ── API data state
  const [meat,         setMeat]         = useState(null);   // Gemini agent output
  const [meatLoading,  setMeatLoading]  = useState(false);
  const [scores,       setScores]       = useState(null);   // last + next game
  const [scoresLoading,setScoresLoading]= useState(false);
  const [roster,       setRoster]       = useState(null);   // on-demand roster
  const [rosterLoading,setRosterLoading]= useState(false);
  const [rosterError,  setRosterError]  = useState(null);

  // ── Derived team info
  const allTeams = [];
  selSports.forEach(sp => {
    (selTeams[sp] || []).forEach(tid => {
      const t = (TEAMS[sp] || []).find(x => x.id === tid);
      if (t) allTeams.push({ sp, tid, t, key: `${sp}:${tid}` });
    });
  });

  const curKey = activeKey || (allTeams[0] ? allTeams[0].key : null);
  const cur    = allTeams.find(x => x.key === curKey) || allTeams[0] || null;
  const team   = cur?.t || null;
  const sport  = cur?.sp || selSports[0] || "NFL";
  const tc     = team?.color  || C.bgDeep;
  const ta     = team?.accent || C.gold;
  const meta   = LEAGUE_META[sport] || LEAGUE_META.NFL;

  // ── Fetch Gemini agent content when team changes
  useEffect(() => {
    if (!team) return;
    let cancelled = false;
    async function loadMeat() {
      setMeatLoading(true);
      setMeat(null);
      try {
        const res  = await fetch(`/api/get-meat?teamId=${team.id}&teamName=${encodeURIComponent(team.name)}&sport=${sport}&season=${meta.season}`);
        const data = await res.json();
        if (!cancelled) setMeat(data);
      } catch {
        if (!cancelled) setMeat({ whatYouMissed: "The Professor is reviewing the tape. Try again shortly.", hotTakes: null, waterCooler: "Agents are huddling. Refresh in a moment." });
      }
      if (!cancelled) setMeatLoading(false);
    }
    loadMeat();
    return () => { cancelled = true; };
  }, [team?.id, sport]);

  // ── Fetch scores when team changes
  useEffect(() => {
    if (!team) return;
    let cancelled = false;
    async function loadScores() {
      setScoresLoading(true);
      setScores(null);
      try {
        const res  = await fetch(`/api/scores?teamId=${team.id}&sport=${sport}&season=${meta.season}`);
        const data = await res.json();
        if (!cancelled) setScores(data);
      } catch {
        if (!cancelled) setScores(null);
      }
      if (!cancelled) setScoresLoading(false);
    }
    loadScores();
    return () => { cancelled = true; };
  }, [team?.id, sport]);

  // ── Fetch roster on-demand when Roster tab opened
  useEffect(() => {
    if (activeTab !== "Roster" || !team) return;
    if (roster?.teamId === team.id) return; // already loaded for this team
    let cancelled = false;
    async function loadRoster() {
      setRosterLoading(true);
      setRosterError(null);
      setRoster(null);
      try {
        const res  = await fetch(`/api/roster?teamId=${team.id}&sport=${sport}`);
        const data = await res.json();
        if (!cancelled) setRoster({ ...data, teamId: team.id });
      } catch (err) {
        if (!cancelled) { setRosterError("Could not load roster. Try again."); setRoster(null); }
      }
      if (!cancelled) setRosterLoading(false);
    }
    loadRoster();
    return () => { cancelled = true; };
  }, [activeTab, team?.id, sport]);

  // ── Calendar helpers
  const today    = new Date();
  const monthStr = today.toLocaleString("default", { month: "long" });
  const dim      = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const fdow     = new Date(today.getFullYear(), today.getMonth(), 1).getDay();

  // ── Streak helpers
  const nextBadge = BADGES.find(b => streak < b.days) || null;
  const pct       = nextBadge ? Math.min((streak / nextBadge.days) * 100, 100) : 100;

  function tapStreak() {
    if (!checkedIn) {
      setCheckedIn(true);
      setStreak(s => s + 1);
      setBumping(true);
      setTimeout(() => setBumping(false), 600);
    }
    setStreakOpen(o => !o);
  }

  function switchTeam(key) {
    setActiveKey(key);
    setSelDate(null);
    setOpenPos(null);
    setStreakOpen(false);
    setRoster(null); // force roster reload for new team
  }

  function toggleSport(id) {
    setSelSports(p => p.includes(id) ? p.filter(s => s !== id) : [...p, id]);
  }

  function toggleTeam(sp, tid) {
    setSelTeams(p => {
      const cur = p[sp] || [];
      return { ...p, [sp]: cur.includes(tid) ? cur.filter(x => x !== tid) : [...cur, tid] };
    });
  }

  // ── Loading shimmer component
  function Shimmer({ lines = 3 }) {
    return (
      <div style={{ padding: "14px 0" }}>
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="pulse" style={{ height: 14, borderRadius: 6, background: C.bgDeep, marginBottom: 10, width: i === lines - 1 ? "60%" : "100%" }} />
        ))}
      </div>
    );
  }

  // ─── Render ─────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", background: C.bg, minHeight: "100vh", color: C.cream, maxWidth: 430, margin: "0 auto", position: "relative" }}>
      <style>{CSS}</style>

      {/* ── Streak Drawer — fixed at root, never clipped ── */}
      {streakOpen && screen === "app" && (
        <>
          <div style={{ position: "fixed", inset: 0, zIndex: 90 }} onClick={() => setStreakOpen(false)} />
          <div style={{ position: "fixed", top: 110, right: "calc(50% - 197px)", zIndex: 100, width: 290, maxHeight: "80vh", overflowY: "auto", background: C.bgCard, border: `1px solid ${C.dusty}33`, borderRadius: 16, padding: 18, boxShadow: "0 8px 40px #000c" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 17, fontWeight: 900, color: C.cream, marginBottom: 3 }}>🔥 Winning Streak</div>
                <div style={{ fontSize: 11, color: C.dusty, fontFamily: "'Barlow',sans-serif" }}>
                  {checkedIn ? "Checked in today. See you tomorrow!" : "Tap below to check in."}
                </div>
              </div>
              <div style={{ textAlign: "center", marginLeft: 12 }}>
                <div style={{ fontSize: 34, fontWeight: 900, lineHeight: 1, color: checkedIn ? C.gold : C.cream, textShadow: checkedIn ? "0 0 14px #F5C84288" : "none" }}>{streak}</div>
                <div style={{ fontSize: 9, color: C.dusty, fontFamily: "'Barlow',sans-serif" }}>days</div>
              </div>
            </div>
            {nextBadge && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: C.dusty, fontFamily: "'Barlow',sans-serif" }}>Next: {nextBadge.emoji} {nextBadge.label}</span>
                  <span style={{ fontSize: 11, color: C.dusty, fontFamily: "'Barlow',sans-serif" }}>{streak}/{nextBadge.days}d</span>
                </div>
                <div style={{ height: 5, borderRadius: 3, background: C.bgDeep, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, borderRadius: 3, background: C.gold, transition: "width .6s ease" }} />
                </div>
              </div>
            )}
            <div style={{ fontSize: 10, fontWeight: 700, color: C.dusty, letterSpacing: .5, marginBottom: 10, fontFamily: "'Barlow',sans-serif" }}>YOUR BADGES</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {BADGES.map(b => {
                const earned = streak >= b.days;
                return (
                  <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 12px", borderRadius: 10, background: earned ? "#2a2100" : C.bgDeep, border: `1px solid ${earned ? C.gold + "55" : C.dusty + "22"}`, opacity: earned ? 1 : 0.4 }}>
                    <span style={{ fontSize: 22, flexShrink: 0 }}>{b.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: earned ? C.gold : C.dusty }}>{b.label}</div>
                      <div style={{ fontSize: 10, color: C.dusty, fontFamily: "'Barlow',sans-serif", marginTop: 1 }}>{b.desc}</div>
                    </div>
                    {earned ? <span style={{ fontSize: 11, color: C.gold, fontWeight: 700 }}>✓</span> : <span style={{ fontSize: 10, color: C.dusty, fontFamily: "'Barlow',sans-serif" }}>{b.days - streak}d</span>}
                  </div>
                );
              })}
            </div>
            {!checkedIn && (
              <button onClick={tapStreak} style={{ marginTop: 14, width: "100%", padding: 11, borderRadius: 11, border: "none", background: C.gold, color: C.midnight, fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "'Barlow Condensed',sans-serif" }}>
                Check In Today
              </button>
            )}
          </div>
        </>
      )}

      {/* ── ONBOARDING: SPORTS ── */}
      {screen === "sports" && (
        <div style={{ padding: "60px 22px 40px", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          <span className="pill" style={{ background: C.gold, color: C.midnight, marginBottom: 14, display: "inline-block" }}>BANDWAGON</span>
          <h1 style={{ fontSize: 40, fontWeight: 900, letterSpacing: -1, lineHeight: 1, marginBottom: 10, color: C.cream }}>Pick your<br/>sports.</h1>
          <p style={{ fontSize: 14, color: C.dusty, fontFamily: "'Barlow',sans-serif", marginBottom: 28 }}>We will keep you in the loop — no stats required.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, flex: 1 }}>
            {SPORTS.map(s => {
              const on = selSports.includes(s.id);
              return (
                <div key={s.id} className="chip" onClick={() => toggleSport(s.id)}
                  style={{ borderColor: on ? C.gold : C.dusty + "44", background: on ? "#2a2100" : C.bgCard, boxShadow: on ? "0 0 14px #F5C84244" : "none", color: on ? C.gold : C.dusty }}>
                  <div style={{ fontSize: 26, marginBottom: 4 }}>{s.emoji}</div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{s.label}</div>
                  {on && <div style={{ fontSize: 11, marginTop: 3, fontFamily: "'Barlow',sans-serif" }}>Selected</div>}
                </div>
              );
            })}
          </div>
          <button onClick={() => selSports.length > 0 && setScreen("teams")}
            style={{ marginTop: 24, width: "100%", padding: 15, borderRadius: 14, border: "none", fontFamily: "'Barlow Condensed',sans-serif", fontSize: 18, fontWeight: 800, cursor: selSports.length > 0 ? "pointer" : "default", background: selSports.length > 0 ? C.gold : C.bgCard, color: selSports.length > 0 ? C.midnight : C.dusty }}>
            {selSports.length > 0 ? `Continue — ${selSports.length} sport${selSports.length > 1 ? "s" : ""}` : "Select at least one"}
          </button>
        </div>
      )}

      {/* ── ONBOARDING: TEAMS ── */}
      {screen === "teams" && (
        <div style={{ padding: "60px 22px 40px", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
            <button onClick={() => setScreen("sports")} style={{ background: C.bgCard, border: `1px solid ${C.dusty}44`, color: C.cream, borderRadius: 10, padding: "7px 13px", cursor: "pointer", fontFamily: "'Barlow',sans-serif", fontSize: 13 }}>Back</button>
            <span className="pill" style={{ background: C.bgCard, color: C.dusty, border: `1px solid ${C.dusty}33` }}>{sportStep + 1} / {selSports.length}</span>
          </div>
          {selSports.map((sid, idx) => {
            const sp = SPORTS.find(x => x.id === sid);
            return (
              <div key={sid} style={{ display: idx === sportStep ? "flex" : "none", flexDirection: "column", flex: 1 }}>
                <h1 style={{ fontSize: 36, fontWeight: 900, letterSpacing: -1, marginBottom: 4, color: C.cream }}>{sp.emoji} {sp.label}</h1>
                <p style={{ fontSize: 13, color: C.dusty, fontFamily: "'Barlow',sans-serif", marginBottom: 20 }}>Choose your team(s)</p>
                <div style={{ overflowY: "auto", maxHeight: "58vh" }}>
                  {(TEAMS[sid] || []).map(tm => {
                    const on = (selTeams[sid] || []).includes(tm.id);
                    return (
                      <div key={tm.id} className="trow" onClick={() => toggleTeam(sid, tm.id)}
                        style={{ borderColor: on ? C.gold : C.dusty + "33", background: on ? "#2a2100" : C.bgCard, boxShadow: on ? "0 0 10px #F5C84233" : "none" }}>
                        <div style={{ width: 34, height: 34, borderRadius: 9, background: tm.color, display: "flex", alignItems: "center", justifyContent: "center", marginRight: 12, fontSize: 9, fontWeight: 900, color: tm.accent, flexShrink: 0 }}>
                          {tm.name.substring(0, 3).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontSize: 17, fontWeight: 800, color: on ? C.gold : C.cream }}>{tm.name}</div>
                          <div style={{ fontSize: 11, color: C.dusty, fontFamily: "'Barlow',sans-serif" }}>{tm.city}</div>
                        </div>
                        {on && <div style={{ marginLeft: "auto", width: 22, height: 22, borderRadius: "50%", background: C.gold, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: C.midnight, fontWeight: 900 }}>✓</div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            {sportStep > 0 && (
              <button onClick={() => setSportStep(i => i - 1)} style={{ flex: 1, padding: 13, borderRadius: 13, border: `2px solid ${C.dusty}44`, background: "transparent", color: C.cream, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'Barlow Condensed',sans-serif" }}>Prev</button>
            )}
            <button onClick={() => sportStep < selSports.length - 1 ? setSportStep(i => i + 1) : setScreen("app")}
              style={{ flex: 2, padding: 13, borderRadius: 13, border: "none", background: C.gold, color: C.midnight, fontSize: 17, fontWeight: 800, cursor: "pointer", fontFamily: "'Barlow Condensed',sans-serif" }}>
              {sportStep < selSports.length - 1 ? "Next Sport" : "Let's Go!"}
            </button>
          </div>
        </div>
      )}

      {/* ── MAIN APP ── */}
      {screen === "app" && (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>

          {/* Header */}
          <div style={{ padding: "52px 18px 14px", background: `linear-gradient(160deg, ${tc}cc 0%, ${C.bg} 65%)`, borderBottom: `1px solid ${C.dusty}22`, position: "relative" }}>
            <div style={{ position: "absolute", inset: 0, background: GRAIN, pointerEvents: "none" }} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, position: "relative" }}>
              <span className="pill" style={{ background: C.red, color: "#fff", fontSize: 12, padding: "4px 12px" }}>BANDWAGON</span>
              <button onClick={tapStreak} style={{ display: "flex", alignItems: "center", gap: 6, background: checkedIn ? "#1c2200" : C.bgCard, border: `1px solid ${checkedIn ? C.gold + "77" : C.dusty + "44"}`, borderRadius: 20, padding: "6px 14px", cursor: "pointer", boxShadow: checkedIn ? "0 0 10px #F5C84244" : "none" }}>
                <span className={bumping ? "bump" : ""} style={{ fontSize: 15 }}>🔥</span>
                <span style={{ fontSize: 18, fontWeight: 900, color: checkedIn ? C.gold : C.cream }}>{streak}</span>
                <span style={{ fontSize: 10, color: checkedIn ? C.gold : C.dusty, fontFamily: "'Barlow',sans-serif", fontWeight: 600 }}>{checkedIn ? "done" : "streak"}</span>
              </button>
            </div>
            {allTeams.length > 0 && (
              <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2, position: "relative" }}>
                {allTeams.map(entry => {
                  const active = entry.key === curKey;
                  return (
                    <button key={entry.key} className="sw-btn" onClick={() => switchTeam(entry.key)}
                      style={{ background: active ? entry.t.color : C.bgDeep, color: active ? entry.t.accent : C.dusty, boxShadow: active ? `0 0 12px ${entry.t.color}88` : "none", border: `1px solid ${active ? entry.t.accent + "44" : C.dusty + "22"}` }}>
                      {entry.sp} · {entry.t.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Nav tabs */}
          <div style={{ display: "flex", background: C.bgDeep, borderBottom: `1px solid ${C.dusty}22`, position: "sticky", top: 0, zIndex: 20 }}>
            {TABS.map(tab => (
              <button key={tab} className="tab-btn" style={{ color: activeTab === tab ? C.gold : C.dusty }}
                onClick={() => { setActiveTab(tab); setStreakOpen(false); }}>
                {tab}
                {activeTab === tab && <div style={{ height: 2, background: C.gold, borderRadius: 2, marginTop: 4 }} />}
              </button>
            ))}
          </div>

          {/* Content */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 100px" }}>

            {/* ── HOME ── */}
            {activeTab === "Home" && (
              <div>
                {!team ? (
                  <div style={{ textAlign: "center", padding: "60px 20px", color: C.dusty }}>
                    <div style={{ fontSize: 38, marginBottom: 12 }}>🏆</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: C.cream, marginBottom: 8 }}>No team selected</div>
                    <button onClick={() => setScreen("sports")} style={{ padding: "11px 22px", background: C.gold, border: "none", borderRadius: 12, color: C.midnight, fontWeight: 800, cursor: "pointer", fontFamily: "'Barlow Condensed',sans-serif", fontSize: 15 }}>Pick Teams</button>
                  </div>
                ) : (
                  <>
                    {/* What You Missed */}
                    <div className="ai" style={{ marginBottom: 12 }}>
                      <div className="card" style={{ border: `1px solid ${tc}55` }}>
                        <div style={{ padding: "11px 15px 8px", background: `linear-gradient(90deg, ${tc}66, transparent)`, display: "flex", alignItems: "center", gap: 8 }}>
                          <span className="pill" style={{ background: C.red + "33", color: C.red }}>WHAT YOU MISSED</span>
                          {scores?.lastGame && (
                            <span style={{ fontSize: 11, color: C.dusty, fontFamily: "'Barlow',sans-serif" }}>{formatScore(scores.lastGame)}</span>
                          )}
                        </div>
                        <div style={{ padding: "10px 15px 15px" }}>
                          {meatLoading ? <Shimmer lines={3} /> : (
                            <p style={{ fontSize: 13, lineHeight: 1.65, color: C.cream, fontFamily: "'Barlow',sans-serif" }}>
                              {meat?.whatYouMissed || "Loading game summary..."}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Up Next */}
                    <div className="ai" style={{ marginBottom: 12, animationDelay: ".07s" }}>
                      <div className="card" style={{ border: `1px solid ${C.dusty}22` }}>
                        <div style={{ padding: "11px 15px 7px" }}>
                          <span className="pill" style={{ background: C.blue + "33", color: C.blue }}>UP NEXT</span>
                        </div>
                        <div style={{ padding: "8px 15px 15px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          {scoresLoading ? <Shimmer lines={2} /> : scores?.nextGame ? (
                            <>
                              <div>
                                <div style={{ fontSize: 20, fontWeight: 900, color: C.cream }}>
                                  vs {scores.nextGame.home === team.name ? scores.nextGame.away : scores.nextGame.home}
                                </div>
                                <div style={{ fontSize: 12, color: C.dusty, fontFamily: "'Barlow',sans-serif", marginTop: 2 }}>{formatDate(scores.nextGame.date)}</div>
                              </div>
                              <div style={{ width: 46, height: 46, borderRadius: 11, background: C.bgDeep, border: `1px solid ${C.dusty}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: C.dusty }}>
                                {(scores.nextGame.home === team.name ? scores.nextGame.away : scores.nextGame.home).substring(0, 3).toUpperCase()}
                              </div>
                            </>
                          ) : (
                            <div style={{ fontSize: 13, color: C.dusty, fontFamily: "'Barlow',sans-serif" }}>No upcoming game found.</div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Hot Takes preview — links to Water Cooler */}
                    {meat?.hotTakes && (
                      <div className="ai" style={{ marginBottom: 12, animationDelay: ".14s" }}>
                        <div className="card" style={{ border: `1px solid ${C.dusty}22` }}>
                          <div style={{ padding: "11px 15px 7px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span className="pill" style={{ background: C.gold + "33", color: C.gold }}>HOT TAKES</span>
                            <button onClick={() => setActiveTab("Water Cooler")} style={{ fontSize: 10, color: C.dusty, background: "none", border: "none", cursor: "pointer", fontFamily: "'Barlow',sans-serif" }}>See full breakdown →</button>
                          </div>
                          <div style={{ padding: "6px 15px 14px" }}>
                            {meat.hotTakes.slice(0, 2).map((item, i) => (
                              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: i === 0 ? `1px solid ${C.dusty}18` : "none" }}>
                                <span className="pill" style={{ background: C.bgDeep, color: C.dusty, flexShrink: 0 }}>{item.label}</span>
                                <span style={{ fontSize: 18, fontWeight: 900, color: ratingColor(item.rating), flexShrink: 0 }}>{item.rating}</span>
                                <span style={{ fontSize: 12, color: C.tan, fontFamily: "'Barlow',sans-serif", lineHeight: 1.4 }}>{item.take}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* ── SCHEDULE ── */}
            {activeTab === "Schedule" && team && (
              <div>
                {/* Record banner */}
                <div className="card ai" style={{ marginBottom: 14, padding: "14px 16px", border: `1px solid ${C.dusty}22`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.dusty, fontFamily: "'Barlow',sans-serif", letterSpacing: .5, marginBottom: 4 }}>THIS SEASON</div>
                    {scoresLoading ? <Shimmer lines={1} /> : (
                      <div style={{ fontSize: 32, fontWeight: 900, color: C.cream, letterSpacing: -1 }}>
                        {scores?.lastGame ? formatScore(scores.lastGame) : "Season data loading..."}
                      </div>
                    )}
                  </div>
                  <div style={{ width: 52, height: 52, borderRadius: 13, background: tc, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 900, color: ta, boxShadow: `0 0 14px ${tc}66` }}>
                    {team.name.substring(0, 3).toUpperCase()}
                  </div>
                </div>

                <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 12, letterSpacing: -0.5, color: C.cream }}>{monthStr} {today.getFullYear()}</div>

                {/* Calendar — game dots pulled from scores API */}
                <div className="card" style={{ padding: 14, marginBottom: 14 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, marginBottom: 8 }}>
                    {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
                      <div key={d} style={{ textAlign: "center", fontSize: 10, color: C.dusty, fontFamily: "'Barlow',sans-serif", fontWeight: 600 }}>{d}</div>
                    ))}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3 }}>
                    {Array.from({ length: fdow }).map((_, i) => <div key={"e" + i} />)}
                    {Array.from({ length: dim }).map((_, i) => {
                      const day = i + 1;
                      const isT = day === today.getDate();
                      const isNext = scores?.nextGame && formatDate(scores.nextGame.date).includes(`${day}`);
                      const isLast = scores?.lastGame && formatDate(scores.lastGame.date).includes(`${day}`);
                      const dotColor = isNext ? C.blue : isLast ? (scores.lastGame.homeScore != null ? (
                        (scores.lastGame.home === team.name && scores.lastGame.homeScore > scores.lastGame.awayScore) ||
                        (scores.lastGame.away === team.name && scores.lastGame.awayScore > scores.lastGame.homeScore)
                          ? "#4ade80" : C.red) : null) : null;
                      return (
                        <div key={day} className="cal-cell"
                          style={{ background: isT ? tc + "55" : selDate === day ? C.bgDeep : "transparent", border: isT ? `1px solid ${C.gold}` : "1px solid transparent" }}
                          onClick={() => setSelDate(selDate === day ? null : day)}>
                          <span style={{ fontSize: 12, fontWeight: isT ? 800 : 400, fontFamily: "'Barlow',sans-serif", color: isT ? C.gold : C.cream }}>{day}</span>
                          {dotColor && <div style={{ marginTop: 2, width: 6, height: 6, borderRadius: "50%", background: dotColor }} />}
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ display: "flex", gap: 14, marginTop: 12, justifyContent: "center" }}>
                    {[["#4ade80","Win"],[C.red,"Loss"],[C.blue,"Upcoming"]].map(([col, l]) => (
                      <div key={l} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <div style={{ width: 7, height: 7, borderRadius: "50%", background: col }} />
                        <span style={{ fontSize: 10, color: C.dusty, fontFamily: "'Barlow',sans-serif" }}>{l}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tapped date detail */}
                {selDate && scores?.nextGame && (
                  <div className="card ai" style={{ padding: 15, border: `1px solid ${C.gold}44` }}>
                    <div style={{ fontSize: 12, color: C.dusty, fontFamily: "'Barlow',sans-serif", marginBottom: 6 }}>{monthStr} {selDate}</div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: C.cream, marginBottom: 4 }}>
                      vs {scores.nextGame.home === team.name ? scores.nextGame.away : scores.nextGame.home}
                    </div>
                    <div style={{ fontSize: 12, color: C.tan, fontFamily: "'Barlow',sans-serif" }}>{formatDate(scores.nextGame.date)}</div>
                  </div>
                )}
              </div>
            )}

            {/* ── ROSTER ── */}
            {activeTab === "Roster" && team && (
              <div>
                <div style={{ fontSize: 26, fontWeight: 900, marginBottom: 4, letterSpacing: -0.5, color: C.cream }}>{team.name} Roster</div>
                <p style={{ fontSize: 13, color: C.dusty, fontFamily: "'Barlow',sans-serif", marginBottom: 18 }}>{sport} depth chart — tap a position to expand.</p>

                {rosterLoading && (
                  <div style={{ padding: "40px 20px", textAlign: "center" }}>
                    <div className="pulse" style={{ fontSize: 13, color: C.dusty, fontFamily: "'Barlow',sans-serif" }}>Loading roster from API-Sports...</div>
                  </div>
                )}

                {rosterError && (
                  <div className="card" style={{ padding: 16, border: `1px solid ${C.red}44`, textAlign: "center" }}>
                    <div style={{ fontSize: 13, color: C.red, fontFamily: "'Barlow',sans-serif" }}>{rosterError}</div>
                  </div>
                )}

                {roster?.roster && roster.roster.map((group, gi) => (
                  <div key={gi} style={{ marginBottom: 8 }}>
                    <button onClick={() => setOpenPos(openPos === gi ? null : gi)}
                      style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", background: openPos === gi ? "#0d1e2a" : C.bgCard, border: `1px solid ${openPos === gi ? C.blue + "55" : C.dusty + "22"}`, borderRadius: 10, padding: "7px 12px", cursor: "pointer", marginBottom: openPos === gi ? 5 : 0 }}>
                      <span style={{ fontSize: 14, fontWeight: 800, color: openPos === gi ? C.blue : C.cream }}>{group.pos}</span>
                      <span style={{ fontSize: 11, color: C.dusty }}>{openPos === gi ? "▲" : "▼"}</span>
                    </button>
                    {openPos === gi && group.players.map((p, pi) => (
                      <div key={p.id || pi} className="ai card" style={{ padding: "11px 14px", marginBottom: 6, border: `1px solid ${C.dusty}22`, animationDelay: `${pi * 0.04}s` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: 9, background: tc, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, color: ta, flexShrink: 0 }}>
                            {p.number !== "—" ? `#${p.number}` : group.pos.substring(0, 2)}
                          </div>
                          <div>
                            <div style={{ fontSize: 15, fontWeight: 800, color: C.cream }}>{p.name || "Unknown"}</div>
                            <div style={{ fontSize: 10, color: C.dusty, fontFamily: "'Barlow',sans-serif" }}>
                              {p.position}{p.age ? ` · Age ${p.age}` : ""}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}

                {!rosterLoading && !rosterError && (!roster?.roster || roster.roster.length === 0) && (
                  <div className="card" style={{ padding: 20, textAlign: "center", border: `1px solid ${C.dusty}22` }}>
                    <div style={{ fontSize: 13, color: C.dusty, fontFamily: "'Barlow',sans-serif" }}>No roster data available for this team yet.</div>
                  </div>
                )}
              </div>
            )}

            {/* ── WATER COOLER ── */}
            {activeTab === "Water Cooler" && (
              <div>
                <div style={{ fontSize: 26, fontWeight: 900, marginBottom: 4, letterSpacing: -0.5, color: C.cream }}>Water Cooler</div>
                <p style={{ fontSize: 13, color: C.dusty, fontFamily: "'Barlow',sans-serif", marginBottom: 18 }}>Everything worth knowing today. ☕</p>

                {/* Hot Takes — full set */}
                <div style={{ fontSize: 11, fontWeight: 800, color: C.dusty, letterSpacing: 1, marginBottom: 10, fontFamily: "'Barlow',sans-serif" }}>
                  HOT TAKES
                </div>
                {meatLoading ? <Shimmer lines={5} /> : meat?.hotTakes ? (
                  meat.hotTakes.map((item, i) => (
                    <div key={i} className="ai card" style={{ marginBottom: 10, padding: 16, border: `1px solid ${C.dusty}22`, borderLeft: `4px solid ${ratingColor(item.rating)}`, animationDelay: `${i * 0.06}s` }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 7 }}>
                        <span className="pill" style={{ background: C.bgDeep, color: C.dusty }}>{item.label}</span>
                        <span style={{ fontSize: 24, fontWeight: 900, color: ratingColor(item.rating), letterSpacing: -1 }}>{item.rating}</span>
                      </div>
                      <p style={{ fontSize: 13, fontFamily: "'Barlow',sans-serif", lineHeight: 1.55, color: C.cream }}>{item.take}</p>
                    </div>
                  ))
                ) : (
                  <div className="card" style={{ padding: 16, border: `1px solid ${C.dusty}22`, marginBottom: 10 }}>
                    <p style={{ fontSize: 13, color: C.dusty, fontFamily: "'Barlow',sans-serif" }}>Hot takes load after a recent game. Check back soon.</p>
                  </div>
                )}

                {/* Divider */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "18px 0 14px" }}>
                  <div style={{ flex: 1, height: 1, background: C.dusty + "22" }} />
                  <span style={{ fontSize: 10, color: C.dusty, fontFamily: "'Barlow',sans-serif", fontWeight: 700, letterSpacing: 1 }}>LEAGUE BUZZ</span>
                  <div style={{ flex: 1, height: 1, background: C.dusty + "22" }} />
                </div>

                {/* Water Cooler bullets from Gemini */}
                {meatLoading ? <Shimmer lines={3} /> : meat?.waterCooler ? (
                  <div className="card" style={{ padding: 16, border: `1px solid ${C.dusty}22`, marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                      <span style={{ fontSize: 18 }}>🎓</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: C.gold, letterSpacing: 1, fontFamily: "'Barlow',sans-serif" }}>THE PROFESSOR'S BRIEF</span>
                    </div>
                    {meat.waterCooler.split("\n").filter(l => l.trim()).map((line, i) => (
                      <p key={i} style={{ fontSize: 13, lineHeight: 1.6, color: C.cream, fontFamily: "'Barlow',sans-serif", marginBottom: 8 }}>{line}</p>
                    ))}
                  </div>
                ) : (
                  <div className="card" style={{ padding: 16, border: `1px solid ${C.dusty}22` }}>
                    <p style={{ fontSize: 13, color: C.dusty, fontFamily: "'Barlow',sans-serif" }}>Water cooler content loads with game data.</p>
                  </div>
                )}

                <div className="card" style={{ padding: 13, marginTop: 4, border: `1px solid ${C.dusty}22`, display: "flex", gap: 10, alignItems: "center" }}>
                  <span style={{ fontSize: 18 }}>🔄</span>
                  <div style={{ fontSize: 12, color: C.dusty, fontFamily: "'Barlow',sans-serif" }}>AI agents refresh every hour. Check in daily to keep your streak alive.</div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
