import type { MetadataRoute } from "next"

import { events, news, projects } from "@/content/public-data"

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
  "/search",
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  const detailRoutes = [
    ...projects.map((project) => `/projects/${project.slug}`),
    ...events.map((event) => `/events/${event.slug}`),
    ...news.map((item) => `/news/${item.slug}`),
  ]

  return [...routes, ...detailRoutes].map((route, index) => ({
    url: `https://asrro.org${route}`,
    lastModified,
    changeFrequency: index === 0 ? "weekly" : "monthly",
    priority: index === 0 ? 1 : 0.7,
  }))
}
