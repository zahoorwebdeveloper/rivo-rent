"use client";

import { X, Bot } from "lucide-react";

export default function ChatHeader({ onClose }) {
  return (
    <div className="relative bg-gradient-to-r from-[#658C58] to-[#7AA16D] px-5 py-3 text-white">

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full p-2 hover:bg-white/20 transition"
      >
        <X size={20} />
      </button>

      <div className="flex items-center gap-4">

        {/* Avatar */}
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 backdrop-blur">
          <Bot size={20} />
        </div>

        {/* Title */}
        <div>
          <h2 className="text-base font-semibold">
            Assistant
          </h2>

          <div className="mt-1 flex items-center gap-2">

            <span className="h-2.5 w-2.5 rounded-full bg-green-300 animate-pulse"></span>

            <span className="text-sm text-white/90">
              Online
            </span>

          </div>
        </div>

      </div>

      {/* Bottom Decoration */}
      <div className="absolute bottom-0 left-0 h-[1px] w-full bg-white/15"></div>
    </div>
  );
}