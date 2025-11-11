import TicketsLayout from "@/app/tickets/layout";

export default function ForwardedTicketsLayout({ children }) {
  // Reuse the same HelpDesk layout used by /tickets
  return <TicketsLayout>{children}</TicketsLayout>;
}
