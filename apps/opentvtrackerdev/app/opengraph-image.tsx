import { ImageResponse } from "next/og"

export const alt = "OpenTV Tracker — private TV tracking for one person or two."
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background:
          "linear-gradient(135deg, #05070d 0%, #0b1224 52%, #183b75 100%)",
        color: "white",
        display: "flex",
        height: "100%",
        justifyContent: "space-between",
        padding: "72px 80px",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
          width: 760,
        }}
      >
        <div
          style={{
            alignItems: "center",
            display: "flex",
            fontSize: 28,
            fontWeight: 600,
            gap: 16,
          }}
        >
          <div
            style={{
              alignItems: "center",
              background: "#4c9cff",
              borderRadius: 16,
              display: "flex",
              fontSize: 22,
              height: 52,
              justifyContent: "center",
              width: 52,
            }}
          >
            TV
          </div>
          OpenTV Tracker
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 72,
            fontWeight: 700,
            letterSpacing: "-4px",
            lineHeight: 1.02,
          }}
        >
          Keep the shows.
          <br />
          Lose the feed.
        </div>
        <div
          style={{
            color: "#b7c8e9",
            display: "flex",
            fontSize: 28,
            lineHeight: 1.35,
          }}
        >
          Private TV and movie tracking for your iPhone—solo or together.
        </div>
      </div>
      <div
        style={{
          background: "rgba(76, 156, 255, 0.12)",
          border: "2px solid rgba(130, 185, 255, 0.45)",
          borderRadius: 58,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          padding: "40px 34px",
          transform: "rotate(3deg)",
          width: 270,
        }}
      >
        {[
          "Episode progress",
          "Together",
          "Recommendations",
          "TV Time import",
        ].map((label) => (
          <div
            key={label}
            style={{
              alignItems: "center",
              background: "rgba(255, 255, 255, 0.08)",
              borderRadius: 18,
              display: "flex",
              fontSize: 20,
              gap: 12,
              padding: "16px",
            }}
          >
            <div
              style={{
                background: "#4c9cff",
                borderRadius: 99,
                display: "flex",
                height: 10,
                width: 10,
              }}
            />
            {label}
          </div>
        ))}
      </div>
    </div>,
    size
  )
}
