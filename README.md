# The True Word — Next.js 14

Faith-based ministry site rebuilt with **Next.js 14 (App Router)**, React 18, TypeScript, Tailwind CSS, Framer Motion, and Docker.

## Getting started

```bash
npm install
cp .env.example .env
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | ESLint |

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

If SMTP is not fully configured, the API returns an error and the UI opens a `mailto:` fallback.

### Coolify

1. Deploy with **Dockerfile** build pack (repo root).
2. Set the variables above in the Coolify application **Environment** (secrets stay in Coolify — do not commit real passwords).
3. Redeploy after changing env vars.
4. Container listens on port **3000** (Coolify proxies this).

## Docker (local)

```bash
docker compose up --build
```

Maps host **3010** → container **3000**. Open [http://localhost:3010](http://localhost:3010). Uses Next.js `output: 'standalone'`.

## Content

- Pages live under `app/`
- Articles are MDX in `content/articles/` (converted from the legacy HTML site)
- Optional: set `SITE.youtubeFeaturedVideoId` in `lib/site-data.ts` to a YouTube `watch?v=` ID for a real homepage thumbnail
- Legacy static site is archived in `_legacy/`

## Brand

- Gold accent: `#C0A04C` (`ttw-gold`)
- Fonts: Inter + Cinzel via `next/font`
