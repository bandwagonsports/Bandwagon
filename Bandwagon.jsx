import { useState, useMemo } from "react";

// ─── Worn All-Star Palette ─────────────────────────────────────────────────
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

// ─── Static Data ──────────────────────────────────────────────────────────
const SPORTS = [
  { id: "NFL",    label: "NFL",                emoji: "🏈" },
  { id: "NBA",    label: "NBA",                emoji: "🏀" },
  { id: "MLB",    label: "MLB",                emoji: "⚾"  },
  { id: "NHL",    label: "NHL",                emoji: "🏒" },
  { id: "MLS",    label: "MLS",                emoji: "⚽" },
  { id: "NCAAFB", label: "College Football",   emoji: "🏈" },
  { id: "NCAAMB", label: "College Basketball", emoji: "🏀" },
];

const TEAMS = {
  NFL: [
    { id: "phi", name: "Eagles",   city: "Philadelphia",  color: "#004C54", accent: "#A5ACAF" },
    { id: "dal", name: "Cowboys",  city: "Dallas",        color: "#003594", accent: "#869397" },
    { id: "kc",  name: "Chiefs",   city: "Kansas City",   color: "#E31837", accent: "#FFB81C" },
    { id: "sf",  name: "49ers",    city: "San Francisco", color: "#AA0000", accent: "#B3995D" },
    { id: "gb",  name: "Packers",  city: "Green Bay",     color: "#203731", accent: "#FFB612" },
    { id: "buf", name: "Bills",    city: "Buffalo",       color: "#00338D", accent: "#C60C30" },
    { id: "ne",  name: "Patriots", city: "New England",   color: "#002244", accent: "#C60C30" },
    { id: "nyg", name: "Giants",   city: "NY Giants",     color: "#0B2265", accent: "#A71930" },
  ],
  NBA: [
    { id: "bos", name: "Celtics",  city: "Boston",        color: "#007A33", accent: "#BA9653" },
    { id: "lal", name: "Lakers",   city: "Los Angeles",   color: "#552583", accent: "#FDB927" },
    { id: "gsw", name: "Warriors", city: "Golden State",  color: "#1D428A", accent: "#FFC72C" },
    { id: "mia", name: "Heat",     city: "Miami",         color: "#98002E", accent: "#F9A01B" },
    { id: "nyk", name: "Knicks",   city: "New York",      color: "#006BB6", accent: "#F58426" },
    { id: "chi", name: "Bulls",    city: "Chicago",       color: "#CE1141", accent: "#cccccc" },
    { id: "den", name: "Nuggets",  city: "Denver",        color: "#0E2240", accent: "#FEC524" },
    { id: "mil", name: "Bucks",    city: "Milwaukee",     color: "#00471B", accent: "#EEE1C6" },
  ],
  MLB: [
    { id: "nyy", name: "Yankees",   city: "New York",      color: "#003087", accent: "#E4002C" },
    { id: "bos", name: "Red Sox",   city: "Boston",        color: "#BD3039", accent: "#aaaaaa" },
    { id: "lad", name: "Dodgers",   city: "Los Angeles",   color: "#005A9C", accent: "#EF3E42" },
    { id: "hou", name: "Astros",    city: "Houston",       color: "#002D62", accent: "#EB6E1F" },
    { id: "atl", name: "Braves",    city: "Atlanta",       color: "#CE1141", accent: "#aaaaaa" },
    { id: "chc", name: "Cubs",      city: "Chicago",       color: "#0E3386", accent: "#CC3433" },
    { id: "phi", name: "Phillies",  city: "Philadelphia",  color: "#E81828", accent: "#002D72" },
    { id: "sfg", name: "SF Giants", city: "San Francisco", color: "#FD5A1E", accent: "#27251F" },
  ],
  NHL: [
    { id: "bru", name: "Bruins",      city: "Boston",     color: "#7a5c00", accent: "#FFB81C" },
    { id: "nyr", name: "Rangers",     city: "New York",   color: "#0038A8", accent: "#CE1126" },
    { id: "pit", name: "Penguins",    city: "Pittsburgh", color: "#333333", accent: "#FCB514" },
    { id: "tor", name: "Maple Leafs", city: "Toronto",    color: "#003E7E", accent: "#aaccee" },
    { id: "col", name: "Avalanche",   city: "Colorado",   color: "#6F263D", accent: "#aaaacc" },
    { id: "det", name: "Red Wings",   city: "Detroit",    color: "#CE1126", accent: "#cccccc" },
  ],
  MLS: [
    { id: "atl", name: "Atlanta Utd", city: "Atlanta",      color: "#80000A", accent: "#FFCD00" },
    { id: "lfc", name: "LAFC",        city: "Los Angeles",  color: "#111111", accent: "#C39E6D" },
    { id: "sea", name: "Sounders",    city: "Seattle",      color: "#5D9732", accent: "#0072CE" },
    { id: "phi", name: "Union",       city: "Philadelphia", color: "#071B2C", accent: "#B19B69" },
  ],
  NCAAFB: [
    { id: "ala",  name: "Crimson Tide", city: "Alabama",    color: "#9E1B32", accent: "#999999" },
    { id: "osu",  name: "Buckeyes",     city: "Ohio State", color: "#BB0000", accent: "#cccccc" },
    { id: "mich", name: "Wolverines",   city: "Michigan",   color: "#00274C", accent: "#FFCB05" },
    { id: "uga",  name: "Bulldogs",     city: "Georgia",    color: "#BA0C2F", accent: "#cccccc" },
  ],
  NCAAMB: [
    { id: "duk", name: "Blue Devils", city: "Duke",     color: "#003087", accent: "#cccccc" },
    { id: "unc", name: "Tar Heels",   city: "UNC",      color: "#4B9CD3", accent: "#cccccc" },
    { id: "ku",  name: "Jayhawks",    city: "Kansas",   color: "#0051A5", accent: "#E8000D" },
    { id: "uk",  name: "Wildcats",    city: "Kentucky", color: "#0033A0", accent: "#cccccc" },
  ],
};

// League rankings: deterministic per player id — simulates where they rank league-wide at their position
// rank is pre-assigned so it stays stable across renders
const DEPTH = {
  NFL: [
    { pos: "QB", players: [
      { id: "qb1", name: "Starter McLane",   num: 1,  age: 28, exp: "6 yrs", leagueRank: 4,  stats: ["68% CMP","31 TD","104 RTG"], role: "STARTER" },
      { id: "qb2", name: "Backup Reeves",    num: 7,  age: 24, exp: "2 yrs", leagueRank: 24, stats: ["61% CMP","8 TD", "91 RTG"],  role: "BACKUP"  },
    ]},
    { pos: "RB", players: [
      { id: "rb1", name: "Miles Carrington", num: 22, age: 26, exp: "4 yrs", leagueRank: 6,  stats: ["1,142 YDS","9 TD","4.6 AVG"], role: "STARTER" },
      { id: "rb2", name: "D. Holloway",      num: 34, age: 23, exp: "1 yr",  leagueRank: 38, stats: ["312 YDS","2 TD","4.1 AVG"],   role: "BACKUP"  },
    ]},
    { pos: "WR", players: [
      { id: "wr1", name: "T. Okafor",        num: 11, age: 27, exp: "5 yrs", leagueRank: 8,  stats: ["94 REC","1,280 YDS","11 TD"], role: "STARTER" },
      { id: "wr2", name: "D. Saunders",      num: 17, age: 25, exp: "3 yrs", leagueRank: 19, stats: ["58 REC","712 YDS","5 TD"],    role: "STARTER" },
      { id: "wr3", name: "J. Price",         num: 83, age: 22, exp: "R",     leagueRank: 67, stats: ["21 REC","244 YDS","1 TD"],    role: "BACKUP"  },
    ]},
    { pos: "TE", players: [
      { id: "te1", name: "C. Bellamy",       num: 88, age: 29, exp: "7 yrs", leagueRank: 5,  stats: ["71 REC","820 YDS","8 TD"],    role: "STARTER" },
    ]},
    { pos: "OL", players: [
      { id: "ol1", name: "B. Kowalski",      num: 74, age: 31, exp: "9 yrs", leagueRank: 3,  stats: ["16 GMS","1 PEN","98.2 PFF"],  role: "STARTER" },
      { id: "ol2", name: "R. Dade",          num: 67, age: 26, exp: "4 yrs", leagueRank: 14, stats: ["16 GMS","3 PEN","91.5 PFF"],  role: "STARTER" },
    ]},
    { pos: "DL", players: [
      { id: "dl1", name: "V. Mensah",        num: 91, age: 27, exp: "5 yrs", leagueRank: 7,  stats: ["12 SCK","44 TKL","19 TFL"],   role: "STARTER" },
      { id: "dl2", name: "A. Graves",        num: 96, age: 24, exp: "2 yrs", leagueRank: 29, stats: ["4 SCK","22 TKL","6 TFL"],     role: "BACKUP"  },
    ]},
    { pos: "LB", players: [
      { id: "lb1", name: "M. Tran",          num: 52, age: 28, exp: "6 yrs", leagueRank: 9,  stats: ["118 TKL","6 SCK","3 INT"],    role: "STARTER" },
      { id: "lb2", name: "G. Ford",          num: 55, age: 25, exp: "3 yrs", leagueRank: 21, stats: ["74 TKL","2 SCK","1 INT"],     role: "STARTER" },
    ]},
    { pos: "DB", players: [
      { id: "db1", name: "L. Chambers",      num: 24, age: 26, exp: "4 yrs", leagueRank: 11, stats: ["5 INT","18 PD","62 TKL"],     role: "STARTER" },
      { id: "db2", name: "O. Petrov",        num: 29, age: 23, exp: "1 yr",  leagueRank: 44, stats: ["1 INT","7 PD","34 TKL"],      role: "BACKUP"  },
    ]},
    { pos: "K/P", players: [
      { id: "k1",  name: "S. Larkin",        num: 4,  age: 32, exp: "10 yrs",leagueRank: 2,  stats: ["94% FG","53 LNG","21/21 XP"], role: "STARTER" },
    ]},
  ],
  NBA: [
    { pos: "PG", players: [
      { id: "pg1", name: "D. Ashford",  num: 3,  age: 26, exp: "5 yrs", leagueRank: 7,  stats: ["22.4 PPG","8.1 APG","3.2 RPG"], role: "STARTER" },
      { id: "pg2", name: "M. Salter",   num: 12, age: 23, exp: "2 yrs", leagueRank: 31, stats: ["9.1 PPG","4.8 APG","1.9 RPG"],  role: "BACKUP"  },
    ]},
    { pos: "SG", players: [
      { id: "sg1", name: "T. Wren",     num: 2,  age: 28, exp: "6 yrs", leagueRank: 12, stats: ["19.7 PPG","4.2 RPG","2.8 APG"], role: "STARTER" },
      { id: "sg2", name: "K. Ellis",    num: 21, age: 24, exp: "2 yrs", leagueRank: 38, stats: ["8.3 PPG","2.1 RPG","1.4 APG"],  role: "BACKUP"  },
    ]},
    { pos: "SF", players: [
      { id: "sf1", name: "J. Obi",      num: 14, age: 27, exp: "5 yrs", leagueRank: 9,  stats: ["18.2 PPG","6.4 RPG","3.1 APG"], role: "STARTER" },
      { id: "sf2", name: "R. Novak",    num: 23, age: 25, exp: "3 yrs", leagueRank: 27, stats: ["7.8 PPG","3.9 RPG","1.2 APG"],  role: "BACKUP"  },
    ]},
    { pos: "PF", players: [
      { id: "pf1", name: "C. Diallo",   num: 33, age: 30, exp: "8 yrs", leagueRank: 6,  stats: ["14.9 PPG","9.2 RPG","1.8 BPG"], role: "STARTER" },
      { id: "pf2", name: "B. Huang",    num: 42, age: 22, exp: "R",     leagueRank: 52, stats: ["4.2 PPG","3.1 RPG","0.6 BPG"],  role: "BACKUP"  },
    ]},
    { pos: "C", players: [
      { id: "c1",  name: "P. Morin",    num: 5,  age: 29, exp: "7 yrs", leagueRank: 4,  stats: ["16.1 PPG","11.4 RPG","2.9 BPG"],role: "STARTER" },
      { id: "c2",  name: "I. Torres",   num: 55, age: 26, exp: "3 yrs", leagueRank: 19, stats: ["5.8 PPG","5.2 RPG","1.1 BPG"],  role: "BACKUP"  },
    ]},
  ],
  MLB: [
    { pos: "SP", players: [
      { id: "sp1", name: "A. Reyes",    num: 32, age: 28, exp: "6 yrs", leagueRank: 5,  stats: ["14-6 W-L","2.91 ERA","198 K"],   role: "STARTER" },
      { id: "sp2", name: "C. Walsh",    num: 19, age: 25, exp: "3 yrs", leagueRank: 22, stats: ["9-9 W-L","3.84 ERA","142 K"],    role: "STARTER" },
      { id: "sp3", name: "D. Byrd",     num: 44, age: 31, exp: "9 yrs", leagueRank: 41, stats: ["7-8 W-L","4.21 ERA","111 K"],    role: "STARTER" },
    ]},
    { pos: "RP/CL", players: [
      { id: "cl1", name: "J. Soto",     num: 51, age: 27, exp: "5 yrs", leagueRank: 3,  stats: ["38 SV","1.82 ERA","74 K"],       role: "CLOSER"  },
      { id: "cl2", name: "M. Park",     num: 60, age: 26, exp: "3 yrs", leagueRank: 18, stats: ["8 SV","2.74 ERA","55 K"],        role: "BACKUP"  },
    ]},
    { pos: "C", players: [
      { id: "c1",  name: "R. Ibarra",   num: 12, age: 30, exp: "8 yrs", leagueRank: 8,  stats: [".281 AVG","18 HR","72 RBI"],     role: "STARTER" },
    ]},
    { pos: "INF", players: [
      { id: "if1", name: "T. Grant",    num: 3,  age: 26, exp: "4 yrs", leagueRank: 11, stats: [".309 AVG","28 HR","94 RBI"],     role: "1B"      },
      { id: "if2", name: "S. Kim",      num: 7,  age: 24, exp: "2 yrs", leagueRank: 34, stats: [".271 AVG","8 HR","41 RBI"],      role: "2B"      },
      { id: "if3", name: "L. Vargas",   num: 18, age: 29, exp: "7 yrs", leagueRank: 14, stats: [".294 AVG","14 HR","68 RBI"],     role: "SS"      },
      { id: "if4", name: "B. Quinn",    num: 25, age: 27, exp: "5 yrs", leagueRank: 17, stats: [".267 AVG","22 HR","81 RBI"],     role: "3B"      },
    ]},
    { pos: "OF", players: [
      { id: "of1", name: "N. Foster",   num: 9,  age: 28, exp: "6 yrs", leagueRank: 4,  stats: [".318 AVG","31 HR","102 RBI"],   role: "LF"      },
      { id: "of2", name: "P. Chen",     num: 24, age: 25, exp: "3 yrs", leagueRank: 29, stats: [".283 AVG","12 HR","55 RBI"],    role: "CF"      },
      { id: "of3", name: "A. Brooks",   num: 13, age: 32, exp: "10 yrs",leagueRank: 21, stats: [".271 AVG","19 HR","74 RBI"],    role: "RF"      },
    ]},
  ],
  NHL: [
    { pos: "G", players: [
      { id: "g1",  name: "V. Larsson",  num: 35, age: 29, exp: "7 yrs", leagueRank: 6,  stats: [".921 SV%","2.41 GAA","8 SO"],   role: "STARTER" },
      { id: "g2",  name: "P. Gallant",  num: 31, age: 25, exp: "2 yrs", leagueRank: 22, stats: [".908 SV%","2.98 GAA","1 SO"],   role: "BACKUP"  },
    ]},
    { pos: "D", players: [
      { id: "d1",  name: "T. Bergman",  num: 4,  age: 28, exp: "6 yrs", leagueRank: 8,  stats: ["12 G","38 A","+24"],            role: "STARTER" },
      { id: "d2",  name: "C. Marchand", num: 7,  age: 26, exp: "4 yrs", leagueRank: 19, stats: ["5 G","22 A","+11"],             role: "STARTER" },
    ]},
    { pos: "F", players: [
      { id: "f1",  name: "M. Petrov",   num: 71, age: 27, exp: "5 yrs", leagueRank: 11, stats: ["38 G","44 A","+19"],            role: "STARTER" },
      { id: "f2",  name: "J. Roux",     num: 19, age: 24, exp: "2 yrs", leagueRank: 28, stats: ["21 G","29 A","+8"],             role: "STARTER" },
      { id: "f3",  name: "D. Kane",     num: 22, age: 30, exp: "8 yrs", leagueRank: 33, stats: ["17 G","31 A","+6"],             role: "STARTER" },
    ]},
  ],
  MLS: [
    { pos: "GK", players: [
      { id: "gk1", name: "A. Silva",    num: 1,  age: 29, exp: "7 yrs", leagueRank: 5,  stats: ["9 CS","68 SV","1.1 GAA"],       role: "STARTER" },
    ]},
    { pos: "DEF", players: [
      { id: "df1", name: "R. Osei",     num: 5,  age: 27, exp: "5 yrs", leagueRank: 7,  stats: ["94 CLR","2 G","1.8 INT/G"],     role: "STARTER" },
      { id: "df2", name: "L. Martins",  num: 3,  age: 25, exp: "3 yrs", leagueRank: 16, stats: ["71 CLR","1 G","1.4 INT/G"],     role: "STARTER" },
    ]},
    { pos: "MID", players: [
      { id: "md1", name: "K. Boateng",  num: 8,  age: 26, exp: "4 yrs", leagueRank: 9,  stats: ["7 G","11 A","88 CMP%"],         role: "STARTER" },
      { id: "md2", name: "T. Novak",    num: 14, age: 24, exp: "2 yrs", leagueRank: 24, stats: ["3 G","6 A","84 CMP%"],          role: "STARTER" },
    ]},
    { pos: "FWD", players: [
      { id: "fw1", name: "C. Adeyemi",  num: 9,  age: 28, exp: "6 yrs", leagueRank: 4,  stats: ["18 G","7 A","74 SHT"],          role: "STARTER" },
      { id: "fw2", name: "J. Santos",   num: 11, age: 23, exp: "1 yr",  leagueRank: 31, stats: ["6 G","4 A","38 SHT"],           role: "STARTER" },
    ]},
  ],
  NCAAFB: [
    { pos: "QB", players: [
      { id: "qb1", name: "T. Williams", num: 1,  age: 21, exp: "Junior",   leagueRank: 3,  stats: ["67% CMP","28 TD","94 RTG"], role: "STARTER" },
      { id: "qb2", name: "R. Allen",    num: 10, age: 19, exp: "Freshman", leagueRank: 47, stats: ["59% CMP","4 TD","81 RTG"],  role: "BACKUP"  },
    ]},
    { pos: "RB", players: [
      { id: "rb1", name: "D. Jackson",  num: 22, age: 21, exp: "Junior",   leagueRank: 8,  stats: ["1,041 YDS","12 TD","5.1 AVG"], role: "STARTER" },
    ]},
    { pos: "WR", players: [
      { id: "wr1", name: "A. Moore",    num: 4,  age: 22, exp: "Senior",    leagueRank: 5,  stats: ["78 REC","1,104 YDS","9 TD"], role: "STARTER" },
      { id: "wr2", name: "B. Reed",     num: 8,  age: 20, exp: "Sophomore", leagueRank: 21, stats: ["44 REC","608 YDS","5 TD"],   role: "STARTER" },
    ]},
    { pos: "DEF", players: [
      { id: "df1", name: "C. Brown",    num: 44, age: 22, exp: "Senior",    leagueRank: 6,  stats: ["98 TKL","8 SCK","4 INT"], role: "STARTER" },
      { id: "df2", name: "M. Davis",    num: 21, age: 21, exp: "Junior",    leagueRank: 15, stats: ["72 TKL","3 SCK","2 INT"], role: "STARTER" },
    ]},
  ],
  NCAAMB: [
    { pos: "PG", players: [
      { id: "pg1", name: "J. Carter",   num: 3,  age: 20, exp: "Junior",   leagueRank: 6,  stats: ["18.4 PPG","7.2 APG","2.1 RPG"], role: "STARTER" },
    ]},
    { pos: "SG", players: [
      { id: "sg1", name: "A. Thomas",   num: 2,  age: 21, exp: "Senior",   leagueRank: 11, stats: ["16.8 PPG","3.4 RPG","2.2 APG"], role: "STARTER" },
    ]},
    { pos: "SF/PF", players: [
      { id: "sf1", name: "D. Robinson", num: 24, age: 20, exp: "Sophomore", leagueRank: 9,  stats: ["14.2 PPG","7.8 RPG","1.9 BPG"], role: "STARTER" },
      { id: "sf2", name: "K. White",    num: 11, age: 19, exp: "Freshman",  leagueRank: 44, stats: ["7.1 PPG","4.2 RPG","0.9 BPG"],  role: "BACKUP"  },
    ]},
    { pos: "C", players: [
      { id: "c1",  name: "O. Mensah",   num: 42, age: 22, exp: "Senior",   leagueRank: 3,  stats: ["12.9 PPG","10.1 RPG","3.2 BPG"], role: "STARTER" },
    ]},
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

const HOT_TAKES_WIN = [
  { label: "OFFENSE",     rating: "B+", take: "Got the job done, but don't mistake ugly wins for sustainable play. Efficiency numbers won't hold up against a real defense." },
  { label: "DEFENSE",     rating: "A-", take: "This is where the game was actually won. Locked down in the second half and made the right adjustments at halftime." },
  { label: "COACHING",    rating: "B",  take: "Nothing inspired, but the right call came when it mattered. Late-game lineup was questionable — it worked, so here we are." },
  { label: "STAR PLAYER", rating: "B+", take: "Showed up in crunch time, which is the one job. Disappearing for stretches was noticeable though. Solid, not spectacular." },
  { label: "OVERALL",     rating: "B",  take: "A win is a win. But play like this against a real contender and we are having a very different conversation." },
];

const HOT_TAKES_LOSS = [
  { label: "OFFENSE",     rating: "D+", take: "Went cold for an entire quarter and never found a way back. Can't bail out bad shot selection with prayer attempts late." },
  { label: "DEFENSE",     rating: "C-", take: "Gave up too many open looks and had no answer for their second unit. The scheme was fine — the execution was not." },
  { label: "COACHING",    rating: "C",  take: "Burned timeouts at wrong moments and kept going back to a lineup that has not worked in weeks. That is on him." },
  { label: "STAR PLAYER", rating: "D",  take: "Disappeared when the game was on the line. That is a pattern now, not a bad night. Someone needs to say it out loud." },
  { label: "OVERALL",     rating: "D+", take: "This loss was winnable. They were not outclassed — they beat themselves. Turnovers, poor rotations, no urgency." },
];

const LEAGUE_BUZZ = [
  { text: "Commissioner considering expanding playoffs — owners are split down the middle.", why: "More teams in means more chaos. Fringe contenders love this idea." },
  { text: "A blockbuster trade reportedly in the works involving two All-Stars. No names yet.", why: "Front offices are panicking. Rosters you see now may not exist by Friday." },
  { text: "Rookie of the Year race is wide open — three legit candidates with six weeks left.", why: "No frontrunner means every game matters. Great time to be watching." },
  { text: "A star skipped practice Wednesday. Team says maintenance. Reporters disagree.", why: "When beat writers push back on the injury report, something is usually up." },
  { text: "Playoff seeding gets decided in two weeks — eight teams within two games of each other.", why: "Home court could flip multiple times. Every game from here is high stakes." },
];

const TEAM_NEWS = [
  { headline: "Star player returns from injury ahead of schedule", why: "Changes the whole playoff picture — this team just got dangerous again." },
  { headline: "Major trade shakes up the Eastern Conference",       why: "Front offices are panicking. The deadline just got more interesting."  },
  { headline: "Rookie breaks franchise scoring record",             why: "Write this name down. Everyone will be talking about it."             },
  { headline: "Coach on the hot seat after third straight loss",    why: "The locker room is frustrated. A shakeup could be coming any week."   },
  { headline: "Commissioner announces playoff schedule changes",    why: "Affects home-court advantage for several top seeds — including yours." },
];

const OPPONENTS = ["Celtics","Heat","Bucks","Suns","Clippers","Warriors","Knicks","Lakers","Cowboys","Chiefs","Ravens"];
const NETWORKS  = ["ESPN","ABC","NBC","FOX","TNT","Prime Video","Peacock"];

// Deterministic seeded random — stable across renders
function srng(seed) {
  let s = (seed * 9301 + 49297) % 233280;
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}

// Build all mock data from team id — stable because srng is deterministic
function buildMock(teamId) {
  const seed  = teamId.split("").reduce((a, c) => a + c.charCodeAt(0), 17);
  const rng   = srng(seed);
  const isWin = rng() > 0.5;
  const opp   = OPPONENTS[Math.floor(rng() * OPPONENTS.length)];
  const nxt   = OPPONENTS[Math.floor(rng() * OPPONENTS.length)];
  const net   = NETWORKS[Math.floor(rng() * NETWORKS.length)];
  const s1    = Math.floor(rng() * 30 + 90);
  const s2    = Math.floor(rng() * 25 + 78);
  const score = `${Math.max(s1, s2)}-${Math.min(s1, s2)}`;
  // Season record from same seed — always consistent per team
  const wins   = Math.floor(rng() * 20 + 20);
  const losses = Math.floor(rng() * 15 + 8);
  const pctVal = (wins / (wins + losses) * 100).toFixed(1);
  // Schedule
  const today = new Date();
  const dim   = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const sched = [];
  for (let d = 1; d <= dim; d++) {
    if (rng() < 0.35) sched.push({ day: d, type: d < today.getDate() ? (rng() > 0.45 ? "win" : "loss") : "upcoming" });
  }
  return { isWin, opp, nxt, net, score, wins, losses, pctVal, hotTakes: isWin ? HOT_TAKES_WIN : HOT_TAKES_LOSS, sched };
}

function ratingColor(r) {
  if (r[0] === "A") return "#4ade80";
  if (r[0] === "B") return C.blue;
  if (r[0] === "C") return C.gold;
  return C.red;
}

function roleColor(role) {
  if (role === "STARTER") return C.gold;
  if (role === "CLOSER")  return C.red;
  if (["1B","2B","SS","3B","LF","CF","RF"].includes(role)) return C.blue;
  return C.dusty;
}

// ─── Styles ───────────────────────────────────────────────────────────────
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
`;

const TABS = ["Home", "Schedule", "Roster", "Water Cooler"];

// ─── Component ────────────────────────────────────────────────────────────
export default function Bandwagon() {
  const [screen,     setScreen]     = useState("sports");
  const [selSports,  setSelSports]  = useState([]);
  const [selTeams,   setSelTeams]   = useState({});
  const [sportStep,  setSportStep]  = useState(0);
  const [activeTab,  setActiveTab]  = useState("Home");
  const [activeKey,  setActiveKey]  = useState(null);
  const [selDate,    setSelDate]    = useState(null);
  const [expNews,    setExpNews]    = useState(null);
  const [streak,     setStreak]     = useState(12);
  const [checkedIn,  setCheckedIn]  = useState(false);
  const [streakOpen, setStreakOpen] = useState(false);
  const [bumping,    setBumping]    = useState(false);
  const [openPos,    setOpenPos]    = useState(null);

  // Build flat ordered team list from selections
  const allTeams = [];
  selSports.forEach(sp => {
    (selTeams[sp] || []).forEach(tid => {
      const t = (TEAMS[sp] || []).find(x => x.id === tid);
      if (t) allTeams.push({ sp, tid, t, key: `${sp}:${tid}` });
    });
  });

  const curKey = activeKey || (allTeams[0] ? allTeams[0].key : null);
  const cur    = allTeams.find(x => x.key === curKey) || allTeams[0] || null;
  const team   = cur ? cur.t  : null;
  const sport  = cur ? cur.sp : (selSports[0] || "NBA");
  const tc     = team ? team.color  : C.bgDeep;
  const ta     = team ? team.accent : C.gold;

  // Memoize on team.id string — stable reference, no object identity issues
  const teamId = team ? team.id : null;
  const mock   = useMemo(() => teamId ? buildMock(teamId) : null, [teamId]);

  const today    = new Date();
  const monthStr = today.toLocaleString("default", { month: "long" });
  const dim      = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const fdow     = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  const smap     = {};
  if (mock) mock.sched.forEach(g => { smap[g.day] = g; });

  const nextBadge = BADGES.find(b => streak < b.days) || null;
  const pct       = nextBadge ? Math.min((streak / nextBadge.days) * 100, 100) : 100;

  // Depth chart for active sport — fall back to first available
  const depthChart = DEPTH[sport] || DEPTH[Object.keys(DEPTH)[0]];

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
    setExpNews(null);
    setOpenPos(null); // reset roster accordion when switching teams
    setStreakOpen(false);
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

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", background: C.bg, minHeight: "100vh", color: C.cream, maxWidth: 430, margin: "0 auto", position: "relative" }}>
      <style>{CSS}</style>

      {/* ── Streak drawer overlay — rendered at root so nothing clips it ── */}
      {streakOpen && screen === "app" && (
        <>
          <div style={{ position: "fixed", inset: 0, zIndex: 90 }} onClick={() => setStreakOpen(false)} />
          <div style={{ position: "fixed", top: 110, right: "calc(50% - 215px + 18px)", zIndex: 100, width: 290, maxHeight: "80vh", overflowY: "auto", background: C.bgCard, border: `1px solid ${C.dusty}33`, borderRadius: 16, padding: 18, boxShadow: "0 8px 40px #000c" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 17, fontWeight: 900, marginBottom: 3, color: C.cream }}>🔥 Winning Streak</div>
                <div style={{ fontSize: 11, color: C.dusty, fontFamily: "'Barlow',sans-serif" }}>
                  {checkedIn ? "Checked in today. See you tomorrow!" : "Tap below to check in."}
                </div>
              </div>
              <div style={{ textAlign: "center", marginLeft: 12 }}>
                <div style={{ fontSize: 34, fontWeight: 900, color: checkedIn ? C.gold : C.cream, lineHeight: 1, textShadow: checkedIn ? "0 0 14px #F5C84288" : "none" }}>{streak}</div>
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
                    {earned
                      ? <span style={{ fontSize: 11, color: C.gold, fontWeight: 700 }}>✓</span>
                      : <span style={{ fontSize: 10, color: C.dusty, fontFamily: "'Barlow',sans-serif" }}>{b.days - streak}d</span>}
                  </div>
                );
              })}
            </div>

            {!checkedIn && (
              <button onClick={tapStreak}
                style={{ marginTop: 14, width: "100%", padding: 11, borderRadius: 11, border: "none", background: C.gold, color: C.midnight, fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "'Barlow Condensed',sans-serif" }}>
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
            <button onClick={() => setScreen("sports")}
              style={{ background: C.bgCard, border: `1px solid ${C.dusty}44`, color: C.cream, borderRadius: 10, padding: "7px 13px", cursor: "pointer", fontFamily: "'Barlow',sans-serif", fontSize: 13 }}>
              Back
            </button>
            <span className="pill" style={{ background: C.bgCard, color: C.dusty, border: `1px solid ${C.dusty}33` }}>{sportStep + 1} / {selSports.length}</span>
          </div>
          {selSports.map((sid, idx) => {
            const sp = SPORTS.find(x => x.id === sid);
            return (
              <div key={sid} style={{ display: idx === sportStep ? "flex" : "none", flexDirection: "column", flex: 1 }}>
                <h1 style={{ fontSize: 36, fontWeight: 900, letterSpacing: -1, marginBottom: 4, color: C.cream }}>{sp.emoji} {sid}</h1>
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
                        {on && (
                          <div style={{ marginLeft: "auto", width: 22, height: 22, borderRadius: "50%", background: C.gold, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: C.midnight, fontWeight: 900 }}>✓</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            {sportStep > 0 && (
              <button onClick={() => setSportStep(i => i - 1)}
                style={{ flex: 1, padding: 13, borderRadius: 13, border: `2px solid ${C.dusty}44`, background: "transparent", color: C.cream, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'Barlow Condensed',sans-serif" }}>
                Prev
              </button>
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

          {/* Header — no overflow:hidden so nothing clips drawers */}
          <div style={{ padding: "52px 18px 14px", background: `linear-gradient(160deg, ${tc}cc 0%, ${C.bg} 65%)`, borderBottom: `1px solid ${C.dusty}22`, position: "relative" }}>
            {/* Grain overlay on header */}
            <div style={{ position: "absolute", inset: 0, background: GRAIN, pointerEvents: "none" }} />

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, position: "relative" }}>
              <span className="pill" style={{ background: C.red, color: "#fff", fontSize: 12, padding: "4px 12px" }}>BANDWAGON</span>
              {/* Streak button */}
              <button onClick={tapStreak}
                style={{ display: "flex", alignItems: "center", gap: 6, background: checkedIn ? "#1c2200" : C.bgCard, border: `1px solid ${checkedIn ? C.gold + "77" : C.dusty + "44"}`, borderRadius: 20, padding: "6px 14px", cursor: "pointer", boxShadow: checkedIn ? "0 0 10px #F5C84244" : "none" }}>
                <span className={bumping ? "bump" : ""} style={{ fontSize: 15 }}>🔥</span>
                <span style={{ fontSize: 18, fontWeight: 900, color: checkedIn ? C.gold : C.cream }}>{streak}</span>
                <span style={{ fontSize: 10, color: checkedIn ? C.gold : C.dusty, fontFamily: "'Barlow',sans-serif", fontWeight: 600 }}>
                  {checkedIn ? "done" : "streak"}
                </span>
              </button>
            </div>

            {/* Team switcher */}
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

          {/* Scrollable content */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 100px" }}>

            {/* ── HOME ── */}
            {activeTab === "Home" && (
              <div>
                {team && mock ? (
                  <>
                    {/* What You Missed */}
                    <div className="ai" style={{ marginBottom: 12 }}>
                      <div className="card" style={{ border: `1px solid ${tc}55` }}>
                        <div style={{ padding: "11px 15px 8px", background: `linear-gradient(90deg, ${tc}66, transparent)`, display: "flex", alignItems: "center", gap: 8 }}>
                          <span className="pill" style={{ background: mock.isWin ? "#14532d" : "#7f1d1d", color: mock.isWin ? "#86efac" : "#fca5a5" }}>
                            {mock.isWin ? "WIN" : "LOSS"}
                          </span>
                          <span style={{ fontSize: 12, color: C.dusty, fontFamily: "'Barlow',sans-serif" }}>vs {mock.opp} · {mock.score}</span>
                        </div>
                        <div style={{ padding: "10px 15px 15px" }}>
                          <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 7, color: C.gold, letterSpacing: .5 }}>WHAT YOU MISSED</div>
                          <p style={{ fontSize: 13, lineHeight: 1.6, color: C.cream, fontFamily: "'Barlow',sans-serif" }}>
                            {mock.isWin
                              ? `The ${team.name} pulled off a gritty win against the ${mock.opp}, riding a strong second half when it mattered most. Momentum is real, but there were rough edges worth watching.`
                              : `The ${team.name} dropped a winnable one against the ${mock.opp}, going cold at the worst time. Back-to-back losses now. The next game just became a must-win.`}
                          </p>
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
                          <div>
                            <div style={{ fontSize: 20, fontWeight: 900, color: C.cream }}>vs {mock.nxt}</div>
                            <div style={{ fontSize: 12, color: C.dusty, fontFamily: "'Barlow',sans-serif", marginTop: 2 }}>Thu, Apr 3 · 7:30 PM ET</div>
                            <div style={{ fontSize: 12, color: C.dusty, fontFamily: "'Barlow',sans-serif" }}>📺 {mock.net}</div>
                          </div>
                          <div style={{ width: 46, height: 46, borderRadius: 11, background: C.bgDeep, border: `1px solid ${C.dusty}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: C.dusty }}>
                            {mock.nxt.substring(0, 3).toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Around the League */}
                    <div className="ai" style={{ animationDelay: ".14s" }}>
                      <div className="card" style={{ border: `1px solid ${C.dusty}22` }}>
                        <div style={{ padding: "11px 15px 7px" }}>
                          <span className="pill" style={{ background: C.red + "33", color: C.red }}>AROUND THE LEAGUE</span>
                        </div>
                        <div style={{ padding: "4px 0 8px" }}>
                          {TEAM_NEWS.map((item, i) => (
                            <div key={i} style={{ padding: "11px 15px", borderBottom: i < TEAM_NEWS.length - 1 ? `1px solid ${C.dusty}18` : "none", cursor: "pointer" }}
                              onClick={() => setExpNews(expNews === i ? null : i)}>
                              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: expNews === i ? 5 : 0, color: C.cream }}>{item.headline}</div>
                              {expNews === i
                                ? <div style={{ fontSize: 12, color: C.tan, fontFamily: "'Barlow',sans-serif", fontStyle: "italic" }}>💬 {item.why}</div>
                                : <div style={{ fontSize: 10, color: C.dusty, fontFamily: "'Barlow',sans-serif", marginTop: 2 }}>tap to see why it matters</div>}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: "center", padding: "60px 20px", color: C.dusty }}>
                    <div style={{ fontSize: 38, marginBottom: 12 }}>🏆</div>
                    <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8, color: C.cream }}>No team selected</div>
                    <button onClick={() => setScreen("sports")}
                      style={{ marginTop: 14, padding: "11px 22px", background: C.gold, border: "none", borderRadius: 12, color: C.midnight, fontWeight: 800, cursor: "pointer", fontFamily: "'Barlow Condensed',sans-serif", fontSize: 15 }}>
                      Pick Teams
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ── SCHEDULE ── */}
            {activeTab === "Schedule" && mock && team && (
              <div>
                {/* Team record banner */}
                <div className="card ai" style={{ marginBottom: 14, padding: "14px 16px", border: `1px solid ${C.dusty}22`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.dusty, fontFamily: "'Barlow',sans-serif", letterSpacing: .5, marginBottom: 4 }}>THIS SEASON</div>
                    <div style={{ fontSize: 32, fontWeight: 900, color: C.cream, letterSpacing: -1 }}>{mock.wins}–{mock.losses}</div>
                    <div style={{ fontSize: 11, color: C.tan, fontFamily: "'Barlow',sans-serif" }}>Win rate: {mock.pctVal}%</div>
                  </div>
                  <div style={{ width: 52, height: 52, borderRadius: 13, background: team.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 900, color: team.accent, boxShadow: `0 0 14px ${team.color}66` }}>
                    {team.name.substring(0, 3).toUpperCase()}
                  </div>
                </div>

                <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 12, letterSpacing: -0.5, color: C.cream }}>{monthStr} {today.getFullYear()}</div>

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
                      const g   = smap[day];
                      const isT = day === today.getDate();
                      return (
                        <div key={day} className="cal-cell"
                          style={{ background: isT ? tc + "55" : selDate === day ? C.bgDeep : "transparent", border: isT ? `1px solid ${C.gold}` : "1px solid transparent" }}
                          onClick={() => setSelDate(selDate === day ? null : day)}>
                          <span style={{ fontSize: 12, fontWeight: isT ? 800 : 400, fontFamily: "'Barlow',sans-serif", color: isT ? C.gold : C.cream }}>{day}</span>
                          {g && <div style={{ marginTop: 2, width: 6, height: 6, borderRadius: "50%", background: g.type === "win" ? "#4ade80" : g.type === "loss" ? C.red : C.blue }} />}
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ display: "flex", gap: 14, marginTop: 12, justifyContent: "center" }}>
                    {[["#4ade80","Win"],[C.red,"Loss"],[C.blue,"Game"]].map(([col, l]) => (
                      <div key={l} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <div style={{ width: 7, height: 7, borderRadius: "50%", background: col }} />
                        <span style={{ fontSize: 10, color: C.dusty, fontFamily: "'Barlow',sans-serif" }}>{l}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {selDate && smap[selDate] && (
                  <div className="card ai" style={{ padding: 15, border: `1px solid ${C.gold}44` }}>
                    <div style={{ fontSize: 12, color: C.dusty, fontFamily: "'Barlow',sans-serif", marginBottom: 6 }}>{monthStr} {selDate}</div>
                    <div style={{ fontSize: 20, fontWeight: 900, marginBottom: 4, color: C.cream }}>vs {mock.nxt}</div>
                    <div style={{ fontSize: 12, color: C.tan, fontFamily: "'Barlow',sans-serif" }}>
                      {smap[selDate].type === "upcoming" ? `7:30 PM ET · 📺 ${mock.net}` : `Final · ${mock.score} · ${smap[selDate].type === "win" ? "Win" : "Loss"}`}
                    </div>
                  </div>
                )}
                {selDate && !smap[selDate] && (
                  <div className="card ai" style={{ padding: 15, textAlign: "center", color: C.dusty }}>
                    <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 13 }}>No game on {monthStr} {selDate}</div>
                  </div>
                )}
              </div>
            )}

            {/* ── ROSTER ── */}
            {activeTab === "Roster" && team && (
              <div>
                <div style={{ fontSize: 26, fontWeight: 900, marginBottom: 4, letterSpacing: -0.5, color: C.cream }}>{team.name} Roster</div>
                <p style={{ fontSize: 13, color: C.dusty, fontFamily: "'Barlow',sans-serif", marginBottom: 18 }}>{sport} depth chart — tap a position to expand.</p>

                {depthChart.map((group, gi) => (
                  <div key={gi} style={{ marginBottom: 8 }}>
                    <button onClick={() => setOpenPos(openPos === gi ? null : gi)}
                      style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", background: openPos === gi ? "#0d1e2a" : C.bgCard, border: `1px solid ${openPos === gi ? C.blue + "55" : C.dusty + "22"}`, borderRadius: 10, padding: "7px 12px", cursor: "pointer", marginBottom: openPos === gi ? 5 : 0 }}>
                      <span style={{ fontSize: 14, fontWeight: 800, color: openPos === gi ? C.blue : C.cream, letterSpacing: .3 }}>{group.pos}</span>
                      <span style={{ fontSize: 11, color: C.dusty }}>{openPos === gi ? "▲" : "▼"}</span>
                    </button>

                    {openPos === gi && group.players.map((p, pi) => (
                      <div key={p.id} className="ai card" style={{ padding: "12px 14px", marginBottom: 6, border: `1px solid ${C.dusty}22`, animationDelay: `${pi * 0.05}s` }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 9 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 32, height: 32, borderRadius: 9, background: team.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, color: team.accent, flexShrink: 0 }}>
                              #{p.num}
                            </div>
                            <div>
                              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <span style={{ fontSize: 15, fontWeight: 800, color: C.cream }}>{p.name}</span>
                                <span style={{ fontSize: 10, fontWeight: 700, color: C.gold, background: "#2a2100", borderRadius: 6, padding: "1px 6px", fontFamily: "'Barlow',sans-serif" }}>
                                  #{p.leagueRank} in {sport}
                                </span>
                              </div>
                              <div style={{ fontSize: 10, color: C.dusty, fontFamily: "'Barlow',sans-serif", marginTop: 1 }}>Age {p.age} · {p.exp}</div>
                            </div>
                          </div>
                          <span className="pill" style={{ background: roleColor(p.role) + "22", color: roleColor(p.role) }}>{p.role}</span>
                        </div>
                        <div style={{ display: "flex", gap: 6 }}>
                          {p.stats.map((st, si) => (
                            <div key={si} style={{ flex: 1, background: C.bgDeep, borderRadius: 8, padding: "6px 4px", textAlign: "center", border: `1px solid ${C.dusty}18` }}>
                              <div style={{ fontSize: 12, fontWeight: 800, color: C.cream }}>{st}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* ── WATER COOLER ── */}
            {activeTab === "Water Cooler" && mock && (
              <div>
                <div style={{ fontSize: 26, fontWeight: 900, marginBottom: 4, letterSpacing: -0.5, color: C.cream }}>Water Cooler</div>
                <p style={{ fontSize: 13, color: C.dusty, fontFamily: "'Barlow',sans-serif", marginBottom: 18 }}>Everything worth knowing today. ☕</p>

                <div style={{ fontSize: 11, fontWeight: 800, color: C.dusty, letterSpacing: 1, marginBottom: 10, fontFamily: "'Barlow',sans-serif" }}>
                  HOT TAKES — AFTER THE {mock.isWin ? "WIN" : "LOSS"}
                </div>
                {mock.hotTakes.map((item, i) => (
                  <div key={i} className="ai card" style={{ marginBottom: 10, padding: 16, border: `1px solid ${C.dusty}22`, borderLeft: `4px solid ${ratingColor(item.rating)}`, animationDelay: `${i * 0.06}s` }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 7 }}>
                      <span className="pill" style={{ background: C.bgDeep, color: C.dusty }}>{item.label}</span>
                      <span style={{ fontSize: 24, fontWeight: 900, color: ratingColor(item.rating), letterSpacing: -1 }}>{item.rating}</span>
                    </div>
                    <p style={{ fontSize: 13, fontFamily: "'Barlow',sans-serif", lineHeight: 1.55, color: C.cream }}>{item.take}</p>
                  </div>
                ))}

                <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "18px 0 14px" }}>
                  <div style={{ flex: 1, height: 1, background: C.dusty + "22" }} />
                  <span style={{ fontSize: 10, color: C.dusty, fontFamily: "'Barlow',sans-serif", fontWeight: 700, letterSpacing: 1 }}>LEAGUE BUZZ</span>
                  <div style={{ flex: 1, height: 1, background: C.dusty + "22" }} />
                </div>

                {allTeams.length > 0 && (
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: C.dusty, letterSpacing: .5, marginBottom: 8, fontFamily: "'Barlow',sans-serif" }}>YOUR TEAMS</div>
                    {allTeams.map((entry, i) => (
                      <div key={entry.key} className="ai card" style={{ marginBottom: 10, padding: 14, border: `1px solid ${C.dusty}22`, borderLeft: `4px solid ${entry.t.color}`, animationDelay: `${(5 + i) * 0.06}s` }}>
                        <span className="pill" style={{ background: entry.t.color + "33", color: C.tan, marginBottom: 7, display: "inline-block", fontSize: 9 }}>
                          {entry.sp} · {entry.t.name}
                        </span>
                        <p style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.4, marginBottom: 5, color: C.cream }}>{TEAM_NEWS[i % TEAM_NEWS.length].headline}</p>
                        <p style={{ fontSize: 12, color: C.tan, fontFamily: "'Barlow',sans-serif", fontStyle: "italic" }}>💬 {TEAM_NEWS[i % TEAM_NEWS.length].why}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ fontSize: 10, fontWeight: 700, color: C.dusty, letterSpacing: .5, marginBottom: 8, fontFamily: "'Barlow',sans-serif" }}>AROUND THE LEAGUE</div>
                {LEAGUE_BUZZ.map((item, i) => (
                  <div key={i} className="ai card" style={{ marginBottom: 10, padding: 14, border: `1px solid ${C.dusty}22`, animationDelay: `${(5 + allTeams.length + i) * 0.06}s` }}>
                    <p style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.4, marginBottom: 5, color: C.cream }}>{item.text}</p>
                    <p style={{ fontSize: 12, color: C.tan, fontFamily: "'Barlow',sans-serif", fontStyle: "italic" }}>💬 {item.why}</p>
                  </div>
                ))}

                <div className="card" style={{ padding: 13, marginTop: 4, border: `1px solid ${C.dusty}22`, display: "flex", gap: 10, alignItems: "center" }}>
                  <span style={{ fontSize: 18 }}>🔄</span>
                  <div style={{ fontSize: 12, color: C.dusty, fontFamily: "'Barlow',sans-serif" }}>Fresh takes and buzz every morning. Check in to keep your streak alive.</div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
