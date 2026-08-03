# Convex API guide

Convex functions are the application's typed API. Generated references in `convex/_generated/api` are consumed with `useQuery`, `useMutation`, or server-side Convex clients.

## Public reads

Public pages read bounded or paginated lists for events, projects, alumni, committee members, publications, posts, gallery albums, and site settings. Detail reads accept typed document IDs or indexed slugs.

## Public writes

- Submit a membership application.
- Register or cancel an eligible event registration before its deadline.
- Send a contact message.
- Add an optional blog comment when comments are enabled.

Every write validates its complete argument shape. Membership and event workflows derive authority from the authenticated identity rather than accepting an arbitrary user ID.

## Member reads

Authenticated members can read their own profile, membership card data, event history, receipts, and notifications. These functions never return another member's private fields.

## Administrative operations

Executive operations include application approval/rejection, member status updates, event and content management, attendance, committee maintenance, finance entries, and report datasets. Functions enforce role permissions server-side; hiding controls in the browser is only a usability layer.

## Error handling

User-correctable failures use concise messages suitable for form feedback. Authorization failures do not disclose whether a private record exists. Export formatting belongs in a bounded action or client worker so database transactions remain short.
