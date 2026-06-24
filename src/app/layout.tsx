import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AssessmentProvider } from "@/components/assessment-provider";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AssessmentProvider>
          <SiteNav />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </AssessmentProvider>
      </body>
    </html>
  );
}
