import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://datosegurodigital.com"),
  title: {
    default: "Dato Seguro Digital — Protegemos tus datos, protegemos tu tranquilidad",
    template: "%s | Dato Seguro Digital",
  },
  description:
    "Orientación y acompañamiento para personas que sufren acoso por aplicaciones de crédito digital ilegales en Colombia. Protegemos tus datos, protegemos tu tranquilidad.",
  keywords: [
    "acoso apps de crédito",
    "gota a gota digital",
    "protección de datos personales Colombia",
    "apps de préstamos ilegales",
    "Dato Seguro Digital",
  ],
  openGraph: {
    title: "Dato Seguro Digital — Protegemos tus datos, protegemos tu tranquilidad",
    description:
      "Orientación y acompañamiento para personas que sufren acoso por aplicaciones de crédito digital ilegales en Colombia.",
    url: "https://datosegurodigital.com",
    siteName: "Dato Seguro Digital",
    locale: "es_CO",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Dato Seguro Digital — Protegemos tus datos, protegemos tu tranquilidad",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dato Seguro Digital",
    description:
      "Orientación y acompañamiento para personas que sufren acoso por aplicaciones de crédito digital ilegales en Colombia.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
