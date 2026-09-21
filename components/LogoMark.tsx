import { BRAND } from "@/lib/constants";

// The app's icon mark, drawn inline rather than reused from the generated
// favicon route — this renders in the page itself (e.g. the header), so it
// needs to be a real SVG, not a Satori-rendered image. Fixed brand colors on
// purpose: the mark should look the same in light and dark mode, like the
// app icon and exported verse images do.
export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" role="img" aria-label="Longtable">
      <rect width="36" height="36" rx="9" fill={BRAND.deep} />
      <text
        x="18"
        y="25.5"
        textAnchor="middle"
        fontFamily="'Fraunces', serif"
        fontWeight={700}
        fontSize="20"
        fill={BRAND.goldSoft}
      >
        L
      </text>
    </svg>
  );
}
