import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const COLORS = [
  "#a21caf", // fuchsia
  "#f59e42", // orange
  "#fde047", // yellow
  "#2563eb", // blue
  "#10b981", // green
  "#e11d48", // pink/red
];
const DOTS_MAX = 25;
const DOT_SIZE = 12;
const RADIUS = 36;
const SEG_THICKNESS = 18;
const CENTER = 50;

export default function AnimatedFriendshipRing({ className = "" }) {
  const [phase, setPhase] = useState<"spin" | "explode" | "ring">("spin");
  const [dotCount, setDotCount] = useState(1);
  const [spinSpeed, setSpinSpeed] = useState(0);

  // --- PHASE 1: SPIN + build up dots ---
  useEffect(() => {
    if (phase !== "spin") return;
    if (dotCount < DOTS_MAX) {
      const t = setTimeout(() => {
        setDotCount(d => d + 1);
        setSpinSpeed(s => s + 0.14);
      }, 80);
      return () => clearTimeout(t);
    }
    // Move to explode after brief pause
    if (dotCount === DOTS_MAX) {
      setTimeout(() => setPhase("explode"), 700);
    }
  }, [dotCount, phase]);

  // --- PHASE 2: EXPLODE OUT ---
  useEffect(() => {
    if (phase !== "explode") return;
    const t = setTimeout(() => setPhase("ring"), 950);
    return () => clearTimeout(t);
  }, [phase]);

  // --- ANIMATION: SPIN (continuous for phase 1) ---
  const [spinAngle, setSpinAngle] = useState(0);
  useEffect(() => {
    if (phase !== "spin") return;
    let frame: number;
    const animate = () => {
      setSpinAngle(a => (a + 1.3 + spinSpeed) % 360);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line
  }, [phase, spinSpeed]);

  // --- RENDER ---
  return (
    <svg
      className={className}
      style={{ width: 110, height: 110, display: "block", zIndex: -10 }}
      viewBox="0 0 100 100"
    >
      {/* --- Dots, spinning --- */}
      <AnimatePresence>
        {phase === "spin" &&
          [...Array(dotCount)].map((_, i) => {
            const angle = ((360 / dotCount) * i + spinAngle) * (Math.PI / 180);
            const x = CENTER + RADIUS * Math.cos(angle);
            const y = CENTER + RADIUS * Math.sin(angle);
            return (
              <motion.circle
                key={i}
                cx={x}
                cy={y}
                r={DOT_SIZE / 2}
                fill={COLORS[i % COLORS.length]}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: 1.25,
                  opacity: 1,
                  transition: { delay: i * 0.03, duration: 0.3 }
                }}
                exit={{
                  scale: 1.3,
                  opacity: 0,
                  transition: { duration: 0.25, delay: i * 0.015 }
                }}
              />
            );
          })}
      </AnimatePresence>
      {/* --- Dots explode out --- */}
      <AnimatePresence>
        {phase === "explode" &&
          [...Array(DOTS_MAX)].map((_, i) => {
            const angle = ((360 / DOTS_MAX) * i + spinAngle) * (Math.PI / 180);
            const x = CENTER + (RADIUS + 17) * Math.cos(angle);
            const y = CENTER + (RADIUS + 17) * Math.sin(angle);
            return (
              <motion.circle
                key={i}
                cx={x}
                cy={y}
                r={DOT_SIZE / 2 + 1}
                fill={COLORS[i % COLORS.length]}
                initial={{ scale: 1.1, opacity: 1 }}
                animate={{
                  scale: [1.3, 1.5, 0.7],
                  opacity: [1, 0.7, 0],
                  transition: { delay: i * 0.012, duration: 0.67 }
                }}
                exit={{ opacity: 0, scale: 0.6 }}
              />
            );
          })}
      </AnimatePresence>
      {/* --- Segmented Ring --- */}
      <AnimatePresence>
        {phase === "ring" &&
          [...Array(COLORS.length)].map((_, i) => {
            const startAngle = (360 / COLORS.length) * i;
            const endAngle = startAngle + 360 / COLORS.length - 2; // little gap
            const largeArc = endAngle - startAngle > 180 ? 1 : 0;

            // Convert polar to cartesian
            const polar = (angle: number, r: number) => [
              CENTER + r * Math.cos((angle - 90) * (Math.PI / 180)),
              CENTER + r * Math.sin((angle - 90) * (Math.PI / 180)),
            ];

            const [x1, y1] = polar(startAngle, RADIUS + SEG_THICKNESS / 2);
            const [x2, y2] = polar(endAngle, RADIUS + SEG_THICKNESS / 2);
            const [ix1, iy1] = polar(startAngle, RADIUS - SEG_THICKNESS / 2);
            const [ix2, iy2] = polar(endAngle, RADIUS - SEG_THICKNESS / 2);

            // Create arc path (annular sector)
            const d = [
              `M ${x1} ${y1}`,
              `A ${RADIUS + SEG_THICKNESS / 2} ${RADIUS + SEG_THICKNESS / 2} 0 ${largeArc} 1 ${x2} ${y2}`,
              `L ${ix2} ${iy2}`,
              `A ${RADIUS - SEG_THICKNESS / 2} ${RADIUS - SEG_THICKNESS / 2} 0 ${largeArc} 0 ${ix1} ${iy1}`,
              "Z",
            ].join(" ");

            return (
              <motion.path
                key={i}
                d={d}
                fill={COLORS[i]}
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{
                  opacity: 1,
                  scale: [1.09, 1],
                  filter: "drop-shadow(0 0 6px #fde04788)",
                }}
                transition={{
                  delay: 0.3 + i * 0.12,
                  duration: 0.6,
                  type: "spring",
                }}
                exit={{ opacity: 0, scale: 0.7 }}
              />
            );
          })}
      </AnimatePresence>
      {/* Optional: subtle glowing ring, only in ring phase */}
      <AnimatePresence>
        {phase === "ring" && (
          <motion.circle
            key="glow"
            cx={CENTER}
            cy={CENTER}
            r={RADIUS + SEG_THICKNESS / 2 + 4}
            fill="none"
            stroke="#fde047"
            strokeWidth="3"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              transition: {
                repeat: Infinity,
                duration: 2,
                repeatType: "reverse",
              },
            }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>
    </svg>
  );
}
