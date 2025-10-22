"use client";

import { Plus, Search, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TicketSidebar() {
  return (
    <div className="w-full bg-background border-r border-border flex flex-col min-h-full relative">
      {/* Fixed top section (New Ticket + Search) */}
      <div className="sticky top-0 z-20 bg-white border-b border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-foreground">Tickets</h1>
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white gap-1"
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
        {/* All Recent Tickets Section */}
        <div className="p-4 border-b border-border">
          <h2 className="text-blue-600 font-semibold text-sm mb-3">
            All recent tickets
          </h2>
          <div className="space-y-2">
            <SidebarItem label="Tickets to handle" count="99+" />
            <SidebarItem label="My open tickets" count="1" />
            <SidebarItem label="Undelivered" count="99+" />
          </div>
        </div>

        {/* Ticket Views Section */}
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
          <SidebarItem label="My tickets in last 7 days" count="99+" />
        </div>

        {/* Statuses Section */}
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
            <SidebarItem label="Open" count="99+" />
            <SidebarItem label="Pending" count="0" />
            <SidebarItem label="On hold" count="0" />
            <SidebarItem label="Solved" />
            <SidebarItem label="Closed" />
            <SidebarItem label="Reopened" />
          </div>
        </div>

        {/* Folders Section */}
        <div className="p-4">
          <h3 className="text-muted-foreground font-semibold text-xs uppercase tracking-wide mb-3">
            Folders
          </h3>
          <div className="space-y-2">
            <SidebarItem label="Archive" />
            <SidebarItem label="Spam" />
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
          Manage your HelpDesk
        </Button>
      </div>
    </div>
  );
}

/* Reusable small sidebar item component */
function SidebarItem({ label, count }) {
  return (
    <div className="flex items-center justify-between py-2 px-2 hover:bg-muted rounded cursor-pointer">
      <span className="text-foreground text-sm">{label}</span>
      {count && (
        <span className="bg-muted text-muted-foreground text-xs font-semibold px-2 py-1 rounded">
          {count}
        </span>
      )}
    </div>
  );
}
