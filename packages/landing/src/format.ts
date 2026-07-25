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
