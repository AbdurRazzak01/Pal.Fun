"use client";
import Image from "next/image";
import { UserCircle } from "lucide-react";

export default function StoryBar({ pals }: { pals: any[] }) {
  const livePals = pals?.filter(pal => pal.status === "Active").slice(0, 12);

  return (
    <div className="w-full flex items-center gap-4 px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black sticky top-16 z-10 overflow-x-auto">
      {/* Your Story */}
      <div className="flex flex-col items-center group">
        <div className="rounded-full border-2 border-blue-500 w-16 h-16 flex items-center justify-center bg-gray-200 dark:bg-gray-800 hover:brightness-90 cursor-pointer relative overflow-hidden">
          <Image
            src="/dog.jpg"
            width={48}
            height={48}
            alt="You"
            className="rounded-full object-cover"
            onError={(e: any) => { e.currentTarget.style.display = "none"; }}
          />
          {/* Fallback if image not found */}
          <UserCircle className="h-10 w-10 text-gray-400 absolute inset-0 m-auto" />
        </div>
        <span className="text-xs mt-1 text-gray-700 dark:text-gray-300">You</span>
      </div>
      {/* Live pals */}
      {livePals.map((pal, idx) => (
        <div key={pal.publicKey} title={pal.statement} className="flex flex-col items-center group">
          <div className="rounded-full border-2 border-pink-500 w-16 h-16 flex items-center justify-center bg-gradient-to-tr from-pink-400 to-yellow-300 hover:brightness-90 cursor-pointer transition-all relative overflow-hidden">
            {pal.profileUrl ? (
              <Image
                src={pal.profileUrl}
                width={48}
                height={48}
                alt={pal.creator}
                className="rounded-full object-cover"
                onError={(e: any) => { e.currentTarget.style.display = "none"; }}
              />
            ) : (
              <UserCircle className="h-10 w-10 text-white drop-shadow" />
            )}
          </div>
          <span className="text-xs mt-1 text-gray-700 dark:text-gray-200 max-w-[60px] truncate group-hover:underline">
            {pal.creator?.toString().slice(0, 8)}...
          </span>
        </div>
      ))}
    </div>
  );
}
