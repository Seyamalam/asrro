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

Open `http://localhost:3000`. The dashboard is available under `/dashboard`.

## Environment

```dotenv
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=
NEXT_PUBLIC_CONVEX_SITE_URL=
```

Never commit `.env.local`. Authentication provider settings must be added in `convex/auth.config.ts` when the production identity provider is selected.

## Quality checks

```bash
bun run lint
bun run typecheck
bun run format:check
bun run doctor
bun run build
```

Husky runs lint-staged, a full TypeScript check, and staged React Doctor diagnostics before commits. React Scan is loaded only during development and can be initialized again with `bunx react-scan init`.

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

1. Configure the production Convex deployment and identity provider.
2. Run `bunx convex deploy` after confirming the target deployment.
3. Build with `bun run build` and deploy the Next.js output to a compatible host.
4. Set the three environment variables above and update the canonical `metadataBase` in `app/layout.tsx` if the final domain differs from `asrro.org`.

## License

Copyright © ASRRO. Add the organization-approved license before accepting external contributions.
