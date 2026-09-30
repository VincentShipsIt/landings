import { describe, expect, test } from "bun:test"

import type { ProfileDocument } from "./schema"
import { bandFor, cardAlt, formatTokens, headline, relativeTime } from "./view"

const win = (label: string, usedPercent: number) => ({
  label,
  pace: null,
  resetsAt: null,
  usedPercent,
})
const doc: ProfileDocument = {
  providers: [
    {
      name: "Claude Code",
      plan: null,
      provider: "Claude Code",
      windows: [win("Session", 40), win("Weekly", 92)],
    },
    {
      name: "OpenAI Codex",
      plan: null,
      provider: "Codex CLI",
      windows: [win("Weekly", 10)],
    },
  ],
  receipt: null,
  schema: 1,
  updatedAt: "2026-09-29T20:00:00.000Z",
}

describe("bandFor", () => {
  test("uses the app's thresholds (25 tight, 10 critical, 0 out)", () => {
    expect(bandFor(90)).toBe("healthy")
    expect(bandFor(26)).toBe("healthy")
    expect(bandFor(25)).toBe("tight")
    expect(bandFor(11)).toBe("tight")
    expect(bandFor(10)).toBe("critical")
    expect(bandFor(1)).toBe("critical")
    expect(bandFor(0)).toBe("exhausted")
  })
})

describe("headline", () => {
  test("is the tightest window across providers", () => {
    const top = headline(doc)
    expect(top?.provider.name).toBe("Claude Code")
    expect(top?.window.label).toBe("Weekly")
    expect(top?.left).toBe(8)
    expect(top?.band).toBe("critical")
  })

  test("alt text names it, and survives no data", () => {
    expect(cardAlt(doc)).toBe(
      "8% left on Claude Code Weekly. AI coding limits on MeterBar."
    )
    expect(cardAlt({ ...doc, providers: [] })).toBe(
      "AI coding limits on MeterBar."
    )
  })
})

describe("formatting", () => {
  test("tokens", () => {
    expect(formatTokens(950)).toBe("950")
    expect(formatTokens(84_200_000)).toBe("84.2M")
    expect(formatTokens(184_000_000)).toBe("184M")
    expect(formatTokens(8_420_000)).toBe("8.4M")
    expect(formatTokens(1_000_000)).toBe("1M")
    expect(formatTokens(2_300_000_000)).toBe("2.3B")
  })

  test("relative time", () => {
    const now = Date.parse("2026-09-29T20:00:00Z")
    expect(relativeTime("2026-09-29T19:59:30Z", now)).toBe("just now")
    expect(relativeTime("2026-09-29T19:45:00Z", now)).toBe("15 min ago")
    expect(relativeTime("2026-09-29T15:00:00Z", now)).toBe("5 hr ago")
    expect(relativeTime("2026-09-25T20:00:00Z", now)).toBe("4 days ago")
  })
})
