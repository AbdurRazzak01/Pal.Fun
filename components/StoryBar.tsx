"use client";
import { UserCircle } from "lucide-react";

export default function StoryBar({ pals }: { pals: any[] }) {
  // Only show live/active pals, up to 12 (for a clean row)
  const livePals = pals?.filter(pal => pal.status === "Active").slice(0, 12);

  return (
    <div className="w-full flex items-center gap-4 px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black sticky top-16 z-10 overflow-x-auto">
      {/* (Optional) Your Story placeholder */}
      <div className="flex flex-col items-center group">
        <div className="rounded-full border-2 border-blue-500 w-16 h-16 flex items-center justify-center bg-gray-200 dark:bg-gray-800 hover:brightness-90 cursor-pointer">
          <UserCircle className="h-10 w-10 text-gray-400" />
        </div>
        <span className="text-xs mt-1 text-gray-700 dark:text-gray-300">You</span>
      </div>
      {/* Map each live pal as a “story” */}
      {livePals.map((pal) => (
        <div
          key={pal.publicKey}
          title={pal.statement}
          className="flex flex-col items-center group"
        >
          <div
            className="rounded-full border-2 border-pink-500 w-16 h-16 flex items-center justify-center bg-gradient-to-tr from-pink-400 to-yellow-300 hover:brightness-90 cursor-pointer transition-all"
            // You can add an onClick here to open join/details modal:
            // onClick={() => ...}
          >
            {/* Pal creator icon/placeholder */}
            <UserCircle className="h-10 w-10 text-white drop-shadow" />
          </div>
          <span className="text-xs mt-1 text-gray-700 dark:text-gray-200 max-w-[60px] truncate group-hover:underline">
            {pal.creator?.toString().slice(0, 8)}...
          </span>
        </div>
      ))}
    </div>
  );
}
