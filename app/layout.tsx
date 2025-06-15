import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// 1. Import SolanaWalletProvider
import { SolanaWalletProvider } from "../components/SolanaWalletProvider";
import './globals.css';// 2. Fonts setup (your code)
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Palsphere",
  description: "Your decentralized social betting app",
};

// 3. Export root layout with provider
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
<html lang="en" suppressHydrationWarning>
<body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SolanaWalletProvider>
          {children}
        </SolanaWalletProvider>
      </body>
    </html>
  );
}
