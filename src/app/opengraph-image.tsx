import { ImageResponse } from "next/og";
import {
  getSiteHost,
  SITE_HEADLINE,
  SITE_NAME,
  SITE_PRODUCT_LABEL,
} from "@/lib/site";

export const alt = `${SITE_HEADLINE}｜${SITE_NAME}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  const host = getSiteHost();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "linear-gradient(145deg, #fff7f2 0%, #ffe4e6 48%, #fecdd3 100%)",
          color: "#1c1917",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: "0.02em",
            color: "#9f1239",
          }}
        >
          {SITE_NAME}
          <span style={{ color: "rgba(159, 18, 57, 0.35)" }}>—</span>
          <span style={{ fontSize: 22, fontWeight: 700, color: "#78716c" }}>
            {SITE_PRODUCT_LABEL}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              display: "flex",
              fontSize: 56,
              fontWeight: 800,
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              color: "#1c1917",
              maxWidth: 900,
            }}
          >
            つみたてNISAで、
            <br />
            引退まであとどれくらい？
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              lineHeight: 1.45,
              color: "#57534e",
              maxWidth: 820,
            }}
          >
            積立・利回り・目標を動かすと、目標までの不足額がすぐわかります
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 22,
            fontWeight: 600,
            color: "#78716c",
          }}
        >
          {host}
        </div>
      </div>
    ),
    { ...size },
  );
}
