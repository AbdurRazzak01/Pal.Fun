"use client";
import { useState } from "react";
import { usePalsphereProgram } from "../utils/anchorProvider";

export default function ClaimWinningsButton({ pal }: { pal: any }) {
  const { program, wallet } = usePalsphereProgram();
  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [error, setError] = useState("");

  async function handleClaim() {
    if (!program || !wallet) return setError("Wallet not connected");
    setClaiming(true);
    setError("");
    try {
      const { web3 } = await import("@project-serum/anchor");
      const palVaultSeeds = [Buffer.from("pal_vault"), new web3.PublicKey(pal.publicKey).toBuffer()];
      const [palVaultPDA] = await web3.PublicKey.findProgramAddress(
        palVaultSeeds,
        program.programId
      );
      await program.methods
        .claimWinnings()
        .accounts({
          palAccount: new web3.PublicKey(pal.publicKey),
          claimer: wallet.publicKey,
          palVault: palVaultPDA,
        })
        .rpc();
      setClaimed(true);
      setClaiming(false);
    } catch (e: any) {
      setError(e.message || "Failed to claim winnings.");
      setClaiming(false);
    }
  }

  if (claimed) return <span className="text-green-600">Claimed!</span>;

  return (
    <button
      className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
      onClick={handleClaim}
      disabled={claiming}
    >
      {claiming ? "Claiming..." : "Claim Winnings"}
      {error && <span className="text-xs text-red-500 ml-2">{error}</span>}
    </button>
  );
}
