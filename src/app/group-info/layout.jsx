import TicketsLayout from "@/app/tickets/layout";

export default function GroupInfoLayout({ children }) {
  // ✅ Reuse the same layout as /tickets (includes TicketSidebar, etc.)
  return <TicketsLayout>{children}</TicketsLayout>;
}
