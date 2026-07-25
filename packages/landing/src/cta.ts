/**
 * Primary calls to action are painted in the product accent rather than the
 * neutral shadcn primary, so the one action that matters carries the brand.
 *
 * `--product-accent-ink` is the accent darkened enough for white text to clear
 * WCAG AA; it is declared alongside the accent on the page root. The class list
 * is a module-level constant because Tailwind only scans static strings.
 */
export const PRIMARY_CTA_CLASS =
  "border-transparent bg-[var(--product-accent-ink)] text-white shadow-sm hover:bg-[var(--product-accent-ink)]/90"
