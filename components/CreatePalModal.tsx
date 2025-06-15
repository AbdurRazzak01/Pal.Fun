"use client";
import { useState, useEffect } from "react";
import { usePalsphereProgram } from "../utils/anchorProvider";
import BN from "bn.js";
import { PublicKey, SystemProgram } from "@solana/web3.js";

interface InitialValues {
  statement?: string;
  verificationUrl?: string;
  confidence?: number;
  stake?: number;
  deadline?: string;
}
interface Props {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
  initialValues?: InitialValues;
}

export default function CreatePalModal({ open, onClose, onCreated, initialValues }: Props) {
  const { program, wallet } = usePalsphereProgram();

  // --- Form state
  const [statement, setStatement] = useState(initialValues?.statement || "");
  const [verificationUrl, setVerificationUrl] = useState(initialValues?.verificationUrl || "");
  const [confidence, setConfidence] = useState(initialValues?.confidence ?? 80);
  const [stake, setStake] = useState(initialValues?.stake ?? 0.01); // in SOL
  const [deadline, setDeadline] = useState(initialValues?.deadline || "");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  // Debug: Log values on render
  useEffect(() => {
    if (open) {
      setStatement(initialValues?.statement || "");
      setVerificationUrl(initialValues?.verificationUrl || "");
      setConfidence(initialValues?.confidence ?? 80);
      setStake(initialValues?.stake ?? 0.01);
      setDeadline(initialValues?.deadline || "");
    }
    // eslint-disable-next-line
  }, [open, initialValues]);

  // Validation
  const isValid =
    statement.length > 10 &&
    verificationUrl.startsWith("http") &&
    !creating &&
    stake >= 0.001 &&
    confidence >= 0 &&
    confidence <= 100;

  // --- DEBUG LOGS ---
  useEffect(() => {
    // Log the actual current state whenever it changes
    if (open) {
      console.log("Modal open: debug form state", {
        statement, verificationUrl, confidence, stake, deadline
      });
      console.log("isValid?", isValid);
      console.log("program:", program);
      console.log("wallet:", wallet);
    }
  }, [open, statement, verificationUrl, confidence, stake, deadline, program, wallet, isValid]);

  // -- Submit
  async function handleSubmit(e: any) {
    e.preventDefault();
    console.log("SUBMIT fired", { program, wallet });

    setError("");
    if (!program || !wallet) {
      setError("Wallet not connected");
      console.log("NO PROGRAM/WALLET", { program, wallet });
      return;
    }
    setCreating(true);
    try {
      const unixDeadline =
        deadline && !isNaN(new Date(deadline).getTime())
          ? Math.floor(new Date(deadline).getTime() / 1000)
          : Math.floor(Date.now() / 1000) + 60 * 60 * 24;

      const { web3 } = await import("@project-serum/anchor");
      const kp = web3.Keypair.generate();
      const palVaultSeeds = [Buffer.from("pal_vault"), kp.publicKey.toBuffer()];
      const [palVaultPDA] = await web3.PublicKey.findProgramAddress(
        palVaultSeeds,
        program.programId
      );

      // Log everything before send
      console.log("About to call createPal with:", {
        statement, verificationUrl, confidence, unixDeadline, stake,
        palVaultPDA: palVaultPDA.toBase58(),
        kp: kp.publicKey.toBase58(),
        creator: wallet.publicKey?.toBase58?.(),
      });

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
          oracle: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([kp])
        .rpc();

      console.log("Tx sent! Signature:", tx);

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
