# Rebrand Map: SDL Global Logistics → Nuvexa Global Transport

> **Context:** the platform is finished and working. This job is a **re-skin**: name, logo, photos, admin password and
> tracking-ID prefix change; design, palette, fonts, layout and features stay. See `CLAUDE.md §0`.

**Approach:** targeted find-and-replace and asset swaps. Build and test after each group. Tick items as you go and note
the commit. Audit taken from branch `sdl-rebrand` at `8161ae7` on 2026-10-03.

`{{DOMAIN}}`, `{{EMAIL}}` and `{{LEGAL_NAME}}` mean the values in `CLAUDE.md §1`.

---

## 1. Strings → replacements

| Old | New | Where |
|---|---|---|
| `SDL Global Logistics Ltd` | `{{LEGAL_NAME}}` (`LEGAL_NAME`) | footer ©, legal pages, documents, settings default, JSON-LD |
| `SDL Global Logistics` | `Nuvexa Global Transport` (`COMPANY`) | titles, meta, first mentions, health endpoint, server log |
| `SDL` (stand-alone) | `Nuvexa` (`COMPANY_SHORT`) | buttons, repeated mentions, "Talk to SDL", "WHY SDL" |
| `SDL Operations Console` / `Centre` / `Intake Desk` | `Nuvexa Operations Console` / `Centre` / `Intake Desk` | already built from `COMPANY_SHORT` in brand.ts; just verify |
| `SDL Tamper-Evident Document Pouch` | `Nuvexa Tamper-Evident Document Pouch` | `DocumentBrand.tsx` |
| `SDL's Shipping Terms` | `Nuvexa's Shipping Terms` | `DocumentBrand.tsx` |
| Previous client's domain, email and admin subdomain | `{{DOMAIN}}`, `{{EMAIL}}`, `private.{{DOMAIN}}` | brand.ts, index.html, server/db.ts settings default. **Done 2026-10-03; no reference to the old domain remains.** |
| `Fast, Safe, Reliable` (SDL tagline) | `Faster • Safer • Further` (`TAGLINE`, as on the logo) | Home H1, OG/Twitter title, footer brand block, `TAGLINE` | + JSON-LD `slogan` |
| `"SDL", "we"` (legal) | `"Nuvexa", "we"` | `src/data/legalDocs.ts` |

## 2. Visible text: files to edit

- [x] `src/config/brand.ts` (all facts; one place)
- [x] `index.html` (title, description, OG/Twitter, site_name, JSON-LD, canonical, og:url, og:image, favicon cache-bust)
- [x] `Public/site.webmanifest` (name, short_name)
- [x] `src/App.tsx` (page meta table: home, track, about, locations, contact descriptions)
- [x] Pages: `HomePage.tsx`, `TrackPage.tsx`, `TrackResultPage.tsx`, `ServicesPage.tsx`, `AboutPage.tsx`, `ContactPage.tsx`,
      `ShipPage.tsx`, `QuotePage.tsx`, `PublicQuoteResultPage.tsx`, `LegalPage.tsx`, `HelpPage.tsx`, `LocationsPage.tsx`
- [x] Components: `Header.tsx`, `Footer.tsx`, `DocumentBrand.tsx`, `ShipmentDocuments.tsx`, `SupportModal.tsx`
- [x] Data: `src/data/legalDocs.ts`, `src/data/helpArticles.ts`, `src/data/gateways.ts` (comments)
- [x] Admin: `AdminLayout.tsx`, `CreateShipmentView.tsx` (seal placeholder `SDL-SL-892401`), `SettingsView.tsx`
- [x] Server: `server/index.ts` (health service name, start log), `server/db.ts` (settings defaults), `server/routes/track.ts` (comment)
- [x] Code comments naming SDL: `services/geocodingService.ts`, `planningEngine.ts`, `routingEngine.ts`, `AdminDataContext.tsx`, CSS header comments
- [x] Photo alt texts that describe SDL vehicles ("SDL truck…", "SDL aircraft…"): `HomePage.tsx`, `TrackPage.tsx`,
      `TrackResultPage.tsx` (×2), `ServicesPage.tsx`, `AboutPage.tsx` → rewritten for the new photos in Prompt 05

## 3. Tracking ID and reference prefixes

Format and alphabet don't change: prefix + 5 characters from `23456789ABCDEFGHJKLMNPQRSTUVWXYZ`, 8 total.

| Old | New |
|---|---|
| `DLS7K2M9` (example), regex `^DLS[2-9A-HJ-NP-Z]{5}$` | `NGT7K2M9`, `^NGT[2-9A-HJ-NP-Z]{5}$` (built from `TRACKING_PREFIX`) |
| `DLS7K2M9-01` (piece label) | `NGT7K2M9-01` |
| `DLS·····` (placeholder before the server assigns an ID) | `NGT·····` |
| `SDL-SL-######` / `SDL-TKT-######` / `SDL-INV-######` | `NGT-SL-######` / `NGT-TKT-######` / `NGT-INV-######` |
| `REFERENCE_PATTERN = /^SDL-(SL\|TKT\|INV)-\d{6}$/` | built from the prefix: `^NGT-(SL\|TKT\|INV)-\d{6}$` |

Files with a hard-coded `DLS` or `SDL-` reference:
- [x] `src/config/brand.ts` (`TRACKING_PREFIX`)
- [x] `src/shared/trackingId.ts` (comments only), `src/shared/references.ts` (prefixes + pattern)
- [x] `server/routes/shipments.ts`, `server/routes/track.ts`, `server/db.ts`
- [x] `src/pages/TrackPage.tsx`, `HomePage.tsx`, `ContactPage.tsx`, `ShipPage.tsx`
- [x] `src/components/SupportModal.tsx`, `src/admin/components/ShipmentControlModal.tsx`, `src/admin/pages/CreateShipmentView.tsx`
- [x] `src/context/AdminDataContext.tsx`, `src/services/api.ts`, `src/data/helpArticles.ts`, `src/types/admin.ts`, `src/types/shipment.ts`
- [x] Tests: `scripts/trackingId.test.ts`, `scripts/references.test.ts`

## 4. Internal identifiers

| Old | New | Notes |
|---|---|---|
| CSS variables `--sdl-*` | `--ngt-*` | ~77 files under `src/`. Scripted rename; **values unchanged** |
| CSS classes `sdl-*` | `ngt-*` | same pass; update the TSX `className`s too |
| Cookie `sdl.sid` | `ngt.sid` | `SESSION_COOKIE` in `server/middleware/auth.ts` (constant only) + `legalDocs.ts` cookie list |
| `sdl_live_shipment_stream`, `sdl_recent_tracking`, `sdl_units`, `sdl_admin_shipment_draft` | `ngt_*` | `simulationEngine.ts`, `TrackPage.tsx`, `useUnitSystem.ts`, `CreateShipmentView.tsx`, `legalDocs.ts` |
| DB file `sdl_global.db` | `ngt.db` | `server/db.ts`, `.env.example`. Fresh DB; drop `LEGACY_DB_FILE` / `OLD_BRAND_SETTINGS` (old-brand migration, not needed) |
| `package.json` name `sdl-global-logistics` | `nuvexa-global-transport` | regenerate `package-lock.json` |
| `src/data/sdlImages.ts`, `SDL_IMAGES`, `SdlImageName`, `SdlImageInfo` | `siteImages.ts`, `SITE_IMAGES`, `SiteImageName`, `SiteImageInfo` | `ResponsiveImage.tsx`, `HomePage.tsx`, `ServicesPage.tsx`, `optimize-images.mjs` |
| `Public/images/sdl/` | `Public/images/site/` | output folder in `optimize-images.mjs`; regenerated in Prompt 05 |

## 5. Assets

| Old | New |
|---|---|
| `Public/brand/sdl-logo.png`, `sdl-logo-white.png`, `sdl-mark.png` | `ngt-logo.png`, `ngt-logo-white.png`, `ngt-mark.png` (SVG if supplied) |
| `favicon-16/32.png`, `favicon.png`, `icon-192.png`, `icon-maskable-512.png`, `apple-touch-icon.png`, `og-image.jpg` | regenerated from the Nuvexa logo (same names) |
| `images/logo.jpeg` (SDL logo original) | `images/nov.png` (Nuvexa original, supplied); delete `logo.jpeg` |
| `images/landingimage.png`, `landingimage-mobile.png` (show SDL-branded truck/aircraft), `images/brand-img*.PNG` | **must go**: replaced by Nuvexa photos |
| `images/free-pexels/`, `images/free-cc0/`, `images/site/` (stock, unbranded) | may be reused if the owner approves; otherwise replaced |
| `screens/` (old reference screenshots) | out of the repo |

## 6. Sweep (before and after)

```bash
# Must return nothing (except the Allowed hits below):
grep -rniE "sdl|\bdls[0-9a-z·]|duolingo|dxp" --exclude-dir={node_modules,dist,dist-server,.git,data} \
  src server scripts index.html Public/site.webmanifest package.json .env.example
# Built output:
npm run build && grep -rliE "sdl|duolingo" dist dist-server
# Asset file names:
find Public images -iname "*sdl*"
```

**Before count (Prompt 00, 2026-10-03, `8161ae7`):** source **2,888 line hits in 99 files** (2,407 in `.css`; ~268 more are `--sdl-*`/`sdl-*` in TSX; 28 in tests; 14 `duolingo`/`dxp`). Build: **21 files** in `dist`/`dist-server`. Asset names: **4** (`Public/brand/sdl-logo.png`, `sdl-logo-white.png`, `sdl-mark.png`, `Public/images/sdl/`).
**After count (Prompt 06, 2026-10-06, on `fddd5c6`):** source **4 line hits in 2 files** (all negative tests in `scripts/references.test.ts` / `scripts/trackingId.test.ts`). Build: **0 text hits**; 5 binary image matches in `dist/images/site/` (noise, see below). Asset names: **0**. Git history: `nuvexa/main` still carries the SDL commits until the fresh-history push at Prompt 07 (Decisions log, option B).

**Allowed hits (document each here):**
| Hit | Why it's allowed |
|---|---|
| `CLAUDE.md`, `PROMPTS.md`, `docs/*.md` | Rebrand docs that have to name the old strings. Internal only, not in `dist/`. Remove or trim the SDL references before the repo is shared with anyone outside the project. |
| Negative tests in `scripts/*.test.ts` (asserting old `DLS`/`DXP` IDs are rejected) | Not part of the build. |
| Binary false positives (`sdl`/`dxp` inside compressed image bytes) | No text metadata; confirm with `strings` if in doubt. Checked 2026-10-06: 11 files in `Public/images/site/`, 10 in `images/`; no printable string carries the old name (longest runs are noise such as `DxPsT0`, `sdlO.f`). |
| `package-lock.json` (one line) | `sdL` inside a sha512 `integrity` hash of a dependency. Not text, not in `dist/`. |
