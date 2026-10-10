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

const siteDescription =
  "Build a professional, ATS-friendly CV in minutes. Pick a template, polish your wording with AI, and download a clean PDF. Made for job seekers in Bangladesh.";

export const metadata: Metadata = {
  metadataBase: new URL("https://cv-builder-phmu.vercel.app"),
  title: {
    default: "CVBuilder: Build a professional CV in minutes",
    template: "%s | CVBuilder",
  },
  description: siteDescription,
  openGraph: {
    type: "website",
    siteName: "CVBuilder",
    title: "CVBuilder: Build a professional CV in minutes",
    description: siteDescription,
    locale: "en_BD",
  },
  twitter: {
    card: "summary",
    title: "CVBuilder: Build a professional CV in minutes",
    description: siteDescription,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
