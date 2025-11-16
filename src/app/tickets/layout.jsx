// File: /app/tickets/layout.jsx
"use client";

import { usePathname } from "next/navigation";
import TicketSidebar from "@/components/shared/TicketSidebar";
import { TicketProvider } from "@/context/TicketContext";

export default function TicketsLayout({ children }) {
  const pathname = usePathname();
  const isTicketDetails = /^\/tickets\/[^/]+$/.test(pathname);

  return (
    <TicketProvider>
      <div className="flex h-[calc(100vh-4rem)]">
        {/* hide sidebar on ticket detail page */}
        {!isTicketDetails && (
          <aside className="w-80 border-r border-gray-200 bg-white overflow-y-auto">
            <TicketSidebar />
          </aside>
        )}
        <main className="flex-1 bg-gray-50 overflow-y-auto">{children}</main>
      </div>
    </TicketProvider>
  );
}
