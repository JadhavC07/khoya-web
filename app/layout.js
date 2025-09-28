import React from "react";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Suspense } from "react";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Khoya — Bringing People Back Together",
    template: "%s | Khoya",
  },
  description:
    "Khoya helps families and communities find missing persons. Report cases, receive real‑time alerts, and collaborate with law enforcement—safely and privately.",
  applicationName: "Khoya",
  generator: "v0.app",
  keywords: [
    "missing persons",
    "public safety",
    "community alerts",
    "geolocation alerts",
    "law enforcement collaboration",
    "Khoya",
  ],
  category: "public service",
  authors: [{ name: "Khoya" }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "Khoya — Bringing People Back Together",
    description:
      "Report a missing person, receive real-time alerts, and help bring loved ones home.",
    siteName: "Khoya",
    images: [
      {
        url: "/images/khoya.jpg",
        width: 1200,
        height: 630,
        alt: "Khoya — Bringing People Back Together",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Khoya — Bringing People Back Together",
    description:
      "Report a missing person, receive real-time alerts, and help bring loved ones home.",
    images: ["/images/khoya.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Khoya",
    url: siteUrl,
    logo: `${siteUrl}/images/khoya-removebg-preview.png`,
    sameAs: [
      // Add your real profiles if available
      "https://www.facebook.com/",
      "https://www.instagram.com/",
      "https://twitter.com/",
    ],
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Khoya",
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/search?q={query}`,
      "query-input": "required name=query",
    },
  };

  return (
    <html lang="en">
      <body
        className={`font-sans antialiased ${GeistSans.variable} ${GeistMono.variable}`}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:block focus:p-2 focus:bg-accent focus:text-accent-foreground"
          >
            Skip to content
          </a>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
        </Suspense>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <Analytics />
      </body>
    </html>
  );
}
