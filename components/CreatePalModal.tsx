"use client";

import { useState } from "react";
import { usePalsphereProgram } from "../utils/anchorProvider";
import BN from "bn.js"; // <- Needed for Anchor v0.26+
import { PublicKey, SystemProgram } from "@solana/web3.js";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export default function CreatePalModal({ open, onClose, onCreated }: Props) {
  const { program, wallet } = usePalsphereProgram();
  const [statement, setStatement] = useState("");
  const [verificationUrl, setVerificationUrl] = useState("");
  const [confidence, setConfidence] = useState(80);
  const [stake, setStake] = useState(0.01); // in SOL
  const [deadline, setDeadline] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  // Basic validation
  const isValid =
    statement.length > 10 &&
    verificationUrl.startsWith("http") &&
    !creating &&
    stake >= 0.001 &&
    confidence >= 0 &&
    confidence <= 100;

  async function handleSubmit(e: any) {
    e.preventDefault();
    setError("");
    if (!program || !wallet) {
      setError("Wallet not connected");
      return;
    }
    setCreating(true);

    try {
      // Parse deadline to unix timestamp
      const unixDeadline =
        deadline && !isNaN(new Date(deadline).getTime())
          ? Math.floor(new Date(deadline).getTime() / 1000)
          : Math.floor(Date.now() / 1000) + 60 * 60 * 24;

      // Generate a new keypair for the Pal account
      const { web3 } = await import("@project-serum/anchor");
      const kp = web3.Keypair.generate();

      // PDA for palVault
      const palVaultSeeds = [Buffer.from("pal_vault"), kp.publicKey.toBuffer()];
      const [palVaultPDA] = await web3.PublicKey.findProgramAddress(
        palVaultSeeds,
        program.programId
      );

      // Debug logging
      console.log("Wallet pubkey:", wallet.publicKey?.toBase58());
      console.log("PalAccount pubkey:", kp.publicKey.toBase58());
      console.log("palVaultPDA:", palVaultPDA.toBase58());
      console.log("About to send tx...");

      // Call Anchor method (using BN for numbers)
      const tx = await program.methods
        .createPal(
          statement,
          verificationUrl,
          "", // image hash (optional)
          new BN(confidence),
          new BN(unixDeadline),
          new BN(Math.floor(stake * web3.LAMPORTS_PER_SOL))
        )
        .accounts({
          palAccount: kp.publicKey,
          creator: wallet.publicKey,
          palVault: palVaultPDA,
          oracle: wallet.publicKey, // Use a real oracle in production!
          systemProgram: SystemProgram.programId,
        })
        .signers([kp])
        .rpc();

      console.log("Tx sent! Signature:", tx);

      // Reset form only if success
      setStatement("");
      setVerificationUrl("");
      setConfidence(80);
      setStake(0.01);
      setDeadline("");
      setCreating(false);
      if (onCreated) onCreated();
      onClose();
    } catch (e: any) {
      setError(e.message || "Failed to create pal.");
      setCreating(false);
      console.error(e);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed z-30 inset-0 flex items-center justify-center bg-black bg-opacity-40">
      <form
        className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 w-full max-w-lg flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <h2 className="text-lg font-bold mb-2">Create a Pal</h2>
        {error && <div className="text-red-600">{error}</div>}
        <input
          type="text"
          className="border rounded p-2"
          placeholder="Statement (e.g. MIT will require GRE in 2026)"
          value={statement}
          onChange={e => setStatement(e.target.value)}
          required
        />
        <input
          type="url"
          className="border rounded p-2"
          placeholder="Verification URL (must start with http)"
          value={verificationUrl}
          onChange={e => setVerificationUrl(e.target.value)}
          required
        />
        <input
          type="number"
          className="border rounded p-2"
          placeholder="Confidence Score (%)"
          value={confidence}
          onChange={e => setConfidence(Number(e.target.value))}
          min={0}
          max={100}
        />
        <input
          type="datetime-local"
          className="border rounded p-2"
          placeholder="Deadline"
          value={deadline}
          onChange={e => setDeadline(e.target.value)}
        />
        <input
          type="number"
          step="0.001"
          className="border rounded p-2"
          placeholder="Stake Amount (SOL)"
          value={stake}
          onChange={e => setStake(Number(e.target.value))}
          min={0.001}
        />
        <div className="flex gap-4 mt-4">
          <button
            type="button"
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            onClick={onClose}
            disabled={creating}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            disabled={!isValid || creating}
          >
            {creating ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}