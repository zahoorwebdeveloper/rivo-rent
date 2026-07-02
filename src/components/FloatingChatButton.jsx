"use client";

export default function FloatingChatButton() {
  const openChat = () => {
    if (typeof window !== "undefined") {
      // Open Botpress chat
      window.botpress?.open?.();

      // Fallback
      const launcher = document.querySelector(
        '[data-botpress-webchat="launcher"]'
      );

      if (launcher) {
        launcher.click();
      }
    }
  };

  return (
    <button
      onClick={openChat}
      className="fixed bottom-25 right-6 z-50 w-16 h-16 rounded-full bg-[#658C58] shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center"
    >
      <svg
        className="w-7 h-7 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 10h.01M12 10h.01M16 10h.01M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z"
        />
      </svg>
    </button>
  );
}