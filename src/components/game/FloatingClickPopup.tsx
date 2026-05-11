import { motion } from "framer-motion";
import { formatBigNumber } from "../../utils/formatNumber";

export type FloatingPopupItem = {
  id: string;
  amount: number;
  offsetX: number;
};

type FloatingClickPopupProps = {
  item: FloatingPopupItem;
};

/**
 * Floating "+N" bubble over the 3D stage (Framer Motion).
 */
export function FloatingClickPopup({ item }: FloatingClickPopupProps) {
  const text = `+${formatBigNumber(item.amount)}`;

  return (
    <motion.span
      className="pointer-events-none absolute left-1/2 top-[32%] z-10 -translate-x-1/2 rounded-full border border-white/20 bg-surface-card/75 px-4 py-2 font-numbers text-xl tabular-nums tracking-tight text-royal-glow shadow-[0_8px_32px_rgba(45,74,203,0.35)] backdrop-blur-md ring-1 ring-royal/30 sm:text-2xl"
      style={{ marginLeft: item.offsetX }}
      initial={{ opacity: 0, y: 16, scale: 0.65 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -100, scale: 1.12 }}
      transition={{ duration: 0.88, ease: [0.16, 1, 0.3, 1] }}
    >
      {text}
    </motion.span>
  );
}
