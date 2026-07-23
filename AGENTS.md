<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Repo Notes

- Use Bun. Do not introduce npm, yarn, or pnpm lockfiles.
- Apps live in `apps/meterbardev`, `apps/macsweepdev`,
  `apps/opentvtrackerdev`, and `apps/openfocusdev`.
- Shared page code lives in `packages/landing`; shared shadcn/ui components live in `packages/ui`.
- Keep landing pages visually consistent by changing product content in
  `packages/landing/src/products.ts`.
- Run shadcn from one app directory, for example `cd apps/meterbardev && bunx --bun shadcn@latest add card`.
