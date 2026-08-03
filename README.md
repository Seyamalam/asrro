# ASRRO Portal

The public website and organization-management workspace for the Andromeda Space and Robotics Research Organization at CUET, Bangladesh.

The application combines a fast editorial public site with a member portal and role-aware executive dashboard. It is built with Next.js 16, React 19, Convex, Tailwind CSS 4, and vendored [BeUI](https://beui.dev/) motion primitives.

## Product areas

- Public pages for ASRRO's story, committee, alumni, projects, events, gallery, publications, news, and contact details.
- Membership application, approval, permanent ASRRO UUID allocation, profile, digital card, and notifications.
- Event administration, registration review, attendance, and export-ready datasets.
- Executive workflows for members, committees, projects, content, reports, and settings.
- Restricted finance views for income, expenses, budgets, trends, and reporting periods.

## Local development

Requirements: Bun 1.3+, Node.js 20+, and a Convex deployment.

```bash
bun install
cp .env.example .env.local
bunx convex dev
bun dev
```

Open `http://localhost:3000`. Use **Dashboard** in the header or visit
`/login`, create an email/password account, and you will be taken directly to
`/dashboard`. Development authentication does not send a verification code.

## Public demo accounts

These shared, member-level accounts are available on the configured ASRRO
development deployment. They are intentionally not granted executive or
administrative permissions.

| Account         | Email                       | Password      |
| --------------- | --------------------------- | ------------- |
| Demo member     | `demo.member@asrro.org`     | `demo12345`   |
| Demo researcher | `demo.researcher@asrro.org` | `research123` |

Sign in at `/login`; no email verification code is required. These credentials
are public, so do not store personal or sensitive information in either
account. A fresh Convex deployment has its own database, and users can create a
new local account from the same screen.

## Environment

```dotenv
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=
NEXT_PUBLIC_CONVEX_SITE_URL=
```

Never commit `.env.local`. Better Auth is configured in
`convex/betterAuth/auth.ts`, with Convex JWT discovery in
`convex/auth.config.ts`.

Set `SITE_URL` and `BETTER_AUTH_SECRET` in the Convex deployment environment.
Approved members can link their portal identity to the existing role-aware
member record; new accounts initially receive member-level navigation.

## Quality checks

```bash
bun run lint
bun run typecheck
bun run format:check
bun run doctor
bun run build
```

Husky runs lint-staged, a full TypeScript check, and staged React Doctor
diagnostics before commits. Start the local React Scan workflow with
`bun run dev:scan`.

## Screenshots

The complete public-site and authenticated-dashboard gallery is maintained in
[screenshots.md](screenshots.md).

## Structure

```text
app/(site)             public routes and shared site layout
app/(portal)/dashboard member and administration routes
components/site        public product components
components/dashboard   portal shell and data interfaces
components/motion      vendored BeUI motion primitives
convex                  schema and domain functions
content, data           typed display data and fixtures
docs                    architecture, API, data model, and user guide
```

See [architecture](docs/architecture.md), [data model](docs/data-model.md), [API guide](docs/api.md), and [user guide](docs/user-guide.md).

## Deployment

1. Configure the production Convex deployment and Better Auth environment.
2. Run `bunx convex deploy` after confirming the target deployment.
3. Build with `bun run build` and deploy the Next.js output to a compatible host.
4. Set the three environment variables above and update the canonical `metadataBase` in `app/layout.tsx` if the final domain differs from `asrro.org`.

## License

Copyright © ASRRO. Add the organization-approved license before accepting external contributions.
