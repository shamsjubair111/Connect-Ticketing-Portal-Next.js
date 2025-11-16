// File: /app/layout.jsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import { AlertProvider } from "@/hooks/alertContext";
import TicketsLayout from "@/app/tickets/layout";
import { useRef, useState } from "react";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isTicketSection = [
    "/forwarded-tickets",
    "/group-info",
    "/report",
    "/user-info",
  ].some((p) => pathname.startsWith(p));
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  return (
    <html lang="en">
      <body>
        <AlertProvider>
          {/* Header shown on all pages except home */}
          {!isHome && (
            <header className="fixed inset-x-0 top-0 z-50 h-16 bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-8">
              <div
                onClick={() => router.push("/tickets")}
                className="flex items-center gap-3 cursor-pointer"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-100">
                  {/* icon here */}
                  <svg
                    className="h-5 w-5 text-gray-700"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3 10a1 1 0 011-1h12a1 1 0 01-1 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zm5-3a1 1 0 100-2 1 1 0 000 2z"
                    />
                  </svg>
                </div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Ticketing System
                </h1>
              </div>
              <div className="relative" ref={dropdownRef}>
                <button
                  className="rounded p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setOpen(!open)}
                >
                  <svg
                    className="h-5 w-5 text-gray-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10.5 1.5H9.5V3h1V1.5zM4.72 4.72L3.86 3.86 2.44 5.28l.86.86 1.42-1.42zM1.5 9.5H3v1H1.5V9.5zm0 5.5H3v1H1.5v-1zm2.22 2.22l-.86.86 1.42 1.42.86-.86-1.42-1.42zm5.28 1.78h1V17h-1v-1.5zm5.5-1.78l1.42 1.42.86-.86-1.42-1.42-.86.86zM17 10.5v-1h1.5v1H17zm0-5.5v-1h1.5v1H17zm-1.72-2.22l.86-.86-1.42-1.42-.86.86 1.42 1.42zM10 5a5 5 0 100 10 5 5 0 000-10zm0 8a3 3 0 110-6 3 3 0 010 6z" />
                  </svg>
                </button>

                {open && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-md z-50">
                    <button
                      onClick={() => {
                        localStorage.removeItem("jwt_token");
                        router.push("/");
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </header>
          )}

          <div className={`${isHome ? "" : "pt-16"} min-h-screen bg-gray-50`}>
            {isTicketSection ? (
              <TicketsLayout>{children}</TicketsLayout>
            ) : (
              children
            )}
          </div>
        </AlertProvider>
      </body>
    </html>
  );
}
