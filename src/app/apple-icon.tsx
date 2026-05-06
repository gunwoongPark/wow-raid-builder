import { ImageResponse } from "next/og"

export const size = { height: 180, width: 180 }
export const contentType = "image/png"

const AppleIcon = () =>
  new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "linear-gradient(135deg, #0a0e1a 0%, #1a2332 100%)",
        display: "flex",
        height: "100%",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <div
        style={{
          color: "#e8c96a",
          fontSize: "80px",
          fontWeight: "700",
          letterSpacing: "-2px",
          textShadow: "0 0 30px rgba(200, 160, 60, 0.8)",
        }}
      >
        W
      </div>
    </div>,
    { ...size }
  )

export default AppleIcon
