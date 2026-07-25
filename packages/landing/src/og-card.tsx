import { ImageResponse } from "next/og"
import { Fragment } from "react"

export const OG_CARD_SIZE = { height: 630, width: 1200 }

export type OgCardSpec = {
  /** CSS background for the full card; every product uses a diagonal gradient. */
  background: string
  padding: string
  /** Width of the text column, tuned per product to the headline length. */
  columnWidth: number
  name: string
  nameFontSize: number
  mark: {
    background: string
    borderRadius: number
    fontSize: number
    label: string
    size: number
  }
  headline: {
    fontSize: number
    lineHeight: number
    /** Rendered with an explicit break between entries. */
    lines: string[]
  }
  subtitle: {
    color: string
    fontSize: number
    text: string
  }
  card: {
    background: string
    border: string
    borderRadius: number
    gap: number
    padding: string
    /** Degrees of tilt applied to the floating card. */
    rotate: number
    width: number
    /** Optional title row above the list, with a pill on the trailing side. */
    header?: {
      pillBackground: string
      pillLabel: string
      title: string
    }
    itemBackground: string
    itemBorderRadius: number
    itemFontSize: number
    itemPadding: string
    items: string[]
    marker: {
      color: string
      /** Filled dots read as status; hollow rings read as checkboxes. */
      filled: boolean
      size: number
    }
  }
}

/**
 * Shared Satori layout behind every dynamic OG card: a text column on the
 * leading side and a tilted list card on the trailing side.
 */
export function renderOgCard(spec: OgCardSpec) {
  const { card, headline, mark, subtitle } = spec

  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: spec.background,
        color: "white",
        display: "flex",
        height: "100%",
        justifyContent: "space-between",
        padding: spec.padding,
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
          width: spec.columnWidth,
        }}
      >
        <div
          style={{
            alignItems: "center",
            display: "flex",
            fontSize: spec.nameFontSize,
            fontWeight: 600,
            gap: 16,
          }}
        >
          <div
            style={{
              alignItems: "center",
              background: mark.background,
              borderRadius: mark.borderRadius,
              display: "flex",
              fontSize: mark.fontSize,
              height: mark.size,
              justifyContent: "center",
              width: mark.size,
            }}
          >
            {mark.label}
          </div>
          {spec.name}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: headline.fontSize,
            fontWeight: 700,
            letterSpacing: "-4px",
            lineHeight: headline.lineHeight,
          }}
        >
          {headline.lines.map((line, index) => (
            <Fragment key={line}>
              {index > 0 ? <br /> : null}
              {line}
            </Fragment>
          ))}
        </div>
        <div
          style={{
            color: subtitle.color,
            display: "flex",
            fontSize: subtitle.fontSize,
            lineHeight: 1.35,
          }}
        >
          {subtitle.text}
        </div>
      </div>
      <div
        style={{
          background: card.background,
          border: card.border,
          borderRadius: card.borderRadius,
          display: "flex",
          flexDirection: "column",
          gap: card.gap,
          padding: card.padding,
          transform: `rotate(${card.rotate}deg)`,
          width: card.width,
        }}
      >
        {card.header ? (
          <div
            style={{
              alignItems: "center",
              display: "flex",
              fontSize: 26,
              fontWeight: 600,
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            {card.header.title}
            <div
              style={{
                background: card.header.pillBackground,
                borderRadius: 99,
                display: "flex",
                fontSize: 15,
                padding: "9px 13px",
              }}
            >
              {card.header.pillLabel}
            </div>
          </div>
        ) : null}
        {card.items.map((item) => (
          <div
            key={item}
            style={{
              alignItems: "center",
              background: card.itemBackground,
              borderRadius: card.itemBorderRadius,
              display: "flex",
              fontSize: card.itemFontSize,
              gap: 12,
              padding: card.itemPadding,
            }}
          >
            <div
              style={{
                ...(card.marker.filled
                  ? { background: card.marker.color }
                  : { border: `2px solid ${card.marker.color}` }),
                borderRadius: 99,
                display: "flex",
                height: card.marker.size,
                width: card.marker.size,
              }}
            />
            {item}
          </div>
        ))}
      </div>
    </div>,
    OG_CARD_SIZE
  )
}
