"use client";
import { useEffect, useState } from "react";
import { Copy, Share2, X, MessageCircle } from "lucide-react";

export default function SharePalButton({ pal }: { pal: any }) {
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") setOrigin(window.location.origin);
  }, []);

  const shareUrl = `${origin}/?pal=${pal.publicKey}`;
  const xShare = `https://x.com/intent/tweet?text=Join%20my%20pal%20(bet)%20on%20Palsphere%3A%20%22${encodeURIComponent(
    pal.statement
  )}%22%0A${encodeURIComponent(shareUrl)}`;
  const waShare = `https://wa.me/?text=Join%20my%20pal%20(bet)%20on%20Palsphere%3A%20%22${encodeURIComponent(
    pal.statement
  )}%22%0A${encodeURIComponent(shareUrl)}`;

  return (
    <div className="flex gap-3 mt-4 items-center w-full">
      <button
        className={`px-3 py-2 rounded-full bg-gradient-to-tr from-gray-100 via-blue-50 to-amber-100 text-fuchsia-700 shadow hover:bg-yellow-100 transition-all flex items-center gap-2 text-xs font-semibold`}
        onClick={async () => {
          await navigator.clipboard.writeText(shareUrl);
          setCopied(true);
          setTimeout(() => setCopied(false), 1000);
        }}
        title="Copy link"
      >
        <Copy className="w-4 h-4" /> {copied ? "Copied!" : "Copy"}
      </button>
      <a
        className="px-3 py-2 rounded-full bg-blue-500 text-white shadow hover:bg-blue-600 transition-all flex items-center gap-2 text-xs font-semibold"
        href={xShare}
        target="_blank"
        rel="noopener noreferrer"
        title="Share on X"
      >
        <X className="w-4 h-4" /> X
      </a>
      <a
        className="px-3 py-2 rounded-full bg-green-500 text-white shadow hover:bg-green-600 transition-all flex items-center gap-2 text-xs font-semibold"
        href={waShare}
        target="_blank"
        rel="noopener noreferrer"
        title="Share on WhatsApp"
      >
        <MessageCircle className="w-4 h-4" /> WhatsApp
      </a>
      <span className="ml-2 text-xs text-gray-400">Share</span>
    </div>
  );
}
