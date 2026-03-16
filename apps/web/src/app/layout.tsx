import type { Metadata } from "next";
import { IBM_Plex_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/providers/app-providers";

const headingFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
});

const bodyFont = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Yubeepay",
  description: "Yubeepay enterprise wallet and payments console",
  icons: {
    icon: "/yubeepay-logo.svg",
    shortcut: "/yubeepay-logo.svg",
    apple: "/yubeepay-logo.svg",
  },
};

export default function RootLayout({ children }: any) {
  return (
    <html lang="en">
      <body
        className={`${headingFont.variable} ${bodyFont.variable} min-h-screen bg-app text-app-foreground`}
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
