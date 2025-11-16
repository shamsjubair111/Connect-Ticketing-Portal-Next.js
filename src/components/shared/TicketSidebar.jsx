"use client";

import { Plus, Search, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTicketContext } from "@/context/TicketContext";

export default function TicketSidebar() {
  const { selectedItem, setSelectedItem, selectedStatus, setSelectedStatus } =
    useTicketContext();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ Apply selectedItem only after mount (client side)
  useEffect(() => {
    if (!mounted) return;

    if (pathname === "/tickets") setSelectedItem("");
    else if (pathname === "/forwarded-tickets") setSelectedItem("forwarded");
    else if (pathname === "/group-info") setSelectedItem("group");
    else if (pathname === "/report") setSelectedItem("report");
    else if (pathname === "/user-info") setSelectedItem("user");
  }, [pathname, mounted]);

  function clearFilterStatus() {
    try {
      // Remove "Status" filter only, not everything
      const saved = localStorage.getItem("ticket_filters");
      if (saved) {
        const parsed = JSON.parse(saved);
        const updated = parsed.filter((f) => f.label !== "Status");
        localStorage.setItem("ticket_filters", JSON.stringify(updated));
      }

      // Broadcast a manual event to let Filter.jsx know
      window.dispatchEvent(new Event("storage"));
    } catch (e) {
      console.error("Failed to clear filters:", e);
    }
  }

  return (
    <div className="w-full bg-background border-r border-border flex flex-col min-h-full relative">
      {/* Fixed top section */}
      <div className="sticky top-0 z-20 bg-white border-b border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-foreground">Tickets</h1>
          <Button
            size="sm"
            onClick={() => router.push("/createTicket")}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-1 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New ticket
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search in all tickets..."
            className="pl-10 bg-white border border-gray-200 text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Scrollable Middle Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <SidebarItem
            label="All Tickets"
            isActive={mounted && selectedItem === ""}
            onClick={() => {
              setSelectedItem("");
              router.push("/tickets");
            }}
          />
          <SidebarItem
            label="Forwarded Tickets"
            isActive={mounted && selectedItem === "forwarded"}
            onClick={() => {
              setSelectedItem("forwarded");
              router.push("/forwarded-tickets");
            }}
          />
          <SidebarItem
            label="User"
            isActive={mounted && selectedItem === "user"}
            onClick={() => {
              setSelectedItem("user");
              router.push("/user-info"); // ✅ add this line
            }}
          />
          <SidebarItem
            label="Group"
            isActive={mounted && selectedItem === "group"}
            onClick={() => {
              setSelectedItem("group");
              router.push("/group-info");
            }}
          />
          <SidebarItem
            label="Report"
            isActive={mounted && selectedItem === "report"}
            onClick={() => {
              setSelectedItem("report");
              router.push("/report");
            }}
          />
        </div>

        {/* Recent Tickets */}
        <div className="p-4 border-b border-border">
          <h2 className="text-blue-600 font-semibold text-sm mb-3">
            All recent tickets
          </h2>
          <div className="space-y-2">
            <SidebarItem label="Tickets to handle" />
            <SidebarItem label="My open tickets" />
          </div>
        </div>

        {/* Ticket Views */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-muted-foreground font-semibold text-xs uppercase tracking-wide">
              Ticket Views
            </h3>
            <a
              href="#"
              className="text-blue-600 text-sm font-semibold hover:underline"
            >
              Manage
            </a>
          </div>
          <SidebarItem label="My tickets in last 7 days" />
        </div>

        {/* Statuses */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-muted-foreground font-semibold text-xs uppercase tracking-wide">
              Statuses
            </h3>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4 text-muted-foreground cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="bg-slate-800 text-white text-xs rounded px-2 py-1 shadow-md"
                >
                  <p>Statuses help you stay up to date with your tickets.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="space-y-2">
            <SidebarItem
              label="All"
              isActive={!selectedStatus} // ✅ active when no status selected
              onClick={() => {
                clearFilterStatus(); // ✅ remove any saved filters
                setSelectedStatus(""); // ✅ reset to show all
              }}
            />
            <SidebarItem
              label="Open"
              isActive={selectedStatus === "open"}
              onClick={() => {
                clearFilterStatus(); // ✅ clears any active Status filter
                setSelectedStatus("open");
              }}
            />
            <SidebarItem
              label="In Progress"
              isActive={selectedStatus === "in_progress"}
              onClick={() => {
                clearFilterStatus();
                setSelectedStatus("in_progress");
              }}
            />
            <SidebarItem
              label="Solved"
              isActive={selectedStatus === "closed"}
              onClick={() => {
                clearFilterStatus();
                setSelectedStatus("closed");
              }}
            />
          </div>
        </div>

        {/* Folders */}
        <div className="p-4">
          <h3 className="text-muted-foreground font-semibold text-xs uppercase tracking-wide mb-3">
            Folders
          </h3>
          <div className="space-y-2">
            <SidebarItem label="Trash" />
          </div>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="sticky bottom-0 z-20 bg-white border-t border-border p-4">
        <Button
          variant="outline"
          className="w-full text-foreground border-border hover:bg-muted bg-transparent"
        >
          Manage your Ticketing System
        </Button>
      </div>
    </div>
  );
}

/* Small reusable component */
function SidebarItem({ label, count, isActive, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between py-2 px-2 rounded cursor-pointer transition-all duration-150 ${
        isActive
          ? "bg-blue-100 text-blue-700 font-semibold"
          : "hover:bg-muted text-foreground"
      }`}
    >
      <span className="text-sm">{label}</span>
      {count && (
        <span
          className={`text-xs font-semibold px-2 py-1 rounded ${
            isActive
              ? "bg-blue-200 text-blue-700"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {count}
        </span>
      )}
    </div>
  );
}
