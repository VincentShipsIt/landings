import type { ProfileDocument } from "../schema"

// Synthetic schema-1 fixtures, not captured usage. Wire tokens inspected from
// Packages/MeterBarShared/Sources/MeterBarShared/ServiceType.swift at provider
// head c56f72ba0295b46cb833eb3a8639d3843f7964a3. Card and receipt rawValue
// construction inspected in MeterBar/Models/PublicProfileDocument.swift at
// app head 585d862f47193fa988894d020e3144817b15e918.
export const WIRE_PROVIDERS = [
  "Claude Code",
  "Codex CLI",
  "Cursor",
  "OpenRouter",
  "Grok",
  "Kimi Code",
  "Z.ai Coding Plan",
  "GitHub Copilot",
] as const

export const newProviderFixture: ProfileDocument = {
  schema: 1,
  updatedAt: "2026-09-30T08:00:00.000Z",
  providers: WIRE_PROVIDERS.slice(5).map((provider) => ({
    provider,
    name: provider === "Z.ai Coding Plan" ? "Z.ai GLM Coding Plan" : provider,
    plan: null,
    // Synthetic valid quota only: this is not a Copilot usage-only snapshot.
    windows: [{ label: "Weekly", usedPercent: 17, resetsAt: null, pace: null }],
  })),
  receipt: {
    tokens30d: 6,
    sessions: null,
    models: WIRE_PROVIDERS.slice(5).map((provider, index) => ({
      provider,
      name: "synthetic-model",
      tokens: index + 1,
    })),
    dailyTokens: [0, 0, 0, 0, 0, 0, 6],
  },
}
