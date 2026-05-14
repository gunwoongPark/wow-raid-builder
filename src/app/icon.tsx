import { ImageResponse } from "next/og"

export const size = { height: 32, width: 32 }
export const contentType = "image/png"

const Icon = () =>
  new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "linear-gradient(135deg, #0a0e1a 0%, #1a2332 100%)",
        borderRadius: "6px",
        display: "flex",
        height: "100%",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <div
        style={{
          color: "#e8c96a",
          fontSize: "14px",
          fontWeight: "700",
          letterSpacing: "-0.5px",
          textShadow: "0 0 8px rgba(200, 160, 60, 0.9)",
        }}
      >
        RS
      </div>
    </div>,
    { ...size }
  )

export default Icon
