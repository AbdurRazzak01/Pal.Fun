"use client";
import { useState } from "react";
import { usePalsphereProgram } from "../utils/anchorProvider";

interface Props {
  open: boolean;
  onClose: () => void;
  pal: any | null;
  onResolved?: () => void;
}

export default function ResolvePalModal({ open, onClose, pal, onResolved }: Props) {
  const { program, wallet } = usePalsphereProgram();
  const [threshold, setThreshold] = useState(""); // As string for user input
  const [resolving, setResolving] = useState(false);
  const [error, setError] = useState("");

  if (!open || !pal) return null;

  async function handleResolve(e: any) {
    e.preventDefault();
    if (!program || !wallet) return setError("Wallet not connected");
    setResolving(true);
    setError("");
    try {
      const { web3 } = await import("@project-serum/anchor");
      const chainlinkFeed = new web3.PublicKey("8GWK4R8i6TySrtf4uQ8CmqJLC9t6jzMZWnwbWRKra9Vh"); // Example devnet SOL/USD
      await program.methods
        .resolvePricePal(
          threshold ? parseInt(threshold) : 180_00000000 // Example threshold (adjust as needed)
        )
        .accounts({
          palAccount: new web3.PublicKey(pal.publicKey),
          chainlinkFeed,
        })
        .rpc();
      setResolving(false);
      onClose();
      if (onResolved) onResolved();
    } catch (e: any) {
      setError(e.message || "Failed to resolve pal.");
      setResolving(false);
    }
  }

  return (
    <div className="fixed z-10 inset-0 flex items-center justify-center bg-black bg-opacity-40">
      <form
        className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 w-full max-w-lg flex flex-col gap-4"
        onSubmit={handleResolve}
      >
        <h2 className="text-lg font-bold mb-2">Resolve Pal</h2>
        <div className="font-semibold">{pal.statement}</div>
        {error && <div className="text-red-600">{error}</div>}
        <input
          type="number"
          className="border rounded p-2"
          placeholder="Threshold Price (8 decimals, e.g. 180_00000000)"
          value={threshold}
          onChange={e => setThreshold(e.target.value)}
          required
        />
        <div className="flex gap-4 mt-4">
          <button
            type="button"
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            onClick={onClose}
            disabled={resolving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700"
            disabled={resolving}
          >
            {resolving ? "Resolving..." : "Resolve"}
          </button>
        </div>
      </form>
    </div>
  );
}
