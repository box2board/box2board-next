# Box2Board Next.js Foundation

This repository contains the stabilized Next.js foundation for Box2Board.
It uses the **App Router** and ships with a minimal landing page, health
endpoint, and health UI so deployments can be validated quickly.

## Getting Started

Install dependencies:

```bash
npm install
```

Copy the optional environment variables:

```bash
cp .env.example .env.local
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

## API Endpoints

- `/api/today?league=mlb|nba|nfl|nhl|golf`
- `/api/trends?league=mlb|nba|nfl|nhl|golf`

## Vercel Deployment

This project is ready for Vercel. Import the repository and use the default
Next.js build settings:

- Build command: `npm run build`
- Output: `.next`
- Install command: `npm install`

No required environment variables are needed to boot. Optional runtime
metadata is read from `VERCEL_GIT_COMMIT_SHA` when available.
