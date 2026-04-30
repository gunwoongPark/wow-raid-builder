import { ImageResponse } from "next/og"

export const alt = "WoW Raid Builder — 공격대 버프·유틸 커버리지 분석"
export const size = { height: 630, width: 1200 }
export const contentType = "image/png"

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
      {/* 상단 골드 장식선 */}
      <div
        style={{
          background:
            "linear-gradient(to right, transparent, #c9a84c 20%, #f0c040 50%, #c9a84c 80%, transparent)",
          height: "2px",
          marginBottom: "48px",
          width: "100%",
        }}
      />

      {/* 서비스명 */}
      <div
        style={{
          color: "#e8c96a",
          fontSize: "72px",
          fontWeight: "700",
          letterSpacing: "4px",
          lineHeight: 1.1,
          textShadow: "0 0 40px rgba(200, 160, 60, 0.6)",
        }}
      >
        WoW Raid Builder
      </div>

      {/* 설명 */}
      <div
        style={{
          color: "#94a3b8",
          fontSize: "32px",
          fontWeight: "400",
          lineHeight: 1.5,
          marginTop: "24px",
          maxWidth: "800px",
        }}
      >
        공대장을 위한 공격대 구성 분석 도구
      </div>

      {/* 태그 */}
      <div style={{ display: "flex", gap: "12px", marginTop: "40px" }}>
        {["버프 커버리지", "유틸 분석", "한밤 시즌 1"].map((tag) => (
          <div
            key={tag}
            style={{
              background: "rgba(200, 160, 60, 0.15)",
              border: "1px solid rgba(200, 160, 60, 0.4)",
              borderRadius: "6px",
              color: "#c9a84c",
              fontSize: "20px",
              padding: "8px 16px",
            }}
          >
            {tag}
          </div>
        ))}
      </div>

      {/* 하단 골드 장식선 */}
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
