"use client";

import { usePathname, useRouter } from "next/navigation";
import { AlertProvider } from "@/hooks/alertContext";
import TicketsLayout from "@/app/tickets/layout";
import { useRef, useState } from "react";
import Header from "@/components/Header"; // extract your header into client comp

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isTicketSection = [
    "/forwarded-tickets",
    "/group-info",
    "/report",
    "/user-info",
    "/priorities",
    "/tags",
    "/trash",
    "/permanently-deleted",
  ].some((p) => pathname.startsWith(p));

  return (
    <AlertProvider>
      {!isHome && <Header />}

      <div className={`${isHome ? "" : "pt-16"} min-h-screen bg-gray-50`}>
        {isTicketSection ? <TicketsLayout>{children}</TicketsLayout> : children}
      </div>
    </AlertProvider>
  );
}
