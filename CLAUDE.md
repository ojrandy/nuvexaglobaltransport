# CLAUDE.md — Nuvexa Global Transport Website

> This file is read automatically by Claude Code at the start of every session.
> Keep it short, current and true. Detailed specs live in `/docs`. The step-by-step prompts are in `PROMPTS.md`.

## 0. Your role: read this first

**The system is already built, finished and working.** It is a complete logistics platform: public website, live
shipment tracking, Express/SQLite API, admin operations console, PDF documents, quotes and bookings. It currently
carries the brand of a previous client, **SDL Global Logistics**.

**The job is a re-skin, not a redesign.** Turn it into **Nuvexa Global Transport** on its own new domain on Hostinger.

| Changes | Stays exactly the same |
|---|---|
| Company name, legal name, email, domain | Design, layout, spacing, components |
| Logo, favicon, app icons, OG image | Colour palette (`src/styles/tokens.css` values) |
| Photos | Fonts (Plus Jakarta Sans, Inter, JetBrains Mono) |
| Admin password and session secret | Every page, every feature, every API route |
| Tracking-ID prefix (and the reference prefixes) | Database schema (tables and columns) |
| Internal identifiers that carry the old name (CSS prefix, cookie, storage keys, DB file name) | Page copy, apart from the company name |

**Target time: about one hour.** Work like a senior developer on a client's production system:
- **Modify in place.** Find-and-replace and asset swaps. No refactors, no restyling, no new features, no "while I'm here" fixes.
- **Protect what works.** Tracking, admin login, shipment creation, documents/PDFs, quotes and the database must work after every step.
- **Small commits** with clear prefixes (`rebrand: …`, `assets: …`, `deploy: …`).
- **Ask when a business fact is missing.** Never invent one.

## 1. Company facts (single source of truth)

Facts confirmed by the owner on 2026-10-03; remaining TBD rows are optional. Once filled, they go into `src/config/brand.ts` and nowhere else in the code.

| Field | Value |
|---|---|
| Company name (UI, titles, meta) | **Nuvexa Global Transport** |
| Short name (buttons, repeated mentions) | **Nuvexa** |
| Legal name (footer ©, legal pages, documents) | **Nuvexa Global Transport Ltd** |
| Domain | **nuvexaglobaltransport.com** |
| Primary email | **info@nuvexaglobaltransport.com** |
| Admin console | `https://nuvexaglobaltransport.com<ADMIN_PATH>/`: default `/private-user/`, live value set only in hPanel `ADMIN_PATH` and never written in the repo (same Node app, private path; owner moved it off the `private.` subdomain on 2026-10-06 because the Hostinger plan allows only 5 Node apps). Never publish the path. |
| Tracking-ID prefix | **`NGT`** (owner changed it from NVX on 2026-10-03). Full ID is **exactly 8 characters**: prefix + 5, e.g. `NGT7K2M9` |
| Reference prefixes | `NGT-SL-######` (seals), `NGT-TKT-######` (tickets), `NGT-INV-######` (invoices) |
| Tagline | **Faster • Safer • Further** (owner, 2026-10-03: written as on the logo). `TAGLINE = 'Faster • Safer • Further'`; footer and admin upper-case it, no closing full stop. Home H1 stays the headline `Faster, Safer,` / **`Further.`** |
| Phone / WhatsApp / HQ address / socials | **TBD. Leave empty; the UI hides empty values. Never invent numbers or addresses.** |
| Logo original | `images/nov.png` (2024×777 PNG, transparent; black + red, globe in the "V") |
| GitHub repo | https://github.com/ojrandy/nuvexaglobaltransport (git remote `nuvexa`) |
| Admin password | Chosen by the owner. **Never write it in any file, commit or chat log.** Only its bcrypt hash goes in hPanel. |


## 2. Tech stack (already in place; don't touch)

- **Frontend:** React 18 + TypeScript + Vite 6, hash routing in `src/App.tsx` (`KNOWN_PAGES`). No React Router.
- **Styling:** plain CSS + tokens in `src/styles/tokens.css`. **Colour values stay**; only the variable *prefix* is renamed.
- **Maps:** Leaflet / react-leaflet, Nominatim geocoding, OSRM routing.
- **Backend:** Express 5 (`server/`), SQLite via built-in `node:sqlite` (**Node ≥ 22.5**), express-session, helmet, rate limiting.
- **Admin:** opens only at the private path in `server/adminPath.ts` (env `ADMIN_PATH` overrides). The server marks that page with `<meta name="admin-console">`, which `isAdminConsolePage()` in `src/App.tsx` reads, so the path never ships in the client bundle. `#/admin` works on localhost only.
- **Static assets folder is `Public/` (capital P)** — `vite.config.ts` sets `publicDir: 'Public'`. Don't rename it; Hostinger's Linux build is case-sensitive.
- **Images pipeline:** originals in `images/` → `node scripts/optimize-images.mjs` → `Public/brand/*`, `Public/images/<folder>/*` and the manifest read by `<ResponsiveImage>`.

## 3. Commands

```bash
npm install            # also runs `npm run build` via postinstall
npm run dev            # Express API (:5000) + Vite (:3000)
npm run build          # tsc + vite build + server tsc -> dist/ and dist-server/
npm test               # tracking-ID, reference, routing, time-zone tests
npm start              # production: node dist-server/server/index.js
```

Local admin: `http://localhost:3000/#/admin`. Env vars: `.env.example` and `docs/DEPLOYMENT.md`.

## 4. Where the brand lives

```
src/config/brand.ts        Name, legal name, email, domain, logo paths, admin subdomain, tracking prefix
src/shared/references.ts   Seal / ticket / invoice prefixes + REFERENCE_PATTERN
src/shared/trackingId.ts   Reads TRACKING_PREFIX; regex and alphabet stay as they are
index.html                 Title, meta, OG/Twitter, JSON-LD, canonical
Public/site.webmanifest    App name
Public/brand/              Logo, white logo, mark, favicons, OG image
images/                    Untouched photo/logo originals (input to scripts/optimize-images.mjs)
docs/REBRAND_MAP.md        The full file-by-file checklist for this job
```

## 5. Rules for every task

1. **Read `docs/PROJECT_TRACKER.md` first** and do the next unchecked task, unless told otherwise.
2. **Names come from `brand.ts`** in code; wording comes from `docs/CONTENT.md`; checklist is `docs/REBRAND_MAP.md`.
3. **Don't change design.** No edits to colour values, font choices, spacing, layout or component structure. A renamed
   CSS variable must keep its exact value.
4. **Never break existing behaviour.** After every change: `npm run build` (zero TypeScript errors) and `npm test`.
5. **No fabricated facts:** no invented stats, testimonials, logos, certifications, phone numbers or addresses.
6. **Don't touch** `.env` or the live database file. In `server/middleware/auth.ts`, the only permitted change is the
   cookie *name* constant (Prompt 03). No other security logic changes.
7. **No demo data.** Don't add sample shipments or fake records.
8. **Don't rename database tables or columns.** The DB *file* name changes once (Prompt 03). Nuvexa starts with a fresh database.
9. **Don't carry the previous client across.** No SDL name, domain, logo, photo or git history may reach the Nuvexa repo or site.
10. After each task: tick it in `PROJECT_TRACKER.md`, add one line to its **Change log**, list owner questions under **Needs owner**.

## 6. Definition of done (per task)

- [ ] `npm run build` and `npm test` pass; no new browser console errors.
- [ ] Quick look at 375px and 1440px: nothing moved, nothing restyled.
- [ ] Old-brand sweep shows nothing new: `grep -rniE "sdl|\bdls[0-9a-z·]|duolingo|dxp" src server scripts index.html Public/site.webmanifest`
- [ ] Tracker updated.
