/**
 * The public profile document, as the MeterBar app sends it.
 *
 * The contract lives in the app repo (docs/public-profile-contract.md). This
 * validator is deliberately stricter than "valid JSON": it rebuilds the
 * document from an allowlist, so a key the app never sends, or a string that
 * looks like an email, a path or a URL, cannot be stored and then rendered on
 * a public page — whoever is calling the endpoint.
 */

export const SCHEMA_VERSION = 1
export const MAX_BODY_BYTES = 16 * 1024
export const MAX_PROVIDERS = 12
export const MAX_WINDOWS = 6
export const MAX_MODELS = 3
export const DAILY_TOKEN_DAYS = 7

/** 10 characters of lowercase Crockford base32. */
export const SLUG_PATTERN = /^[0-9a-hjkmnp-tv-z]{10}$/

export function isValidSlug(value: string): boolean {
  return SLUG_PATTERN.test(value)
}

export type ProfileWindow = {
  label: string
  usedPercent: number
  resetsAt: string | null
  pace: string | null
}

export type ProfileProvider = {
  provider: string
  name: string
  plan: string | null
  windows: ProfileWindow[]
}

export type ProfileModel = { provider: string; name: string; tokens: number }

export type ProfileReceipt = {
  tokens30d: number
  sessions: number | null
  models: ProfileModel[]
  dailyTokens: number[]
}

export type ProfileDocument = {
  schema: typeof SCHEMA_VERSION
  updatedAt: string
  providers: ProfileProvider[]
  receipt: ProfileReceipt | null
}

const KNOWN_PROVIDERS = new Set([
  "Claude Code",
  "Codex CLI",
  "Cursor",
  "OpenRouter",
  "Grok",
])

// Same character sets as the app's sanitizers.
const LABEL_PATTERN = /^[A-Za-z0-9 .+\-&()%]{1,40}$/
const NAME_PATTERN = /^[A-Za-z0-9 .+\-&()%]{1,60}$/
const PLAN_PATTERN = /^[A-Za-z0-9 .+\-&()%]{1,24}$/
const PACE_PATTERN = /^[A-Za-z0-9 .+\-&()%]{1,32}$/
const MODEL_PATTERN = /^[A-Za-z0-9._-]{1,48}$/

const MAX_TOKENS = 1e15

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function text(value: unknown, pattern: RegExp): string | null {
  return typeof value === "string" && pattern.test(value.trim())
    ? value.trim()
    : null
}

function optionalText(value: unknown, pattern: RegExp): string | null | false {
  if (value === null || value === undefined) return null
  const parsed = text(value, pattern)
  return parsed === null ? false : parsed
}

function count(value: unknown): number | null {
  return typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 0 &&
    value <= MAX_TOKENS
    ? value
    : null
}

function isoDate(value: unknown): string | null {
  if (typeof value !== "string" || value.length > 40) return null
  const time = Date.parse(value)
  return Number.isNaN(time) ? null : new Date(time).toISOString()
}

function parseWindow(value: unknown): ProfileWindow | null {
  if (!isRecord(value)) return null
  const label = text(value.label, LABEL_PATTERN)
  const used = value.usedPercent
  if (
    label === null ||
    typeof used !== "number" ||
    !Number.isInteger(used) ||
    used < 0 ||
    used > 100
  ) {
    return null
  }
  const pace = optionalText(value.pace, PACE_PATTERN)
  if (pace === false) return null
  let resetsAt: string | null = null
  if (value.resetsAt !== null && value.resetsAt !== undefined) {
    resetsAt = isoDate(value.resetsAt)
    if (resetsAt === null) return null
  }
  return { label, usedPercent: used, resetsAt, pace }
}

function parseProvider(value: unknown): ProfileProvider | null {
  if (!isRecord(value)) return null
  const provider = text(value.provider, NAME_PATTERN)
  const name = text(value.name, NAME_PATTERN)
  const plan = optionalText(value.plan, PLAN_PATTERN)
  if (
    provider === null ||
    !KNOWN_PROVIDERS.has(provider) ||
    name === null ||
    plan === false ||
    !Array.isArray(value.windows) ||
    value.windows.length === 0 ||
    value.windows.length > MAX_WINDOWS
  ) {
    return null
  }
  const windows = value.windows.map(parseWindow)
  if (windows.some((window) => window === null)) return null
  return { provider, name, plan, windows: windows as ProfileWindow[] }
}

function parseReceipt(value: unknown): ProfileReceipt | null | false {
  if (value === null || value === undefined) return null
  if (!isRecord(value)) return false
  const tokens30d = count(value.tokens30d)
  let sessions: number | null = null
  if (value.sessions !== null && value.sessions !== undefined) {
    sessions = count(value.sessions)
    if (sessions === null) return false
  }
  if (
    tokens30d === null ||
    !Array.isArray(value.models) ||
    value.models.length > MAX_MODELS ||
    !Array.isArray(value.dailyTokens) ||
    value.dailyTokens.length !== DAILY_TOKEN_DAYS
  ) {
    return false
  }
  const models: ProfileModel[] = []
  for (const entry of value.models) {
    if (!isRecord(entry)) return false
    const provider = text(entry.provider, NAME_PATTERN)
    const name = text(entry.name, MODEL_PATTERN)
    const tokens = count(entry.tokens)
    if (
      provider === null ||
      !KNOWN_PROVIDERS.has(provider) ||
      name === null ||
      tokens === null
    ) {
      return false
    }
    models.push({ provider, name, tokens })
  }
  const dailyTokens = value.dailyTokens.map(count)
  if (dailyTokens.some((day) => day === null)) return false
  return {
    tokens30d,
    sessions,
    models,
    dailyTokens: dailyTokens as number[],
  }
}

/** Returns a rebuilt, allowlisted document, or `null` if it does not conform. */
export function parseProfile(input: unknown): ProfileDocument | null {
  if (!isRecord(input) || input.schema !== SCHEMA_VERSION) return null
  const updatedAt = isoDate(input.updatedAt)
  if (
    updatedAt === null ||
    !Array.isArray(input.providers) ||
    input.providers.length > MAX_PROVIDERS
  ) {
    return null
  }
  const providers = input.providers.map(parseProvider)
  if (providers.some((provider) => provider === null)) return null
  const receipt = parseReceipt(input.receipt)
  if (receipt === false) return null
  const document: ProfileDocument = {
    schema: SCHEMA_VERSION,
    updatedAt,
    providers: providers as ProfileProvider[],
    receipt,
  }
  return document.providers.length === 0 && document.receipt === null
    ? null
    : document
}
