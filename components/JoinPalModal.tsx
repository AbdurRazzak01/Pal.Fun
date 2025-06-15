"use client";

import { useState } from "react";
import { usePalsphereProgram } from "../utils/anchorProvider";
import BN from "bn.js";
import { PublicKey, SystemProgram } from "@solana/web3.js";

interface Props {
  open: boolean;
  onClose: () => void;
  pal: any | null; // Pass full pal object from list
  onJoined?: () => void;
}

export default function JoinPalModal({ open, onClose, pal, onJoined }: Props) {
  const { program, wallet } = usePalsphereProgram();
  const [side, setSide] = useState(true); // true = for, false = against
  const [amount, setAmount] = useState(0.01); // In SOL
  const [message, setMessage] = useState("");
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");

  if (!open || !pal) return null;

  async function handleJoin(e: any) {
    e.preventDefault();
    setError("");
    if (!program || !wallet) {
      setError("Wallet not connected");
      return;
    }
    setJoining(true);

    try {
      // Always use PublicKey object for all pubkey params!
      const palPubkey = new PublicKey(
        typeof pal.publicKey === "string"
          ? pal.publicKey
          : pal.publicKey?.toString?.() ?? pal.publicKey
      );

      // Derive palVault PDA correctly
      const palVaultSeeds = [Buffer.from("pal_vault"), palPubkey.toBuffer()];
      const [palVaultPDA] = await PublicKey.findProgramAddress(
        palVaultSeeds,
        program.programId
      );

      // Always use BN for numbers sent to Anchor!
      const lamports = new BN(Math.floor(amount * 1_000_000_000)); // 1 SOL = 1_000_000_000 lamports

      await program.methods
        .joinPal(
          side,
          lamports,
          message
        )
        .accounts({
          palAccount: palPubkey,
          joiner: wallet.publicKey,
          palVault: palVaultPDA,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      setJoining(false);
      if (onJoined) onJoined();
      onClose();
    } catch (e: any) {
      setError(e.message || "Failed to join pal.");
      setJoining(false);
      console.error(e);
    }
  }

  return (
    <div className="fixed z-10 inset-0 flex items-center justify-center bg-black bg-opacity-40">
      <form
        className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 w-full max-w-lg flex flex-col gap-4"
        onSubmit={handleJoin}
      >
        <h2 className="text-lg font-bold mb-2">Join Pal</h2>
        <div className="font-semibold">{pal.statement}</div>
        {error && <div className="text-red-600">{error}</div>}
        <div>
          <label className="mr-2">
            <input
              type="radio"
              checked={side}
              onChange={() => setSide(true)}
            />
            <span className="ml-1">For</span>
          </label>
          <label className="ml-4">
            <input
              type="radio"
              checked={!side}
              onChange={() => setSide(false)}
            />
            <span className="ml-1">Against</span>
          </label>
        </div>
        <input
          type="number"
          step="0.001"
          className="border rounded p-2"
          placeholder="Amount (SOL)"
          value={amount}
          min={0.001}
          onChange={e => setAmount(Number(e.target.value))}
          required
        />
        <input
          type="text"
          className="border rounded p-2"
          placeholder="Message (optional)"
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <div className="flex gap-4 mt-4">
          <button
            type="button"
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            onClick={onClose}
            disabled={joining}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
            disabled={joining}
          >
            {joining ? "Joining..." : "Join"}
          </button>
        </div>
      </form>
    </div>
  );
}
