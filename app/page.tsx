"use client";
import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import TopBar from "../components/TopBar";
import StoryBar from "../components/StoryBar";
import Feed from "../components/Feed";
import RightBar from "../components/RightBar";
import BottomNav from "../components/BottomNav";
import CreatePalModal from "../components/CreatePalModal";
import JoinPalModal from "../components/JoinPalModal";
import ResolvePalModal from "../components/ResolvePalModal";
import { usePals } from "../utils/usePals";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import CenteredModal from "@/components/CenteredModal";

// SSR safe wallet button for fallback in mobile menu
const WalletMultiButton = dynamic(
  async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

// Example pals for demo/empty state
const DUMMY_PALS = [
  {
    publicKey: "EXAMPL1234567",
    creator: "Fakeman11111111",
    status: "Active",
    statement: "MIT will require GRE scores for CS PhD in Fall 2026.",
    stake_amount: 10000000,
    confidence_score: 93,
    deadline: Math.floor(Date.now() / 1000) + 60000,
    verification_url: "https://www.csail.mit.edu/admissions",
    participants: [],
  },
];

export default function Home() {
  const { pals, loading } = usePals();

  // Show demo pals if none on-chain yet
  const allPals = useMemo(
    () =>
      (pals?.length ? pals : []).concat(
        (!pals || pals.length === 0) ? DUMMY_PALS : []
      ),
    [pals]
  );

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [selectedPal, setSelectedPal] = useState<any>(null);
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [palToResolve, setPalToResolve] = useState<any>(null);

  // Animation variants
  const pageVariants = {
    hidden: { opacity: 0, y: 24 },
    enter: { opacity: 1, y: 0, transition: { type: "spring", duration: 0.6 } },
    exit: { opacity: 0, y: 20, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="enter"
      exit="exit"
      className="relative min-h-screen w-full
        bg-gradient-to-br from-blue-300 via-fuchsia-100 via-70% to-amber-200
        dark:from-[#151e39] dark:via-[#18123c] dark:to-[#2a253e]
        transition-colors duration-700"
      style={{ fontFamily: "var(--font-geist-sans), Arial, sans-serif" }}
    >
      {/* TopBar with logo etc */}
      <TopBar />

      {/* Story Bar, colored and lively */}
      <StoryBar pals={allPals} />

      {/* Main Layout Grid */}
      <div className="flex w-full max-w-12xl mx-auto px-1 lg:px-3 gap-6 min-h-[70vh] pt-4 pb-20">
      {/* Feed */}
        <main className="flex-1 max-w-2xl lg:max-w-4xl mx-auto z-10">
        {/* Empty state art */}
          {!loading && !pals?.length && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.15 } }}
              className="flex flex-col items-center mt-14 mb-10"
            >
              <Sparkles className="w-14 h-14 text-fuchsia-500 animate-bounce mb-4 drop-shadow-xl" />
              <div className="text-3xl font-extrabold text-center text-fuchsia-800 dark:text-yellow-100 mb-2 tracking-tight drop-shadow-lg">
                Welcome to <span className="text-yellow-400">Palsphere!</span>
              </div>
              <div className="text-lg text-gray-700 dark:text-fuchsia-100 mb-4 text-center max-w-sm">
                Make a <span className="font-semibold text-fuchsia-500">Pal</span>—bet, challenge, or prediction, all on chain, all social, all fun.
              </div>
              <motion.button
                whileTap={{ scale: 0.96 }}
                whileHover={{ scale: 1.07, boxShadow: "0 4px 28px #f472b6" }}
                className="bg-gradient-to-r from-fuchsia-500 via-orange-400 to-yellow-300 text-white px-8 py-4 font-extrabold text-lg rounded-xl shadow-2xl shadow-pink-200/30 transition-all hover:brightness-110 active:brightness-90 mb-6 animate-pulse"
                onClick={() => setModalOpen(true)}
              >
                + Create Your First Pal
              </motion.button>
              <div className="text-xs text-gray-400 mt-2">
                <span className="animate-pulse">Or see some live examples below!</span>
              </div>
            </motion.div>
          )}
          <Feed
            pals={allPals}
            loading={loading}
            onCreatePal={() => setModalOpen(true)}
            onJoinPal={pal => {
              setSelectedPal(pal);
              setJoinModalOpen(true);
            }}
            onResolvePal={pal => {
              setPalToResolve(pal);
              setResolveModalOpen(true);
            }}
          />
        </main>
        {/* RightBar (hidden on mobile) */}
        <aside className="w-80 hidden lg:block z-0">
          <RightBar />
        </aside>
      </div>

      {/* Bottom Navigation */}
      <BottomNav onCreatePal={() => setModalOpen(true)} />

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            key="create-pal-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md"
          >
            <CenteredModal>
              <CreatePalModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onCreated={() => window.location.reload()}
              />
            </CenteredModal>
          </motion.div>
        )}
        {joinModalOpen && (
          <motion.div
            key={selectedPal?.publicKey ? `join-pal-modal-${selectedPal.publicKey}` : "join-pal-modal"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md"
          >
            <CenteredModal>
              <JoinPalModal
                open={joinModalOpen}
                pal={selectedPal}
                onClose={() => setJoinModalOpen(false)}
                onJoined={() => window.location.reload()}
              />
            </CenteredModal>
          </motion.div>
        )}
        {resolveModalOpen && (
          <motion.div
            key={palToResolve?.publicKey ? `resolve-pal-modal-${palToResolve.publicKey}` : "resolve-pal-modal"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md"
          >
            <CenteredModal>
              <ResolvePalModal
                open={resolveModalOpen}
                pal={palToResolve}
                onClose={() => setResolveModalOpen(false)}
                onResolved={() => window.location.reload()}
              />
            </CenteredModal>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
