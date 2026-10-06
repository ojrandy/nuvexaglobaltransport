# Deployment: GitHub → Hostinger (Nuvexa Global Transport)

> **Context:** the platform is finished and working, and this exact setup has been deployed to Hostinger before. This
> guide points it at Nuvexa's new repo and domain. `{{DOMAIN}}` and `{{EMAIL}}` are the values in `CLAUDE.md §1`.

The app is **one Node.js process**: Express serves the API (`/api/*`) and the built React site (`dist/`). It stores
data in a **SQLite file**, which shapes everything below.

---

## 1. Hosting requirements

| Need | Why |
|---|---|
| A Hostinger plan that runs **Node.js web apps** (Business / Cloud web hosting, or a VPS) | Static hosting can't run the API, tracking or admin |
| **Node.js ≥ 22.5** (22.x LTS or newer) | `server/db.ts` uses the built-in `node:sqlite` |
| **Persistent storage** outside the deploy folder | The database must survive every redeploy |
| HTTPS (free SSL in hPanel) | The admin session cookie is `secure` in production |

hPanel labels change from time to time; if one below doesn't match, look for the equivalent setting.

## 2. Repository

**Repo:** https://github.com/ojrandy/nuvexaglobaltransport (git remote `nuvexa` in this folder). Everything lives here.

Its `main` currently holds this project's full history (commit `8161ae7` and earlier), which includes the previous
clients' names. **Owner decision (2026-10-03): fresh history (option B).** At Prompt 07, `main` is replaced by one clean
commit. This overwrites what is on GitHub and can't be undone from there, so Claude prepares it and the owner gives the
final yes before the push:

1. Confirm `.gitignore` excludes `node_modules/`, `dist/`, `dist-server/`, `/data/`, `.env`, and that `screens/` and
   unused previous-brand images are gone.
2. Build the clean commit and review it (file list + REBRAND_MAP §6 sweep on it):
   ```bash
   git checkout --orphan nuvexa-main && git add -A && git commit -m "Nuvexa Global Transport: initial import"
   ```
3. After the owner's yes:
   ```bash
   git push --force nuvexa nuvexa-main:main
   git remote remove origin && git remote remove sdl
   ```

The local branches with the old history stay on this machine as a backup until the site is live; delete them after.

## 3. Hostinger app configuration

| Setting | Value |
|---|---|
| Source | GitHub → `ojrandy/nuvexaglobaltransport`, branch `main` |
| Node version | 22.x (or newer LTS) |
| Install command | `npm install` (`postinstall` already runs `npm run build`) |
| Build command | only if the panel insists: `npm run build` (don't build twice) |
| Start command | `npm start` → `node dist-server/server/index.js` |
| Port | the platform's `PORT` env var (the server reads `process.env.PORT`) |

## 4. Environment variables (set in hPanel, never commit)

```ini
NODE_ENV=production
PORT=<provided by Hostinger or 5000>
ADMIN_PASSWORD_HASH=<bcrypt hash of the NEW Nuvexa admin password>
SESSION_SECRET=<NEW 64 hex chars>
SEED_DEMO_DATA=false
DB_PATH=/home/<hostinger-user>/nuvexa-data/ngt.db   # a folder OUTSIDE the app/deploy directory
```

**New admin password.** The owner picks it and runs this locally, typing the password themselves. Nobody writes the
password in a file, a commit or a chat:
```bash
node -e "console.log(require('bcryptjs').hashSync(process.argv[1], 12))" 'YOUR-NEW-PASSWORD'
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Paste the outputs into `ADMIN_PASSWORD_HASH` and `SESSION_SECRET`. **Never reuse the previous client's values.** (Clear
the command from your shell history afterwards if you typed the password on the command line.)

**Database.** Nuvexa starts with a **fresh** `ngt.db`; nothing is migrated from the previous client. The server
creates the schema on first start.

**Check persistence before launch:** log in to the admin console, then open
`https://private.{{DOMAIN}}/api/diag/storage` in the same browser. Redeploy and open it again. If `markerFirstSeen` stays
the same, storage persists. **Then remove that endpoint.**

## 5. Domains & DNS

| Host | Points to | Purpose |
|---|---|---|
| `{{DOMAIN}}` | Node app | Public site |
| `www.{{DOMAIN}}` | Redirect → apex | |
| `private.{{DOMAIN}}` | **Same** Node app (additional domain/alias) | Admin console |

- `isAdminHost()` in `src/App.tsx` reads `ADMIN_HOST` from `src/config/brand.ts` (`private.` + `DOMAIN`), so setting
  `DOMAIN` is all the code needs.
- Add `private.{{DOMAIN}}` as an alias of the **same** app, so both hostnames share one API, session store and database.
- On the public domain `#/admin` falls back to Home; the admin host serves `noindex, nofollow`. Don't list the subdomain
  in `robots.txt` or a sitemap.
- SSL on for all three hostnames; force HTTPS.

## 6. Email ({{EMAIL}})

- Create the mailbox (Hostinger Email or Google Workspace).
- DNS: **MX** from the provider · **SPF** `v=spf1 include:<provider> ~all` · **DKIM** (from the provider) ·
  **DMARC** `v=DMARC1; p=quarantine; rua=mailto:{{EMAIL}}`.
- Send a test to Gmail → "Show original" → SPF/DKIM/DMARC = PASS.

## 7. Launch checklist (smoke test on the live domain)

- [ ] Home loads over HTTPS with the Nuvexa logo and photos, no console errors.
- [ ] `/api/health` returns `ok` with service name "Nuvexa Global Transport API".
- [ ] `private.{{DOMAIN}}` → login works with the **new** password; the old SDL password does not. `#/admin` on the public domain does **not** open admin.
- [ ] Create a shipment in admin → it gets an `NGT` + 5-character ID → the public Track page finds it.
- [ ] Waybill / POD PDFs download and show Nuvexa branding only.
- [ ] Quote request → appears in admin → quote link opens publicly.
- [ ] Contact and callback forms show an `NGT-TKT-` reference.
- [ ] No demo data: `SEED_DEMO_DATA=false`; tracking `NGT7K2M9` says "not found".
- [ ] Redeploy once; the shipment above still exists (persistence).
- [ ] View source, the cookie name (`ngt.sid`), `/brand/og-image.jpg` (200, `image/jpeg`) and a link preview (e.g. WhatsApp): all Nuvexa.
- [ ] `canonical`, `og:url`, `og:image`, `twitter:image` point at the exact live host (apex vs `www`). Then run the URL
      through the Facebook Sharing Debugger and LinkedIn Post Inspector.
- [ ] Final sweep on the live HTML/JS bundle (REBRAND_MAP §6).

## 8. After launch

- **Backups:** copy `ngt.db` daily to off-server storage; test a restore once.
- **Updates:** push to `main` → Hostinger redeploys.
- **Monitoring:** a free uptime monitor on `/api/health` (5-minute interval) with alerts to {{EMAIL}}.
- **Security:** rotate `ADMIN_PASSWORD_HASH` and `SESSION_SECRET` if anyone with access leaves; `npm audit` monthly.
