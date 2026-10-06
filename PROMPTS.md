# Nuvexa Global Transport — Prompt Pack for Claude in VS Code

**The job:** turn the finished, working logistics site into **Nuvexa Global Transport** on its own new domain on
Hostinger. New name, logo, photos, admin password and tracking-ID prefix. **The design, colour palette, fonts, layout
and every feature stay exactly as they are.** Target time: **about one hour.**

**How to use this pack**
- Paste **one prompt at a time**, in order. Wait for Claude's report and glance at the site before sending the next.
- Keep `npm run dev` running (http://localhost:3000, admin at http://localhost:3000/#/admin) and look after each prompt.
- If something breaks, send **F1** before moving on. New chat later? Send **R** first.
- Company facts are confirmed in `CLAUDE.md §1` (nuvexaglobaltransport.com, info@nuvexaglobaltransport.com, Nuvexa Global Transport Ltd, prefix NGT).

**Before you start, have ready:**
1. ~~Domain and email~~ (confirmed).
2. ~~Logo~~ supplied: `images/nov.png`.
3. New photos → put them in `images/nuvexa/` (any names; Claude maps them in Prompt 05).
4. A strong admin password (you'll type it into one command yourself; it never goes in a file).

| # | Prompt | Time |
|---|---|---|
| 00 | Orientation & safety branch | 5 min |
| 01 | Brand config, tracking-ID & reference prefixes | 10 min |
| 02 | Visible name sweep (pages, meta, documents, legal) | 10 min |
| 03 | Internal identifiers (CSS prefix, cookie, keys, DB file, package) | 10 min |
| 04 | Logo, favicons, OG image | 5 min |
| 05 | Photos | 10 min |
| 06 | Final sweep & regression check | 5 min |
| 07 | New repo, admin password & Hostinger | 10 min |

---

### Prompt 00 — Orientation & safety branch (no code changes)
```
You're a senior full-stack developer re-skinning a finished, working logistics platform for a new client, Nuvexa Global Transport. Read CLAUDE.md, then docs/PROJECT_TRACKER.md (including System notes), docs/REBRAND_MAP.md and docs/BRAND_GUIDE.md.

This is a re-skin: name, logo, photos, admin password and tracking-ID prefix change; design, palette, fonts, layout and features do not.

1. Check CLAUDE.md §1. If any TBD row needed for the code (domain, email, legal name, tracking prefix) is still TBD, list them and STOP. If the prefix is not NGT, replace NGT with it across PROMPTS.md and /docs first.
2. Run `git status`. If clean, create a branch `nuvexa-rebrand`.
3. Run `npm run build` and `npm test` and record the result as the baseline in tracker task 0.2.
4. Run the "before" sweep in REBRAND_MAP §6 and record the hit count in the tracker.
STOP and report: baseline result, hit count, and any questions.
```

### Prompt 01 — Brand config, tracking-ID & reference prefixes
```
Tracker tasks 1.1–1.3. Use the values in CLAUDE.md §1.
1. src/config/brand.ts: COMPANY, COMPANY_SHORT, LEGAL_NAME, TAGLINE, EMAIL, DOMAIN, LOGO/LOGO_WHITE paths (/brand/ngt-logo.png, /brand/ngt-logo-white.png — files arrive in Prompt 04), TRACKING_PREFIX = 'NGT'. Keep ADMIN_SUBDOMAIN = 'private'. Leave PHONE/WHATSAPP/HQ_ADDRESS/SOCIAL empty. Update the header comment.
2. src/shared/references.ts: prefixes NGT-SL-, NGT-TKT-, NGT-INV- and REFERENCE_PATTERN. Build them from TRACKING_PREFIX in brand.ts so there is one source.
3. src/shared/trackingId.ts already reads TRACKING_PREFIX: don't change its logic. Update its comments and examples (DLS7K2M9 → NGT7K2M9).
4. Update every hard-coded DLS example, placeholder, validation message and help text listed in REBRAND_MAP §3 (e.g. "e.g. NGT7K2M9", "Tracking IDs start with NGT and are 8 characters long", the DLS····· placeholder → NGT·····). Prefer building them from TRACKING_PREFIX where the file already imports brand.ts.
5. Update scripts/trackingId.test.ts and scripts/references.test.ts so they expect NGT (keep the negative tests, and add one that rejects an old DLS ID).
Build + npm test must pass. Create a shipment in local admin and confirm it gets an NGT ID and the public Track page finds it. Commit "rebrand: Nuvexa brand config and NGT prefixes". STOP and report.
```

### Prompt 02 — Visible name sweep
```
Tracker tasks 2.1–2.4. Work through REBRAND_MAP §2 (visible text). Follow BRAND_GUIDE §1 for which name form to use.
1. index.html: title, description, OG/Twitter tags, og:site_name, JSON-LD (name, legalName, alternateName, url, email), canonical and og:url/og:image URLs on the new domain. Public/site.webmanifest name/short_name.
2. src/App.tsx page meta table, and every page, component, admin view, document template (DocumentBrand.tsx), help article and legal text (src/data/legalDocs.ts) that says SDL / SDL Global Logistics. Use brand.ts constants where the file already imports them; otherwise plain text matching docs/CONTENT.md.
3. Server strings: /api/health service name and the startup log (server/index.ts), settings defaults in server/db.ts.
4. Image alt texts that say "SDL truck/aircraft" describe the OLD photos. Change them to brand-neutral wording for now ("Truck and container ship at a port at sunset"); Prompt 05 rewrites them for the new photos.
5. Code comments that name SDL → brand-neutral or Nuvexa.
Do not change any wording other than the name and the tagline: "Fast, Safe, Reliable" → "Faster, Safer, Further" (TAGLINE in brand.ts, Home H1 "Faster, Safer," + accent "Further.", OG/Twitter titles, JSON-LD slogan). Do not touch CSS values or layout.
Build + test, check Home, Track, a Track Result, Contact, Legal and the admin dashboard in the browser. Commit "rebrand: Nuvexa name across site, documents and legal". STOP and report.
```

### Prompt 03 — Internal identifiers
```
Tracker tasks 3.1–3.5. These are invisible to visitors but show in page source, cookies and file names. Mechanical renames only; values stay identical. See REBRAND_MAP §4.
1. CSS: rename the variable prefix --sdl-* → --ngt-* and the class prefix sdl- → ngt- across src/ in one scripted pass (TS/TSX class names and CSS). Every token keeps its exact value. Afterwards grep for any remaining "sdl-" and for broken references (a var() whose name no longer exists).
2. Storage keys: sdl_live_shipment_stream, sdl_recent_tracking, sdl_units, sdl_admin_shipment_draft → ngt_*. Update the cookie/storage list in src/data/legalDocs.ts to match.
3. Session cookie: SESSION_COOKIE 'sdl.sid' → 'ngt.sid' in server/middleware/auth.ts (this exact constant only, plus its comment; nothing else in that file). Check the logout clearCookie uses the constant.
4. Database file: DB_FILE 'sdl_global.db' → 'ngt.db' in server/db.ts, .env.example (and DEPLOYMENT.md already says ngt.db). Nuvexa starts with a fresh DB, so remove the legacy-file warning and the old-brand settings migration (OLD_BRAND_SETTINGS / LEGACY_DB_FILE) if nothing else depends on them. Do NOT touch tables, columns or my local data/ folder.
5. package.json name → nuvexa-global-transport; run `npm install` so package-lock.json follows. Image manifest: rename src/data/sdlImages.ts → siteImages.ts, SDL_IMAGES → SITE_IMAGES, SdlImage* types → SiteImage*, and change scripts/optimize-images.mjs to write Public/images/site/ and the new manifest name (don't re-run it yet; Prompt 05 does).
Build + test. Run locally on a fresh DB (temporary DB_PATH in the scratch folder, not my data/), log in to admin, create a shipment, track it, download a PDF. Commit "rebrand: rename internal identifiers to Nuvexa". STOP and report, including anything that looked different in the browser (it shouldn't).
```

### Prompt 04 — Logo, favicons, OG image
```
Tracker tasks 4.1–4.3. The Nuvexa logo is images/nov.png (2024×777, transparent PNG, black lettering + red, a red globe with an orbit arrow in the "V", and a small "FASTER • SAFER • FURTHER" line under it).
1. Update the logo section of scripts/optimize-images.mjs to read images/nov.png (it is already transparent, so skip the white-to-alpha step) and write Public/brand/ngt-logo.png (full colour, trimmed), ngt-logo-white.png (dark header/footer/admin sidebar: black lettering → white, red stays red; watch the dark drop-shadow so it does not turn into a white halo) and ngt-mark.png (the red globe from the "V", cropped square, for favicons). The tagline line is tiny: check it is still legible at header size, and tell me if a version without it would read better in the header.
2. Run `node scripts/optimize-images.mjs --icons` (and the logo step) to regenerate favicon-16/32, favicon.png, icon-192, icon-maskable-512, apple-touch-icon and og-image.jpg (1200×630, logo on a clean background in the existing palette).
3. Delete Public/brand/sdl-*.png. Bump the favicon cache-bust query in index.html. theme-color stays (palette unchanged).
4. Check: header on light and over the dark hero, mobile drawer, footer, admin sidebar and login, a generated PDF (waybill) and the public quote print view.
If the logo's colours clash with the existing palette, tell me — don't change the palette. Commit "assets: Nuvexa logo, favicons and OG image". STOP and report with sizes.
```

### Prompt 05 — Photos
```
Tracker tasks 5.1–5.3. The new photos are in images/nuvexa/.
1. List every file with dimensions and size, open each one, and propose a mapping to the existing slots in scripts/optimize-images.mjs (hero-home, hero-home-mobile, track-hero, callback-banner, services-hero, about-hero, service-*, industry-*, about-*, contact-*, locations-hero, …). Flag slots with no suitable photo and photos too small for their slot. Draft alt text for each (describe what's actually in it). Also flag any photo that shows another company's logo or SDL branding.
STOP and show me the table for approval.
```
**After you approve:**
```
Apply the approved mapping: update the source paths in scripts/optimize-images.mjs, run it, delete Public/images/sdl/ and the old originals that are no longer used (list them first; keep anything still referenced), and replace the alt texts in the pages and in docs/CONTENT.md §12. The hero must still crop well at 375px and 1440px (adjust the script's position/crop for a slot only if needed). Build, check every page that shows a photo, commit "assets: Nuvexa photos". STOP and report sizes.
```

### Prompt 06 — Final sweep & regression check
```
Tracker tasks 6.1–6.3.
1. Run the sweep in REBRAND_MAP §6 on source AND a fresh `npm run build` (dist/, dist-server/). Fix every real hit. Anything that must stay goes in the "Allowed hits" table with a reason.
2. Regression: build + npm test; on a fresh local DB (scratch DB_PATH) check public pages load, admin login, create shipment → NGT ID → public tracking, multi-piece label lookup (NGTxxxxx-01), waybill/POD PDF download, quote request → admin → public quote link, contact form → NGT-TKT reference.
3. Compare Home, Services, Track Result and the admin dashboard at 375px and 1440px against the pre-rebrand look: only the name, logo and photos may differ.
Update the tracker. Commit "rebrand: final sweep". STOP and report pass/fail per item.
```

### Prompt 07 — New repo, admin password & Hostinger
```
Tracker tasks 7.1–7.6. Follow docs/DEPLOYMENT.md.
1. Fresh history (I chose option B, DEPLOYMENT §2). Check .gitignore excludes node_modules/, dist/, dist-server/, /data/, .env, and that screens/ and unused previous-brand images are gone; then build a single clean commit on an orphan branch and show me `git show --stat` and a sweep of that commit (REBRAND_MAP §6). Then STOP and ask for my final yes before the force-push to `nuvexa` main (https://github.com/ojrandy/nuvexaglobaltransport). After it, remove the old `origin` and `sdl` remotes.
2. Admin password: give me the one-line command to turn MY password into a bcrypt hash and the one to generate a new SESSION_SECRET. Never ask me for the password and never write it anywhere. These values must be new, not the SDL ones.
3. Write the exact hPanel settings for me (Node version, install/start commands, env vars with DB_PATH outside the app folder, the domain + www + private subdomain on the same app, SSL).
4. Check robots.txt/sitemap (if present), canonical and OG URLs all use the new domain and that the admin subdomain is not listed.
Commit "deploy: Nuvexa Hostinger setup". STOP and give me a numbered checklist for hPanel and the live smoke test (DEPLOYMENT §7).
```

---

### Prompt R — Resume in a new chat
```
We're re-skinning this working logistics platform as Nuvexa Global Transport. Read CLAUDE.md and docs/PROJECT_TRACKER.md (Change log + Needs owner), run `git status` and `git log --oneline -10`, then tell me where we are and what the next unchecked task is. Don't change anything yet.
```

### Prompt F1 — Fix something that broke
```
Something broke: <describe what you see, the page, and any console/terminal error>.
Find the cause (check the last commit's diff first), fix it with the smallest change, and confirm the build, npm test and the affected flow work. Don't restyle or refactor anything else. Log it in the tracker. STOP and report the cause and the fix.
```

### Prompt F2 — Owner info arrived
```
New company info: <phone / WhatsApp / address / socials / legal name / tagline>.
Put it in src/config/brand.ts (and CLAUDE.md §1, CONTENT.md placeholder table) only, then check where it now appears (header, footer, contact, documents, legal) at 375px and 1440px. Remove it from Needs owner. Commit "content: owner details". STOP and report.
```
