import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://talosdiario.ar";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f4efe6",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Talos Diario · Periódico Digital Interactivo de Argentina",
    template: "%s · Talos Diario",
  },
  description:
    "El primer periódico digital interactivo de Argentina impulsado por Inteligencia Artificial y Periodismo Aumentado. Análisis de opinion pública, noticias en tiempo real y mapa de calor territorial.",
  keywords: [
    "Talos Diario", "Proyecto Talos", "Noticias Argentina", "Diario Digital",
    "Inteligencia Artificial", "Periodismo Aumentado", "Política Argentina",
    "Economía", "Deportes", "Tecnología", "Pulso Nacional", "Mapa de Calor"
  ],
  authors: [{ name: "Redacción Talos" }],
  creator: "Proyecto Talos",
  publisher: "Proyecto Talos",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Talos Diario · Periódico Digital Interactivo de Argentina",
    description:
      "Periodismo aumentado con Inteligencia Artificial, mapa de calor territorial y noticias en vivo.",
    url: siteUrl,
    siteName: "Talos Diario",
    locale: "es_AR",
    type: "website",
    images: [
      {
        url: `${siteUrl}/api/og?title=${encodeURIComponent("Talos Diario · Periódico Digital Interactivo")}&category=ARGENTINA`,
        width: 1200,
        height: 630,
        alt: "Talos Diario · Periodismo Aumentado por IA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Talos Diario · Periódico Digital Interactivo de Argentina",
    description:
      "Noticias en tiempo real, análisis de opinión pública y mapa de calor territorial con IA.",
    site: "@TalosDiario",
    creator: "@TalosDiario",
    images: [`${siteUrl}/api/og?title=${encodeURIComponent("Talos Diario · Periódico Digital Interactivo")}&category=ARGENTINA`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
