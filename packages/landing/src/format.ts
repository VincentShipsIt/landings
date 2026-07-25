/**
 * Formats a social-proof count: exact below 1,000, then abbreviated with one
 * decimal (1.2k, 15.4k, 120k). Returns null so callers can drop the stat
 * entirely when GitHub did not report a usable number.
 */
export function formatCount(count: number | null | undefined) {
  if (typeof count !== "number" || !Number.isFinite(count) || count <= 0) {
    return null
  }

  if (count < 1000) return String(Math.round(count))

  const units = ["k", "M"]
  let value = count / 1000
  let unit = 0

  while (value >= 1000 && unit < units.length - 1) {
    value /= 1000
    unit += 1
  }

  const rounded = value >= 100 ? Math.round(value) : Number(value.toFixed(1))

  return `${rounded}${units[unit]}`
}

/**
 * Formats a byte count the way macOS does: base-10 units, one decimal below
 * 100 MB. Returns null so callers can drop the segment entirely when GitHub
 * did not report a size.
 */
export function formatFileSize(bytes: number | null | undefined) {
  if (typeof bytes !== "number" || !Number.isFinite(bytes) || bytes <= 0) {
    return null
  }

  const units = ["B", "KB", "MB", "GB"]
  let value = bytes
  let unit = 0

  while (value >= 1000 && unit < units.length - 1) {
    value /= 1000
    unit += 1
  }

  const rounded =
    value >= 100 || unit === 0 ? Math.round(value) : value.toFixed(1)

  return `${rounded} ${units[unit]}`
}
