"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";

import ChatButton from "./ChatButton";
import ChatWindow from "./ChatWindow";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: Date.now(),
      role: "assistant",
      text: `👋 Welcome to Rivo.Rent!

I'm your virtual assistant.

How can I help you today?`,
      time: "Now",
    },
  ]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <ChatWindow
            messages={messages}
            setMessages={setMessages}
            onClose={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <ChatButton
        isOpen={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      />
    </>
  );
}