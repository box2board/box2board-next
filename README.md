# Box2Board

Box2Board is a focused, server-rendered daily scoreboard for MLB, NBA, NFL, and NHL. Schedule days and game times use America/New_York, with daylight-saving time handled by the runtime.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. The app requests scoreboard data on the server and shows an explicit error state when the provider cannot be reached.

## Production

```bash
npm run build
npm run start
```

Vercel is the configured hosting provider. The canonical production origin is `https://box2board.com`; previews are protected from indexing. No custom environment variables are currently required. See [Instructions.md](./Instructions.md) for architecture and deployment guidance, [LAUNCH_CHECKLIST.md](./LAUNCH_CHECKLIST.md) for verification, and [NEXT_PHASE.md](./NEXT_PHASE.md) for the prioritized product roadmap.
