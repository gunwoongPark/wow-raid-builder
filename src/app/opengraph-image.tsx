import { ImageResponse } from "next/og"

export const alt = "RaidCraft — Raid Buff & Utility Coverage Analyzer"
export const size = { height: 630, width: 1200 }
export const contentType = "image/png"

const tagStyle = {
  background: "rgba(200, 160, 60, 0.15)",
  border: "1px solid rgba(200, 160, 60, 0.4)",
  borderRadius: "6px",
  color: "#c9a84c",
  fontSize: "20px",
  padding: "8px 16px",
}

const OgImage = () =>
  new ImageResponse(
    <div
      style={{
        background: "linear-gradient(135deg, #0a0e1a 0%, #111827 50%, #0f1729 100%)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "center",
        padding: "80px",
        width: "100%",
      }}
    >
      <div
        style={{
          background:
            "linear-gradient(to right, transparent, #c9a84c 20%, #f0c040 50%, #c9a84c 80%, transparent)",
          height: "2px",
          marginBottom: "48px",
          width: "100%",
        }}
      />

      <div
        style={{
          color: "#e8c96a",
          fontSize: "72px",
          fontWeight: "700",
          letterSpacing: "4px",
          lineHeight: 1.1,
        }}
      >
        RaidCraft
      </div>

      <div
        style={{
          color: "#94a3b8",
          fontSize: "30px",
          fontWeight: "400",
          lineHeight: 1.5,
          marginTop: "24px",
          maxWidth: "800px",
        }}
      >
        Raid composition analyzer for raid leaders.
      </div>
      <div
        style={{
          color: "#94a3b8",
          fontSize: "30px",
          fontWeight: "400",
          lineHeight: 1.5,
          maxWidth: "800px",
        }}
      >
        Check buff & utility coverage at a glance.
      </div>

      <div style={{ display: "flex", gap: "12px", marginTop: "40px" }}>
        <div style={tagStyle}>Buff Coverage</div>
        <div style={tagStyle}>Utility Analysis</div>
        <div style={tagStyle}>Midnight Season 1</div>
      </div>

      <div
        style={{
          background:
            "linear-gradient(to right, transparent, #c9a84c 20%, #f0c040 50%, #c9a84c 80%, transparent)",
          bottom: "80px",
          height: "2px",
          left: "80px",
          position: "absolute",
          right: "80px",
        }}
      />
    </div>,
    { ...size }
  )

export default OgImage
