# CLAUDE.md — SOLA (Smart Outfit & Look Assistant)

## What SOLA is
An AI-powered personal styling assistant. Users upload photos of clothes they already own, build a personal style profile, and chat with an AI stylist that recommends outfits **using only items from their own wardrobe**, shown as visual collages of their actual clothing photos.

**Core value:** turn the clothes users already own into personalized outfits — saving time, reducing decision fatigue, and making better use of existing wardrobes.

## Target user (MVP)
Female university students aged 18–25 with busy academic and social schedules. They care about personal style but have limited time and energy for outfit planning. Design copy, examples, and test data for this audience.

## MVP scope

### Must have
1. **User accounts** — register, log in; wardrobe and style profile saved securely per user.
2. **Digital wardrobe** — upload individual clothing photos, view saved wardrobe, start small (~10 items) and grow over time.
3. **Automatic AI clothing recognition** — AI identifies each uploaded item and categorizes it by **type** and **color**; user can correct misclassifications.
4. **Personal style profile** — user uploads inspiration images (AI extracts preferred styles, colors, combinations) and completes a style questionnaire.
5. **AI personal stylist chat** — user describes plans/occasion in natural language (e.g. "I have classes today, I want something comfortable but stylish").
6. **Personalized outfit recommendations** — built **exclusively** from the user's wardrobe, reflecting their style and the occasion; user can request multiple options (e.g. 3).
7. **Visual outfit collages** — each recommended outfit rendered as a collage of the user's actual item photos.

### Nice to have (do NOT build unless asked)
- Weather integration (auto location + weather-appropriate outfits)
- Interactive refinement ("swap the shoes", "make it more formal")

### Out of scope for v1 (do NOT build)
- Shopping recommendations or links to buy items
- Native mobile app — v1 is a **responsive web app** (desktop + mobile browsers)
- Multilingual support — **English only**
- Payments

## Product rules (hard constraints)
- **Never recommend an item the user does not own.** Every outfit item must reference an existing wardrobe item ID. Validate AI output against the wardrobe before displaying it; drop or regenerate outfits that reference unknown items.
- If the wardrobe can't form a sensible outfit for the request (e.g. no shoes uploaded), say so clearly and suggest what to upload — don't invent items.
- Onboarding is **required and follows PRD §4.2** (questionnaire → inspiration → wardrobe → review → chat; user decision 2026-11-22), but keep each step short — a user with ~10 items should get useful recommendations. Don't add further required steps.
- AI categorization must always be user-editable.
- Clothing and inspiration photos are personal data: store per-user, never expose across accounts, never use in other users' recommendations.

## Key user flow (the demo path)
1. Student opens SOLA → lands on stylist chat.
2. Types occasion + desired vibe.
3. SOLA combines style questionnaire + inspiration analysis + wardrobe.
4. Generates N outfits from her wardrobe only.
5. Shows collages of her real clothing photos.
6. She picks one and gets dressed.

Keep this flow fast and working end-to-end at all times — it's what the pilot tests.

## Data model (starting point)
- **User** — id, email, auth info, created_at
- **ClothingItem** — id, user_id, image_url, (processed/background-removed image_url), category (top, bottom, dress, outerwear, shoes, bag, accessory…), color(s), optional tags (style, season, formality), ai_confidence, user_corrected (bool)
- **StyleProfile** — user_id, questionnaire answers, inspiration image URLs, AI-derived summary (styles, palettes, typical combinations)
- **Outfit** — id, user_id, item_ids[], occasion, request text, explanation, collage_url, created_at, selected (bool)
- **ChatMessage** — id, user_id, role, content, linked outfit_ids

## Pilot metrics to support (instrument these)
The MVP is tested with 10–20 students. Log events so these can be measured:
| Metric | Target | Needs |
|---|---|---|
| Wardrobe onboarding | ≥80% upload 10 items | item upload events |
| Setup time | ≥70% finish 10 items in ≤15 min | timestamp of first + 10th upload |
| Outfit generation | ≥90% successfully generate an outfit | outfit request success/failure |
| Weekly engagement | ≥50% select an outfit on 3+ days in a week | outfit selection events with dates |
| Time savings | avg ≥3 min saved per decision | request → selection duration |
| Satisfaction | ≥80% rate 4/5+ | post-test survey (external is fine) |

## Tech stack
- Frontend: Next.js 16 (App Router, TypeScript, `src/`), Tailwind CSS v4 (tokens in `src/app/globals.css` `@theme`). Next 16 renamed middleware → `src/proxy.ts`; read `node_modules/next/dist/docs/` before using unfamiliar APIs.
- Backend: Next.js Server Actions + Route Handlers (`src/app/api/*`)
- Database / storage: Supabase Postgres with RLS on every table; private Storage buckets `wardrobe` and `inspiration`, paths `{user_id}/{uuid}.jpg`, shown via signed URLs. Schema in `supabase/migrations/`.
- Auth: Supabase Auth (email + password) via `@supabase/ssr` (`src/lib/supabase/`)
- AI (vision / categorization): Claude via `@anthropic-ai/sdk`, server-side only; outputs validated with zod
- AI (stylist chat / outfit generation): Claude, same setup; prompts live in `src/lib/ai/prompts/`
- Background removal / collage rendering: none in v1 — collages are HTML/CSS layouts of the user's original photos
- Hosting: Vercel

## Design source of truth
- Screens: Stitch export at `~/Downloads/stitch_sola_smart_styling_assistant/` — use the `*_simplified` screens (plus `digital_wardrobe_setup`) and the **Quiet Atelier** design system (`quiet_atelier/DESIGN.md`): warm ivory, charcoal, champagne, blush accents `#E8B4B8`/`#C47C83`, Playfair Display + Plus Jakarta Sans, Material Symbols icons. This palette supersedes the pink palette in PRD §5.1 (user decision, 2026-11-22).
- Welcome page: layout/copy from the Codex page at `~/Documents/ChatGPT/נתונים וטכנולוגיה בעסקים/sola-welcome/`, restyled in the app fonts.
- Drop decorative filler from the designs (fake stats, "Concierge" links, confidence scores, version labels).

## Commands
- `npm install` — install
- `npm run dev` — dev server on http://localhost:3000 (needs `.env.local`, see `.env.example`)
- `npm run lint` · `npx tsc --noEmit` — lint / typecheck (run `npx next typegen` first if `LayoutProps`/`PageProps` are missing)
- `npm run build` — production build
- Database: paste `supabase/migrations/*.sql` into the Supabase SQL editor in order

## Working conventions for Claude
- Stay within MVP scope above; ask before adding nice-to-have or out-of-scope features.
- Keep the UI responsive and mobile-first — most usage is on a phone in the morning.
- Prefer simple, demo-able solutions over heavy infrastructure; this is an MVP for a small pilot.
- Never commit API keys or secrets; use environment variables and keep a `.env.example` up to date.
- Keep AI prompts in dedicated files/modules (not inline in UI code) so they're easy to iterate on.
- Return AI outputs as structured JSON (validated) rather than parsing free text.
- When you change scope, the data model, or the stack, update this file.
