import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

// Use standard offline-proof system fonts variables
const geistSans = {
  variable: "font-sans",
};

const geistMono = {
  variable: "font-mono",
};

export const metadata: Metadata = {
  title: "ScoutVision | Enterprise AI Sports Analytics SaaS",
  description: "High-frequency match tagging, optical player tracking heatmaps, custom performance dashboards, and collaborative workflows for elite coaches and analysts.",
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
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

