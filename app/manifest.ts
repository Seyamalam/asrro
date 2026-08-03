import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ASRRO Portal",
    short_name: "ASRRO",
    description:
      "The digital home of the Andromeda Space and Robotics Research Organization at CUET.",
    start_url: "/",
    display: "standalone",
    background_color: "#060b18",
    theme_color: "#39bff8",
    icons: [
      {
        src: "/asrro-logo.png",
        sizes: "725x725",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
  }
}
