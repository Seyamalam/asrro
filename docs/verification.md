# Verification record

Last verified on 3 August 2026 against the configured development backend.

## Automated gates

- Production build: passed for all 37 generated routes.
- Strict TypeScript: passed.
- ESLint with zero warnings: passed.
- Prettier check: passed.
- React Doctor changed-scope audit: no issues.
- Backend workflow tests: 5 passed, covering applicant isolation, duplicate membership payments, administrative authorization, one-time administrator bootstrap, event eligibility, and duplicate event payments.
- Backend schema/function synchronization: passed.

## Browser verification

- All current public, applicant, member, executive, finance, and administration routes were opened and captured at desktop size.
- Representative home, login, and dashboard routes were captured in light, dark, and mobile layouts.
- Local development measurements reported homepage LCP at 736 ms, login LCP at 392 ms, and CLS at 0 for both routes. These are development-machine observations, not a production SLA.

## Operational checks

- `/api/health` verifies that the web runtime can read the backend and returns a degraded `503` response when it cannot.
- Authentication origins are configured per deployment through `SITE_URL` and `TRUSTED_ORIGINS`.
- Outbound email is intentionally disabled until an organization-owned provider is configured; in-app notifications remain operational.
- Availability guarantees and high-volume capacity must be monitored and load-tested in the final hosting environment because local checks cannot establish a production SLA.
