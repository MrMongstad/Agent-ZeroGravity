import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EmpireHQ | Command Center",
  description: "Executive Intelligence Dashboard for Antigravity & Claude-Code",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div id="mesh-background" />
        <Toaster position="bottom-right" richColors theme="dark" />
        {children}
      </body>
    </html>
  );
}
