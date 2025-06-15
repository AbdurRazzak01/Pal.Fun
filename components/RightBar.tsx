"use client";
import { useEffect, useState } from "react";
import { usePals } from "../utils/usePals";
import { usePalsphereProgram } from "../utils/anchorProvider";

export default function RightBar() {
  const { pals, loading } = usePals();
  const { wallet } = usePalsphereProgram();
  const [myPals, setMyPals] = useState<any[]>([]);

  useEffect(() => {
    if (!wallet?.publicKey || !pals) return;
    setMyPals(
      pals.filter(
        (pal: any) =>
          pal.creator?.toString() === wallet.publicKey.toString() ||
          (pal.participants &&
            pal.participants.some(
              (p: any) => p.key?.toString() === wallet.publicKey.toString()
            ))
      )
    );
  }, [wallet, pals]);

  // Debug log:
  // myPals.forEach(pal => console.log("pal.status:", pal.status));

  return (
    <aside className="sticky top-24 bg-white dark:bg-gray-950 rounded-xl shadow-md border border-gray-200 dark:border-gray-800 p-4 h-fit min-h-[320px]">
      <h3 className="text-lg font-semibold mb-4">My Pals</h3>
      {loading && <div>Loading your bets…</div>}
      {!loading && (!myPals || myPals.length === 0) && (
        <div className="text-gray-400 text-sm">
          You haven’t created or joined any pals yet.
        </div>
      )}
      <ul className="space-y-3">
        {myPals.map((pal: any) => (
          <li
            key={pal.publicKey?.toString?.() || pal.publicKey}
            className="flex flex-col gap-1 p-2 rounded hover:bg-blue-50 dark:hover:bg-gray-900 transition"
          >
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-gray-500">
                #{typeof pal.publicKey === "object" && pal.publicKey.toString
                  ? pal.publicKey.toString().slice(0, 6)
                  : String(pal.publicKey).slice(0, 6)}
                ...
              </span>
              <span className="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-800">
                {typeof pal.status === "object"
                  ? Object.keys(pal.status)[0]
                  : String(pal.status)}
              </span>
            </div>
            <div className="font-medium text-sm truncate">{pal.statement}</div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>Stake: {pal.stake_amount}</span>
              <span>
                {pal.creator?.toString() === wallet?.publicKey?.toString()
                  ? "You created"
                  : "You joined"}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
