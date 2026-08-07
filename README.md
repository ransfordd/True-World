# The True Word — Next.js 15

Faith-based ministry site with **Next.js 15 (App Router)**, React 19, TypeScript,
Tailwind CSS, Framer Motion, Docker, and a **self-hosted file-backed CMS** so staff
can edit content at `/admin` without code or MDX.

## Getting started

```bash
npm install
cp .env.example .env
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Staff CMS: [http://localhost:3000/admin](http://localhost:3000/admin)

Default login (change immediately in production via env):

- Email: `admin@thetrueword.com` (or `CMS_ADMIN_EMAIL`)
- Password: `ChangeMe123!` (or `CMS_ADMIN_PASSWORD`)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | ESLint |

## Content management (CMS)

Church staff manage **almost all site content** through `/admin`:

| Area | Path |
|------|------|
| Articles (create / edit / unpublish / delete + cover image) | `/admin/articles` |
| Testimonials | `/admin/testimonials` |
| Resources | `/admin/resources` |
| Daily Truth quotes | `/admin/daily-truths` |
| Coaching packages | `/admin/coaching` |
| Journey course tiers | `/admin/journey` |
| Site settings (name, tagline, email, socials, featured YouTube ID, logo) | `/admin/settings` |

**How it works**

- Content is stored in JSON at `data/cms/store.json` (or `CMS_DATA_DIR`).
- Uploads go to `public/uploads/` and are served at `/uploads/...`.
- On first boot, the store is **seeded** from `content/articles/*.mdx` and defaults in `lib/site-data.ts`.
- After seed, edit live in the admin UI — no redeploy needed for content changes.
- Public pages load CMS data at request time (`force-dynamic` where needed).

### Staff workflow

1. Open `https://your-domain/admin` over HTTPS.
2. Sign in with the admin credentials.
3. **Articles:** New → fill title, slug, body HTML, cover image upload → set status to **published**.
4. **Settings:** Update YouTube featured video ID, tagline, contact links → save.
5. Refresh the public site to see changes.

### Auth hardening

- Set a long random `CMS_SECRET` (32+ characters).
- Set strong `CMS_ADMIN_EMAIL` / `CMS_ADMIN_PASSWORD` before production.
- Sessions use httpOnly cookies (7 days).
- Do not expose `/admin` in public navigation (not linked from the main site header).
- Prefer HTTPS only in production (cookies use `secure` when `NODE_ENV=production`).

To reset a forgotten password: stop the app, delete the user entry in `store.json` (or delete the store and re-seed), set new `CMS_ADMIN_*` env vars, and start again.

## Email / forms (SMTP)

Contact, prayer, coaching, and subscribe forms `POST` to App Router API routes and send mail via Nodemailer.

**Required environment variables** (see `.env.example`):

| Variable | Purpose |
|----------|---------|
| `SMTP_HOST` | SMTP server hostname |
| `SMTP_PORT` | Usually `587` (STARTTLS) or `465` (SSL) |
| `SMTP_USER` | SMTP username |
| `SMTP_PASS` | SMTP password / app password |
| `MAIL_TO` | Inbox for form submissions |
| `MAIL_FROM` | From header (e.g. `The True Word <noreply@…>`) |
| `NEXT_PUBLIC_MAIL_TO` | Client `mailto:` fallback address |
| `CMS_SECRET` | CMS session signing key |
| `CMS_ADMIN_EMAIL` | Bootstrap admin email |
| `CMS_ADMIN_PASSWORD` | Bootstrap admin password |
| `CMS_DATA_DIR` | Optional path for CMS JSON store |

If SMTP is not fully configured, the API returns an error and the UI opens a `mailto:` fallback.

### Coolify

1. Deploy with **Dockerfile** build pack (repo root).
2. Set SMTP + CMS variables in Coolify **Environment**.
3. **Persist volumes** (otherwise content/images reset on redeploy):
   - `/app/data/cms` → CMS store
   - `/app/public/uploads` → media uploads
4. Redeploy after changing env vars.
5. Container listens on port **3000** (Coolify proxies this).
6. Staff URL: `https://your-domain/admin`

### Docker (local)

```bash
docker compose up --build
```

Maps host **3010** → container **3000**. Open [http://localhost:3010](http://localhost:3010).

Compose mounts named volumes for CMS data and uploads.

## Architecture notes

- Self-hosted **file CMS** (not Sanity/Contentful; Payload packages were unavailable at install time).
- Static fallbacks remain in `lib/site-data.ts` for seed/defaults.
- MDX under `content/articles/` is used for initial import; live source of truth is the CMS store after first seed.

## Brand

- Gold accent: `#C0A04C` (`ttw-gold`)
- Fonts: Inter + Cinzel via `next/font`
