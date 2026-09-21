import { ImageResponse } from "next/og";
import { BRAND } from "@/lib/constants";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The image shown when a link to the site is shared — iMessage, Slack, X,
// etc. Twitter/X reuses this automatically unless a twitter-image is added.
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: BRAND.deep,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 120,
            height: 120,
            borderRadius: 28,
            background: "rgba(253,253,251,0.08)",
            marginBottom: 36,
          }}
        >
          <div
            style={{
              display: "flex",
              color: BRAND.goldSoft,
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontWeight: 700,
              fontSize: 74,
            }}
          >
            L
          </div>
        </div>
        <div
          style={{
            display: "flex",
            color: BRAND.goldSoft,
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontWeight: 700,
            fontSize: 76,
            letterSpacing: "-0.01em",
          }}
        >
          Longtable
        </div>
        <div
          style={{
            display: "flex",
            color: "#C7CFC0",
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontStyle: "italic",
            fontSize: 30,
            marginTop: 18,
          }}
        >
          Scripture, open to everyone.
        </div>
      </div>
    ),
    size
  );
}
