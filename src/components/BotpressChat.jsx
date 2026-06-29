"use client";

import Script from "next/script";

export default function BotpressChat() {
  return (
    <>
      <Script
        src="https://cdn.botpress.cloud/webchat/v3.6/inject.js"
        strategy="afterInteractive"
      />

      <Script
        src="https://files.bpcontent.cloud/2026/06/29/03/20260629035912-W409E578.js"
        strategy="afterInteractive"
      />
    </>
  );
}