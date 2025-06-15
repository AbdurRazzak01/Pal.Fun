"use client";

import { ReactNode } from "react";

export default function CenteredModal({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div className="bg-white dark:bg-[#1b2337] rounded-2xl p-8 max-w-md w-full shadow-2xl flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}
