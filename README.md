# VincentShipsIt Landings

Open-source landing pages for VincentShipsIt macOS utilities.

## Apps

- `apps/meterbardev` - `meterbar.dev`
- `apps/macsweepdev` - `macsweep.dev`

Both apps use the same shared renderer and shadcn/ui package. Product-specific copy,
links, install commands, and screenshots live in `packages/landing/src/products.ts`.

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
bun run build
bun run typecheck
```

## shadcn/ui

Run shadcn from an app directory so new components land in `packages/ui`:

```bash
cd apps/meterbardev
bunx --bun shadcn@latest add button
```

The two apps are intentionally thin. Add reusable UI to `packages/landing` or
`packages/ui`; keep app-local files limited to metadata, assets, and routing.
