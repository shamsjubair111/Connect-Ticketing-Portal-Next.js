// File: /app/tickets/layout.jsx
"use client";

import { usePathname } from "next/navigation";
import TicketSidebar from "@/components/shared/TicketSidebar";
import { TicketProvider } from "@/context/TicketContext";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function TicketsLayout({ children }) {
  const pathname = usePathname();
  const isTicketDetails = /^\/tickets\/[^/]+$/.test(pathname);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <TicketProvider>
      <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)]">
        {/* Mobile Menu Button - Only show when sidebar is available */}
        {!isTicketDetails && (
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden fixed bottom-4 right-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
            aria-label="Toggle menu"
          >
            {sidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        )}

        {/* Sidebar - Hidden on mobile by default */}
        {!isTicketDetails && (
          <>
            {/* Mobile Overlay */}
            {sidebarOpen && (
              <div
                className="md:hidden fixed inset-0 bg-black/50 z-40"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            {/* Sidebar Container */}
            <aside
              className={`
                fixed md:static inset-y-0 left-0 z-40
                w-80 md:w-80 
                border-r border-gray-200 bg-white 
                overflow-y-auto
                transform transition-transform duration-300 ease-in-out
                md:transform-none
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
              `}
              style={{ top: "4rem" }} // Account for header height
            >
              <TicketSidebar onNavigate={() => setSidebarOpen(false)} />
            </aside>
          </>
        )}

        {/* Main Content - Full width on mobile, flexible on desktop */}
        <main className="flex-1 bg-gray-50 overflow-y-auto w-full">
          {children}
        </main>
      </div>
    </TicketProvider>
  );
}
