# Kodus Trust Center · Dead-simple Trust Hub

Kodus’ trust center is a self-hosted, YAML-driven builder. Paste your security program into a single YAML document and instantly expose a polished trust portal with compliance badges, document requests, subprocessors, FAQs, and more—no paid SaaS, no vendor lock-in.

## Why this project?

- **Own your data**: Everything lives in your repo/Cloudflare D1. Deploy on Workers.
- **YAML in, trust center out**: The public site and admin builder render directly from one source of truth.
- **Fast to operate**: Sales and security teams can edit the YAML, save, and immediately refresh the public page.
- **Real document requests**: Visitors request sensitive documents via email + admin review.
- **Lego layout**: Sections can be hidden or set to `half` / `full` width for flexible compositions.

## Features

| Capability | Details |
| --- | --- |
| YAML builder + live preview | Admin area with copy/reset, D1-backed persistence, hide preview toggle. |
| Public trust center | Theming (`light`/`dark`), company logo, hero commitments, metrics, compliance cards, policies, documents, infra, monitoring, updates, FAQs accordion, subprocessors, contacts. |
| Document requests | Modal collects work email/context → stored in Cloudflare D1 (`document_requests` table). |
| Admin dashboard | Tabs for requests + YAML editor, GitHub SSO (NextAuth). |
| API endpoints | `/api/requests` (list/create) + `/api/trust-config` (load/save YAML). |

## Tech Stack

- **Next.js 16 / App Router** + TypeScript (OpenNext on Cloudflare Workers)
- **Cloudflare D1** for storing requests + YAML config
- **Shadcn/ui + Tailwind CSS v4** for styling
- **NextAuth (GitHub provider)** for admin access
- **Zod + js-yaml** for schema validation

## Quick Start

> Prereqs: Node 18+, pnpm, Cloudflare account + Wrangler login. GitHub OAuth app for admin.

```bash
pnpm install
cp .env.example .env          # fill in NEXTAUTH_*, GITHUB_*, ADMIN_EMAILS
cp .env.example .dev.vars     # same values for Wrangler local/preview
pnpm db:migrate:local         # apply D1 migrations locally
pnpm dev
```

D1 schema lives in `migrations/`. Apply remotely with `pnpm db:migrate`.
Save via the admin UI to seed `trust_configs` (`id='default'`), or the public site falls back to `DEFAULT_TRUST_YAML`.

## YAML Schema Overview

Everything lives under a single document. The schema (in `docs/trust-center-schema.md`) includes:

- `theme`: `"light"` or `"dark"`
- `layout`: map of section → `"full"` / `"half"`
- `company`, `hero`, `metrics`, `compliance`, `documents`, `policies`
- `infrastructure`, `monitoring`, `updates`, `faqs`
- `subprocessors` (with optional `subprocessorsLink`)
- `contacts`

Delete a section to hide its block entirely. Example snippet:

```yaml
theme: dark
layout:
  compliance: half
  policies: half
  documents: full
subprocessors:
  - name: AWS
    category: IT infrastructure
    location: United States
    logo: https://.../aws.svg
    description: Primary cloud provider.
```

## Deployment (Cloudflare Workers)

```bash
pnpm db:migrate               # apply D1 migrations remotely
pnpm deploy                   # OpenNext build + wrangler deploy
# set secrets once:
npx wrangler secret put NEXTAUTH_SECRET
npx wrangler secret put GITHUB_ID
npx wrangler secret put GITHUB_SECRET
npx wrangler secret put ADMIN_EMAILS
npx wrangler secret put NEXTAUTH_URL
```

Custom domain is configured in `wrangler.jsonc` (`trust.and-element.com`). Remove any existing CNAME for that hostname before the first deploy so Workers can attach the custom domain.

## Roadmap / Ideas

- Webhook integrations (Slack/email) for new document requests.
- Versioned YAML history + diff view.
- Multiple trust centers / multi-tenant mode.
- Automated compliance evidence importers.

## License

MIT. Build your trust center, own the infra, and share the YAML freely. Contributions welcome!
