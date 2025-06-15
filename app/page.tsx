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
import AnimatedDonutWithDots from "@/components/AnimatedDonutWithDots";
import GptBetGeneratorModal from "@/components/GptBetGeneratorModal";

// SSR safe wallet button for fallback in mobile menu
const WalletMultiButton = dynamic(
  async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

// Example pals for demo/empty state
const DUMMY_PALS = [
  {
    publicKey: "EXAMPL1234567",
    creator: "Aaron",
    status: "Active",
    statement: "MIT will require GRE scores for CS PhD in Fall 2026.",
    stake_amount: 10000000,
    confidence_score: 93,
    deadline: Math.floor(Date.now() / 1000) + 60000,
    verification_url: "https://www.csail.mit.edu/admissions",
    participants: [],
  },
  {
    publicKey: "EXAMPL1234568",
    creator: "Raahan",
    status: "Active",
    statement: "Stanford will remove the GRE for PhD admissions in 2027.",
    stake_amount: 8000000,
    confidence_score: 85,
    deadline: Math.floor(Date.now() / 1000) + (10 * 24 * 60 * 60),
    verification_url: "https://cs.stanford.edu/admissions",
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
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [selectedPal, setSelectedPal] = useState<any>(null);
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [palToResolve, setPalToResolve] = useState<any>(null);

  // For AI/GPT+Create modals
  const [gptModalOpen, setGptModalOpen] = useState(false);
  const [gptInitialValues, setGptInitialValues] = useState(null);
  const [createFromGptOpen, setCreateFromGptOpen] = useState(false);

  // Animation variants
  const pageVariants = {
    hidden: { opacity: 0, y: 24 },
    enter: { opacity: 1, y: 0, transition: { type: "spring", duration: 0.6 } },
    exit: { opacity: 0, y: 20, transition: { duration: 0.3 } },
  };

  // This opens both GPT modal and stacked CreatePalModal immediately

  function handleOpenGptAndCreate() {
    setGptInitialValues(null);
    setGptModalOpen(true);
    setCreateFromGptOpen(true);
  }

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

      {/* Animated donut, above everything if you want */}
      {/* <AnimatedDonutWithDots className="fixed top-16 left-1/2 -translate-x-1/2 z-0" /> */}

      {/* Main Layout Grid */}
      <div className="flex w-full max-w-10xl mx-auto px-1 lg:px-3 gap-6 min-h-[70vh] pt-4 pb-20">
        {/* Feed */}
        <main className="flex-1 max-w-2xl lg:max-w-4xl mx-auto z-10">
          {/* Empty state art */}
          {!loading && !pals?.length && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.15 } }}
              className="flex flex-col items-center mt-14 mb-10"
            >
              {/* Donut + Sparkle stack */}
              <div className="relative flex items-center justify-center mb-10" style={{ width: 80, height: 80 }}>
                {/* Animated Donut (background) */}
                <AnimatedDonutWithDots className="absolute inset-0 w-[90px] h-[100px] -z-10" />
                {/* Sparkles (foreground) */}
              </div>

              <div className="text-3xl font-extrabold text-center text-fuchsia-800 dark:text-yellow-100 mb-4 tracking-tight drop-shadow-lg">
                Welcome to <span className="text-yellow-400">Pal.Fun!</span>
              </div>
              <div className="text-lg text-gray-700 dark:text-fuchsia-100 mb-4 text-center max-w-sm">
                Make a <span className="font-semibold text-fuchsia-500">Pal</span>—bet, challenge, or prediction, all on Chain, all Social, all Fun.
              </div>
              {/* 
                Replace previous create button with new one that opens both modals 
                (You can change the text if you want)
              */}
              <motion.button
                whileTap={{ scale: 0.96 }}
                whileHover={{ scale: 1.07, boxShadow: "0 4px 28px #f472b6" }}
                className="bg-gradient-to-r from-fuchsia-500 via-orange-400 to-yellow-300 text-white px-8 py-4 font-extrabold text-lg rounded-xl shadow-2xl shadow-pink-200/30 transition-all hover:brightness-110 active:brightness-90 mb-6 animate-pulse"
                onClick={handleOpenGptAndCreate}
              >
                + Create Your First Bet (AI)
              </motion.button>
              <div className="text-xs text-gray-400 mt-2">
                <span className="animate-pulse">Or see some live examples below!</span>
              </div>
            </motion.div>
          )}
          <Feed
            pals={allPals}
            loading={loading}
            onCreatePal={handleOpenGptAndCreate}
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
      <BottomNav onCreatePal={handleOpenGptAndCreate} />

      <AnimatePresence>
  {/* Combined GPT+Create Modal */}
  {(gptModalOpen || createFromGptOpen) && (
    <motion.div
      key="gpt-create-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-md"
    >
      <CenteredModal>
        <div
          className="w-full max-w-3xl flex flex-col md:flex-row gap-6 p-2"
          style={{
            minHeight: 520,
            alignItems: "stretch"
          }}
        >
          {/* GPT generator on left/top */}
          <div className="flex-1 min-w-[300px]">
            <GptBetGeneratorModal
              open={gptModalOpen}
              onClose={() => {
                setGptModalOpen(false);
                // Optionally: close create as well if user closes GPT
                setCreateFromGptOpen(false);
              }}
              onGenerated={values => {
                setGptInitialValues(values);
                // Optionally: focus/scroll the create side
              }}
            />
          </div>
          {/* Create Pal on right/bottom */}
          <div className="flex-1 min-w-[320px]">
            <CreatePalModal
              open={createFromGptOpen}
              initialValues={gptInitialValues || {}}
              onClose={() => {
                setCreateFromGptOpen(false);
                setGptModalOpen(false);
              }}
              onCreated={() => {
                setCreateFromGptOpen(false);
                setGptModalOpen(false);
                window.location.reload();
              }}
            />
          </div>
        </div>
      </CenteredModal>
    </motion.div>
  )}

  {/* ...rest of your other modals (Join, Resolve)... */}
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
