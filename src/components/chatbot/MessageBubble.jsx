"use client";

import { Bot, User } from "lucide-react";

export default function MessageBubble({
  role,
  message,
  time,
}) {
  const isUser = role === "user";

  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      } mb-3`}
    >
      <div
        className={`flex items-end gap-2 max-w-[85%] ${
          isUser ? "flex-row-reverse" : ""
        }`}
      >
        {/* Avatar */}
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
            isUser
              ? "bg-[#658C58] text-white"
              : "bg-gray-100 text-[#658C58]"
          }`}
        >
          {isUser ? (
            <User size={15} />
          ) : (
            <Bot size={15} />
          )}
        </div>

        {/* Bubble */}
        <div
          className={`px-3 py-2 rounded-2xl shadow-sm ${
            isUser
              ? "bg-[#658C58] text-white rounded-br-md"
              : "bg-white border border-gray-200 rounded-bl-md"
          }`}
        >
          <p className="text-sm leading-5 whitespace-pre-wrap">
            {message}
          </p>

          <p
            className={`text-[10px] mt-1 ${
              isUser
                ? "text-green-100"
                : "text-gray-400"
            }`}
          >
            {time}
          </p>
        </div>
      </div>
    </div>
  );
}