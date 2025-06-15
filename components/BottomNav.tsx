"use client";
import { Home, Search, PlusCircle, Wallet, User } from "lucide-react";

interface BottomNavProps {
  onCreatePal: () => void;
}

export default function BottomNav({ onCreatePal }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 w-full h-16
        bg-gradient-to-r from-blue-100 via-fuchsia-50 to-yellow-50
        dark:from-[#24174a] dark:via-[#18123c] dark:to-[#332b1a]
        border-t border-fuchsia-200 dark:border-fuchsia-800
        flex justify-around items-center z-40 shadow-[0_-4px_24px_0_rgba(233,64,155,0.06)]
        px-2 sm:px-8 transition-all"
    >
      {/* Home */}
      <button
        className="flex flex-col items-center gap-0.5 text-gray-600 dark:text-fuchsia-100 hover:text-blue-700 dark:hover:text-yellow-300 font-bold transition-all"
        title="Home"
        // onClick={() => ...route to home}
      >
        <Home className="w-6 h-6 mb-0.5" />
        <span className="text-xs font-semibold">Home</span>
      </button>
      {/* Search */}
      <button
        className="flex flex-col items-center gap-0.5 text-gray-600 dark:text-fuchsia-100 hover:text-fuchsia-600 dark:hover:text-yellow-300 font-bold transition-all"
        title="Search"
        // onClick={() => ...future search modal}
      >
        <Search className="w-6 h-6 mb-0.5" />
        <span className="text-xs font-semibold">Search</span>
      </button>
      {/* Create Pal (center accent) */}
      <button
        className="flex flex-col items-center gap-0.5
          text-white bg-gradient-to-tr from-fuchsia-500 via-orange-400 to-yellow-400
          hover:from-fuchsia-700 hover:to-yellow-500
          shadow-lg rounded-full px-4 py-2 -mt-6 border-4 border-white dark:border-[#24174a]
          transition-all"
        style={{ minWidth: 72, minHeight: 56 }}
        title="Create Pal"
        onClick={onCreatePal}
      >
        <PlusCircle className="w-8 h-8 mb-0.5 drop-shadow" />
        <span className="text-xs font-bold">Create</span>
      </button>
      {/* Wallet */}
      <button
        className="flex flex-col items-center gap-0.5 text-gray-600 dark:text-fuchsia-100 hover:text-blue-700 dark:hover:text-yellow-300 font-bold transition-all"
        title="Wallet"
        // onClick={() => ...future wallet view}
      >
        <Wallet className="w-6 h-6 mb-0.5" />
        <span className="text-xs font-semibold">Wallet</span>
      </button>
      {/* Profile */}
      <button
        className="flex flex-col items-center gap-0.5 text-gray-600 dark:text-fuchsia-100 hover:text-blue-700 dark:hover:text-yellow-300 font-bold transition-all"
        title="Profile"
        // onClick={() => ...future profile}
      >
        <User className="w-6 h-6 mb-0.5" />
        <span className="text-xs font-semibold">Profile</span>
      </button>
    </nav>
  );
}
