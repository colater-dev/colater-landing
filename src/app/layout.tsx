import type { Metadata } from "next";
import { tasaExplorer, satoshi } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Colater — AI-Powered Design Agency for Startups",
  description:
    "One senior designer + six AI agents. Agency-level brand identity, product design, and web development at startup-friendly pricing. From $500 per project.",
  openGraph: {
    title: "Colater — AI-Powered Design Agency for Startups",
    description:
      "One senior designer + six AI agents. Agency-level output at startup-friendly pricing.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${tasaExplorer.variable} ${satoshi.variable}`}>
      <body>{children}</body>
    </html>
  );
}
