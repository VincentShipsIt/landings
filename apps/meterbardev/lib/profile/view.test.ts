import { describe, expect, test } from "bun:test"

import type { ProfileDocument } from "./schema"
import {
  bandFor,
  cardAlt,
  formatTokens,
  headline,
  relativeTime,
  tightestWindow,
  visibleWindows,
  windowShowsBar,
  windowValue,
  windowDetails,
} from "./view"

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

describe("provider availability", () => {
  const provider = (
    windows: ProfileDocument["providers"][number]["windows"],
    extra = {}
  ) => ({
    provider: "Claude Code",
    name: "Claude Code",
    plan: null,
    windows,
    ...extra,
  })
  test("weekly exhaustion hides session and model windows, with no spent gauge", () => {
    const p = provider([
      win("Session", 20),
      win("Weekly", 100),
      win("Fable", 100),
    ])
    expect(visibleWindows(p).map((w) => w.label)).toEqual(["Weekly"])
    expect(tightestWindow(p).label).toBe("Weekly")
    expect(windowShowsBar(p.windows[1]!)).toBe(false)
    expect(windowValue(p.windows[1]!)).toBe("Out of quota")
  })
  test("spent Fable and code review quotas do not headline an available provider", () => {
    const p = provider([
      win("Weekly", 20),
      win("Fable", 100),
      win("Code Review", 100),
    ])
    expect(tightestWindow(p).label).toBe("Weekly")
    expect(visibleWindows(p)).toHaveLength(3)
  })
  test("Cursor keeps its usable fallback and independent Grok Bot card", () => {
    const p = provider([win("Cursor Models", 100), win("Other Models", 27)], {
      provider: "Cursor",
      name: "Cursor",
    })
    expect(tightestWindow(p).label).toBe("Other Models")
    expect(visibleWindows(p)).toHaveLength(2)
    const pool = provider([win("Weekly", 42)], {
      provider: "Cursor",
      name: "Grok Bot on Cursor",
    })
    expect(tightestWindow(pool).usedPercent).toBe(42)
    expect(headline({ ...doc, providers: [p, pool] })?.left).toBe(58)
  })
  test("explicit roles and primary index work without guessing provider labels", () => {
    const p = provider(
      [
        { ...win("Unnamed model", 100), role: "secondary" as const },
        { ...win("Quota", 20), role: "provider" as const },
      ],
      { primaryWindowIndex: 1, isBlocked: false }
    )
    expect(tightestWindow(p).label).toBe("Quota")
    expect(visibleWindows(p)).toHaveLength(2)
  })
  test("extra usage keeps otherwise exhausted provider windows expanded", () => {
    const p = provider([win("Session", 20), win("Weekly", 100)], {
      isBlocked: false,
      primaryWindowIndex: 1,
    })
    expect(visibleWindows(p)).toHaveLength(2)
  })
  test("estimated zero is an approximation, not a confirmed block", () => {
    const p = provider([
      win("Session", 20),
      { ...win("Weekly", 100), isEstimated: true },
    ])
    expect(visibleWindows(p)).toHaveLength(2)
    expect(windowShowsBar(p.windows[1]!)).toBe(true)
    expect(windowValue(p.windows[1]!)).toBe("~0% left")
  })
  test("latest blocking reset wins, while an unknown reset prevents a recovery promise", () => {
    const session = { ...win("Session", 100), resetsAt: "2026-10-03T10:00:00Z" }
    const weekly = { ...win("Weekly", 100), resetsAt: "2026-10-06T10:00:00Z" }
    expect(tightestWindow(provider([session, weekly])).label).toBe("Weekly")
    expect(
      tightestWindow(provider([session, { ...weekly, resetsAt: null }]))
        .resetsAt
    ).toBeNull()
  })
  test("stale resets are never displayed as a historical recovery date", () => {
    const now = Date.parse("2026-10-02T10:00:00Z")
    expect(
      windowDetails(
        {
          ...win("Weekly", 100),
          resetsAt: "2026-09-11T19:59:00Z",
          pace: "Out of quota",
        },
        now
      )
    ).toBe("reset unavailable")
    expect(
      windowDetails(
        { ...win("Weekly", 100), resetsAt: "2026-10-02T09:59:00Z" },
        now
      )
    ).toBe("reset due now")
  })
})
