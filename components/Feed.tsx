"use client";
import ClaimWinningsButton from "./ClaimWinningsButton";
import ClientDate from "./ClientDate";
import { motion } from "framer-motion";
import { X, MessageCircle, Link2 } from "lucide-react";
import { useEffect, useState } from "react";

interface FeedProps {
  pals: any[];
  loading: boolean;
  onCreatePal: () => void;
  onJoinPal: (pal: any) => void;
  onResolvePal: (pal: any) => void;
}

const PROFILE_IMG = "/dog.jpg";
const PROFILE_IMG_SIZE = 44;
const PAL_IMG = "/dog2.jpg";
const PAL_IMG_SIZE = 210;
const BUTTON_CLASSES =
  "flex-1 min-w-[120px] h-11 px-4 rounded-xl font-bold shadow-md text-sm flex items-center justify-center transition-all focus:outline-none";

function safeText(val: any) {
  if (val == null) return "";
  if (typeof val === "string" || typeof val === "number") return val;
  try {
    return JSON.stringify(val);
  } catch {
    return String(val);
  }
}

export default function Feed({
  pals,
  loading,
  onCreatePal,
  onJoinPal,
  onResolvePal,
}: FeedProps) {
  // Show up to the first 3 pals, if any:
  const topPals = pals?.slice(0, 3) || [];

  return (
    <div className="w-full flex flex-col gap-10 px-4 md:px-40">
      {/* Header */}
      <div className="flex justify-between items-center mb-3"></div>

      {!loading && (!topPals.length) && (
        <div className="text-gray-400 text-center font-semibold py-16 text-xl">
          No pals found yet.<br />Start the fun—create one!
        </div>
      )}

      <div className="flex flex-col gap-10">
        {topPals.map((pal, idx) => (
          <motion.div
            key={safeText(pal.publicKey) + idx}
            initial={{ opacity: 0, y: 36 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { delay: 0, type: "spring", stiffness: 120 }
            }}
            whileHover={{
              scale: 1.012,
              boxShadow:
                "0 4px 32px 0 rgba(233,64,155,0.13),0 2px 8px 0 rgba(0,0,0,0.09)"
            }}
            className="relative rounded-3xl bg-gradient-to-tr from-blue-50 via-yellow-50 to-pink-50 dark:from-[#232347] dark:to-[#1b2337] shadow-2xl border border-fuchsia-100 dark:border-fuchsia-900 hover:ring-2 hover:ring-pink-300/30 transition-all duration-300 backdrop-blur-xl p-18"
          >
            {/* --- 1st row: Info + Image --- */}
            <div className="flex flex-row min-h-[220px]">
              {/* Left: 2/3, Info */}
              <div className="flex flex-col flex-1 pl-8 pr-6 py-7 justify-between min-w-0">
                {/* Profile row */}
                <div className="flex items-center gap-3 mb-1">
                  <img
                    src={PROFILE_IMG}
                    alt="User"
                    width={PROFILE_IMG_SIZE}
                    height={PROFILE_IMG_SIZE}
                    className="rounded-full object-cover bg-white border-2 border-fuchsia-100"
                    style={{
                      width: PROFILE_IMG_SIZE,
                      height: PROFILE_IMG_SIZE,
                      minWidth: PROFILE_IMG_SIZE,
                      minHeight: PROFILE_IMG_SIZE
                    }}
                  />
                  <span className="font-mono text-xs text-gray-600 dark:text-fuchsia-100">
                    {safeText(pal.creator).toString().slice(0, 8)}...
                  </span>
                  <span className={`text-xs px-3 py-1 rounded-full ml-2 font-semibold bg-gradient-to-r from-pink-100 via-yellow-100 to-blue-100 text-fuchsia-700 dark:bg-gradient-to-r dark:from-fuchsia-900 dark:to-blue-900 dark:text-yellow-200`}>
                    {safeText(pal.status)}
                  </span>
                </div>
                {/* Statement */}
                <div className="font-extrabold text-2xl md:text-3xl text-gray-900 dark:text-yellow-100 break-words mb-2 leading-snug">
                  {safeText(pal.statement)}
                </div>
                {/* Details */}
                <div className="flex flex-col gap-1 text-xs text-gray-700 dark:text-gray-200 font-mono mb-2 pl-1">
                  <span>
                    <span className="font-semibold">Stake:</span>{" "}
                    <span className="text-fuchsia-700 dark:text-fuchsia-200">{safeText(pal.stake_amount)}</span>{" "}
                    lamports
                  </span>
                  <span>
                    <span className="font-semibold">Confidence:</span>{" "}
                    <span className="text-blue-700 dark:text-blue-200">{safeText(pal.confidence_score)}%</span>
                  </span>
                  <span>
                    <span className="font-semibold">Deadline:</span>{" "}
                    {pal.deadline ? <ClientDate timestamp={pal.deadline} /> : "N/A"}
                  </span>
                </div>
              </div>
              {/* Right: 1/3, Pal Image */}
              <div
                className="flex items-center justify-center bg-gradient-to-tr from-blue-200 via-pink-100 to-yellow-100 rounded-r-3xl overflow-hidden"
                style={{ width: PAL_IMG_SIZE + 30, minWidth: PAL_IMG_SIZE + 30, maxWidth: PAL_IMG_SIZE + 30 }}
              >
                <img
                  src={PAL_IMG}
                  alt="Pal"
                  width={PAL_IMG_SIZE}
                  height={PAL_IMG_SIZE}
                  className="object-cover rounded-2xl shadow-md border-2 border-fuchsia-100"
                  style={{
                    width: PAL_IMG_SIZE,
                    height: PAL_IMG_SIZE,
                    minWidth: PAL_IMG_SIZE,
                    minHeight: PAL_IMG_SIZE,
                    background: "#e0e7ff"
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://placehold.co/210x210/png";
                  }}
                />
              </div>
            </div>
            {/* --- 2nd row: Share + Actions --- */}
            <div className="w-full flex flex-col gap-3 py-4 px-8">
              {/* Row 1: Verification link, X, WhatsApp */}
              <div className="flex items-center justify-between gap-3">
                <VerificationAndShare pal={pal} />
              </div>
              <div className="flex gap-3 mt-5 flex-wrap w-full justify-between">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  whileHover={{ scale: 1.08 }}
                  className={`bg-gradient-to-tr from-green-400 to-emerald-500 text-white ${BUTTON_CLASSES}`}
                  onClick={() => onJoinPal(pal)}
                >
                  Join
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  whileHover={{ scale: 1.08 }}
                  className={`bg-gradient-to-tr from-purple-500 to-fuchsia-500 text-white ${BUTTON_CLASSES}`}
                  onClick={() => onResolvePal(pal)}
                >
                  Resolve
                </motion.button>
                <button
                  className={`bg-gradient-to-tr from-yellow-300 to-yellow-400 text-fuchsia-900 ${BUTTON_CLASSES}`}
                >
                  Claim
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ---- SHARE/VERIFICATION: evenly distributed, icons only ----
function VerificationAndShare({ pal }: { pal: any }) {
  const [origin, setOrigin] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") setOrigin(window.location.origin);
  }, []);
  const shareUrl = `${origin}/?pal=${safeText(pal.publicKey)}`;
  const xShare = `https://x.com/intent/tweet?text=Join%20my%20pal%20(bet)%20on%20Palsphere%3A%20%22${encodeURIComponent(
    safeText(pal.statement)
  )}%22%0A${encodeURIComponent(shareUrl)}`;
  const waShare = `https://wa.me/?text=Join%20my%20pal%20(bet)%20on%20Palsphere%3A%20%22${encodeURIComponent(
    safeText(pal.statement)
  )}%22%0A${encodeURIComponent(shareUrl)}`;

  const iconBtn =
    "flex-1 flex justify-center items-center px-3 py-2 min-w-[100px] max-w-[140px] rounded-lg font-bold text-xs transition-all gap-2";

  return (
    <div className="flex w-full justify-between gap-3">
      <a
        className={iconBtn + " bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 hover:bg-blue-200"}
        href={pal.verification_url}
        target="_blank"
        rel="noopener noreferrer"
        title="Verification Source"
      >
        <Link2 className="w-5 h-5 mr-1" /> Source
      </a>
      <a
        className={iconBtn + " bg-blue-500 text-white hover:bg-blue-600"}
        href={xShare}
        target="_blank"
        rel="noopener noreferrer"
        title="Share on X"
      >
        <X className="w-5 h-5 mr-1" /> X
      </a>
      <a
        className={iconBtn + " bg-green-500 text-white hover:bg-green-600"}
        href={waShare}
        target="_blank"
        rel="noopener noreferrer"
        title="Share on WhatsApp"
      >
        <MessageCircle className="w-5 h-5 mr-1" /> WhatsApp
      </a>
    </div>
  );
}
