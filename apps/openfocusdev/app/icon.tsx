import { ImageResponse } from "next/og"

export const size = {
  width: 64,
  height: 64,
}
export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "linear-gradient(145deg, #7857ff 0%, #5131d8 100%)",
        borderRadius: 14,
        color: "white",
        display: "flex",
        fontSize: 35,
        fontWeight: 700,
        height: "100%",
        justifyContent: "center",
        width: "100%",
      }}
    >
      O
    </div>,
    size
  )
}
