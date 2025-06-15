"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import { UserCircle2, MessageCircle } from "lucide-react";

const WalletMultiButton = dynamic(
  async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export default function TopBar() {
  return (
    <header
      className="
        w-full h-20 flex items-center justify-between
        border-b border-fuchsia-200 dark:border-fuchsia-800
        px-6
        bg-gradient-to-r from-blue-100 via-fuchsia-100 to-yellow-100
        dark:from-[#1a1339] dark:via-[#131a33] dark:to-[#39201a]
        shadow-lg sticky top-0 z-30
        "
    >
      {/* Logo/brand */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-tr from-fuchsia-400 via-blue-300 to-yellow-300 shadow-md border-2 border-fuchsia-200 overflow-hidden">
          <Image
            src="/ZenVlotLogo.png"
            alt="Palsphere logo"
            width={36}
            height={36}
            className="object-contain"
            priority
          />
        </div>
        <span className="font-extrabold text-2xl sm:text-3xl bg-gradient-to-tr from-fuchsia-600 via-blue-500 to-amber-400 text-transparent bg-clip-text drop-shadow">
          Pal.Fun
        </span>
      </div>
      {/* Actions */}
      <div className="flex items-center gap-6">
        <button
          title="Open chat"
          className="rounded-full bg-gradient-to-tr from-blue-200 via-fuchsia-100 to-yellow-100 dark:from-fuchsia-900 dark:via-blue-900 dark:to-yellow-900 p-2 shadow-md hover:scale-110 transition-all"
        >
          <MessageCircle className="h-7 w-7 text-fuchsia-600 dark:text-yellow-200" />
        </button>
        <button
          title="Profile"
          className="rounded-full bg-gradient-to-tr from-yellow-100 via-blue-100 to-fuchsia-100 dark:from-yellow-900 dark:via-blue-900 dark:to-fuchsia-900 p-2 shadow-md hover:scale-110 transition-all"
        >
          <UserCircle2 className="h-7 w-7 text-blue-700 dark:text-yellow-100" />
        </button>
        <div>
          <WalletMultiButton />
        </div>
      </div>
    </header>
  );
}
