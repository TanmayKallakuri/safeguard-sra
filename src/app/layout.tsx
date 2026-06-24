import type { Metadata } from "next";
import { JetBrains_Mono, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { AssessmentProvider } from "@/components/assessment-provider";
import { MotionProvider } from "@/components/motion-provider";
import { VantaFog } from "@/components/vanta-fog";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

// Monospace is the dominant voice — wordmark, nav, labels, numerals, tables.
const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// One clean neutral sans, used ONLY for long prose (descriptions, remediation).
const sans = Instrument_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "safeguard — HIPAA Security Risk Assessment",
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
      className={`${mono.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Animated Vanta FOG background (+ static fallback), fixed behind all
            content; hidden in print. */}
        <VantaFog />
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
