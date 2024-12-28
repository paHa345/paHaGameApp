"use client";
import { motion } from "framer-motion";

export default function TransitionTemplate({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ y: 0, opacity: 0, scale: 0 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ type: "spring", duration: 1 }}
    >
      {children}
    </motion.div>
  );
}
