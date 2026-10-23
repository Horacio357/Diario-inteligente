import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Talos Diario · Periodismo Aumentado",
    short_name: "Talos Diario",
    description: "Periódico digital interactivo con monitor de humor social, mapa de calor territorial y periodismo aumentado.",
    start_url: "/",
    display: "standalone",
    background_color: "#060812",
    theme_color: "#00d4ff",
    lang: "es-AR",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
