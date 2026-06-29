"use client";

import { motion } from "framer-motion";

import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

export default function ChatWindow({
  onClose,
  messages,
  setMessages,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ duration: 0.25 }}
      className="
        fixed
        z-[9999]

        bottom-20
        right-4

        w-[calc(100vw-32px)]
        max-w-[380px]

        h-[70vh]
        max-h-[560px]
        min-h-[420px]

        sm:right-6
      "
    >
      <div className="flex h-full w-full flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,.18)]">

        <ChatHeader onClose={onClose} />

        <ChatMessages messages={messages} />

        <ChatInput
          messages={messages}
          setMessages={setMessages}
        />

      </div>
    </motion.div>
  );
}