import { openTVTrackerLanding } from "@workspace/landing"
import { OG_CARD_SIZE, renderOgCard } from "@workspace/landing/og"

export const alt = openTVTrackerLanding.ogImage.alt
export const size = OG_CARD_SIZE
export const contentType = "image/png"

export default function OpenGraphImage() {
  return renderOgCard({
    background:
      "linear-gradient(135deg, #05070d 0%, #0b1224 52%, #183b75 100%)",
    padding: "72px 80px",
    columnWidth: 760,
    name: openTVTrackerLanding.name,
    nameFontSize: 28,
    mark: {
      background: "#4c9cff",
      borderRadius: 16,
      fontSize: 22,
      label: "TV",
      size: 52,
    },
    headline: {
      fontSize: 72,
      lineHeight: 1.02,
      lines: ["Keep the shows.", "Lose the feed."],
    },
    subtitle: {
      color: "#b7c8e9",
      fontSize: 28,
      text: "Private TV and movie tracking for your iPhone—solo or together.",
    },
    card: {
      background: "rgba(76, 156, 255, 0.12)",
      border: "2px solid rgba(130, 185, 255, 0.45)",
      borderRadius: 58,
      gap: 16,
      padding: "40px 34px",
      rotate: 3,
      width: 270,
      itemBackground: "rgba(255, 255, 255, 0.08)",
      itemBorderRadius: 18,
      itemFontSize: 20,
      itemPadding: "16px",
      items: [
        "Episode progress",
        "Together",
        "Recommendations",
        "TV Time import",
      ],
      marker: { color: "#4c9cff", filled: true, size: 10 },
    },
  })
}
