# Scapedle

A daily guessing game for Old School RuneScape fans, playable at [scapedle.net](https://scapedle.net).

---

## Game Modes

### Items
Guess the mystery OSRS item using Grand Exchange data as hints. Each guess reveals how close you are across six attributes:

| Hint | Description |
|---|---|
| **Price** | GE mid price — arrow shows if the answer is higher or lower |
| **Volume** | Daily trade volume — arrow shows direction |
| **Equippable** | Whether the item can be equipped |
| **Slot** | Equipment slot (Head, Body, Weapon, etc.) |
| **Buy Limit** | GE 4-hour buy limit — arrow shows direction |
| **Release Year** | Year the item was added to OSRS |

Color coding: green = exact match, orange = close, red = wrong.

### Music
Listen to an OSRS music track and click the location on the map where you think it plays. Feedback is temperature-based:

- **Correct** — exact region
- **Hot** — adjacent region
- **Warm** — same broad area
- **Cold / Frozen** — far away

Both modes have a **Daily** challenge (one per day, shared with all players) and an **Unlimited** mode for endless practice.

---

## Tech Stack

- **React 19** — frontend framework
- **Leaflet / React Leaflet** — interactive OSRS world map
- **Supabase** — stores daily item and song assignments
- **GitHub Actions** — CI/CD, auto-deploys to GitHub Pages on push to `master`
- **GitHub Pages** — hosting at `scapedle.net`

### External Data Sources

| Source | Used For |
|---|---|
| [osrsreboxed-db](https://github.com/0xNeffarion/osrsreboxed-db) | Full OSRS item database |
| [RS Prices API](https://prices.runescape.wiki/api/v1/osrs/) | Live GE prices and volumes |
| [OSRS Wiki](https://oldschool.runescape.wiki) | Music track audio files |
| [OSRSGuesser](https://github.com/davsan56/OSRSGuesser) | OSRS map tiles |

---

## Project Structure

```
scapelde/
├── .github/workflows/deploy.yml   # GitHub Actions deploy pipeline
├── scripts/
│   └── generate-daily.js          # Pre-populates Supabase with daily challenges
├── supabase/
│   └── functions/generate-daily/  # Supabase edge function (scheduled generation)
└── scapedle/                       # React app
    ├── public/
    │   ├── index.html
    │   └── CNAME                   # Custom domain config
    └── src/
        ├── App.js                  # Root component, game state, daily/unlimited logic
        ├── MusicGame.js            # Music game with audio player and map
        ├── musicTracks.js          # 244 curated OSRS tracks with location data
        ├── supabase.js             # Supabase client
        ├── utils.js                # Seeded random, date helpers, comparison logic
        ├── components/
        │   └── OSRSMap/            # Interactive Leaflet map with temperature pins
        └── data/
            └── mapRegions.js       # Region bounds, categories, temperature logic
```

---

## Development

```bash
cd scapedle
npm install --legacy-peer-deps
npm start
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

Create `scapedle/.env.local`:

```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_anon_key
```

### Generating Daily Challenges

The `generate-daily.js` script populates Supabase with the next 7 days of challenges:

```bash
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key node scripts/generate-daily.js
```

Run this weekly or deploy the Supabase edge function on a cron schedule.

---

## Deployment

Pushing to `master` automatically triggers the GitHub Actions workflow which builds the React app and deploys it to the `gh-pages` branch. GitHub Pages serves that branch at `scapedle.net`.

### Item Filtering

Items are pulled from the full OSRS database and filtered to ensure quality puzzles:
- Must be tradeable on the GE (no noted/placeholder variants)
- Volume ≥ 400 **or** price ≥ 100k GP
- Items with volume < 500 must have price > 5M GP
- Items priced under 500 GP must have volume ≥ 750k
- Excludes potion doses 1–3, broken Barrows items, and god book pages
