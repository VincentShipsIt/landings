import { ImageResponse } from "next/og"

import type { ProfileDocument } from "./schema"
import {
  BAND_COLOR,
  BAND_LABEL,
  bandFor,
  formatTokens,
  headline,
  percentLeft,
  providerColor,
  tightestWindow,
  windowShowsBar,
  windowValue,
} from "./view"

export const CARD_SIZE = { height: 630, width: 1200 }

const SURFACE = "#0d0d0d"
const TRACK = "#2e2e2e"
const SECONDARY = "#9e9e9e"
const TERTIARY = "#6b6b6b"
const MAX_ROWS = 5

/** The app icon's mark: three meter bars at 30 / 55 / 85% on a dark plate. */
function BrandMark({ size }: { size: number }) {
  const inset = (size * 64) / 448
  const barHeight = (size * 44) / 448
  const gap = (size * (82 - 44)) / 448
  const width = size - inset * 2
  const bars: [number, string][] = [
    [0.3, "#4ade80"],
    [0.55, "#fbbf24"],
    [0.85, "#f87171"],
  ]
  return (
    <div
      style={{
        alignItems: "center",
        background: "linear-gradient(135deg, #1a1a2e, #0f0f1a)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: (size * 96) / 448,
        display: "flex",
        flexDirection: "column",
        gap,
        height: size,
        justifyContent: "center",
        width: size,
      }}
    >
      {bars.map(([fill, color]) => (
        <div
          key={color}
          style={{
            background: "#2a2a4a",
            borderRadius: barHeight,
            display: "flex",
            height: barHeight,
            width,
          }}
        >
          <div
            style={{
              background: color,
              borderRadius: barHeight,
              height: barHeight,
              width: width * fill,
            }}
          />
        </div>
      ))}
    </div>
  )
}

/**
 * The share card for a profile: the app's card look (near-black surface, the
 * icon's mark, provider colors, the green / amber / red ramp), sized for
 * Open Graph and X at 1200x630.
 */
export function renderProfileCard(document: ProfileDocument) {
  const top = headline(document)
  const rows = document.providers.slice(0, MAX_ROWS).map((provider) => {
    const window = tightestWindow(provider)
    const left = percentLeft(window)
    return { band: bandFor(left), left, provider, window }
  })
  const tokens = document.receipt?.tokens30d

  return new ImageResponse(
    <div
      style={{
        background: SURFACE,
        color: "white",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: "52px 60px",
        width: "100%",
      }}
    >
      <div style={{ alignItems: "center", display: "flex", gap: 16 }}>
        <BrandMark size={56} />
        <div style={{ display: "flex", fontSize: 38, fontWeight: 700 }}>
          MeterBar
        </div>
        <div style={{ color: TERTIARY, display: "flex", fontSize: 32 }}>·</div>
        <div style={{ color: SECONDARY, display: "flex", fontSize: 32 }}>
          AI coding limits
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, gap: 56, paddingTop: 36 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: 420,
          }}
        >
          {top ? (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  color: BAND_COLOR[top.band],
                  display: "flex",
                  fontSize: 200,
                  fontWeight: 800,
                  letterSpacing: -6,
                  lineHeight: 1,
                }}
              >
                {top.window.isEstimated ? "~" : ""}
                {top.left}%
              </div>
              <div
                style={{
                  color: SECONDARY,
                  display: "flex",
                  fontSize: 30,
                  marginTop: 12,
                }}
              >
                left on {top.provider.name} {top.window.label}
              </div>
              <div
                style={{
                  alignItems: "center",
                  background: BAND_COLOR[top.band],
                  borderRadius: 999,
                  color: "#0f0f0f",
                  display: "flex",
                  fontSize: 24,
                  fontWeight: 700,
                  marginTop: 24,
                  padding: "6px 20px",
                  alignSelf: "flex-start",
                }}
              >
                {BAND_LABEL[top.band]}
              </div>
            </div>
          ) : (
            <div style={{ color: SECONDARY, display: "flex", fontSize: 40 }}>
              Tracking token spend
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            gap: 26,
            justifyContent: "center",
          }}
        >
          {rows.map(({ band, provider, window }) => (
            <div
              key={provider.name}
              style={{ display: "flex", flexDirection: "column", gap: 10 }}
            >
              <div
                style={{
                  alignItems: "baseline",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ alignItems: "center", display: "flex", gap: 12 }}>
                  <div
                    style={{
                      background: providerColor(provider.provider),
                      borderRadius: 999,
                      display: "flex",
                      height: 16,
                      width: 16,
                    }}
                  />
                  <div
                    style={{ display: "flex", fontSize: 30, fontWeight: 600 }}
                  >
                    {provider.name}
                  </div>
                  <div
                    style={{ color: TERTIARY, display: "flex", fontSize: 24 }}
                  >
                    {window.label}
                  </div>
                </div>
                <div
                  style={{
                    color: BAND_COLOR[band],
                    display: "flex",
                    fontSize: 30,
                    fontWeight: 700,
                  }}
                >
                  {windowValue(window)}
                </div>
              </div>
              {windowShowsBar(window) ? (
                <div
                  style={{
                    background: TRACK,
                    borderRadius: 999,
                    display: "flex",
                    height: 16,
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      background: BAND_COLOR[band],
                      borderRadius: 999,
                      height: 16,
                      width: `${Math.max(2, window.usedPercent)}%`,
                    }}
                  />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          alignItems: "center",
          color: TERTIARY,
          display: "flex",
          fontSize: 26,
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex" }}>meterbar.dev</div>
        {tokens ? (
          <div style={{ display: "flex" }}>
            {formatTokens(tokens)} tokens · last 30 days
          </div>
        ) : null}
      </div>
    </div>,
    { ...CARD_SIZE }
  )
}
