# VincentShipsIt Landings

Open-source landing pages for VincentShipsIt native apps.

## Apps

- `apps/meterbardev` - `meterbar.dev`
- `apps/macsweepdev` - `macsweep.dev`
- `apps/openfocusdev` - `openfocus.dev`
- `apps/opentvtrackerdev` - `opentvtracker.dev`

All apps use the same shared renderer and shadcn/ui package. Product-specific
copy, links, availability, and screenshots live in
`packages/landing/src/products.ts`.

`opentvtracker.dev` also serves the Apple App Site Association file and the
OpenRouter OAuth callback landing path for the production iPhone bundle
`dev.opentvtracker.app`.

## Packages

- `packages/landing` - shared landing page component and product content
- `packages/ui` - shadcn/ui components and Tailwind theme
- `packages/eslint-config` - shared ESLint config from the shadcn monorepo template
- `packages/typescript-config` - shared TS configs

## Commands

```bash
bun install
bun run dev:meterbar
bun run dev:macsweep
bun run dev:openfocus
bun run dev:opentvtracker
bun run build
bun run typecheck
```

## shadcn/ui

Run shadcn from an app directory so new components land in `packages/ui`:

```bash
cd apps/meterbardev
bunx --bun shadcn@latest add button
```

The apps are intentionally thin. Add reusable UI to `packages/landing` or
`packages/ui`; keep app-local files limited to metadata, assets, and routing.

## MeterBar public profiles

`apps/meterbardev` serves the opt-in public profiles the MeterBar app publishes
(`meterbar.dev/u/<slug>`). This is MeterBar-only behaviour, so it lives in that
app rather than in `packages/landing`. The contract with the app is
`docs/public-profile-contract.md` in `VincentShipsIt/meterbar.dev`.

- `PUT|DELETE /api/profile/<slug>` stores or deletes one JSON document, keyed by
  the SHA-256 of the publisher's key. Records expire 7 days after the last write.
- `/u/<slug>` renders it; `/u/<slug>/og` is the 1200x630 card used by
  Open Graph and X. The page and card are served fresh with
  no browser/CDN caching, so deletion and storage expiry apply on the next
  request. Social platforms can retain their own copies.
- Storage is Upstash Redis. Add the Upstash integration to the Vercel project;
  it injects `KV_REST_API_URL` / `KV_REST_API_TOKEN` (or set
  `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`). With neither set,
  `next dev` uses an in-memory store and production answers 503.
- Tests: `cd apps/meterbardev && bun test`. Storage regressions require local
  `redis-server` and `redis-cli` (Redis 7+); tests start a private temporary Unix
  socket with persistence disabled and exercise the production Upstash SDK.
  CI installs Redis and runs these tests before the build.

Before enabling production profiles, explicitly choose the Vercel team/project,
Upstash account/database/region and plan/billing limits. Add one matched URL/token
pair above through the approved hosting integration, separately for preview and
production as needed. No storage is provisioned by this repository. Fresh page
and card reads each use storage commands; budget for reads as well as writes.
After review, CI and the approved deployment, verify missing-storage 503,
authenticated publish/update/delete, expiry/reclaim, no-store page/card responses,
and the social preview validators using a separately authorized synthetic profile.
Do not use real local usage for deployment smoke tests.
