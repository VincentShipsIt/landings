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
