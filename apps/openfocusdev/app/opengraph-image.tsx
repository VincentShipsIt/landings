import { openFocusLanding } from "@workspace/landing"
import { OG_CARD_SIZE, renderOgCard } from "@workspace/landing/og"

export const alt = openFocusLanding.ogImage.alt
export const size = OG_CARD_SIZE
export const contentType = "image/png"

export default function OpenGraphImage() {
  return renderOgCard({
    background:
      "linear-gradient(135deg, #09070f 0%, #15102b 52%, #3c268c 100%)",
    padding: "68px 76px",
    columnWidth: 650,
    name: openFocusLanding.name,
    nameFontSize: 27,
    mark: {
      background: "#7658ff",
      borderRadius: 14,
      fontSize: 27,
      label: "O",
      size: 50,
    },
    headline: {
      fontSize: 74,
      lineHeight: 1,
      lines: ["Your day,", "already in focus."],
    },
    subtitle: {
      color: "#cbc3ea",
      fontSize: 27,
      text: "Native task management and AI day planning for Mac and iPhone.",
    },
    card: {
      background: "rgba(255, 255, 255, 0.1)",
      border: "2px solid rgba(208, 194, 255, 0.35)",
      borderRadius: 30,
      gap: 12,
      padding: "28px",
      rotate: 2,
      width: 360,
      header: {
        pillBackground: "rgba(118, 88, 255, 0.35)",
        pillLabel: "Plan my day",
        title: "Today",
      },
      itemBackground: "rgba(255, 255, 255, 0.07)",
      itemBorderRadius: 16,
      itemFontSize: 18,
      itemPadding: "15px",
      items: [
        "Review launch checklist",
        "Prepare the weekly plan",
        "Clear the inbox",
      ],
      marker: { color: "#9f89ff", filled: false, size: 16 },
    },
  })
}
