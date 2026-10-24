# Argus — Status Dashboard

Next.js (App Router) + Tailwind CSS dashboard that reads live bot stats from the Argus HTTP API.

## What it shows

| Field | Source |
|-------|--------|
| Online / Offline (green / red dot) | `data.status` |
| Bot name | `data.bot` |
| Server count | `data.guilds` |
| Uptime (e.g. `4h 2m`) | `data.uptime` (seconds) |

Request: `GET ${NEXT_PUBLIC_BOT_API_URL}/api/stats`  
Fallback API: `https://azcicro5jq.apps.bot-hosting.cloud`

The browser calls same-origin `/api/bot-stats`, which proxies to the bot API (avoids CORS issues).

## Setup

```bash
cd website
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Run production build |
