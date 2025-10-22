"use client";

import { usePathname } from "next/navigation";
import TicketSidebar from "@/components/shared/TicketSidebar";

export default function TicketsLayout({ children }) {
  const pathname = usePathname();
  const isTicketDetails = /^\/tickets\/[^/]+$/.test(pathname);

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar only visible on /tickets */}
      {!isTicketDetails && (
        <aside className="w-80 border-r border-gray-200 bg-white overflow-y-auto">
          <TicketSidebar />
        </aside>
      )}

      {/* Main content area */}
      <main className={`flex-1 bg-gray-50 overflow-y-auto`}>{children}</main>
    </div>
  );
}
