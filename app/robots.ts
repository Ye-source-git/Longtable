import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/auth/",
        // Personal/account-scoped — not useful to search, not worth crawl budget.
        "/journal",
        // The whole Tables subtree, including /tables/join/[code] invite links,
        // which must never be crawlable — a cached invite link would let a
        // stranger find their way into someone's private table.
        "/tables",
      ],
    },
    sitemap: "https://www.longtable.study/sitemap.xml",
  };
}
