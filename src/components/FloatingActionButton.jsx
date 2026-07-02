// components/FloatingActionButton.jsx
"use client";

import { useState } from "react";

const FloatingActionButton = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  const handleHover = (item) => {
    setHoveredItem(item);
  };

  const handleLeave = () => {
    setHoveredItem(null);
  };

  const menuItems = [
    {
      id: "email",
      label: "Email Us",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      onClick: () => {
        window.location.href =
          "mailto:Support@Rivo.Rent";
      },
    },
    {
      id: "whatsapp",
      label: "WhatsApp",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
      onClick: () =>
        window.open(
          "https://wa.me/16467454567?text=Rivo%20Rent%20Website%20:",
          "_blank"
        ),
    },
    {
      id: "call",
      label: "Call Us",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      ),
      onClick: () => (window.location.href = "tel:+18455769038"),
    },
  ];

  return (
    <div
      className="fixed bottom-25 right-4 w-16 h-16 md:w-20 md:h-20 flex justify-center items-center bg-transparent cursor-pointer z-50"
      onClick={() => setShowMenu(!showMenu)}
    >
      {/* Pulsing Rings */}
      {/* <div className="absolute ring ring-1 animate-pulse-slow"></div>
      <div className="absolute ring ring-2 animate-pulse-slow"></div>
      <div className="absolute ring ring-3 animate-pulse-slow"></div> */}

      {/* Main Button */}
      <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#658C58] text-white flex justify-center items-center z-10 hover:scale-110 transition-transform duration-200">
        <svg
          className="w-6 h-6 md:w-7 md:h-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      </div>

      {/* Drop-up Menu */}
      {showMenu && (
        <div className="absolute bottom-full right-0 mb-4 bg-none rounded-lg flex flex-col items-end z-40 min-w-[280px] md:min-w-[320px] py-2">
          {menuItems.map((item, index) => (
            <div
              key={item.id}
              className="flex flex-row-reverse items-center gap-3 px-4 py-3 cursor-pointer relative group hover:bg-white/10 rounded-lg transition-colors duration-200"
              onClick={item.onClick}
              onMouseEnter={() => handleHover(item.id)}
              onMouseLeave={handleLeave}
            >
              {/* Icon Circle */}
              <div className="bg-[#658C58] rounded-full p-2 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 group-hover:scale-110 transition-transform duration-200">
                {item.icon}
              </div>

              {/* Label - Show on hover for all devices */}
              <div className="flex-1 flex justify-end">
                <span className="font-medium text-[#658C58] bg-white px-3 py-2 rounded-lg text-sm md:text-base whitespace-nowrap shadow-lg border border-gray-200">
                  {item.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FloatingActionButton;
