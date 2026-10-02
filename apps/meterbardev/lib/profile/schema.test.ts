/* eslint-disable @typescript-eslint/no-explicit-any -- tests mutate loosely-typed JSON on purpose */
import { describe, expect, test } from "bun:test"

import {
  isValidSlug,
  parseProfile,
  type ProfileDocument,
  SCHEMA_VERSION,
} from "./schema"

import { newProviderFixture, WIRE_PROVIDERS } from "./test-support/wire"

const valid = {
  schema: 1,
  updatedAt: "2026-09-29T20:00:00Z",
  providers: [
    {
      provider: "Claude Code",
      name: "Claude Code",
      plan: "Max 20x",
      windows: [
        {
          label: "Weekly",
          usedPercent: 17,
          resetsAt: "2026-10-03T08:00:00Z",
          pace: "27% in reserve",
        },
      ],
    },
  ],
  receipt: {
    tokens30d: 84_200_000,
    sessions: 312,
    models: [{ provider: "Claude Code", name: "claude-opus-5-5", tokens: 5 }],
    dailyTokens: [1, 2, 3, 4, 5, 6, 7],
  },
}

const clone = () => structuredClone(valid) as Record<string, unknown>

describe("slug", () => {
  test("accepts ten Crockford base32 characters only", () => {
    expect(isValidSlug("0123456789")).toBe(true)
    expect(isValidSlug("abcdefghjk")).toBe(true)
    for (const bad of [
      "",
      "abc",
      "ABCDEFGHJK",
      "../../etc/x",
      "0123456789a",
      "iiiiiiiiii",
    ]) {
      expect(isValidSlug(bad)).toBe(false)
    }
  })
})

describe("parseProfile", () => {
  test("accepts the contract's example and returns it unchanged", () => {
    const parsed = parseProfile(valid) as ProfileDocument
    expect(parsed.schema).toBe(SCHEMA_VERSION)
    expect(parsed.providers[0]?.windows[0]?.pace).toBe("27% in reserve")
    expect(parsed.receipt?.dailyTokens).toHaveLength(7)
    expect(parsed.updatedAt).toBe("2026-09-29T20:00:00.000Z")
  })

  test("drops keys the contract does not have instead of storing them", () => {
    const doc = clone() as Record<string, any>
    doc.email = "me@example.com"
    doc.providers[0].accountName = "work@acme.com"
    doc.providers[0].windows[0].note = "secret"
    const stored = JSON.stringify(parseProfile(doc))
    expect(stored).not.toContain("example.com")
    expect(stored).not.toContain("acme")
    expect(stored).not.toContain("secret")
  })

  test("rejects an unknown schema version, provider or empty document", () => {
    expect(parseProfile({ ...clone(), schema: 2 })).toBeNull()
    const unknown = clone() as Record<string, any>
    unknown.providers[0].provider = "Evil"
    expect(parseProfile(unknown)).toBeNull()
    expect(
      parseProfile({ ...clone(), providers: [], receipt: null })
    ).toBeNull()
    expect(parseProfile(null)).toBeNull()
    expect(parseProfile("nope")).toBeNull()
  })

  test("rejects text that could carry an account, path or link", () => {
    for (const field of ["label", "pace"]) {
      for (const bad of [
        "me@example.com",
        "https://evil.example/x",
        "/Users/me/.claude",
        "<script>",
      ]) {
        const doc = clone() as Record<string, any>
        doc.providers[0].windows[0][field] = bad
        expect(parseProfile(doc)).toBeNull()
      }
    }
    const plan = clone() as Record<string, any>
    plan.providers[0].plan = "me@example.com"
    expect(parseProfile(plan)).toBeNull()
    const model = clone() as Record<string, any>
    model.receipt.models[0].name = "ft:gpt-4o:acme::abc"
    expect(parseProfile(model)).toBeNull()
  })

  test("rejects out-of-range numbers and malformed dates", () => {
    for (const used of [-1, 101, 12.5, "50", null]) {
      const doc = clone() as Record<string, any>
      doc.providers[0].windows[0].usedPercent = used
      expect(parseProfile(doc)).toBeNull()
    }
    const date = clone() as Record<string, any>
    date.updatedAt = "yesterday"
    expect(parseProfile(date)).toBeNull()
    const tokens = clone() as Record<string, any>
    tokens.receipt.tokens30d = -5
    expect(parseProfile(tokens)).toBeNull()
  })

  test("enforces the size caps", () => {
    const many = clone() as Record<string, any>
    many.providers = Array.from({ length: 13 }, () => valid.providers[0])
    expect(parseProfile(many)).toBeNull()
    const days = clone() as Record<string, any>
    days.receipt.dailyTokens = [1, 2, 3]
    expect(parseProfile(days)).toBeNull()
  })

  test("accepts a document with no receipt, or no plan and pace", () => {
    const doc = clone() as Record<string, any>
    doc.receipt = null
    doc.providers[0].plan = null
    doc.providers[0].windows[0].pace = null
    doc.providers[0].windows[0].resetsAt = null
    expect(parseProfile(doc)).not.toBeNull()
  })
})

describe("Swift provider wire compatibility", () => {
  test("accepts all eight raw tokens in cards and receipt models", () => {
    for (const provider of WIRE_PROVIDERS) {
      const doc = structuredClone(newProviderFixture)
      doc.providers = [{ ...doc.providers[0]!, provider }]
      doc.receipt!.models = [{ provider, name: "synthetic-model", tokens: 6 }]
      expect(parseProfile(doc)).toEqual(doc)
    }
    const allCards = structuredClone(newProviderFixture)
    allCards.providers = WIRE_PROVIDERS.map((provider) => ({
      ...allCards.providers[0]!,
      provider,
    }))
    expect(parseProfile(allCards)).toEqual(allCards)
  })

  test("keeps display names separate from exact wire identities", () => {
    expect(parseProfile(newProviderFixture)).toEqual(newProviderFixture)
    for (const provider of [
      "Unknown Provider",
      "Z.ai GLM Coding Plan",
      "OpenAI Codex",
      "me@example.com",
      "/Users/me/profile",
      "https://example.com/provider",
    ]) {
      const card = structuredClone(newProviderFixture)
      card.providers[0]!.provider = provider
      expect(parseProfile(card)).toBeNull()
      const receipt = structuredClone(newProviderFixture)
      receipt.receipt!.models[0]!.provider = provider
      expect(parseProfile(receipt)).toBeNull()
    }
  })

  test("new tokens do not relax window, name, plan or model sanitizers", () => {
    for (const provider of WIRE_PROVIDERS.slice(5)) {
      const doc = structuredClone(newProviderFixture)
      doc.providers = [{ ...doc.providers[0]!, provider }]
      doc.providers[0]!.windows = []
      expect(parseProfile(doc)).toBeNull()
      for (const unsafe of [
        "me@example.com",
        "/Users/me/profile",
        "https://example.com/provider",
      ]) {
        for (const field of ["name", "plan"] as const) {
          const card = structuredClone(newProviderFixture)
          card.providers[0]!.provider = provider
          card.providers[0]![field] = unsafe
          expect(parseProfile(card)).toBeNull()
        }
        for (const field of ["label", "pace"] as const) {
          const card = structuredClone(newProviderFixture)
          card.providers[0]!.provider = provider
          card.providers[0]!.windows[0]![field] = unsafe
          expect(parseProfile(card)).toBeNull()
        }
        const receipt = structuredClone(newProviderFixture)
        receipt.receipt!.models[0]!.provider = provider
        receipt.receipt!.models[0]!.name = unsafe
        expect(parseProfile(receipt)).toBeNull()
      }
    }
  })

  test("rebuilds new-provider fixtures without unexpected private fields", () => {
    const doc = structuredClone(newProviderFixture) as Record<string, any>
    doc.email = "me@example.com"
    doc.providers[0].accountName = "me@example.com"
    doc.providers[0].windows[0].path = "/Users/me/profile"
    doc.receipt.models[0].url = "https://example.com/provider"
    expect(parseProfile(doc)).toEqual(newProviderFixture)
  })
})

describe("availability contract", () => {
  test("preserves only validated optional availability metadata", () => {
    const doc = clone() as Record<string, any>
    Object.assign(doc.providers[0], { primaryWindowIndex: 0, isBlocked: false })
    Object.assign(doc.providers[0].windows[0], {
      role: "provider",
      isEstimated: false,
    })
    const stored = parseProfile(doc)!
    expect(stored.providers[0]?.primaryWindowIndex).toBe(0)
    expect(stored.providers[0]?.isBlocked).toBe(false)
    expect(stored.providers[0]?.windows[0]?.role).toBe("provider")
    for (const index of [-1, 1, 1.5, "0"]) {
      doc.providers[0].primaryWindowIndex = index
      expect(parseProfile(doc)).toBeNull()
    }
  })
  test("rejects metadata outside its enum and boolean allowlists", () => {
    for (const [field, bad] of [
      ["role", "me@example.com"],
      ["isEstimated", "false"],
    ]) {
      const doc = clone() as Record<string, any>
      doc.providers[0].windows[0][field as string] = bad
      expect(parseProfile(doc)).toBeNull()
    }
    const doc = clone() as Record<string, any>
    doc.providers[0].isBlocked = "false"
    expect(parseProfile(doc)).toBeNull()
  })
})
