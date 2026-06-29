"use client";

import { useState } from "react";
import { SendHorizontal } from "lucide-react";

export default function ChatInput({
  messages,
  setMessages,
}) {
  const [text, setText] = useState("");

  const sendMessage = () => {
    if (!text.trim()) return;

    const newMessage = {
      id: Date.now(),
      role: "user",
      text,
      time: "Now",
    };

    setMessages([...messages, newMessage]);

    setText("");
  };

  return (
    <div className="border-t bg-white p-4">

      <div className="flex gap-3">

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
          placeholder="Type your message..."
          className="flex-1 rounded-full border border-gray-300 px-4 py-2.5 outline-none focus:border-[#658C58]"
        />

        <button
          onClick={sendMessage}
          className="w-10 h-10 rounded-full bg-[#658C58] text-white flex justify-center items-center hover:scale-105 transition"
        >
          <SendHorizontal size={20} />
        </button>

      </div>

    </div>
  );
}