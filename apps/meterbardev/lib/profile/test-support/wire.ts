import type { ProfileDocument } from "../schema"

// Synthetic schema-1 fixtures, not captured usage. Current wire identities from
// MeterBarShared ServiceType.swift at app head 99378cae61fa497caa614c1b3425acd1abac830a.
export const WIRE_PROVIDERS = [
  "Claude Code",
  "Codex CLI",
  "xAI",
  "OpenRouter",
  "Kimi Code",
  "Z.ai Coding Plan",
  "GitHub Copilot",
  "Muse Code",
  "Claude Platform",
] as const

const newProviders = ["xAI", "Muse Code", "Claude Platform"]

export const newProviderFixture: ProfileDocument = {
  schema: 1,
  updatedAt: "2026-09-30T08:00:00.000Z",
  providers: newProviders.map((provider) => ({
    provider,
    name: provider === "Z.ai Coding Plan" ? "Z.ai GLM Coding Plan" : provider,
    plan: null,
    // Synthetic valid quota only: this is not a Copilot usage-only snapshot.
    windows: [{ label: "Weekly", usedPercent: 17, resetsAt: null, pace: null }],
  })),
  receipt: {
    tokens30d: 6,
    sessions: null,
    models: newProviders.map((provider, index) => ({
      provider,
      name: "synthetic-model",
      tokens: index + 1,
    })),
    dailyTokens: [0, 0, 0, 0, 0, 0, 6],
  },
}
