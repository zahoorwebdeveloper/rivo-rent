"use client";

import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

export default function ChatMessages({ messages }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8FAF7] p-4">

      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          role={msg.role}
          message={msg.text}
          time={msg.time}
        />
      ))}

      <div ref={bottomRef} />

    </div>
  );
}