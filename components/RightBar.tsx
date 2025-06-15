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

  return (
    <aside className="sticky top-24 bg-white dark:bg-gray-950 rounded-xl shadow-md border border-gray-200 dark:border-gray-800 p-4 h-fit min-h-[320px] flex flex-col">
      <h3 className="text-lg font-semibold mb-4">My Bets!</h3>
      {loading && <div>Loading your bets…</div>}
      {!loading && (!myPals || myPals.length === 0) && (
        <div className="text-gray-400 text-sm">
          You haven’t created or joined any bets yet.
        </div>
      )}
      <ul className="flex flex-col gap-4">
        {myPals.map((pal: any) => (
          <li
            key={pal.publicKey?.toString?.() || pal.publicKey}
            className="rounded-2xl bg-gradient-to-br from-blue-100 via-fuchsia-50 to-yellow-50 dark:from-blue-900 dark:via-fuchsia-950 dark:to-yellow-900 border border-fuchsia-100 dark:border-fuchsia-900 shadow-lg p-4 flex flex-col gap-2 transition-all"
          >
            <div className="flex items-center gap-3 mb-1">
              <span className="font-mono text-xs text-gray-500">
                #{typeof pal.publicKey === "object" && pal.publicKey.toString
                  ? pal.publicKey.toString().slice(0, 6)
                  : String(pal.publicKey).slice(0, 6)}
                ...
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-pink-100 via-yellow-100 to-blue-100 text-fuchsia-700 dark:bg-gradient-to-r dark:from-fuchsia-900 dark:to-blue-900 dark:text-yellow-200">
                {typeof pal.status === "object"
                  ? Object.keys(pal.status)[0]
                  : String(pal.status)}
              </span>
            </div>
            <div className="font-semibold text-sm truncate text-gray-900 dark:text-yellow-100">
              {pal.statement}
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-300">
              <span>
                <b>Stake:</b> {pal.stake_amount}
              </span>
              <span>
                {pal.creator?.toString() === wallet?.publicKey?.toString()
                  ? <span className="text-fuchsia-600 dark:text-yellow-200">You created</span>
                  : <span className="text-blue-700 dark:text-fuchsia-300">You joined</span>
                }
              </span>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
