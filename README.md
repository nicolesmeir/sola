# SOLA — Smart Outfit & Look Assistant

SOLA is an AI personal stylist for university students. You upload photos of clothes you already own, set up a short style profile, and chat with the stylist. It suggests outfits made **only from your own wardrobe** and shows each one as a collage of your real clothing photos.

See [PRD.md](PRD.md) for the full product requirements.

## Tech stack

- **App:** Next.js (App Router, TypeScript) + Tailwind CSS
- **Accounts, database, image storage:** Supabase
- **AI:** Anthropic Claude API

## Run it locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the example environment file, then fill in your Supabase and Anthropic keys:
   ```bash
   cp .env.example .env.local
   ```
3. In your Supabase project, run the SQL files in `supabase/migrations/` in order.
4. Start the dev server:
   ```bash
   npm run dev
   ```
5. Open http://localhost:3000.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the local dev server |
| `npm run build` | Build for production |
| `npm run start` | Run the production build |
| `npm run lint` | Check the code with ESLint |

Never commit real API keys. They belong in `.env.local`, which git ignores.
