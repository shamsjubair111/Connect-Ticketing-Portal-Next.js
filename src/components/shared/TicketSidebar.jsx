"use client";

import { Plus, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useTicketContext } from "@/context/TicketContext";

// Cache user data to avoid repeated JWT decoding
let cachedUserData = null;

export default function TicketSidebar({ onNavigate }) {
  const { selectedItem, setSelectedItem, selectedStatus, setSelectedStatus } =
    useTicketContext();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [userType, setUserType] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ PERFORMANCE FIX: Cache JWT decode result
  useEffect(() => {
    if (cachedUserData) {
      setUserType(cachedUserData.user_type);
      setRole(cachedUserData.role);
      return;
    }

    try {
      const token = localStorage.getItem("jwt_token");
      if (token) {
        const decoded = jwtDecode(token);
        cachedUserData = decoded;
        setUserType(decoded.user_type);
        setRole(decoded.role);
      }
    } catch (e) {
      console.log(e);
    }
  }, []);

  // ✅ Apply selectedItem only after mount
  useEffect(() => {
    if (!mounted) return;

    if (pathname === "/tickets") setSelectedItem("");
    else if (pathname === "/forwarded-tickets") setSelectedItem("forwarded");
    else if (pathname === "/group-info") setSelectedItem("group");
    else if (pathname === "/report") setSelectedItem("report");
    else if (pathname === "/user-info") setSelectedItem("user");
    else if (pathname === "/priorities") setSelectedItem("priorities");
    else if (pathname === "/tags") setSelectedItem("tags");
    else if (pathname === "/trash") setSelectedItem("trash");
    else if (pathname === "/permanently-deleted") setSelectedItem("permaTrash");
  }, [pathname, mounted, setSelectedItem]);

  function clearFilterStatus() {
    try {
      const saved = localStorage.getItem("ticket_filters");
      if (saved) {
        const parsed = JSON.parse(saved);
        const updated = parsed.filter((f) => f.label !== "Status");
        localStorage.setItem("ticket_filters", JSON.stringify(updated));
      }
      window.dispatchEvent(new Event("storage"));
    } catch (e) {
      console.error("Failed to clear filters:", e);
    }
  }

  // Helper function to handle navigation and close mobile menu
  const handleNavigate = (path, item) => {
    setSelectedItem(item);
    router.push(path);
    onNavigate?.(); // Close mobile sidebar
  };

  return (
    <div className="w-full bg-background border-r border-border flex flex-col min-h-full relative">
      {/* Fixed top section */}
      <div className="sticky top-0 z-20 bg-white border-b border-border p-3 md:p-4">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <h1 className="text-lg md:text-xl font-bold text-foreground">
            Tickets
          </h1>
          <Button
            size="sm"
            onClick={() => {
              router.push("/createTicket");
              onNavigate?.();
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-1 cursor-pointer text-xs md:text-sm px-2 md:px-3"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New ticket</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>
      </div>

      {/* Scrollable Middle Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-3 md:p-4">
          {userType !== "agent" &&
            userType !== "customer" &&
            userType !== "pbx_user" && (
              <SidebarItem
                label="All Tickets"
                isActive={mounted && selectedItem === ""}
                onClick={() => handleNavigate("/tickets", "")}
              />
            )}

          {userType !== "agent" &&
            userType !== "customer" &&
            userType !== "pbx_user" && (
              <SidebarItem
                label="Forwarded Tickets"
                isActive={mounted && selectedItem === "forwarded"}
                onClick={() =>
                  handleNavigate("/forwarded-tickets", "forwarded")
                }
              />
            )}

          {role === "admin" && (
            <SidebarItem
              label="User"
              isActive={mounted && selectedItem === "user"}
              onClick={() => handleNavigate("/user-info", "user")}
            />
          )}

          {(role === "admin" || role === "moderator") && (
            <SidebarItem
              label="Group"
              isActive={mounted && selectedItem === "group"}
              onClick={() => handleNavigate("/group-info", "group")}
            />
          )}

          {(userType === "cc" || userType === "rs") && (
            <SidebarItem
              label="Report"
              isActive={mounted && selectedItem === "report"}
              onClick={() => handleNavigate("/report", "report")}
            />
          )}

          {(role === "admin" || role === "moderator") && (
            <SidebarItem
              label="Priorities"
              isActive={mounted && selectedItem === "priorities"}
              onClick={() => handleNavigate("/priorities", "priorities")}
            />
          )}

          {(role === "admin" || role === "moderator") && (
            <SidebarItem
              label="Tags"
              isActive={mounted && selectedItem === "tags"}
              onClick={() => handleNavigate("/tags", "tags")}
            />
          )}
        </div>

        {/* Statuses */}
        <div className="p-3 md:p-4 border-b border-border">
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
              isActive={!selectedStatus}
              onClick={() => {
                clearFilterStatus();
                setSelectedStatus("");
                if (pathname !== "/tickets") {
                  router.push("/tickets");
                }
                onNavigate?.();
              }}
            />
            <SidebarItem
              label="Open"
              isActive={selectedStatus === "open"}
              onClick={() => {
                clearFilterStatus();
                setSelectedStatus("open");
                if (pathname !== "/tickets") {
                  router.push("/tickets");
                }
                onNavigate?.();
              }}
            />
            <SidebarItem
              label="In Progress"
              isActive={selectedStatus === "in_progress"}
              onClick={() => {
                clearFilterStatus();
                setSelectedStatus("in_progress");
                if (pathname !== "/tickets") {
                  router.push("/tickets");
                }
                onNavigate?.();
              }}
            />
            <SidebarItem
              label="Solved"
              isActive={selectedStatus === "closed"}
              onClick={() => {
                clearFilterStatus();
                setSelectedStatus("closed");
                if (pathname !== "/tickets") {
                  router.push("/tickets");
                }
                onNavigate?.();
              }}
            />
          </div>
        </div>

        {/* Folders */}
        <div className="p-3 md:p-4">
          {(role === "admin" || role === "moderator") && (
            <h3 className="text-muted-foreground font-semibold text-xs uppercase tracking-wide mb-3">
              Folders
            </h3>
          )}
          <div className="space-y-2">
            {(role === "admin" || role === "moderator") && (
              <SidebarItem
                label="Trash"
                isActive={mounted && selectedItem === "trash"}
                onClick={() => handleNavigate("/trash", "trash")}
              />
            )}

            {(role === "admin" || role === "moderator") && (
              <SidebarItem
                label="Permanently Deleted"
                isActive={mounted && selectedItem === "permaTrash"}
                onClick={() =>
                  handleNavigate("/permanently-deleted", "permaTrash")
                }
              />
            )}
          </div>
        </div>
      </div>

      {/* Fixed Footer - Hidden on mobile to save space */}
      <div className="hidden md:block sticky bottom-0 z-20 bg-white border-t border-border p-4">
        <Button
          variant="outline"
          className="w-full text-foreground border-border hover:bg-muted bg-transparent text-sm"
        >
          Manage Ticketing System
        </Button>
      </div>
    </div>
  );
}

/* Reusable sidebar item component */
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
