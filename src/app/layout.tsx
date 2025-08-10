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
  metadataBase: new URL('https://maximusbeato.com'),
  title: {
    default: "Maximus Beato - Portfolio",
    template: "%s | Maximus Beato"
  },
  description: "Modern portfolio website showcasing innovative projects and technical expertise in full-stack development, built with Next.js and cutting-edge web technologies.",
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
    description: "Modern portfolio website showcasing innovative projects and technical expertise in full-stack development.",
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
    description: "Modern portfolio website showcasing innovative projects and technical expertise.",
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
        <meta name="theme-color" content="#3b82f6" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body
        id="portfolio-root-body"
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300`}
        suppressHydrationWarning={true}
      >
        <div id="portfolio-main-container" className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
