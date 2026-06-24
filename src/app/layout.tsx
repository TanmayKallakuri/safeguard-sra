import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { AssessmentProvider } from "@/components/assessment-provider";
import { MotionProvider } from "@/components/motion-provider";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Safeguard — HIPAA Security Risk Assessment",
  description:
    "Work through the HIPAA Security Rule safeguards, score risk on a NIST SP 800-30 matrix, and generate an audit-ready risk register and report.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plexSans.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Tactile grain overlay (hidden in print + reduced-motion-safe). */}
        <div className="grain" aria-hidden="true" />
        <MotionProvider>
          <AssessmentProvider>
            <SiteNav />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </AssessmentProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
