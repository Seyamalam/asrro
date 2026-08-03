# ASRRO portal architecture

The product is split into three surfaces so public content, member workflows, and privileged operations can evolve independently.

## Route groups

- `app/(site)`: public organization pages, discovery, contact, and membership application.
- `app/(portal)/dashboard`: authenticated member, executive, finance, and administration workspaces.
- `convex`: the database schema and small, domain-focused query/mutation modules.

## UI boundaries

- Pages and layouts stay server components unless browser state or animation requires a client boundary.
- `components/site`, `components/dashboard`, and `components/shared` hold product components.
- `components/motion` contains vendored BeUI primitives. Shared easing and spring constants live in `lib/ease.ts`.
- Domain fixtures live outside components so swapping them for Convex hooks does not rewrite presentation code.

## Visual system

ASRRO's identity is an orbital research control room: near-black navy surfaces, ion blue and aurora cyan signals, restrained amber alerts, and bright technical typography. A circuit-orbit constellation is the signature motif. Motion explains hierarchy through spring entrances, shared-layout navigation, and data count-up; it never blocks reading and always respects reduced-motion preferences.

## Data domains

Convex tables are grouped around people and membership, programs and events, public content, governance, finance, communication, and configuration. Read paths are indexed and paginated or bounded. Public functions expose only the minimum client-facing data; administrative operations remain identity- and role-gated.

## Quality gates

ESLint, TypeScript strict mode, Prettier, React Doctor, and React Scan form the local feedback loop. Husky runs staged lint/format checks, a complete typecheck, and staged React Doctor diagnostics before every commit.
