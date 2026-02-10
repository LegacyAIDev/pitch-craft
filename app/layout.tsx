import type { Metadata } from "next";
import "@fontsource/barlow-condensed/400.css";
import "@fontsource/barlow-condensed/500.css";
import "@fontsource/barlow-condensed/600.css";
import "@fontsource/bebas-neue/400.css";
import "@fontsource/cal-sans/400.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "PitchCraft | From Discovery Call to Ready-to-Send Proposal in Minutes",
  description:
    "AI-powered discovery calls that automatically generate complete project proposals. No more manual quoting, formatting, or follow-up delays. Turn discovery into deals instantly.",
  keywords: [
    "proposal software",
    "AI discovery calls",
    "project quotes",
    "proposal generation",
    "service provider",
    "Fireflies integration",
  ],
  openGraph: {
    title: "PitchCraft | AI-Powered Proposals from Discovery Calls",
    description:
      "Turn discovery conversations into professional proposals in minutes. AI-powered discovery calls + instant proposal generation.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-body antialiased text-navy bg-white">
        {children}
      </body>
    </html>
  );
}
