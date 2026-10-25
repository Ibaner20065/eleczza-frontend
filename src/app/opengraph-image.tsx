import { ImageResponse } from "next/og";

export const alt = "ELECZZA 2.0 221B Baker Street Investigation";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "88px",
        color: "#F7F2E7",
        backgroundColor: "#0B0C10",
        border: "18px solid #DFB75A",
        fontFamily: "serif",
      }}
    >
      <div
        style={{
          color: "#F3D88C",
          fontSize: 24,
          letterSpacing: 8,
          marginBottom: 28,
        }}
      >
        221B SCOTLAND YARD BUREAU
      </div>
      <div style={{ fontSize: 92, fontWeight: 700 }}>ELECZZA 2.0</div>
      <div
        style={{
          color: "#D9CEB8",
          fontSize: 32,
          marginTop: 20,
        }}
      >
        The Baker Street Investigation
      </div>
      <div style={{ color: "#F3D88C", fontSize: 22, marginTop: 48 }}>
        FORENSICS · CRYPTOGRAPHY · DEDUCTION
      </div>
    </div>,
    size,
  );
}
