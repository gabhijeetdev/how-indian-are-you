# How Indian Are You? 🇮🇳

The 60-Second India Challenge — a mobile-first quiz built with React + Vite, with an optional
Express backend for anonymous analytics.

```
how-indian-are-you/
├── frontend/     React + Vite + React Router app (the whole product experience)
└── backend/      Minimal Express API for anonymous analytics (optional)
```

The quiz works **completely on its own** with no backend — scoring, badges, sharing, and the
downloadable result card are all client-side. The backend only powers `quiz_started` /
`share_clicked`-style event counts; skip it entirely if you don't need stats yet.

---

## 1. Run it locally

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`). That's the full app.

### Backend (optional, for analytics)

```bash
cd backend
npm install
npm start
```

Runs on `http://localhost:4000` by default, using an in-memory event store (nothing to configure).
To point the frontend at it, create `frontend/.env` from `frontend/.env.example`:

```
VITE_API_URL=http://localhost:4000
```

Restart `npm run dev` after adding the env file.

---

## 2. Deploy it so everyone can use it

You need two deployments: the **frontend** (static site) and, optionally, the **backend** (small
Node server). Any of the usual free-tier hosts work.

### Frontend — Vercel (recommended, fastest)

1. Push this repo to GitHub.
2. Go to [vercel.com](https://vercel.com) → **New Project** → import the repo.
3. Set **Root Directory** to `frontend`.
4. Framework preset: **Vite** (auto-detected). Build command `npm run build`, output dir `dist` (auto-filled).
5. If you're using the backend, add an environment variable `VITE_API_URL` set to your deployed backend URL (step below).
6. Deploy. You'll get a URL like `https://how-indian-are-you.vercel.app` — that's the link you share.

`vercel.json` is already included so client-side routes (`/quiz`, `/result`) work on refresh.

**Netlify alternative:** same steps, root directory `frontend`, build command `npm run build`,
publish directory `dist`. The included `public/_redirects` file handles SPA routing.

### Backend — Render (recommended, has a free tier)

1. On [render.com](https://render.com) → **New** → **Web Service** → connect the repo.
2. Root directory: `backend`. Build command: `npm install`. Start command: `npm start`.
3. Add environment variable `FRONTEND_ORIGIN` set to your deployed frontend URL (from the step
   above) — this locks down CORS to your actual site.
4. Leave the `MYSQL_*` variables unset to keep using the in-memory store, or fill them in if you've
   provisioned a MySQL database (e.g. PlanetScale, Railway, RDS) and want events to persist. See
   `backend/db/schema.sql` for the table it expects.
5. Deploy. Copy the resulting URL (e.g. `https://how-indian-are-you-api.onrender.com`) into the
   frontend's `VITE_API_URL` environment variable and redeploy the frontend.

**Note on the in-memory store:** it resets whenever the backend restarts or spins down (free tiers
often sleep after inactivity). That's fine for a fun MVP; swap in MySQL via the env vars above if
you want durable stats.

---

## 3. What "everyone should use it" means in practice

- The frontend deploy URL is the one you share on WhatsApp/Instagram — it's a static site, so it
  scales to as many simultaneous players as your host's free tier allows (Vercel/Netlify handle
  this comfortably).
- No login, no database required for anyone to play — only you (the owner) would ever look at
  `/api/stats` on the backend, and only if you deployed it.
- Challenge links look like `https://your-domain.com/?challenge=9` — they work as soon as the
  frontend is deployed, no backend needed.

---

## 4. Project structure

```
frontend/
├── index.html
├── vite.config.js
├── src/
│   ├── main.jsx              # mounts <App /> inside BrowserRouter
│   ├── App.jsx                # routes: / , /quiz , /result
│   ├── index.css              # design tokens + shared classes
│   ├── components/
│   │   ├── Button.jsx
│   │   ├── ProgressBar.jsx
│   │   ├── QuestionCard.jsx
│   │   ├── Timer.jsx          # Ashoka Chakra countdown ring
│   │   ├── ResultCard.jsx     # canvas-drawn shareable PNG
│   │   └── ShareButtons.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Quiz.jsx
│   │   └── Result.jsx
│   ├── data/
│   │   └── questions.js
│   └── utils/
│       ├── scoring.js         # badge + percentile logic
│       └── sharing.js         # share links + analytics calls
backend/
├── server.js                  # POST /api/analytics, GET /api/stats
├── db/
│   ├── schema.sql             # optional MySQL table
│   └── mysqlStore.js          # optional MySQL-backed store
```

## 5. A note on framing

This is a fun trivia challenge, not a citizenship verification tool — the copy is written to make
that clear on the home screen, and nothing in the app claims otherwise.
