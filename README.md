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

## Email / forms

Contact, prayer, coaching, and subscribe forms `POST` to App Router API routes and send mail via Nodemailer. Configure SMTP in `.env` (see `.env.example`). If the API fails, the UI opens a `mailto:` fallback to `info@thetrueword.com`.

## Docker

```bash
docker compose up --build
```

Uses Next.js `output: 'standalone'`.

## Content

- Pages live under `app/`
- Articles are MDX in `content/articles/` (converted from the legacy HTML site)
- Legacy static site is archived in `_legacy/`

## Brand

- Gold accent: `#C0A04C` (`ttw-gold`)
- Fonts: Inter + Cinzel via `next/font`
