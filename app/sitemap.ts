import type { MetadataRoute } from "next"

const routes = [
  "",
  "/about",
  "/committee",
  "/alumni",
  "/projects",
  "/events",
  "/gallery",
  "/publications",
  "/news",
  "/contact",
  "/membership",
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return routes.map((route, index) => ({
    url: `https://asrro.org${route}`,
    lastModified,
    changeFrequency: index === 0 ? "weekly" : "monthly",
    priority: index === 0 ? 1 : 0.7,
  }))
}
