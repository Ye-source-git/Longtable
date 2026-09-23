import type { MetadataRoute } from "next";

const BASE_URL = "https://www.longtable.study";

// Only the pages worth a search engine's attention — public, content-bearing,
// and the same regardless of who's looking. Personal/account pages (Journal,
// Tables, Login) are deliberately left out here and blocked in robots.ts.
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/about", "/read", "/search", "/plans", "/companion", "/guide", "/privacy", "/terms"];
  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "monthly",
    priority: route === "" ? 1 : route === "/about" ? 0.9 : 0.7,
  }));
}
