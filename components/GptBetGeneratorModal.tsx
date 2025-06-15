"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import CreatePalModal from "./CreatePalModal";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function GptBetGeneratorModal({ open, onClose }: Props) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [bet, setBet] = useState<any>(null);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Helper: Extract first URL from text
  function extractFirstUrl(text: string) {
    const match = text?.match?.(/https?:\/\/[^\s"]+/);
    return match ? match[0] : "";
  }

  function handleCreate() {
    setShowCreateModal(true);
  }

  async function handleGenerate(e: any) {
    e.preventDefault();
    setError("");
    setLoading(true);
    setBet(null);

    try {
      const response = await fetch("/api/generate-bet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`API Error: ${errText}`);
      }

      const data = await response.json();

      // Use the "parsed" field if available, else fallback to parsing content
      let parsed = data?.parsed;
      if (!parsed) {
        const text = data.choices?.[0]?.message?.content || "";
        try {
          parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
        } catch {
          const match = text.match(/\{[\s\S]*\}/);
          if (match) parsed = JSON.parse(match[0]);
        }
      }

      // Fix verificationUrl: extract a single, clean URL
      let verificationUrl = "";
      if (parsed?.verificationUrl) {
        verificationUrl = extractFirstUrl(parsed.verificationUrl);
      } else if (parsed?.verification) {
        verificationUrl = extractFirstUrl(parsed.verification);
      }

      setBet({
        statement: parsed?.statement ?? "",
        feasible: parsed?.feasible ?? "",
        confidence: parsed?.confidence ?? "",
        verificationUrl,
      });
    } catch (err: any) {
      setError(err.message || "Failed to generate.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed z-[200] inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 40 }}
        className="bg-white dark:bg-gray-950 rounded-2xl shadow-2xl border border-fuchsia-200 dark:border-fuchsia-800 p-8 w-full max-w-xl flex flex-col gap-5 relative"
      >
        <button
          className="absolute top-2 right-2 text-lg rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 p-1"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-2xl font-black text-center bg-gradient-to-tr from-fuchsia-600 via-blue-500 to-amber-400 text-transparent bg-clip-text mb-2">
          Generate Your Bet
        </h2>
        <form onSubmit={handleGenerate} className="flex flex-col gap-3">
          <textarea
            className="border border-fuchsia-300 dark:border-fuchsia-800 rounded-lg p-3 bg-white dark:bg-gray-900 min-h-[60px] resize-none"
            placeholder="Describe your bet idea (e.g., Bitcoin will close above $100,000 on Jan 1, 2027)..."
            value={input}
            onChange={e => setInput(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-gradient-to-r from-fuchsia-500 via-orange-400 to-yellow-300 text-white font-bold py-2 rounded-xl shadow-xl hover:brightness-110 disabled:opacity-70"
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </form>
        {error && <div className="text-red-600 text-sm mt-2">{error}</div>}

        {bet && (
          <div className="bg-gray-100 dark:bg-gray-900 rounded-xl p-4 mt-2 flex flex-col gap-2 border border-fuchsia-200 dark:border-fuchsia-800">
            <div><span className="font-bold">Statement:</span> {bet.statement}</div>
            <div>
              <span className="font-bold">Feasible?</span>{" "}
              <span className={bet.feasible === "yes" ? "text-green-600 font-semibold" : "text-red-500"}>
                {bet.feasible}
              </span>
            </div>
            <div>
              <span className="font-bold">Confidence:</span>{" "}
              <span className="font-mono text-blue-700 dark:text-blue-300">{bet.confidence}%</span>
            </div>
            {bet.verificationUrl && (
              <div>
                <span className="font-bold">Verification URL:</span>{" "}
                <a href={bet.verificationUrl} className="underline text-blue-600" target="_blank" rel="noopener noreferrer">
                  {bet.verificationUrl}
                </a>
              </div>
            )}
            <button
              className="mt-3 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-xl"
              onClick={handleCreate}
              disabled={bet.feasible !== "yes"}
            >
              {bet.feasible === "yes" ? "Create Bet with This Statement" : "Not Feasible"}
            </button>
            {bet.feasible !== "yes" && (
              <div className="text-xs text-gray-400 mt-2">
                Only feasible bets can be created.
              </div>
            )}
          </div>
        )}

        {/* Show CreatePalModal with prefilled values if user proceeds */}
        {showCreateModal && (
          <CreatePalModal
            open={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            initialValues={{
              statement: bet.statement,
              confidence: bet.confidence,
              verificationUrl: bet.verificationUrl,
            }}
            onCreated={() => {
              setShowCreateModal(false);
              onClose();
            }}
          />
        )}
      </motion.div>
    </div>
  );
}
