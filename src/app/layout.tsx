import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import MotionProvider from "@/components/ui/MotionProvider";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://maximusbeato.com'),
  title: {
    default: "Maximus Beato - Portfolio",
    template: "%s | Maximus Beato"
  },
  description: "max beato — purdue cs. i build fast systems: tonos (voice profiling api), vtx (athlete composite scoring), apimesh (mcp tool orchestration).",
  keywords: [
    "portfolio",
    "developer",
    "full-stack",
    "Next.js",
    "React",
    "TypeScript",
    "web development",
    "software engineer",
    "Maximus Beato"
  ],
  authors: [{ name: "Maximus Beato" }],
  creator: "Maximus Beato",
  publisher: "Maximus Beato",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://maximusbeato.com",
    title: "Maximus Beato - Portfolio",
    description: "max beato — purdue cs. i build fast systems: tonos (voice profiling api), vtx (athlete composite scoring), apimesh (mcp tool orchestration).",
    siteName: "Maximus Beato Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Maximus Beato - Portfolio Website"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Maximus Beato - Portfolio",
    description: "max beato — purdue cs. i build fast systems: tonos, vtx, apimesh.",
    images: ["/og-image.png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  verification: {
    // Add Google Search Console verification when available
    // google: "your-verification-code"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#FAFAF9" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body
        id="portfolio-root-body"
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <MotionProvider>
          <div id="portfolio-main-container" className="min-h-screen">
            {children}
          </div>
        </MotionProvider>
      </body>
    </html>
  );
}
