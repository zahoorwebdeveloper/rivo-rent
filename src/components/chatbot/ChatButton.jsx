"use client";

import { motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";

export default function ChatButton({ isOpen, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
      className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-[9999]"
    >
      {/* Pulse Ring */}
      {!isOpen && (
        <>
          <span className="absolute inset-0 rounded-full bg-[#658C58]/25 animate-ping"></span>
          <span className="absolute inset-0 rounded-full bg-[#658C58]/15 scale-125 animate-pulse"></span>
        </>
      )}

      {/* Main Button */}
      <div
        className={`relative h-16 w-16 rounded-full bg-gradient-to-br from-[#7AA16D] to-[#658C58] shadow-[0_10px_35px_rgba(101,140,88,.45)] border-4 border-white flex items-center justify-center text-white transition-all duration-300 hover:shadow-[0_12px_45px_rgba(101,140,88,.6)]
      `}
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </div>

      {/* Online Dot */}
      {!isOpen && (
        <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-white"></span>
      )}
    </motion.button>
  );
}
