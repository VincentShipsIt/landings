import { ImageResponse } from "next/og"

export const alt = "OpenFocus — your day, already in focus."
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

const tasks = [
  "Review launch checklist",
  "Prepare the weekly plan",
  "Clear the inbox",
]

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background:
          "linear-gradient(135deg, #09070f 0%, #15102b 52%, #3c268c 100%)",
        color: "white",
        display: "flex",
        height: "100%",
        justifyContent: "space-between",
        padding: "68px 76px",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
          width: 650,
        }}
      >
        <div
          style={{
            alignItems: "center",
            display: "flex",
            fontSize: 27,
            fontWeight: 600,
            gap: 16,
          }}
        >
          <div
            style={{
              alignItems: "center",
              background: "#7658ff",
              borderRadius: 14,
              display: "flex",
              fontSize: 27,
              height: 50,
              justifyContent: "center",
              width: 50,
            }}
          >
            ✓
          </div>
          OpenFocus
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 74,
            fontWeight: 700,
            letterSpacing: "-4px",
            lineHeight: 1,
          }}
        >
          Your day,
          <br />
          already in focus.
        </div>
        <div
          style={{
            color: "#cbc3ea",
            display: "flex",
            fontSize: 27,
            lineHeight: 1.35,
          }}
        >
          Native task management and AI day planning for Mac and iPhone.
        </div>
      </div>
      <div
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          border: "2px solid rgba(208, 194, 255, 0.35)",
          borderRadius: 30,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          padding: "28px",
          transform: "rotate(2deg)",
          width: 360,
        }}
      >
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
          Today
          <div
            style={{
              background: "rgba(118, 88, 255, 0.35)",
              borderRadius: 99,
              display: "flex",
              fontSize: 15,
              padding: "9px 13px",
            }}
          >
            Plan my day
          </div>
        </div>
        {tasks.map((task) => (
          <div
            key={task}
            style={{
              alignItems: "center",
              background: "rgba(255, 255, 255, 0.07)",
              borderRadius: 16,
              display: "flex",
              fontSize: 18,
              gap: 12,
              padding: "15px",
            }}
          >
            <div
              style={{
                border: "2px solid #9f89ff",
                borderRadius: 99,
                display: "flex",
                height: 16,
                width: 16,
              }}
            />
            {task}
          </div>
        ))}
      </div>
    </div>,
    size
  )
}
